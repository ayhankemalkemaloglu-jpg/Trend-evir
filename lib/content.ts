/**
 * Curated content for the landing page (value props, showcased trends,
 * testimonials, media mentions). Placeholder copy is realistic Turkish that
 * can be shipped or lightly edited — never Lorem Ipsum, never founder bios.
 */

export const categories = [
  "Tümü",
  "Yeme-İçme",
  "Perakende",
  "Teknoloji",
  "Sağlık",
  "Hizmet",
] as const;

export type Category = (typeof categories)[number];

export type Trend = {
  name: string;
  country: string;
  countryCode: string;
  description: string;
  adaptationScore: number;
  category: Exclude<Category, "Tümü">;
  /** Cover art tint (CSS color) used by the designed placeholder cover. */
  tint: string;
  href: string;
};

export const valueProps = [
  {
    title: "Erken Görürsün",
    body: "Pop Mart Çin'de 4 milyar dolar olmadan önce öğrenseydin?",
  },
  {
    title: "Türkiye için filtrelenmiş",
    body: "Her trend, Türk pazarına uyum skoruyla geliyor.",
  },
  {
    title: "Aksiyona dönüşür",
    body: "Sadece “şu var” demiyoruz. “Türkiye'de nasıl başlatılır” anlatıyoruz.",
  },
] as const;

export const showcaseTrends: Trend[] = [
  {
    name: "Sleep Tourism Otelleri",
    country: "Japonya",
    countryCode: "JP",
    description: "Tek işi uyku olan butik oteller; konuklar dinlenmek için geliyor.",
    adaptationScore: 7,
    category: "Hizmet",
    tint: "#3b4a6b",
    href: "/arsiv/001-ilk-sayi#sleep-tourism-otelleri",
  },
  {
    name: "Blind Box Vending",
    country: "Çin",
    countryCode: "CN",
    description: "Sürpriz figür otomatları; koleksiyon ve oyun bir arada satışta.",
    adaptationScore: 8,
    category: "Perakende",
    tint: "#6b3b54",
    href: "/arsiv/001-ilk-sayi#blind-box-vending",
  },
  {
    name: "Fonksiyonel Su Barları",
    country: "ABD",
    countryCode: "US",
    description: "Adaptojen ve elektrolitli içecekler; kafenin sağlıklı alternatifi.",
    adaptationScore: 6,
    category: "Yeme-İçme",
    tint: "#3b6b5a",
    href: "/arsiv/001-ilk-sayi#fonksiyonel-su-barlari",
  },
];
