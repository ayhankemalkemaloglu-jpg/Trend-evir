import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "TrendÇevir gizlilik politikası ve KVKK aydınlatma metni. Hangi verileri topladığımız, neden işlediğimiz ve haklarınız.",
  alternates: { canonical: "/gizlilik" },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl leading-snug tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-foreground/85">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-16 md:py-24">
      <p className="kicker">Yasal</p>
      <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] leading-tight tracking-tight">
        Gizlilik Politikası
      </h1>
      <p className="mt-4 text-secondary">
        Son güncelleme: 21 Mayıs 2026. Bu metin, 6698 sayılı Kişisel Verilerin
        Korunması Kanunu (KVKK) kapsamında hazırlanmıştır.
      </p>

      <div className="gold-rule my-10" />

      <Section title="1. Veri Sorumlusu">
        <p>
          Kişisel verileriniz, veri sorumlusu sıfatıyla TrendÇevir tarafından
          aşağıda açıklanan kapsamda işlenmektedir. Her türlü soru ve talep için{" "}
          <Link
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            {siteConfig.contactEmail}
          </Link>{" "}
          adresinden bize ulaşabilirsiniz.
        </p>
      </Section>

      <Section title="2. Hangi Verileri Topluyoruz?">
        <p>
          Yalnızca bültene abone olurken paylaştığınız{" "}
          <strong className="text-foreground">e-posta adresinizi</strong>{" "}
          topluyoruz. Bunun dışında ad, telefon veya benzeri kimlik bilgisi
          talep etmiyoruz. İletişim formunu kullanırsanız, ilettiğiniz ad ve
          mesaj içeriği yalnızca size dönüş yapmak için işlenir.
        </p>
      </Section>

      <Section title="3. Verileri Hangi Amaçla İşliyoruz?">
        <p>
          E-posta adresiniz, yalnızca haftalık bülteni göndermek ve abonelik
          tercihlerinizi yönetmek için kullanılır. Verileriniz pazarlama amacıyla
          üçüncü taraflara satılmaz veya kiralanmaz.
        </p>
      </Section>

      <Section title="4. Yurt Dışına Aktarım">
        <p>
          Abonelik ve e-posta gönderim altyapısı için beehiiv hizmetini
          kullanıyoruz. Bu nedenle e-posta adresiniz, hizmetin sunucularının
          bulunduğu yurt dışı (ABD) lokasyonlarında işlenebilir. Aktarım, KVKK
          kapsamında açık rızanıza dayanılarak gerçekleştirilir; aboneliğinizi
          dilediğiniz an iptal edebilirsiniz.
        </p>
      </Section>

      <Section title="5. Çerezler ve Analitik">
        <p>
          Sitemizde gizlilik dostu Plausible analitiğini kullanıyoruz. Plausible{" "}
          <strong className="text-foreground">çerez kullanmaz</strong> ve sizi
          tanımlayan kişisel veri toplamaz; yalnızca toplulaştırılmış, anonim
          ziyaret istatistikleri ölçülür.
        </p>
      </Section>

      <Section title="6. Saklama Süresi">
        <p>
          E-posta adresiniz, aboneliğiniz devam ettiği sürece saklanır.
          Aboneliğinizi iptal ettiğinizde veya silme talebinde bulunduğunuzda,
          veriniz makul süre içinde sistemlerimizden kaldırılır.
        </p>
      </Section>

      <Section title="7. KVKK Kapsamındaki Haklarınız">
        <p>
          KVKK&apos;nın 11. maddesi uyarınca; kişisel verilerinizin işlenip
          işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,
          düzeltilmesini veya silinmesini isteme ve işlemeye itiraz etme
          haklarına sahipsiniz. Taleplerinizi yukarıdaki e-posta adresine
          iletebilirsiniz.
        </p>
      </Section>

      <Section title="8. Değişiklikler">
        <p>
          Bu politika zaman zaman güncellenebilir. Önemli değişikliklerde bülten
          aracılığıyla bilgilendirme yapılır. Güncel sürüm her zaman bu sayfada
          yer alır.
        </p>
      </Section>
    </div>
  );
}
