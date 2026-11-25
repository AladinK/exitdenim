import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { oldPrice, DISCOUNT_PCT } from "@/lib/pricing";
import { productAlt } from "@/lib/seo-labels";
import { formatEur, formatRsd, sortSizes } from "@/lib/format";
import type { ProductWithStock } from "@/lib/products.functions";

export function ProductCard({
  product,
  wholesale,
  eager = false,
}: {
  product: ProductWithStock;
  /** Veleprodajna cena (EUR), samo za odobrene partnere. */
  wholesale?: number;
  /** Prve kartice na stranici učitavaju sliku odmah. */
  eager?: boolean;
}) {
  const stock = product.stock || {};
  const sizes = sortSizes(Object.keys(stock));
  const available = sizes.filter((s) => stock[s] > 0);
  const soldOut = sizes.length > 0 && available.length === 0;
  const lowStock = !soldOut && sizes.length >= 3 && available.length <= 2;
  const [hovered, setHovered] = useState(false);
  const [alternateReady, setAlternateReady] = useState(false);
  const alternate = product.gallery?.find((url) => url !== product.image_url && /^(https?:)?\//.test(url));
  const price = Number(product.retail);

  return (
    <Link
      to="/proizvod/$slug"
      params={{ slug: product.slug }}
      className={`product-card${soldOut ? " is-sold-out" : ""}`}
      aria-label={`${product.name}, ${formatRsd(price)}${soldOut ? ", rasprodato" : ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      data-alternate={alternateReady}
    >
      <div className="product-card__media">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={productAlt(product)}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            width={1000}
            height={1400}
            sizes="(min-width: 1100px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        )}
        {hovered && alternate && (
          <img
            src={alternate}
            alt=""
            aria-hidden="true"
            decoding="async"
            onLoad={() => setAlternateReady(true)}
            className="product-card__alt"
          />
        )}
        <div className="product-card__tags">
          {soldOut ? (
            <span className="tag tag--out">Rasprodato</span>
          ) : (
            <>
              {product.on_sale && <span className="tag tag--sale">−{DISCOUNT_PCT}%</span>}
              {lowStock && <span className="tag tag--low">Poslednji komadi</span>}
            </>
          )}
        </div>
        {!soldOut && sizes.length > 0 && (
          <div className="product-card__sizes" aria-hidden="true">
            {sizes.map((s) => (
              <span key={s} className={stock[s] > 0 ? undefined : "is-out"}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__meta">
          {product.fit} · {product.color}
        </div>
        <div className="product-card__price">
          <span>{formatRsd(price)}</span>
          {product.on_sale && <s>{formatRsd(oldPrice(price))}</s>}
          {wholesale !== undefined && Number.isFinite(wholesale) && (
            <span className="product-card__b2b">B2B {formatEur(wholesale)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
