/**
 * Sends a brand-styled "Bu hafta ne var?" summary of the latest issue via
 * Resend. Meant to run when a new issue lands on main (see
 * .github/workflows/notify-new-issue.yml).
 *
 * Note: the full newsletter goes out through beehiiv (that's where the
 * subscriber list and per-category segments live). This is a lightweight
 * Resend summary to a configured address — an editorial/ops heads-up and the
 * building block for a segmented send.
 *
 * Required to actually send: RESEND_API_KEY, CONTACT_FROM, WEEKLY_SUMMARY_TO.
 * Optional: SITE_URL (default https://trendcevir.com). Without them it prints
 * a dry run and exits 0 (never fails the workflow).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ISSUES_DIR = path.join(process.cwd(), "content", "issues");
const SITE_URL = (process.env.SITE_URL || "https://trendcevir.com").replace(
  /\/$/,
  "",
);

function latestIssue() {
  if (!fs.existsSync(ISSUES_DIR)) return null;
  const files = fs.readdirSync(ISSUES_DIR).filter((f) => f.endsWith(".mdx"));
  let best = null;
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(ISSUES_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const date = new Date(String(data.date ?? 0)).getTime();
    if (!best || date > best.date) {
      best = { slug, data, content, date };
    }
  }
  return best;
}

/** Top trends (by score) parsed from the issue body, falling back to frontmatter. */
function topTrends(content, frontmatterTrends) {
  const found = [];
  const re = /<Trend\b([^>]*?)>/g;
  let m;
  while ((m = re.exec(content))) {
    const attrs = m[1];
    const name = attrs.match(/name="([^"]*)"/)?.[1];
    const score = attrs.match(/score\s*=\s*\{?\s*"?(\d+(?:\.\d+)?)"?\s*\}?/)?.[1];
    if (name) found.push({ name, score: score ? Number(score) : null });
  }
  if (found.length === 0) {
    return (Array.isArray(frontmatterTrends) ? frontmatterTrends : []).map(
      (name) => ({ name: String(name), score: null }),
    );
  }
  return found.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 3);
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}

function buildEmail(issue) {
  const { data, content, slug } = issue;
  const title = String(data.title ?? slug);
  const excerpt = String(data.excerpt ?? "");
  const issueNo = `Sayı ${String(data.issue ?? "").padStart(3, "0")}`;
  const url = `${SITE_URL}/arsiv/${slug}`;
  const trends = topTrends(content, data.trends);

  const subject = `${issueNo}: ${title}`;

  const trendRows = trends
    .map(
      (t) =>
        `<tr><td style="padding:6px 0;color:#ffffff;">${escapeHtml(t.name)}</td>` +
        `<td style="padding:6px 0;text-align:right;color:#d4af37;font-family:monospace;">${
          t.score != null ? `${t.score}/10` : ""
        }</td></tr>`,
    )
    .join("");

  const text = [
    `TrendÇevir — ${issueNo}`,
    "",
    title,
    excerpt,
    "",
    "Bu sayıda:",
    ...trends.map((t) => `- ${t.name}${t.score != null ? ` (${t.score}/10)` : ""}`),
    "",
    `Sayıyı oku: ${url}`,
  ].join("\n");

  const html = `<!doctype html><html lang="tr"><body style="margin:0;background:#0f0f0f;color:#ffffff;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="font-family:monospace;letter-spacing:.18em;text-transform:uppercase;color:#d4af37;font-size:12px;margin:0 0 24px;">TrendÇevir · ${escapeHtml(issueNo)}</p>
    <h1 style="font-size:28px;line-height:1.2;margin:0 0 12px;color:#ffffff;">${escapeHtml(title)}</h1>
    <p style="color:#a0a0a0;line-height:1.6;margin:0 0 24px;">${escapeHtml(excerpt)}</p>
    <p style="font-family:monospace;letter-spacing:.12em;text-transform:uppercase;color:#a0a0a0;font-size:12px;margin:0 0 8px;">Bu sayıda</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #2a2a2a;margin-bottom:28px;">${trendRows}</table>
    <a href="${url}" style="display:inline-block;background:#d4af37;color:#0f0f0f;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:999px;">Sayıyı oku →</a>
    <p style="color:#6b6b6b;font-size:12px;line-height:1.6;margin:32px 0 0;border-top:1px solid #2a2a2a;padding-top:16px;">TrendÇevir · Dünyada işliyor, Türkiye'de henüz yok.</p>
  </div>
</body></html>`;

  return { subject, html, text, url };
}

const issue = latestIssue();
if (!issue) {
  console.error("No issues found — nothing to send.");
  process.exit(0);
}

const email = buildEmail(issue);
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.CONTACT_FROM;
const to = process.env.WEEKLY_SUMMARY_TO || process.env.CONTACT_TO;

if (!apiKey || !from || !to) {
  console.log(
    "Resend not configured (need RESEND_API_KEY, CONTACT_FROM, WEEKLY_SUMMARY_TO).",
  );
  console.log(`Dry run — subject: ${email.subject}`);
  console.log(email.text);
  process.exit(0);
}

const recipients = to
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from,
    to: recipients,
    subject: email.subject,
    html: email.html,
    text: email.text,
  }),
});

if (!res.ok) {
  console.error(`Resend failed (${res.status}): ${await res.text()}`);
  process.exit(1);
}

console.log(`Sent "${email.subject}" to ${recipients.length} recipient(s).`);
