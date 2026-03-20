// status — check all domains
// usage: status

const domains = [
  "aide.sh", "docs.aide.sh", "hub.aide.sh", "chatfounder.ai",
  "kfa.sh", "storylens.ai", "crossmem.dev", "cxfi.earth", "cxfi.org", "whatagentswant.ai",
];

const results = await Promise.all(
  domains.map(async (d) => {
    try {
      const resp = await fetch(`https://${d}/`, { redirect: "follow" });
      return { domain: d, code: String(resp.status) };
    } catch {
      return { domain: d, code: "ERR" };
    }
  })
);

for (const { domain, code } of results) {
  console.log(`${domain.padEnd(25)} ${code}`);
}
