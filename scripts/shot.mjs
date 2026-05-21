import { chromium } from "playwright-core";

const EXECUTABLE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = process.env.SHOT_BASE || "http://localhost:3000";

async function revealAll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, 500);
        y += 500;
        if (y < document.body.scrollHeight + 1200) setTimeout(step, 90);
        else {
          window.scrollTo(0, 0);
          setTimeout(resolve, 400);
        }
      };
      step();
    });
  });
}

const sections = [
  { name: "01-hero", text: null },
  { name: "02-valueprop", text: "Bir trend bülteni değil" },
  { name: "03-latest", text: "Bu hafta masada ne var" },
  { name: "04-showcase", text: "çevirdiklerimiz" },
  { name: "05-manifesto", text: "Neden TrendÇevir" },
  { name: "06-social", text: "Girişimciler ne diyor" },
  { name: "07-finalcta", text: "artık" },
];

const browser = await chromium.launch({ executablePath: EXECUTABLE });

// Desktop section-by-section
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
});
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(700);
await revealAll(page);

for (const s of sections) {
  if (s.text) {
    const el = page.getByText(s.text, { exact: false }).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
  }
  await page.screenshot({ path: `/tmp/shot-${s.name}.png` });
  console.log("saved", s.name);
}
await ctx.close();

// Full-page desktop + mobile
for (const v of [
  { name: "full-desktop", width: 1280, height: 900 },
  { name: "full-mobile", width: 375, height: 812 },
]) {
  const c = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: 1.5,
  });
  const p = await c.newPage();
  await p.goto(BASE, { waitUntil: "load", timeout: 60000 });
  await p.waitForTimeout(700);
  await revealAll(p);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `/tmp/shot-${v.name}.png`, fullPage: true });
  console.log("saved", v.name);
  await c.close();
}

await browser.close();
