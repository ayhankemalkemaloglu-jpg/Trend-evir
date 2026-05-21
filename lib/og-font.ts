/** Loads Instrument Serif for @vercel/og (next/og) image generation. */

let cache: ArrayBuffer | null = null;

export async function loadSerif(): Promise<ArrayBuffer | null> {
  if (cache) return cache;
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    const css = await cssRes.text();
    const url = css.match(/url\((https:\/\/[^)]+\.(?:woff2|ttf|woff))\)/)?.[1];
    if (!url) return null;
    cache = await (await fetch(url)).arrayBuffer();
    return cache;
  } catch {
    return null;
  }
}
