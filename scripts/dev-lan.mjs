import { execFileSync, spawn } from "node:child_process";

function tryIpconfig(iface) {
  try {
    const out = execFileSync("ipconfig", ["getifaddr", iface], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

const host =
  tryIpconfig("en0") ||
  tryIpconfig("en1") ||
  tryIpconfig("bridge0") ||
  "127.0.0.1";

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vite", "--host", host],
  { stdio: "inherit" }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

