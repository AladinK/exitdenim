import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { CartDrawer } from "@/components/CartDrawer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Stranica nije pronađena</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Stranica koju tražite ne postoji ili je premeštena.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-primary"
          >
            Nazad na početnu
          </Link>
        </div>
      </div>
    </div>

  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Greška pri učitavanju
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pokušajte ponovo ili se vratite na početnu.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Pokušajte ponovo
          </button>
          <a href="/" className="btn-outline">
            Početna
          </a>
        </div>
      </div>
    </div>

  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#FBF8F2" },
      { name: "format-detection", content: "telephone=no" },
      { title: "EXIT Denim — muške farmerke, čino i kargo pantalone" },
      { name: "description", content: "Premijum muške farmerke, čino i kargo pantalone iz Novog Pazara. Plaćanje pouzećem, dostava širom Srbije." },
      { property: "og:title", content: "EXIT Denim — muške farmerke, čino i kargo pantalone" },
      { property: "og:description", content: "Premijum muške farmerke, čino i kargo pantalone iz Novog Pazara. Plaćanje pouzećem, dostava širom Srbije." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "EXIT Denim" },
      { property: "og:locale", content: "sr_RS" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "EXIT Denim — muške farmerke, čino i kargo pantalone" },
      { name: "twitter:description", content: "Premijum muške farmerke, čino i kargo pantalone iz Novog Pazara. Plaćanje pouzećem, dostava širom Srbije." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/wQ2yi2LWW4Nm6dZjG9u5v1l2MuN2/social-images/social-1782753110672-EXIT_DENIM.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/wQ2yi2LWW4Nm6dZjG9u5v1l2MuN2/social-images/social-1782753110672-EXIT_DENIM.webp" },
      { name: "google-site-verification", content: "DCaQQtJo89Yh-fBlqH3zmXiNmuE9PQyNuRxoXLYY_DA" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Archivo+Black&family=JetBrains+Mono:wght@400;500&display=swap&subset=cyrillic,cyrillic-ext,latin,latin-ext" },
      { rel: "stylesheet", href: appCss },
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
          <SmoothScroll>
            <Outlet />
          </SmoothScroll>
          <CartDrawer />
          <Cursor />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

