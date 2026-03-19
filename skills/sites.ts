// sites — list all CF Pages projects
// usage: sites

const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!token) { console.error("CLOUDFLARE_API_TOKEN not set"); process.exit(1); }
if (!account) { console.error("CLOUDFLARE_ACCOUNT_ID not set"); process.exit(1); }

const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects`, {
  headers: { Authorization: `Bearer ${token}` },
});

const data = (await resp.json()) as any;
for (const p of data.result || []) {
  const domains = (p.domains || []).map((d: any) => d.name).join(", ") || p.subdomain || "";
  console.log(`${p.name.padEnd(25)} ${domains}`);
}
