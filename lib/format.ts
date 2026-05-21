/** Turkish-locale date formatting helpers. */

export function formatDateTR(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function issueNo(n: number): string {
  return `Sayı ${String(n).padStart(3, "0")}`;
}
