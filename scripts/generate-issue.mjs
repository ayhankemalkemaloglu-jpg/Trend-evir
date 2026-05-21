/**
 * Drafts a new TrendÇevir issue with Claude + web search, then writes it to
 * content/issues/. The GitHub workflow opens a PR for human review — nothing
 * is published without an editor (the brand's editorial rule).
 *
 * Required env: ANTHROPIC_API_KEY
 * Optional env: ANTHROPIC_MODEL (default: claude-opus-4-7), TREND_COUNT (default 3)
 *
 * Run locally:  ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-issue.mjs
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

const ISSUES_DIR = path.join(process.cwd(), "content", "issues");
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";
const TREND_COUNT = Number(process.env.TREND_COUNT || "3");

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "ANTHROPIC_API_KEY is not set — skipping issue generation (no error).",
  );
  process.exit(0);
}

function slugify(input) {
  const map = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u" };
  return input
    .toLowerCase()
    .replace(/[çğıİöşü]/g, (c) => map[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function readExisting() {
  if (!fs.existsSync(ISSUES_DIR)) return { maxIssue: 0, trends: [] };
  const files = fs.readdirSync(ISSUES_DIR).filter((f) => f.endsWith(".mdx"));
  let maxIssue = 0;
  const trends = [];
  for (const f of files) {
    const { data } = matter(fs.readFileSync(path.join(ISSUES_DIR, f), "utf8"));
    if (Number(data.issue) > maxIssue) maxIssue = Number(data.issue);
    if (Array.isArray(data.trends)) trends.push(...data.trends.map(String));
  }
  return { maxIssue, trends };
}

const { maxIssue, trends } = readExisting();
const nextIssue = maxIssue + 1;
const today = new Date().toISOString().slice(0, 10);

const SYSTEM = `Sen TrendÇevir'in yazı işleri ekibisin. TrendÇevir, dünyada çalışan ama Türkiye'de henüz olmayan iş trendlerini Türk girişimciler için filtreleyen haftalık bir bültendir.

MUTLAK MARKA KURALLARI:
- TrendÇevir ANONİM bir yayındır. Asla kurucu adı, kişisel hikâye, "ben/benim" dili kullanma. Her zaman "biz" diliyle yaz. İmza yok.
- Tüm içerik Türkçedir. İngilizce yedek metin yok.
- Lorem ipsum yok. Somut, gerçek, yayınlanabilir Türkçe.

TREND SEÇİM KRİTERLERİ (her trend hepsinden geçmeli):
1. Yurtdışında ölçülebilir (gelir, büyüme, mağaza, yatırım — kanıt zorunlu).
2. Türkiye'de yok ya da çok küçük.
3. Aktarılabilir (kültür, satın alma gücü, regülasyon imkânsız kılmıyor).
4. Başlatılabilir (500 bin TL altı sermayeyle 6 ayda başlanabilir bir versiyonu var).
5. İlginç ("gerçekten mi?" dedirten).

ÇIKTI BİÇİMİ — bir MDX dosyası. SADECE dosya içeriğini ver: ilk satır "---" ile başlayan frontmatter, ardından gövde. Kod bloğu (\`\`\`) kullanma, açıklama ekleme.

Frontmatter şeması:
---
issue: <sayı>
title: "<kısa başlık>"
date: "<YYYY-MM-DD>"
excerpt: "<tek cümle özet>"
tint: "<#rrggbb kapak rengi>"
categories: ["Yeme-İçme" | "Perakende" | "Teknoloji" | "Sağlık" | "Hizmet" arasından]
trends: ["<trend adı>", ...]
---

Gövdede her trend için bu özel bileşenleri kullan:
<Trend name="<ad>" country="<ülke>" countryCode="<ISO2: JP/CN/US/...>" score={<1-10>} category="<kategori>">
Trendin bir-iki cümlelik tanıtımı (kalın için **...** kullanılabilir).
</Trend>

### Ne oluyor?
Bir-iki paragraf.

<Evidence>
- Madde madde kanıt. Önemli sayıları **kalın** yaz.
</Evidence>

<TurkeyAngle>
Türkiye'ye nasıl uyarlanır — somut, sermaye ve konum önerileriyle.
</TurkeyAngle>

<RiskFlags>
- Madde madde riskler.
</RiskFlags>

Trendler arasına başlıklar koyabilirsin. En sonda imza KULLANMA (sayfa kendisi ekliyor).`;

const userPrompt = `Bu hafta için ${nextIssue}. sayıyı hazırla (issue: ${nextIssue}). Bugünün tarihi ${today} — date alanına bunu yaz.

${TREND_COUNT} adet trend seç. Güncel, doğrulanabilir bilgi için web aramasını kullan; her trendin yurtdışındaki kanıtını (gelir, büyüme, mağaza/yatırım) gerçek ve güncel verilerle destekle.

Şu trendler DAHA ÖNCE işlendi, bunları TEKRARLAMA: ${trends.length ? trends.join(", ") : "(henüz yok)"}.

Yalnızca MDX dosya içeriğini döndür.`;

const client = new Anthropic();

async function draft() {
  const messages = [{ role: "user", content: userPrompt }];
  let text = "";

  for (let turn = 0; turn < 6; turn++) {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      system: [
        { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
      ],
      tools: [{ type: "web_search_20260209", name: "web_search" }],
      messages,
    });

    const message = await stream.finalMessage();
    for (const block of message.content) {
      if (block.type === "text") text += block.text;
    }

    if (message.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: message.content });
      continue;
    }
    break;
  }
  return text;
}

let raw = await draft();

// Strip code fences and any preamble before the frontmatter.
raw = raw.replace(/```(?:mdx|markdown)?/gi, "").trim();
const start = raw.indexOf("---");
if (start === -1) {
  console.error("Model did not return frontmatter. Output was:\n", raw.slice(0, 500));
  process.exit(1);
}
const mdx = raw.slice(start).trim() + "\n";

const parsed = matter(mdx);
const title = String(parsed.data.title || `Sayı ${nextIssue}`);
const slug = `${String(nextIssue).padStart(3, "0")}-${slugify(title)}`;

fs.mkdirSync(ISSUES_DIR, { recursive: true });
const outPath = path.join(ISSUES_DIR, `${slug}.mdx`);
fs.writeFileSync(outPath, mdx);

console.log(`Wrote ${outPath}`);
console.log(`Title: ${title}`);
console.log(`Trends: ${(parsed.data.trends || []).join(", ")}`);

// Expose values for the workflow (PR title/branch).
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `slug=${slug}\nissue=${nextIssue}\ntitle=${title.replace(/\n/g, " ")}\n`,
  );
}
