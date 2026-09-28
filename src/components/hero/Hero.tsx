import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteAssets } from "@/hooks/useSiteAsset";
import { ecommerce } from "@/lib/analytics";

const TICKER = ["NEW DROP: BOOTCUT", "RELAXED FIT", "FLARE IS BACK", "PLAĆAŠ KAD STIGNE", "MADE IN NOVI PAZAR", "BESPLATNA DOSTAVA 15.000+"];

export function Hero() {
  const assets = useSiteAssets();
  const bg = assets["hero"]?.url || assets["hero_texture"]?.url || "";
  return (
    <section className="relative isolate overflow-hidden bg-[var(--ink)] text-[color:var(--ivory)]">
      <div className="absolute inset-0 -z-10" aria-hidden>
        {bg && <img src={bg} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/30 to-transparent" />
      </div>

      <div className="container-x relative min-h-[78svh] md:min-h-[86svh] flex flex-col justify-end pt-28 pb-10 md:pb-16">
        <span className="sticker -rotate-3 self-start">Novo · Bootcut / Relaxed / Flare</span>
        <h1 className="mt-5 text-[color:var(--ivory)] leading-[0.86] tracking-[-0.03em] text-[clamp(3.4rem,15vw,11rem)]">
          Wide<br />
          <span className="text-[color:var(--acid)]">leg</span> szn.
        </h1>
        <p className="mt-5 text-[16px] leading-snug text-[color:var(--ivory)]/80 max-w-sm">
          Širi krojevi, jači vibe. Farmerke iz naše radionice u Novom Pazaru — plaćaš tek kad stignu.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link to="/wide-flare" onClick={() => ecommerce.cta("hero_wide_flare")} className="btn-street">
            Shop Wide & Flare <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/katalog" onClick={() => ecommerce.cta("hero_shop_all")} className="font-semibold uppercase text-sm underline underline-offset-4 decoration-2 decoration-[color:var(--acid)]">
            Vidi sve
          </Link>
        </div>
      </div>

      <div className="border-y-2 border-[color:var(--ink)] bg-[color:var(--acid)] text-[color:var(--ink)] overflow-hidden">
        <div className="flex w-max animate-marquee py-2.5" style={{ animationDuration: "22s" }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="px-5 font-[family-name:var(--font-display)] text-sm uppercase whitespace-nowrap">
              {t} <span className="ml-5">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
