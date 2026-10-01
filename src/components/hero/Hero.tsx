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

      <div className="container-x relative min-h-[62svh] md:min-h-[82svh] flex flex-col justify-end pt-28 pb-10 md:pb-16">
        <span className="sticker self-start">Novo · Bootcut / Relaxed / Flare</span>
        <h1 className="mt-5 text-[color:var(--ivory)] font-semibold normal-case leading-[0.95] tracking-[-0.045em] text-[clamp(2.75rem,9vw,7rem)]">
          Wide<br />
          <span className="text-[color:var(--ivory)]/60">leg</span> szn.
        </h1>
        <p className="mt-5 text-[16px] leading-snug text-[color:var(--ivory)]/80 max-w-sm">
          Širi krojevi, jači vibe. Farmerke iz naše radionice u Novom Pazaru — plaćaš tek kad stignu.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link to="/wide-flare" onClick={() => ecommerce.cta("wide_flare", "hero")} className="btn-street">
            Shop Wide & Flare <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/katalog" onClick={() => ecommerce.cta("shop_all", "hero")} className="font-semibold uppercase text-sm underline underline-offset-4 decoration-1">
            Vidi sve
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 text-[color:var(--ivory)]/70 overflow-hidden">
        <div className="flex w-max animate-marquee py-2.5" style={{ animationDuration: "22s" }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="px-5 text-[11px] tracking-[0.24em] uppercase whitespace-nowrap">
              {t} <span className="ml-5 opacity-40">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
