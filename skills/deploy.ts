// deploy — deploy static site to CF Pages
// usage: deploy <dir> <project-name>

const dir = process.argv[2];
const project = process.argv[3];
if (!dir || !project) {
  console.log("Usage: deploy <dir> <project-name>");
  process.exit(1);
}

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("CLOUDFLARE_API_TOKEN not set");
  process.exit(1);
}

const proc = Bun.spawn(["wrangler", "pages", "deploy", dir, "--project-name", project], {
  env: { ...process.env, CLOUDFLARE_API_TOKEN: token },
  stdout: "pipe",
  stderr: "pipe",
});

const output = await new Response(proc.stdout).text();
const lines = output.trim().split("\n");
console.log(lines.slice(-3).join("\n"));

await proc.exited;
if (proc.exitCode !== 0) {
  const stderr = await new Response(proc.stderr).text();
  if (stderr) console.error(stderr);
  process.exit(proc.exitCode ?? 1);
}
