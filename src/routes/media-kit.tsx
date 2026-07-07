import { createFileRoute } from "@tanstack/react-router";
import { Download, Instagram, Image as ImageIcon, FileText } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/media-kit")({
  head: () => ({
    meta: [
      { title: "Медија кит — EXIT Denim за B2B партнере" },
      { name: "description", content: "Фото материјал производа, Instagram story шаблони и готови caption-и за EXIT Denim B2B партнере. Освежавање сваке сезоне." },
      { property: "og:title", content: "Медија кит — EXIT Denim за B2B партнере" },
      { property: "og:url", content: "https://exitdenim.shop/media-kit" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/media-kit" }],
  }),
  component: MediaKit,
});

function MediaKit() {
  const packs = [
    { icon: ImageIcon, title: "Фотографије производа", desc: "Студио + lifestyle. Висока резолуција, спремно за објаву.", count: "120 фајлова" },
    { icon: Instagram, title: "Instagram пакет", desc: "Story шаблони, reels насловне и feed grid mock-up.", count: "40 шаблона" },
    { icon: FileText, title: "Библиотека caption-а", desc: "Готови caption-и на српском и енглеском, оптимизовани за конверзију.", count: "60 caption-а" },
  ];

  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-16 md:py-24 grid md:grid-cols-2 gap-10 items-end">
          <div>
            <div className="eyebrow text-accent">Медија кит за партнере</div>
            <h1 className="mt-3 h1-editorial text-background">Све што бутику треба за продају</h1>
          </div>
          <p className="text-background/70 max-w-md leading-relaxed">
            Фотографије, Instagram материјал и готови caption-и. Преузмете, објавите, продате. Освежавање сваке сезоне.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid md:grid-cols-3 gap-5">
          {packs.map((p) => (
            <div key={p.title} className="border border-border rounded-sm p-6 bg-card flex flex-col">
              <p.icon className="w-6 h-6 text-accent" strokeWidth={1.25} />
              <div className="mt-4 font-semibold text-lg tracking-tight">{p.title}</div>
              <p className="mt-2 text-sm text-muted-foreground flex-1 leading-relaxed">{p.desc}</p>
              <div className="mt-4 text-xs eyebrow">{p.count}</div>
              <button
                type="button"
                disabled
                className="btn-outline mt-5 opacity-60 cursor-not-allowed"
                aria-label={`${p.title} — ускоро доступно за преузимање`}
              >
                <Download className="w-4 h-4" /> Ускоро
              </button>
            </div>
          ))}
        </div>

        <div className="container-x mt-16">
          <div className="eyebrow">Брендинг · паста бојâ</div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["#1B1A17", "Ink"],
              ["#F5F0E7", "Ivory"],
              ["#6B7F4A", "Sage"],
              ["#B89968", "Gold"],
              ["#E8DFD2", "Cashmere"],
              ["#2A2823", "Espresso"],
              ["#8C8377", "Taupe"],
              ["#4F6135", "Deep Sage"],
            ].map(([c, name]) => (
              <div key={c} className="border border-border rounded-sm overflow-hidden">
                <div className="aspect-square" style={{ background: c }} />
                <div className="flex items-center justify-between px-3 py-2 text-[11px]">
                  <span className="font-medium">{name}</span>
                  <span className="mono text-muted-foreground">{c}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
