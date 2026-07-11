import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

function argument(name) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1 || !process.argv[index + 1]) {
    throw new Error(`Missing --${name}`);
  }
  return process.argv[index + 1];
}

const platform = argument("platform");
const arch = argument("arch");
const runtime = path.resolve(argument("runtime"));
const output = path.resolve(argument("out"));
const root = process.cwd();

if (!new Set(["win32", "darwin"]).has(platform)) {
  throw new Error(`Unsupported release platform: ${platform}`);
}
if (!new Set(["x64", "arm64"]).has(arch)) {
  throw new Error(`Unsupported release architecture: ${arch}`);
}

await stat(path.join(root, ".next", "standalone", "server.js"));
await stat(runtime);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

await cp(path.join(root, ".next", "standalone"), output, { recursive: true });
await mkdir(path.join(output, ".next", "static"), { recursive: true });
await cp(path.join(root, ".next", "static"), path.join(output, ".next", "static"), {
  recursive: true,
});

const editableDirectories = [
  "app",
  "components",
  "lib",
  "packaging",
  "remotion",
  "scripts",
  "skill",
];
for (const directory of editableDirectories) {
  await rm(path.join(output, directory), { recursive: true, force: true });
  await cp(path.join(root, directory), path.join(output, directory), { recursive: true });
}
await cp(path.join(root, ".cursor"), path.join(output, ".cursor"), { recursive: true });

await rm(path.join(output, "public"), { recursive: true, force: true });
const uploads = path.resolve(root, "public", "assets", "uploads");
try {
  await stat(path.join(root, "public"));
  await cp(path.join(root, "public"), path.join(output, "public"), {
    recursive: true,
    filter: (source) => {
      const resolved = path.resolve(source);
      return resolved === uploads || !resolved.startsWith(`${uploads}${path.sep}`);
    },
  });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
await mkdir(path.join(output, "public", "assets", "uploads"), { recursive: true });

const editableFiles = [
  ".env.example",
  ".gitignore",
  "AGENTS.md",
  "CLAUDE.md",
  "README.md",
  "next.config.ts",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
];
for (const file of editableFiles) {
  await cp(path.join(root, file), path.join(output, file));
}

await rm(path.join(output, "runtime"), { recursive: true, force: true });
await cp(runtime, path.join(output, "runtime", "node"), { recursive: true });

const runtimeNode = path.join(
  output,
  "runtime",
  "node",
  platform === "win32" ? "node.exe" : "bin/node",
);
const npmCli = path.join(
  output,
  "runtime",
  "node",
  platform === "win32" ? "node_modules/npm/bin/npm-cli.js" : "lib/node_modules/npm/bin/npm-cli.js",
);
await new Promise((resolve, reject) => {
  const child = spawn(runtimeNode, [npmCli, "ci", "--omit=dev"], {
    cwd: output,
    env: { ...process.env, NODE_ENV: "production" },
    stdio: "inherit",
  });
  child.on("error", reject);
  child.on("exit", (code) =>
    code === 0 ? resolve() : reject(new Error(`Production dependency install failed (${code})`)),
  );
});
await rm(path.join(output, ".renders"), { recursive: true, force: true });
await rm(path.join(output, "exports"), { recursive: true, force: true });
await rm(path.join(output, "workspace"), { recursive: true, force: true });
await mkdir(path.join(output, ".renders"), { recursive: true });
await mkdir(path.join(output, "exports"), { recursive: true });
await mkdir(path.join(output, "workspace"), { recursive: true });

for (const privateFile of [".env.local", ".env.production.local", "tsconfig.tsbuildinfo"]) {
  await rm(path.join(output, privateFile), { force: true });
}

const launcherDirectory = path.join(root, "packaging", platform === "win32" ? "windows" : "macos");
for (const launcher of platform === "win32"
  ? ["Start Motion Lab.cmd", "Agent Dev.cmd"]
  : ["Start Motion Lab.command", "Agent Dev.command"]) {
  const source = path.join(launcherDirectory, launcher);
  const destination = path.join(output, launcher);
  await cp(source, destination);
  if (platform === "darwin") await (await import("node:fs/promises")).chmod(destination, 0o755);
}
await cp(path.join(root, "packaging", "PORTABLE-README.txt"), path.join(output, "START-HERE.txt"));

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
await writeFile(
  path.join(output, "RELEASE-MANIFEST.json"),
  `${JSON.stringify(
    {
      name: "Motion Lab AE-Lite Agent-Ready",
      version: packageJson.version,
      platform,
      arch,
      node: process.version,
      builtAt: new Date().toISOString(),
      containsCredentials: false,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`Packaged ${platform}-${arch} release at ${output}`);
