/**
 * remark plugin: links the first prose occurrence of each known trend name to
 * its /trend/[slug] page. Conservative by design — it only touches plain text
 * nodes in narrative prose and skips headings, code, existing links and the
 * custom MDX blocks (<Trend>, <Evidence>, …). Matching is case-sensitive so it
 * never mislinks a partial or differently-cased phrase.
 *
 * Typed against a minimal local mdast shape: pnpm doesn't expose unified/unist
 * at the project root for a direct type import, and these few fields are all
 * the transform touches.
 */

export type TrendRef = { name: string; slug: string };

interface MdNode {
  type: string;
  value?: string;
  url?: string;
  children?: MdNode[];
}

const SKIP = new Set([
  "link",
  "linkReference",
  "code",
  "inlineCode",
  "heading",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
]);

function linkifyText(
  node: MdNode,
  trends: TrendRef[],
  linked: Set<string>,
): MdNode[] {
  let text = node.value ?? "";
  const out: MdNode[] = [];

  // Repeatedly pull out the earliest still-unlinked trend mention.
  for (let guard = 0; guard < 64; guard++) {
    let best: { idx: number; trend: TrendRef } | null = null;
    for (const trend of trends) {
      if (linked.has(trend.slug)) continue;
      const idx = text.indexOf(trend.name);
      if (idx === -1) continue;
      if (
        !best ||
        idx < best.idx ||
        (idx === best.idx && trend.name.length > best.trend.name.length)
      ) {
        best = { idx, trend };
      }
    }
    if (!best) break;

    if (best.idx > 0) out.push({ type: "text", value: text.slice(0, best.idx) });
    out.push({
      type: "link",
      url: `/trend/${best.trend.slug}`,
      children: [{ type: "text", value: best.trend.name }],
    });
    linked.add(best.trend.slug);
    text = text.slice(best.idx + best.trend.name.length);
  }

  if (text) out.push({ type: "text", value: text });
  return out.length ? out : [node];
}

export function remarkAutolinkTrends(options: { trends: TrendRef[] }) {
  // Longer names first so "Sleep Tourism Otelleri" wins over a shorter prefix.
  const sorted = [...options.trends].sort(
    (a, b) => b.name.length - a.name.length,
  );

  return (tree: MdNode) => {
    const linked = new Set<string>();

    function walk(node: MdNode) {
      if (!node.children) return;
      const next: MdNode[] = [];
      for (const child of node.children) {
        if (child.type === "text" && typeof child.value === "string") {
          next.push(...linkifyText(child, sorted, linked));
        } else {
          if (!SKIP.has(child.type)) walk(child);
          next.push(child);
        }
      }
      node.children = next;
    }

    walk(tree);
  };
}
