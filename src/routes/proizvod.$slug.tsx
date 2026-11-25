import type React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Gallery } from "@/components/ProductGallery";
import { SizeMatrix } from "@/components/SizeMatrix";
import { ProductCard } from "@/components/ProductCard";
import { AddToCart } from "@/components/AddToCart";
import { B2BSpecs } from "@/components/B2BSpecs";
import { CatalogUnavailable } from "@/components/CatalogUnavailable";
import { generateLineSheet } from "@/lib/line-sheet.functions";
import { productResultQuery, productsQuery } from "@/lib/product-queries";
import { markTemporarilyUnavailable } from "@/lib/http-status";
import { ecommerce, itemFromProduct } from "@/lib/analytics";
import { usePartner } from "@/hooks/usePartner";
import { oldPrice, DISCOUNT_PCT } from "@/lib/pricing";
import { formatEur, formatRsd } from "@/lib/format";
import { productAlt, productKind, fitPath, categoryLink } from "@/lib/seo-labels";
import { productSchema } from "@/lib/product-schema";
import { fitGuidance } from "@/lib/fit-guidance";
import { SIZE_EXCHANGE_TEXT } from "@/lib/brand";

export const Route = createFileRoute("/proizvod/$slug")({
  loader: async ({ params, context }) => {
    const result = await context.queryClient.ensureQueryData(productResultQuery(params.slug));
    if (!result.product) {
      // Baza ne odgovara: ne tvrdimo da model ne postoji, nego da je zastoj privremen.
      if (result.state === "down") {
        markTemporarilyUnavailable();
        return { product: null };
      }
      throw notFound();
    }
    // Slični modeli se učitavaju u pozadini i ne zadržavaju prvi prikaz.
    void context.queryClient.prefetchQuery(productsQuery());
    return { product: result.product };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.product;
    const name = p?.name ?? params.slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    const kind = p ? productKind(p) : "muške pantalone";
    const kindCap = kind.charAt(0).toUpperCase() + kind.slice(1);
    const fitTxt = p?.fit && p.fit !== "Cargo" ? ` ${p.fit}` : "";
    const full = `${kindCap}${fitTxt} — ${name} | EXIT`;
    const title = full.length <= 65 ? full : `${name} — ${kind} | EXIT`;
    const desc = p
      ? `${kindCap}${fitTxt ? ` u${fitTxt} kroju` : ""}, ${String(p.color ?? "").toLowerCase()}${p.fabric ? `, ${p.fabric}` : ""}. ${Number(p.retail).toLocaleString("sr-RS")} din, besplatna dostava i plaćanje pouzećem po Srbiji.`.replace(", ,", ",").slice(0, 160)
      : `${name} — muške pantalone EXIT Denim.`;
    const url = `https://exitdenim.shop/proizvod/${params.slug}`;
    const img = p?.image_url && /^https:\/\//.test(p.image_url) ? p.image_url : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
      ],
      links: [
        { rel: "canonical", href: url },
        ...(img ? [{ rel: "preload", as: "image", href: img, fetchPriority: "high" } as const] : []),
      ],
      scripts: p ? [{ type: "application/ld+json", children: JSON.stringify(productSchema(p, url)) }] : [],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="container-x section-pad text-center">
        <p className="eyebrow">Greška 404</p>
        <h1 className="mt-2">Model nije pronađen</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-2">Moguće je da je rasprodat i povučen iz kataloga, ili da adresa nije tačna.</p>
        <Link to="/katalog" className="btn-primary mt-8">Pogledajte sve modele</Link>
      </div>
    </Layout>
  ),
  component: ProductDetail,
});

const CATEGORY_LABEL: Record<string, string> = { jeans: "Farmerke", chino: "Chino pantalone", cargo: "Džeparke" };

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: result } = useSuspenseQuery(productResultQuery(slug));
  const product = result.product;
  const { data: all = [] } = useQuery(productsQuery());
  const { approved, wholesale } = usePartner();

  const related = useMemo(() => {
    if (!product) return [];
    const same = all.filter((x) => x.id !== product.id && x.category === product.category);
    const rest = all.filter((x) => x.id !== product.id && x.category !== product.category && x.fit === product.fit);
    return [...same, ...rest].slice(0, 4);
  }, [all, product]);

  useEffect(() => {
    if (product) ecommerce.viewItem(itemFromProduct(product));
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) {
    return (
      <Layout>
        <div className="container-x section-pad max-w-3xl">
          <CatalogUnavailable
            title="Ovaj model se trenutno ne učitava"
            message="Imamo kratak tehnički zastoj. Model nije nestao: pišite nam ili pozovite i reći ćemo vam odmah koje veličine imamo. Plaćate pouzećem, kao i uvek."
          />
        </div>
      </Layout>
    );
  }

  const category = categoryLink(product);
  const price = Number(product.retail);
  const partnerPrice = approved ? wholesale[product.id] : undefined;
  const guidance = fitGuidance(product.fit);
  const fitLink = fitPath(product.fit);

  return (
    <Layout>
      <nav aria-label="Putanja" className="container-x flex min-h-12 flex-wrap items-center gap-x-2 text-sm text-ink-3">
        <Link to="/katalog" className="hover:text-foreground">Svi modeli</Link>
        <span aria-hidden="true">/</span>
        <Link to={category.to as "/jeans"} className="hover:text-foreground">{CATEGORY_LABEL[product.category] ?? category.label}</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink-2">{product.sku}</span>
      </nav>

      <section className="product-layout pb-12 md:pb-16">
        <Gallery
          images={[product.image_url, ...(product.gallery || [])].filter(Boolean) as string[]}
          alt={productAlt(product)}
          sku={product.sku}
        />

        <div className="product-info">
          <p className="eyebrow">
            {CATEGORY_LABEL[product.category] ?? product.category} · {product.fit} kroj · {product.color}
          </p>
          <h1 className="mt-2 text-[clamp(1.75rem,2.4vw+1rem,2.5rem)]">{product.name}</h1>

          <div className="price-row mt-4">
            <span className="price-row__now">{formatRsd(price)}</span>
            {product.on_sale && (
              <>
                <s className="price-row__old">{formatRsd(oldPrice(price))}</s>
                <span className="tag tag--sale">−{DISCOUNT_PCT}%</span>
              </>
            )}
            {partnerPrice !== undefined && Number.isFinite(partnerPrice) && (
              <span className="ml-auto text-right text-sm text-ink-2">
                B2B cena <strong className="block text-xl text-action-text">{formatEur(partnerPrice)}</strong>
              </span>
            )}
          </div>

          {result.state === "stale" && (
            <p className="notice mt-4 text-sm">
              Trenutno ne možemo da proverimo stanje uživo. Prikazane veličine su poslednje poznate; pre slanja ćemo vam potvrditi porudžbinu.
            </p>
          )}

          <div className="mt-6">
            <AddToCart product={product} />
          </div>

          <div className="mt-8 border-t border-line">
            <Disclosure title="Opis" open>
              <p>{product.description}</p>
            </Disclosure>
            {guidance && (
              <Disclosure title="Kome odgovara ovaj kroj">
                <p>{guidance}</p>
                <p className="mt-3">
                  <Link to="/vodic-za-farmerke" hash="krojevi">Uporedite krojeve i proverite mere pre poručivanja</Link>
                </p>
              </Disclosure>
            )}
            <Disclosure title="Detalji i materijal">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Spec label="Kroj" value={product.fit} />
                <Spec label="Sastav" value={product.fabric} />
                <Spec label="Težina tkanine" value={product.weight} />
                <Spec label="Šifra" value={product.sku} />
              </dl>
            </Disclosure>
            <Disclosure title="Ekološki pristup proizvodnji">
              <p>
                U EXIT proizvodnji koristimo inovativnu lasersku tehnologiju španske kompanije Jeanologia kao deo našeg ekološkog pristupa obradi denima.
              </p>
              <p className="mt-3">
                <Link to="/proizvodnja">Više o našoj proizvodnji</Link>
              </p>
            </Disclosure>
            <Disclosure title="Dostava, plaćanje i zamena">
              <p>Plaćanje pouzećem pri preuzimanju paketa. Dostava je besplatna na sve porudžbine.</p>
              <p className="mt-3">{SIZE_EXCHANGE_TEXT}</p>
            </Disclosure>
            <Disclosure title="Slični modeli i saveti">
              <ul className="grid gap-2">
                {fitLink && fitLink !== category.to && (
                  <li><Link to={fitLink as "/jeans"}>Sve {product.fit} farmerke</Link></li>
                )}
                <li><Link to={category.to as "/jeans"}>{category.label}</Link></li>
                <li><Link to="/vodic-za-farmerke" hash="velicine">Kako izabrati veličinu i dužinu</Link></li>
                <li><Link to="/vodic-za-farmerke" hash="odrzavanje">Kako prati i održavati {productKind(product).replace("muške ", "")}</Link></li>
              </ul>
            </Disclosure>
          </div>

          {approved && (
            <div className="mt-8 grid gap-6">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <Spec label="Minimalna količina" value={`${product.moq} kom`} />
                <Spec label="Isporuka B2B" value={product.delivery} />
              </dl>
              <div>
                <LineSheetButton sku={product.sku} />
              </div>
              <B2BSpecs productId={product.id} sizes={product.sizes} />
              <div>
                <h2 className="text-base font-semibold tracking-normal">B2B porudžbina po veličinama</h2>
                <div className="mt-3">
                  <SizeMatrix product={product} wholesale={partnerPrice} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="band-soft section-pad" aria-labelledby="related-title">
          <div className="container-x">
            <div className="section-head">
              <div>
                <span className="stitch-tick" aria-hidden="true" />
                <h2 id="related-title">Možda vam se svidi i</h2>
              </div>
              <Link to={category.to as "/jeans"} className="section-head__link">{category.label}</Link>
            </div>
            <div className="product-grid mt-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} wholesale={approved ? wholesale[p.id] : undefined} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

function Disclosure({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="disclosure">
      <summary>
        {title}
        <Plus aria-hidden="true" />
      </summary>
      <div className="disclosure__body">{children}</div>
    </details>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.8125rem] text-ink-3">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}

function LineSheetButton({ sku }: { sku: string }) {
  const generate = useServerFn(generateLineSheet);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const download = async () => {
    setBusy(true);
    setError(null);
    try {
      const { pdfBase64 } = await generate({ data: { sku } });
      const bin = atob(pdfBase64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sku}-line-sheet.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (e) {
      setError((e as Error).message || "Line sheet trenutno nije dostupan.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button type="button" onClick={download} disabled={busy} className="btn-outline">
        <Download aria-hidden="true" className="h-[18px] w-[18px]" /> {busy ? "Pripremam…" : "Preuzmite line sheet (PDF)"}
      </button>
      {error && <p role="alert" className="error-text mt-2">{error}</p>}
    </>
  );
}
