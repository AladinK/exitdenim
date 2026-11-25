<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the private-label offering on a public, server-rendered content route, linked from the footer, sitemap and AI reading index so visitors and crawlers can discover the same information.
- Use the shared EcoProduction section for company-level manufacturing claims; keep product-specific finishing claims separate to avoid implying unverified processes for every model.
- Share dynamic site assets through the home-assets Query cache across loaders and branding so hydration does not request them a second time.
- Serve photos from the private buckets through the stable `/img/p/...` (product-images) and `/img/s/...` (site-assets) route (`src/routes/img.$.ts`, `src/lib/image-urls.ts`) instead of signed URLs, so browsers, the CDN, search engines and shared links keep one address per photo. Keep public stock reads live; never prerender visitor-specific or inventory-dependent content for performance.
- Dehydrate the per-request QueryClient into the router and hydrate it before rendering so initial public reads are reused without duplicate requests.
- Keep homepage collection filtering client-side on the existing products Query cache; it must not introduce extra requests or alter checkout behavior.
- Serve the homepage cover as optimized desktop/mobile WebP variants with matching media preloads; uploaded photography uses CDN asset pointers, while original catalog photographs remain unchanged for product inspection.
- Keep campaign photography in an editorial component separate from live product imagery so unverified photo-to-SKU associations cannot enter checkout.
- Apply the reference storefront theme through Layout-scoped tokens and shared controls, keeping administration and business data unchanged.
- Route header search into the existing catalog query filter rather than creating a separate product-fetch path.
- Use shared Radix Sheet and DropdownMenu primitives for storefront navigation so focus trapping, Escape dismissal and focus restoration stay consistent.
- Keep storefront motion CSS-driven with observed reference timings; decode incoming hero images before crossfading and pause rotation offscreen, on interaction and under reduced motion to protect loading and accessibility.
- Use native horizontal scroll snapping for homepage category slides, reusing the home-assets cache and shared buttons to avoid extra slider dependencies and preserve touch scrolling.
- Keep the storefront header on a solid themed surface with matching content offsets and unfiltered logo rendering so visibility does not depend on campaign imagery or scroll state.
- Expose shared Button variant attributes and theme storefront actions through scoped action tokens, including portaled cart controls, without recoloring administration or general primary content.

- Reuse confirmed public identity and model-derived schema helpers for machine-readable facts; never infer address, tax identifiers, return terms, ratings or inventory availability.
- Serve the AI reading index as public/llms.txt with H2 link-list sections only, so crawlers receive the same stable public content without a server handler.
- Keep English B2B translations on distinct public /en content routes with reciprocal language links and self-canonicals; reuse confirmed brand constants and the localized EcoProduction section to avoid divergent claims and changes to Serbian retail checkout.

## Independent hosting

- The code has no Lovable packages or services (`main` and `nezavisan-hosting` carry the same code). The Lovable notice above stays relevant only while the repository is still connected to Lovable; remove it once Lovable is disconnected.
- The storefront must look exactly as it did before the move. Do not restyle it, and keep the UI libraries in `package.json` (React, Tailwind, Radix, lucide, tailwind-merge) pinned to their exact versions; change them only together with a before/after visual comparison.
- Build is plain Vite + TanStack Start + Nitro (`vite.config.ts`). The deploy target is chosen by the Nitro preset (`NITRO_PRESET`, or auto-detected on Vercel, Netlify and Cloudflare Pages). Keep `css.transformer: "lightningcss"`; the original build used it.
- Brand photography and video are static files in `public/media/`, listed in `scripts/media.manifest.json`. The `src/assets/*.asset.json` pointers keep their shape but point to `/media/<file>`. Old `/__l5e/assets-v1/...` URLs are redirected in `src/server.ts`.
- Catalog reads never throw. `listProducts` and `getProductBySlug` return `{ products | product, state }` where state is `live`, `stale` (last good snapshot) or `down`. Loaders go through `loadCatalog` / `loadHome`, which set HTTP 503 when the catalog is down; pages render `CatalogUnavailable` only in that state.
- Customer orders are written by the server with the service role after prices and stock are checked; no client role may insert into `customer_orders`.
- Wholesale prices are never part of public catalog data. Approved partners get them from `getWholesalePrices` through `useWholesalePrice`.
- Order notifications use the Telegram Bot API and Resend directly (`TELEGRAM_BOT_TOKEN`, `RESEND_API_KEY`). Both are optional in code, so log loudly when neither is configured.
- Secrets live only in the host's environment variables (see `.env.example`). The committed `.env` holds public values only.
- While the repository is connected to Lovable, Lovable rewrites the committed `.env` with its own (old) database. Builds on Vercel therefore ignore every `.env*` file (`envDir: false` when `VERCEL` is set in `vite.config.ts`) and take Supabase settings only from Vercel's environment variables. Keep it that way, or the browser and the server end up on different databases.
- The database schema is `supabase/migrations/`; the Lovable-era migrations in `supabase/arhiva-lovable/` are history and are not applied.
- Hosting target is Vercel (`fra1`, set in `vite.config.ts` via `nitro({ vercel: { functions: { regions } } })`). Supabase settings are read under both our names and the names the Supabase–Vercel integration sets (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_*`, legacy `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`). The browser bundle gets the public pair at build time in the same order as the server reads it (`vite.config.ts` and `src/integrations/supabase/env.ts` must stay in sync).
- `npm run build` runs `scripts/db-migrate.mjs` first. It applies each `supabase/migrations/*.sql` once, in a transaction, records it in `private.schema_migrations`, and runs on Vercel only for production builds. Migrations must be forward-only and safe to run against live data; never edit an applied migration, add a new file instead.
- Server-side Supabase reads (GET/HEAD, read-only RPCs `get_*`/`has_*`/`is_*`, storage signing) are retried once when the connection stalls or breaks (`createSupabaseFetch` in `src/integrations/supabase/env.ts`); a frozen serverless instance can otherwise reuse a dead connection and time out while the database is healthy. Writes are never retried automatically.
- Production answers only on `https://www.exit.fashion`: `src/server.ts` permanently redirects page requests from `*.vercel.app`, `exit.fashion` and `exitdenim.shop` to the same path there. Preview deployments are not redirected.
- Owner order e-mails go to `ORDER_NOTIFY_EMAIL` (several addresses may be separated by commas), falling back to the brand e-mail.
- Never commit database exports or customer data (the repository is public).

