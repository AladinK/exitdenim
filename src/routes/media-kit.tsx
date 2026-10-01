import { createFileRoute } from "@tanstack/react-router";
import { Download, Instagram, Image as ImageIcon, FileText } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/media-kit")({
  head: () => ({
    meta: [
      { title: "Medija kit — EXIT Denim za B2B partnere" },
      { name: "description", content: "Foto materijal proizvoda, Instagram story šabloni i gotovi caption-i za EXIT Denim B2B partnere. Osvežavanje svake sezone." },
      { property: "og:title", content: "Medija kit — EXIT Denim za B2B partnere" },
      { property: "og:url", content: "https://exitdenim.shop/media-kit" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/media-kit" }],
  }),
  component: MediaKit,
});

function MediaKit() {
  const packs = [
    { icon: ImageIcon, title: "Fotografije proizvoda", desc: "Studio + lifestyle. Visoka rezolucija, spremno za objavu.", count: "120 fajlova" },
    { icon: Instagram, title: "Instagram paket", desc: "Story šabloni, reels naslovne i feed grid mock-up.", count: "40 šablona" },
    { icon: FileText, title: "Biblioteka caption-a", desc: "Gotovi caption-i na srpskom i engleskom, optimizovani za konverziju.", count: "60 caption-a" },
  ];

  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-16 md:py-24 grid md:grid-cols-2 gap-10 items-end">
          <div>
            <div className="eyebrow text-accent">Medija kit za partnere</div>
            <h1 className="mt-3 h1-editorial text-background">Sve što butiku treba za prodaju</h1>
          </div>
          <p className="text-background/70 max-w-md leading-relaxed">
            Fotografije, Instagram materijal i gotovi caption-i. Preuzmete, objavite, prodate. Osvežavanje svake sezone.
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
                aria-label={`${p.title} — uskoro dostupno za preuzimanje`}
              >
                <Download className="w-4 h-4" /> Uskoro
              </button>
            </div>
          ))}
        </div>

        <div className="container-x mt-16">
          <div className="eyebrow">Brending · pasta bojâ</div>
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
