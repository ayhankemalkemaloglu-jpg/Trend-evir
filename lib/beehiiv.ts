/**
 * Minimal beehiiv API client.
 * Docs: https://developers.beehiiv.com/api-reference/subscriptions/create
 */

const BEEHIIV_API_BASE = "https://api.beehiiv.com/v2";

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "config" | "rejected" | "network" };

export async function subscribeToBeehiiv(
  email: string,
  opts: { referringSite?: string } = {},
): Promise<SubscribeResult> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return { ok: false, reason: "config" };
  }

  try {
    const res = await fetch(
      `${BEEHIIV_API_BASE}/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "trendcevir.com",
          utm_medium: "organic",
          referring_site: opts.referringSite ?? "trendcevir.com",
        }),
        // beehiiv responds quickly; avoid hanging the request indefinitely.
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!res.ok) {
      return { ok: false, reason: "rejected" };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  }
}
