/**
 * Türkiye uyum skorunun dört alt boyuta kırılımı. Saf sunucu bileşeni:
 * tooltip'ler CSS ile (group-hover / group-focus-within) çalışır, ekstra
 * client JS yoktur. Erişilebilirlik için her satır klavyeyle odaklanabilir
 * ve görsel tooltip'ten bağımsız bir aria-label taşır.
 */

export type ScoreDimension = number | { value: number; note?: string };

export interface ScoreBreakdownData {
  /** Türkiye'de talep potansiyeli (yüksek = iyi) */
  demand: ScoreDimension;
  /** Mevcut rekabet yoğunluğu (düşük = iyi) */
  competition: ScoreDimension;
  /** Regülasyon kolaylığı (yüksek = iyi) */
  regulation: ScoreDimension;
  /** Başlangıç maliyeti uygunluğu (yüksek = iyi) */
  cost: ScoreDimension;
}

const WEIGHTS = {
  demand: 0.35,
  competition: 0.25,
  regulation: 0.2,
  cost: 0.2,
} as const;

type Key = keyof ScoreBreakdownData;

const clamp = (n: number) => Math.max(0, Math.min(10, n));

function norm(d: ScoreDimension): { value: number; note?: string } {
  return typeof d === "number"
    ? { value: clamp(d) }
    : { value: clamp(d.value), note: d.note };
}

/**
 * Ağırlıklı toplam, "yüksek = daha iyi fırsat" ölçeğinde. Rekabet yoğunluğu
 * (düşük = iyi) olduğu için toplama ters çevrilerek katılır.
 */
export function weightedScore(b: ScoreBreakdownData): number {
  const demand = norm(b.demand).value;
  const competition = norm(b.competition).value;
  const regulation = norm(b.regulation).value;
  const cost = norm(b.cost).value;
  return Math.round(
    demand * WEIGHTS.demand +
      (10 - competition) * WEIGHTS.competition +
      regulation * WEIGHTS.regulation +
      cost * WEIGHTS.cost,
  );
}

const ROWS: {
  key: Key;
  label: string;
  /** true → bar dolusu = düşük değer (rekabet için). */
  invert: boolean;
  defaultNote: (display: number) => string;
}[] = [
  {
    key: "demand",
    label: "Talep potansiyeli",
    invert: false,
    defaultNote: (v) =>
      v >= 8
        ? "Güçlü ve büyüyen talep."
        : v >= 6
          ? "Sağlam bir talep var."
          : v >= 4
            ? "Orta düzey talep."
            : "Talep henüz sınırlı.",
  },
  {
    key: "competition",
    label: "Düşük rekabet",
    invert: true,
    defaultNote: (v) =>
      v >= 8
        ? "Neredeyse rakipsiz bir alan."
        : v >= 6
          ? "Rekabet düşük."
          : v >= 4
            ? "Orta düzey rekabet."
            : "Rekabet yoğun.",
  },
  {
    key: "regulation",
    label: "Regülasyon kolaylığı",
    invert: false,
    defaultNote: (v) =>
      v >= 8
        ? "Regülasyon engeli yok denecek kadar az."
        : v >= 6
          ? "Regülasyon yönetilebilir."
          : v >= 4
            ? "Birkaç regülasyon adımı var."
            : "Regülasyon karmaşık olabilir.",
  },
  {
    key: "cost",
    label: "Maliyet uygunluğu",
    invert: false,
    defaultNote: (v) =>
      v >= 8
        ? "Düşük sermayeyle başlanabilir."
        : v >= 6
          ? "Makul bir başlangıç maliyeti."
          : v >= 4
            ? "Orta düzey yatırım gerekir."
            : "Başlangıç maliyeti yüksek.",
  },
];

const WEIGHT_PCT: Record<Key, number> = {
  demand: 35,
  competition: 25,
  regulation: 20,
  cost: 20,
};

export function ScoreBreakdown({ data }: { data: ScoreBreakdownData }) {
  return (
    <div className="mt-6">
      <p className="kicker mb-3">Neden bu skor?</p>
      <ul className="space-y-3.5">
        {ROWS.map((row) => {
          const { value, note } = norm(data[row.key]);
          const display = row.invert ? 10 - value : value;
          const text = note ?? row.defaultNote(display);
          const detail = `${row.label}: 10 üzerinden ${display}. Toplam skora %${WEIGHT_PCT[row.key]} ağırlıkla katkı sağlar.`;
          return (
            <li
              key={row.key}
              tabIndex={0}
              aria-label={`${detail} ${text}`}
              className="group relative rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-foreground/90">{row.label}</span>
                <span className="font-mono text-xs tabular text-secondary">
                  {display}/10
                </span>
              </div>
              <div
                aria-hidden
                className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border"
              >
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${display * 10}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-secondary">
                {text}
              </p>

              {/* CSS tooltip — hover & keyboard-focus; supplementary to aria-label */}
              <span
                role="tooltip"
                aria-hidden
                className="pointer-events-none absolute -top-2 left-0 z-10 max-w-xs -translate-y-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs leading-relaxed text-foreground/90 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                {detail}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
