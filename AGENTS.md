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
- Share dynamic site assets through the home-assets Query cache across loaders and branding so hydration does not request a second set of signed URLs.
- Batch private image signing and keep public stock reads live; never prerender visitor-specific or inventory-dependent content for performance.
- Dehydrate the per-request QueryClient into the router and hydrate it before rendering so initial public reads and signed image URLs are reused without duplicate requests.
- Keep homepage collection filtering client-side on the existing products Query cache; it must not introduce extra requests or alter checkout behavior.
- Serve the homepage cover as optimized desktop/mobile WebP variants with matching media preloads; uploaded photography uses CDN asset pointers, while original catalog photographs remain unchanged for product inspection.
- Keep campaign photography in an editorial component separate from live product imagery so unverified photo-to-SKU associations cannot enter checkout.
- Apply the reference storefront theme through Layout-scoped tokens and shared controls, keeping administration and business data unchanged.
- Route header search into the existing catalog query filter rather than creating a separate product-fetch path.
- Use shared Radix Sheet and DropdownMenu primitives for storefront navigation so focus trapping, Escape dismissal and focus restoration stay consistent.
- Keep storefront motion CSS-driven with observed reference timings; decode incoming hero images before crossfading and pause rotation offscreen, on interaction and under reduced motion to protect loading and accessibility.
- Order homepage discovery as photographic masthead, cached live product selection, then editorial collection links so shopping is reachable before secondary brand stories.
