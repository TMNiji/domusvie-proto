#!/usr/bin/env node
/**
 * WCAG color-contrast audit (axe rule: color-contrast only).
 * Starts Vite, drives key screens/flows, writes reports/a11y-contrast/report.json
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.A11Y_PORT || 5199);
const BASE = process.env.A11Y_BASE || "/domusvie-proto/";
const ORIGIN = `http://127.0.0.1:${PORT}`;

function url(q = "") {
  const u = new URL(BASE, ORIGIN);
  if (q) u.search = q.startsWith("?") ? q.slice(1) : q;
  return u.href;
}

async function waitForServer(href, timeout = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const u = new URL(href);
        const req = http.request(
          {
            hostname: u.hostname,
            port: u.port || 80,
            path: u.pathname + u.search,
            method: "GET",
            timeout: 3000,
          },
          (res) => {
            res.resume();
            if (res.statusCode && res.statusCode < 500) resolve();
            else reject(new Error(`HTTP ${res.statusCode}`));
          }
        );
        req.on("error", reject);
        req.on("timeout", () => {
          req.destroy();
          reject(new Error("timeout"));
        });
        req.end();
      });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error(`Server not reachable: ${href}`);
}

async function scan(page, id) {
  const results = await new AxeBuilder({ page })
    .options({
      runOnly: { type: "rule", values: ["color-contrast"] },
    })
    .analyze();
  return {
    id,
    violationCount: results.violations.length,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes?.map((n) => ({
        html: n.html?.slice(0, 400),
        target: n.target,
        failureSummary: n.failureSummary,
      })),
    })),
  };
}

async function screenshot(page, dir, id) {
  const safe = id.replace(/[^a-zA-Z0-9_-]+/g, "_");
  const p = path.join(dir, `${safe}.png`);
  await page.screenshot({ path: p, fullPage: true });
  return p;
}

async function closeMobileOverlays(page) {
  const bd = page.locator(".mobile-view .z-40").first();
  if (await bd.count()) {
    await bd.click({ position: { x: 5, y: 5 }, force: true }).catch(() => {});
  }
}

async function closeDesktopModal(page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(150);
  const bd = page.locator(".z-40").first();
  if (await bd.count()) {
    await bd.click({ position: { x: 5, y: 5 }, force: true }).catch(() => {});
    await page.waitForTimeout(150);
  }
}

async function runMobileFamilyFlows(page, reportDir) {
  const out = [];

  const push = async (id, fn) => {
    await fn();
    const r = await scan(page, id);
    out.push(r);
    if (r.violationCount) await screenshot(page, reportDir, id);
  };

  await page.goto(url("?auditMode=mobile&auditFamilleScreen=F1"));
  await page.waitForLoadState("networkidle");

  await push("mobile_F1_home", async () => {
    await closeMobileOverlays(page);
  });

  await push("mobile_F1_profile_panel", async () => {
    await closeMobileOverlays(page);
    await page.locator(".mobile-view header").getByRole("button", { name: /Marie/i }).click();
    await page.getByRole("heading", { name: "Choisir un profil" }).waitFor({ state: "visible" });
  });

  await push("mobile_F1_upload_context_flow", async () => {
    await closeMobileOverlays(page);
    await page.getByRole("button", { name: /Attestation mutuelle 2026/i }).click();
    await page.getByRole("heading", { name: /Déposer un justificatif/i }).first().waitFor();
    await page.getByRole("button", { name: /Scanner avec mon téléphone/i }).click();
    await page.getByRole("heading", { name: /Vérifier avant envoi/i }).first().waitFor();
    await page.getByRole("button", { name: /Confirmer l'envoi/i }).click();
    await page.getByRole("heading", { name: /Document envoyé/i }).first().waitFor();
  });

  await push("mobile_F1_upload_category_flow", async () => {
    await closeMobileOverlays(page);
    await page.getByRole("button", { name: /Déposer un document/i }).click();
    await page.getByRole("heading", { name: "Déposer un document" }).first().waitFor();
    await page.getByRole("button", { name: /^Identité$/i }).click();
    await page.getByRole("button", { name: /Scanner avec mon téléphone/i }).click();
    await page.getByRole("heading", { name: /Vérifier avant envoi/i }).first().waitFor();
  });

  await push("mobile_F1_kiosque_photo_flow", async () => {
    await closeMobileOverlays(page);
    await page.getByRole("button", { name: "Kiosque" }).click();
    await page.getByRole("button", { name: /Partager une photo/i }).click();
    await page.getByRole("button", { name: /Prendre une photo/i }).click();
    await page.getByRole("button", { name: /^Suivant$/i }).click();
    await page.getByRole("button", { name: /Partager la photo/i }).click();
    await page.getByRole("heading", { name: /Photo partagée/i }).first().waitFor();
  });

  for (const screen of ["F2", "F3", "F4", "F5", "FS"]) {
    await push(`mobile_${screen}_audit`, async () => {
      await closeMobileOverlays(page);
      await page.goto(url(`?auditMode=mobile&auditFamilleScreen=${screen}`));
      await page.waitForLoadState("networkidle");
      if (screen === "FS") {
        await page.getByRole("button", { name: /Signer ce document/i }).click();
        await page.getByRole("button", { name: /Confirmer la signature/i }).waitFor();
      }
    });
  }

  return out;
}

async function runStaffFlows(page, mode, reportDir) {
  const out = [];
  const push = async (id, fn) => {
    await fn();
    const r = await scan(page, id);
    out.push(r);
    if (r.violationCount) await screenshot(page, reportDir, id);
  };

  const auditQs = (extra) => {
    const p = new URLSearchParams({ auditMode: mode, auditStaffRole: "manager", ...extra });
    return `?${p.toString()}`;
  };

  await page.setViewportSize(mode === "tablet" ? { width: 900, height: 900 } : { width: 1400, height: 900 });
  await page.goto(url(auditQs({ auditStaffScreen: "S1" })));
  await page.waitForLoadState("networkidle");

  await push(`${mode}_S1_home`, async () => {
    await closeDesktopModal(page);
  });

  await push(`${mode}_S1_quick_request`, async () => {
    await closeDesktopModal(page);
    await page.getByRole("button", { name: /Demander un justificatif|Demander/i }).click();
    await page.getByRole("heading", { name: /Demander un justificatif/i }).first().waitFor();
    await page.getByRole("button", { name: /Envoyer la demande/i }).click();
    await page.getByRole("heading", { name: /Demande envoyée/i }).first().waitFor();
  });

  await push(`${mode}_S1_library_moderation`, async () => {
    await page.goto(url(auditQs({ auditStaffScreen: "S1" })));
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Bibliothèque" }).click();
    await page.getByRole("button", { name: /CR CVS T1 2026/i }).click();
    await page.getByRole("heading", { name: "Modérer le document" }).first().waitFor();
    await page.getByRole("button", { name: /Archiver définitivement/i }).click();
    await page.getByRole("heading", { name: /Document archivé/i }).first().waitFor();
  });

  await push(`${mode}_S1_admin_add_sheet`, async () => {
    await page.goto(url(auditQs({ auditStaffScreen: "S1" })));
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Administration" }).click();
    await page.getByRole("button", { name: "Ajouter" }).click();
    await page.getByRole("heading", { name: /Créer une nouvelle rubrique/i }).first().waitFor();
  });

  await push(`${mode}_S1_admin_edit_sheet`, async () => {
    await closeDesktopModal(page);
    await page.goto(url(auditQs({ auditStaffScreen: "S1" })));
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Administration" }).click();
    await page.locator(".flex.items-center.gap-3").filter({ hasText: "Identité" }).locator("button").last().click();
    await page.getByRole("heading", { name: /Modifier la rubrique/i }).first().waitFor();
  });

  for (const s of ["S2", "S3", "S4"]) {
    await push(`${mode}_${s}_audit`, async () => {
      await closeDesktopModal(page);
      await page.goto(url(auditQs({ auditStaffScreen: s })));
      await page.waitForLoadState("networkidle");
    });
  }

  await push(`${mode}_S2_publish_success`, async () => {
    await page.goto(url(auditQs({ auditStaffScreen: "S2" })));
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Publier$/i }).click();
    await page.getByRole("heading", { name: /Document publié/i }).first().waitFor();
  });

  await push(`${mode}_S3_sent`, async () => {
    await page.goto(url(auditQs({ auditStaffScreen: "S3" })));
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Envoyer la demande/i }).click();
    await page.getByRole("heading", { name: /Demande envoyée/i }).first().waitFor();
  });

  return out;
}

async function main() {
  const reportDir = path.join(ROOT, "reports", "a11y-contrast", "screenshots");
  await fs.mkdir(reportDir, { recursive: true });

  const vite = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["vite", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
    { cwd: ROOT, stdio: "inherit", detached: false }
  );

  vite.on("error", (e) => {
    console.error(e);
    process.exit(1);
  });

  const killVite = () => {
    try {
      vite.kill("SIGTERM");
    } catch {
      /* ignore */
    }
  };
  process.on("SIGINT", () => {
    killVite();
    process.exit(130);
  });

  try {
    await waitForServer(url());
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const mobileRuns = await runMobileFamilyFlows(page, reportDir);
    const desktopRuns = await runStaffFlows(page, "desktop", reportDir);
    const tabletRuns = await runStaffFlows(page, "tablet", reportDir);

    await context.close();
    await browser.close();

    const all = [...mobileRuns, ...desktopRuns, ...tabletRuns];
    const summary = {
      generatedAt: new Date().toISOString(),
      rule: "color-contrast",
      totalScans: all.length,
      failingScans: all.filter((r) => r.violationCount > 0).map((r) => r.id),
      runs: all,
    };

    const reportPath = path.join(ROOT, "reports", "a11y-contrast", "report.json");
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(summary, null, 2), "utf8");

    console.log(`Wrote ${reportPath}`);
    if (summary.failingScans.length) {
      console.error("Failing scans:", summary.failingScans.join(", "));
      process.exitCode = 1;
    }
  } finally {
    killVite();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
