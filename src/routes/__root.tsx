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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Страница није пронађена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Страница коју тражите не постоји или је премештена.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-primary"
          >
            Назад на почетну
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
          Грешка при учитавању
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Покушајте поново или се вратите на почетну.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Покушајте поново
          </button>
          <a href="/" className="btn-outline">
            Почетна
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
      { title: "EXIT Denim — Премијум B2B платформа за бутике" },
      { name: "description", content: "Премијум мушки деним, чино и карго панталоне из Новог Пазара. Затворена B2B платформа за бутике и регионалне партнере." },
      { property: "og:title", content: "EXIT Denim — Премијум B2B платформа" },
      { property: "og:description", content: "Стабилни кројеви. Стабилне марже. Поновне поруџбине." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "EXIT Denim" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap&subset=cyrillic,cyrillic-ext,latin,latin-ext" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        type: "image/svg+xml",
        href:
          "data:image/svg+xml;utf8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%230F2547'/><text x='50%' y='54%' text-anchor='middle' dominant-baseline='middle' font-family='Inter,sans-serif' font-size='30' font-weight='800' fill='%230FB5A6'>Е</text></svg>`
          ),
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="sr">
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
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
