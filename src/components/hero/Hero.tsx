import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { homeAssetsQuery } from "@/lib/product-queries";
import { ecommerce } from "@/lib/analytics";

const TICKER = ["PLAĆANJE POUZEĆEM", "BESPLATNA DOSTAVA NA SVE PORUDŽBINE", "PROIZVEDENO U SRBIJI", "NOVI KROJEVI: BOOTCUT, RELAXED, FLARE", "VELIČINE 31–40", "DENIM 12 OZ · 98% PAMUK"];

export function Hero() {
  const { data: assets } = useSuspenseQuery(homeAssetsQuery());
  const bg = assets["hero"]?.url || assets["hero_texture"]?.url || "";
  return (
    <section className="relative isolate overflow-hidden bg-[var(--ink)] text-[color:var(--ivory)]">
      <div className="absolute inset-0 -z-10" aria-hidden>
        {bg && <img src={bg} alt="" fetchPriority="high" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/30 to-transparent" />
      </div>

      <div className="container-x relative min-h-[62svh] md:min-h-[82svh] flex flex-col justify-end pt-28 pb-10 md:pb-16">
        <span className="self-start inline-flex items-center bg-accent text-accent-foreground px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">Novi krojevi · Bootcut / Relaxed / Flare</span>
        <h1 className="mt-5 text-[color:var(--ivory)] font-semibold normal-case leading-[0.95] tracking-[-0.045em] text-[clamp(2.75rem,9vw,7rem)]">
          Široke<br />
          <span className="text-[color:var(--ivory)]/60">farmerke.</span>
        </h1>
        <p className="mt-5 text-[16px] leading-snug text-[color:var(--ivory)]/80 max-w-sm">
          Bootcut, relaxed i flare krojevi iz naše radionice. Plaćate tek kad paket stigne na vašu adresu.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link to="/wide-flare" onClick={() => ecommerce.cta("wide_flare", "hero")} className="btn-street">
            Pogledajte modele <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/katalog" onClick={() => ecommerce.cta("shop_all", "hero")} className="font-semibold uppercase text-sm underline underline-offset-4 decoration-1">
            Sav asortiman
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
