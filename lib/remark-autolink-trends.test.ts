import { describe, expect, it } from "vitest";

import { remarkAutolinkTrends, type TrendRef } from "@/lib/remark-autolink-trends";

type N = { type: string; value?: string; url?: string; children?: N[] };

const TRENDS: TrendRef[] = [
  { name: "Blind Box Vending", slug: "blind-box-vending" },
  { name: "Fonksiyonel Su Barları", slug: "fonksiyonel-su-barlari" },
];

function run(tree: N, trends: TrendRef[] = TRENDS): N {
  remarkAutolinkTrends({ trends })(tree);
  return tree;
}

function collectLinks(node: N, out: N[] = []): N[] {
  if (node.type === "link") out.push(node);
  node.children?.forEach((c) => collectLinks(c, out));
  return out;
}

const paragraph = (value: string): N => ({
  type: "paragraph",
  children: [{ type: "text", value }],
});

describe("remarkAutolinkTrends", () => {
  it("links the first prose mention and keeps surrounding text", () => {
    const tree: N = { type: "root", children: [paragraph("Bence Blind Box Vending harika.")] };
    run(tree);

    const kids = tree.children![0].children!;
    expect(kids[0]).toEqual({ type: "text", value: "Bence " });
    expect(kids[1].type).toBe("link");
    expect(kids[1].url).toBe("/trend/blind-box-vending");
    expect(kids[1].children?.[0].value).toBe("Blind Box Vending");
    expect(kids[2]).toEqual({ type: "text", value: " harika." });
  });

  it("links each trend only once across the document", () => {
    const tree: N = {
      type: "root",
      children: [paragraph("Blind Box Vending"), paragraph("yine Blind Box Vending")],
    };
    run(tree);
    expect(collectLinks(tree)).toHaveLength(1);
  });

  it("skips headings", () => {
    const tree: N = {
      type: "root",
      children: [{ type: "heading", children: [{ type: "text", value: "Blind Box Vending" }] }],
    };
    run(tree);
    expect(collectLinks(tree)).toHaveLength(0);
  });

  it("does not descend into existing links", () => {
    const tree: N = {
      type: "root",
      children: [
        { type: "link", url: "/x", children: [{ type: "text", value: "Blind Box Vending" }] },
      ],
    };
    run(tree);
    const outer = tree.children![0];
    expect(outer.url).toBe("/x");
    expect(outer.children?.[0].type).toBe("text");
  });

  it("leaves text untouched when no trend matches", () => {
    const tree: N = { type: "root", children: [paragraph("Burada bir trend adı yok.")] };
    run(tree);
    expect(collectLinks(tree)).toHaveLength(0);
    expect(tree.children![0].children![0].value).toBe("Burada bir trend adı yok.");
  });
});
