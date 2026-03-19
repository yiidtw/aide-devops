// lock — lock a site with CF Access
// usage: lock <domain>

const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!token) { console.error("CLOUDFLARE_API_TOKEN not set"); process.exit(1); }
if (!account) { console.error("CLOUDFLARE_ACCOUNT_ID not set"); process.exit(1); }

const domain = process.argv[2];
if (!domain) {
  console.log("Usage: lock <domain>");
  process.exit(1);
}

console.log(`Locking ${domain} with CF Access...`);

const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/access/apps`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: domain,
    domain: domain,
    type: "self_hosted",
    session_duration: "24h",
  }),
});

const data = (await resp.json()) as any;
console.log(data.success ? "locked" : (data.errors || "fail"));
