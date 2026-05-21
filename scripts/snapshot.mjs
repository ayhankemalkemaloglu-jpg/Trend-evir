import { chromium } from "playwright-core";
import { writeFileSync } from "fs";

const EXECUTABLE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = process.env.SHOT_BASE || "http://localhost:3000";
const ROUTE = process.argv[2] || "/";
const OUT = process.argv[3] || "/tmp/trendcevir-landing.html";

async function revealAll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, 500);
        y += 500;
        if (y < document.body.scrollHeight + 1200) setTimeout(step, 80);
        else {
          window.scrollTo(0, 0);
          setTimeout(resolve, 400);
        }
      };
      step();
    });
  });
}

// Inline every /_next font referenced in a CSS file as a base64 data URI.
async function inlineFonts(css, cssUrl) {
  const re = /url\(\s*['"]?(\/_next\/static\/media\/[^)'"]+\.(?:woff2?|ttf))['"]?\s*\)/g;
  const seen = new Map();
  let m;
  while ((m = re.exec(css)) !== null) {
    const path = m[1];
    if (!seen.has(path)) {
      const url = new URL(path, cssUrl).href;
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      const mime = path.endsWith(".woff2")
        ? "font/woff2"
        : path.endsWith(".woff")
          ? "font/woff"
          : "font/ttf";
      seen.set(path, `data:${mime};base64,${buf.toString("base64")}`);
    }
  }
  for (const [path, dataUri] of seen) {
    css = css.split(path).join(dataUri);
  }
  return css;
}

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto(`${BASE}${ROUTE}`, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(700);
await revealAll(page);
await page.waitForTimeout(500);

// Collect + inline all stylesheets.
const cssHrefs = await page.evaluate(() =>
  [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href),
);
let combinedCss = "";
for (const href of cssHrefs) {
  const raw = await (await fetch(href)).text();
  combinedCss += "\n" + (await inlineFonts(raw, href));
}

// Serialize the live (post-reveal) DOM, then strip external refs + scripts.
let html = await page.content();
html = html
  .replace(/<link[^>]+rel="stylesheet"[^>]*>/g, "")
  .replace(/<link[^>]+rel="preload"[^>]*>/g, "")
  .replace(/<script[\s\S]*?<\/script>/g, "");
html = html.replace(
  "</head>",
  `<style>${combinedCss}</style>\n</head>`,
);

writeFileSync(OUT, html);
console.log("wrote", OUT, `(${(html.length / 1024).toFixed(0)} kB)`);

await browser.close();
