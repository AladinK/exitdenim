import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import fontLatin from "../assets/fonts/archivo-latin-wght-normal.woff2?url";
import fontLatinExt from "../assets/fonts/archivo-latin-ext-wght-normal.woff2?url";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { CartDrawer } from "@/components/CartDrawer";
import { SpinWheel } from "@/components/SpinWheel";
import { CookieBanner } from "@/components/CookieBanner";
import { Layout } from "@/components/Layout";
import { BRAND } from "@/lib/brand";
import { phoneHref, whatsappHref } from "@/lib/contact";
import { MEDIA, absoluteMedia } from "@/lib/media";

const SITE_TITLE = "EXIT Denim — muške farmerke, čino i kargo pantalone";
const SITE_DESCRIPTION = "Premijum muške farmerke, čino i kargo pantalone. Plaćanje pouzećem, dostava širom Srbije.";
const SUPABASE_ORIGIN = import.meta.env.VITE_SUPABASE_URL as string | undefined;

function NotFoundComponent() {
  return (
    <Layout>
      <div className="container-x section-pad text-center">
        <p className="eyebrow">Greška 404</p>
        <h1 className="mt-2">Stranica nije pronađena</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-2">
          Stranica koju tražite ne postoji ili je premeštena. Modeli su i dalje tu.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/katalog" className="btn-primary">Pogledajte sve modele</Link>
          <Link to="/" className="btn-outline">Početna</Link>
        </div>
      </div>
    </Layout>
  );
}

// Poslednja linija odbrane: prikazuje se samo ako pukne nešto što nijedna stranica
// nije sama obradila. Bez zaglavlja sajta, jer ono zavisi od delova koji su možda pali.
function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        <img src={MEDIA.logo} alt="EXIT Denim" width={360} height={202} className="site-logo mx-auto" />
        <h1 className="mt-8 text-[1.75rem]">Stranica se nije učitala</h1>
        <p className="mt-3 text-ink-2">
          Greška je na našoj strani. Pokušajte ponovo za koji trenutak. Ako želite da poručite odmah, pišite nam ili pozovite.
        </p>
        <div className="mt-8 grid gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary w-full"
          >
            Pokušajte ponovo
          </button>
          <a href={whatsappHref("Zdravo, želim da poručim. Sajt mi trenutno ne radi.")} className="btn-outline w-full">
            Poručite preko WhatsApp-a
          </a>
          <a href={phoneHref} className="btn-outline w-full">
            Pozovite {BRAND.phoneLabel}
          </a>
        </div>
        <a href="/" className="mt-6 inline-flex min-h-11 items-center text-sm underline decoration-1 underline-offset-4">
          Nazad na početnu
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#FBFAF7" },
      { name: "format-detection", content: "telephone=no" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "EXIT Denim" },
      { property: "og:locale", content: "sr_RS" },
      { property: "og:image", content: absoluteMedia(MEDIA.coverSeated) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: absoluteMedia(MEDIA.coverSeated) },
      { name: "google-site-verification", content: "DCaQQtJo89Yh-fBlqH3zmXiNmuE9PQyNuRxoXLYY_DA" },
    ],
    links: [
      // Slova su na istom domenu kao sajt: nema čekanja na tuđi server.
      { rel: "preload", as: "font", type: "font/woff2", href: fontLatin, crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: fontLatinExt, crossOrigin: "anonymous" },
      { rel: "stylesheet", href: appCss },
      ...(SUPABASE_ORIGIN ? [{ rel: "preconnect", href: SUPABASE_ORIGIN, crossOrigin: "anonymous" as const }] : []),
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
    ],
    scripts: [
      { children: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500,region:['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH','CA-QC']});" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="sr-Latn">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Outlet />
          <CartDrawer />
          <SpinWheel />
          <CookieBanner />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
