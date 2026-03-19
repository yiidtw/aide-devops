// dns — Cloudflare DNS operations
// usage: dns [list ZONE|set ZONE NAME TYPE VALUE|delete ZONE ID]

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("CLOUDFLARE_API_TOKEN not set");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const cmd = process.argv[2];
if (!cmd) {
  console.log("usage: dns [list ZONE|set ZONE NAME TYPE VALUE]");
  process.exit(1);
}

async function getZoneId(zone: string): Promise<string> {
  const resp = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${zone}`, { headers });
  const data = (await resp.json()) as any;
  const result = data.result;
  if (!result || result.length === 0) {
    console.log(`Zone not found: ${zone}`);
    process.exit(1);
  }
  return result[0].id;
}

switch (cmd) {
  case "list": {
    const zone = process.argv[3];
    if (!zone) {
      console.log("Usage: dns list ZONE");
      process.exit(1);
    }
    const zoneId = await getZoneId(zone);
    const resp = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, { headers });
    const data = (await resp.json()) as any;
    for (const r of data.result) {
      const type = r.type.padEnd(6);
      const name = r.name.padEnd(35);
      const content = r.content.slice(0, 45);
      console.log(`${type} ${name} \u2192 ${content}`);
    }
    break;
  }

  case "set": {
    const zone = process.argv[3];
    const name = process.argv[4];
    const type = process.argv[5];
    const value = process.argv[6];
    if (!zone || !name || !type || !value) {
      console.log("Usage: dns set ZONE NAME TYPE VALUE");
      process.exit(1);
    }
    const zoneId = await getZoneId(zone);
    const resp = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
      method: "POST",
      headers,
      body: JSON.stringify({ type, name, content: value, proxied: true }),
    });
    const data = (await resp.json()) as any;
    console.log(data.success ? "ok" : JSON.stringify(data.errors));
    break;
  }

  default:
    console.log("usage: dns [list ZONE|set ZONE NAME TYPE VALUE]");
    break;
}
