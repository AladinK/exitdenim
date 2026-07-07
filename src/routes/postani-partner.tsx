import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/postani-partner")({
  head: () => ({
    meta: [
      { title: "Партнерски програм — EXIT Denim B2B" },
      { name: "description", content: "Пријавите бутик за EXIT Denim B2B партнерство. Одобравамо велепродају бутицима, онлајн продавцима и дистрибутерима у региону." },
      { property: "og:title", content: "Партнерски програм — EXIT Denim B2B" },
      { property: "og:url", content: "https://exitdenim.shop/postani-partner" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/postani-partner" }],
  }),
  component: Partner,
});

function Partner() {
  return (
    <Layout>
      <section className="bg-foreground text-background relative overflow-hidden">
        <div className="container-x py-20 md:py-32 relative">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">По пријави · Приватни B2B шоурум</div>
          <h1 className="mt-7 h1-editorial max-w-4xl text-background">
            Партнерски програм<br/>
            <span className="italic font-light text-background/85">EXIT Denim</span>
          </h1>
          <p className="mt-8 text-background/75 max-w-xl leading-relaxed">
            Приступ велепродајном каталогу одобравамо бутицима, онлајн продавцима и дистрибутерима који желе стабилну деним понуду — без скакања цена и без скривених трошкова.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="eyebrow">Шта добијате</div>
            <h2 className="mt-5 h2-editorial">
              Комплетан <span className="italic">партнерски пакет</span>.
            </h2>
            <ul className="mt-8 space-y-4 text-[15px]">
              {[
                "Приступ велепродајним ценама и стању по величинама",
                "Матрица величина — поруџбина директно из каталога",
                "Лајн-шит и комплетан каталог у PDF-у",
                "Медија кит: фото, Instagram caption-и, story шаблони",
                "Лични wholesale тим — српски, босански, хрватски, енглески",
                "Поновне поруџбине бест-селлера",
              ].map((i) => (
                <li key={i} className="flex gap-3 items-start border-b border-border pb-4">
                  <Check className="w-4 h-4 mt-1.5 text-accent shrink-0" strokeWidth={1.5} />
                  <span className="text-foreground/85 leading-relaxed">{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-foreground p-10">
              <div className="eyebrow">Услови сарадње</div>
              <h3 className="mt-4 serif text-3xl">Услови куће</h3>
              <dl className="mt-8 divide-y divide-border">
                {[
                  ["Минимум прве поруџбине", "60 ком (Стартер пакет)"],
                  ["MOQ по артиклу", "10–12 ком"],
                  ["Плаћање", "50% аванс · 50% пре отпреме"],
                  ["Регионална испорука", "5 – 10 дана"],
                  ["Сезоне", "2 годишње + поновне поруџбине"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between gap-4 py-4">
                    <dt className="text-sm text-muted-foreground">{l}</dt>
                    <dd className="serif text-lg text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/auth" className="btn-primary w-full mt-8">
                Отвори B2B налог <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground text-center">
                Одобрење налога у року 24 сата
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
