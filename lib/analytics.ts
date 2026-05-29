/** Plausible custom-event helper. No-op if the script isn't loaded. */

type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, string | number | boolean> },
) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export type AnalyticsEvent =
  | "signup_attempted"
  | "signup_success"
  | "issue_read"
  | "share_clicked"
  | "checklist_downloaded";

export function trackEvent(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible(event, props ? { props } : undefined);
  }
}
