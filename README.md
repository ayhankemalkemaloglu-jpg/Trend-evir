# TrendÇevir

Dünyada çalışan iş trendlerini Türk girişimciler için her hafta filtreleyen
haftalık bültenin pazarlama sitesi ve halka açık arşivi.

TrendÇevir **anonim** bir yayındır: marka her zaman "biz" diliyle konuşur, hiçbir
yerde kurucu adı, kişisel biyografi veya bireysel imza yer almaz.

## Teknoloji

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4** + shadcn tarzı bileşenler
- **MDX** — her bülten `content/issues/` altında bir `.mdx` dosyası
- **Framer Motion** — ölçülü animasyonlar
- **next/og** — her sayı için dinamik OpenGraph görseli
- **beehiiv** — e-posta abonelikleri
- **Plausible** — gizlilik dostu analitik

## Hızlı başlangıç

```bash
pnpm install
cp .env.example .env.local   # değerleri doldur (opsiyonel — boşken de site çalışır)
pnpm dev                     # http://localhost:3000
```

Komutlar:

| Komut         | Açıklama                          |
| ------------- | --------------------------------- |
| `pnpm dev`    | Geliştirme sunucusu               |
| `pnpm build`  | Production derlemesi              |
| `pnpm start`  | Derlenmiş çıktıyı sunar           |
| `pnpm lint`   | ESLint                            |

## Ortam değişkenleri

Tümü opsiyoneldir; tanımlı değilse ilgili özellik zarifçe devre dışı kalır
(form "servis yapılandırılmadı" mesajı döner, analitik script yüklenmez).

| Değişken                        | Açıklama                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| `BEEHIIV_API_KEY`               | beehiiv API anahtarı (abonelik)                                |
| `BEEHIIV_PUBLICATION_ID`        | beehiiv yayın ID'si (`pub_...`)                                |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`  | Plausible'da kayıtlı alan adı, örn. `trendcevir.com`           |
| `RESEND_API_KEY`                | İletişim formu e-postaları için Resend anahtarı                |
| `CONTACT_TO`                    | İletişim mesajlarının gideceği adres                           |
| `CONTACT_FROM`                  | Doğrulanmış Resend gönderen, örn. `TrendÇevir <site@...>`      |
| `ANTHROPIC_API_KEY`             | AI Fikir Üretici (`/fikir-uretici`) ve haftalık taslak otomasyonu |
| `ANTHROPIC_IDEAS_MODEL`         | Fikir Üretici için opsiyonel model (varsayılan: hızlı bir Haiku) |

`ANTHROPIC_API_KEY` tanımsızsa `/api/generate-ideas` "yapılandırılmadı"
mesajı döner; site geri kalanı normal çalışır.

## İçerik: yeni bülten ekleme

Her bülten `content/issues/NNN-slug.mdx` biçiminde bir dosyadır. Frontmatter:

```mdx
---
issue: 1
title: "Başlık"
date: "2026-05-18"
excerpt: "Tek cümlelik özet."
tint: "#2a2f45"            # kapak görselinin rengi
categories: ["Hizmet", "Perakende"]
trends: ["Trend A", "Trend B"]
---
```

Gövdede özel bileşenler kullanılır:

- `<Trend name="" country="" countryCode="JP" score={7} category="Hizmet">…</Trend>`
- `<Evidence>…</Evidence>` — kanıt/sayılar
- `<TurkeyAngle>…</TurkeyAngle>` — Türkiye uyarlaması
- `<RiskFlags>…</RiskFlags>` — riskler

Bültenler asla bir kişi tarafından imzalanmaz; sayfa altında imza
"— TrendÇevir Yazı İşleri" olarak görünür.

## Otomatik bülten taslağı (opsiyonel)

`.github/workflows/weekly-issue.yml`, her hafta (ve elle tetiklendiğinde)
`scripts/generate-issue.mjs` çalıştırır. Bu script Claude'un web arama aracıyla
güncel, yurtdışında çalışan ama Türkiye'de olmayan trendleri araştırır, ev
formatında bir MDX taslağı üretir ve **inceleme için bir Pull Request açar** —
yayın insan onayından geçer (markanın editöryal kuralı).

Gerekli GitHub secret: `ANTHROPIC_API_KEY`. Model `ANTHROPIC_MODEL` ile
değiştirilebilir (varsayılan: `claude-sonnet-4-6`).

Yerelde denemek için:

```bash
ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-issue.mjs
```

## Deploy

### Vercel (önerilen)

1. Repoyu Vercel'e içe aktar (framework otomatik algılanır).
2. Ortam değişkenlerini ekle.
3. Deploy. Her `main` push'unda otomatik yayınlanır.

### Render

`render.yaml` blueprint dahildir. Render'da "New → Blueprint" ile repoyu seç,
ortam değişkenlerini gir, deploy et.

## Erişilebilirlik & performans

- Tüm sayfalar statik/SSG; paylaşılan JS ~102 kB.
- Fontlar `next/font` ile optimize; görseller harici bağımlılık olmadan SVG.
- Gövde metni AAA kontrast; tüm etkileşimler klavyeyle erişilebilir.
- `prefers-reduced-motion` desteklenir.
