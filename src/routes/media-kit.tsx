import { createFileRoute } from "@tanstack/react-router";
import { Download, Instagram, Image as ImageIcon, FileText } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/media-kit")({
  head: () => ({
    meta: [
      { title: "Media Kit — EXIT Denim za partnere" },
      { name: "description", content: "Foto materijal, Instagram caption-i i story asseti za EXIT Denim B2B partnere." },
    ],
  }),
  component: MediaKit,
});

function MediaKit() {
  const packs = [
    { icon: ImageIcon, title: "Product photos", desc: "Studio + lifestyle. Visoka rezolucija, ready-to-post.", count: "120 fajlova" },
    { icon: Instagram, title: "Instagram pack", desc: "Story templates, reels covers i feed grid mock-up.", count: "40 templates" },
    { icon: FileText, title: "Caption library", desc: "Gotovi caption-i na BHS i EN, optimizovani za konverziju.", count: "60 caption-a" },
  ];

  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-16 md:py-24 grid md:grid-cols-2 gap-10 items-end">
          <div>
            <div className="eyebrow text-accent">Media Kit za partnere</div>
            <h1 className="mt-3 text-5xl md:text-6xl">Sve što treba butiku za prodaju</h1>
          </div>
          <p className="text-background/70 max-w-md">
            Fotografije, Instagram materijal i gotovi caption-i. Skidaš, postuješ, prodaješ. Update svaku sezonu.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid md:grid-cols-3 gap-5">
          {packs.map((p) => (
            <div key={p.title} className="border border-border rounded-sm p-6 bg-card flex flex-col">
              <p.icon className="w-6 h-6 text-accent" />
              <div className="mt-4 font-semibold text-lg">{p.title}</div>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{p.desc}</p>
              <div className="mt-4 text-xs eyebrow">{p.count}</div>
              <a href="#" className="btn-outline mt-5">
                <Download className="w-4 h-4" /> Download .zip
              </a>
            </div>
          ))}
        </div>

        <div className="container-x mt-16">
          <div className="eyebrow">Preview</div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {["#1f2a44", "#111", "#6b7a3a", "#c8b48f", "#7891ad", "#1b2236", "#2a2a2a", "#c2a878"].map((c, i) => (
              <div key={i} className="aspect-square rounded-sm" style={{ background: `linear-gradient(135deg, ${c}, #0d0d0d)` }} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
