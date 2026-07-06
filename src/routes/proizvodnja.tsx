import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Factory, ShieldCheck, Scissors, Truck } from "lucide-react";
import workshopAsset from "@/assets/workshop.jpg.asset.json";
import { useSiteAsset } from "@/hooks/useSiteAsset";

export const Route = createFileRoute("/proizvodnja")({
  head: () => ({
    meta: [
      { title: "Производња · Атеље у Новом Пазару — EXIT Denim" },
      { name: "description", content: "Властита производња у Новом Пазару. Контрола квалитета на свакој серији. Тканине, крој, финиш." },
    ],
  }),
  component: Proizvodnja,
});

function Proizvodnja() {
  const workshopSrc = useSiteAsset("page_proizvodnja", workshopAsset.url);
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-20 md:py-32">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Атеље · Нови Пазар</div>
          <h1 className="mt-7 h1-editorial max-w-4xl text-background">
            Производња. <span className="italic">Поштене тканине</span>.<br/>
            Скројени кројеви.
          </h1>
          <p className="mt-8 text-lg text-background/75 max-w-2xl leading-relaxed">
            EXIT Denim ради све у властитом погону: кројење, шивење, прање и контролу квалитета. Без посредника, без изненађења.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 aspect-[4/3] overflow-hidden bg-secondary">
            <img src={workshopSrc} alt="EXIT Denim атеље" decoding="async" className="w-full h-full object-cover" />
          </div>
          <div className="lg:col-span-5">
            <div className="eyebrow">Чиме се квалитет држи</div>
            <h2 className="mt-5 h2-editorial">Шта држи квалитет.</h2>
            <div className="mt-10 space-y-7">
              {[
                { icon: Factory, t: "In-house производња", d: "Властита радионица у Новом Пазару. Контрола сваког корака." },
                { icon: Scissors, t: "Тест кроја", d: "Сваки нови модел пролази кроз три рунде тестирања кроја пре производње серије." },
                { icon: ShieldCheck, t: "QC на свакој серији", d: "Шавови, прање, димензије и финиш проверавају се пре паковања." },
                { icon: Truck, t: "Логистика у региону", d: "Директни партнер за испоруку — 5–10 дана до свих балканских земаља." },
              ].map((f) => (
                <div key={f.t} className="flex gap-5 pb-7 border-b border-border last:border-0 last:pb-0">
                  <f.icon className="w-5 h-5 mt-1 text-accent shrink-0" strokeWidth={1.25} />
                  <div>
                    <div className="serif text-xl">{f.t}</div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background border-t border-background/10">
        <div className="container-x py-24">
          <div className="grid md:grid-cols-3 gap-px bg-background/10">
            {[
              ["12.5 oz", "Стандардна тежина денима"],
              ["98 / 2", "Памук · Еластан"],
              ["3 ×", "QC по серији"],
            ].map(([v, l]) => (
              <div key={l} className="bg-foreground p-10 text-center">
                <div className="serif text-6xl text-accent tabular-nums">{v}</div>
                <div className="mt-4 text-[11px] uppercase tracking-[0.28em] text-background/65">{l}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link to="/postani-partner" className="btn-accent">Постаните партнер</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
