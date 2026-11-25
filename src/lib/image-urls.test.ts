import { describe, expect, it } from "vitest";
import { absoluteUrl, parseImageRequest, publicImageUrl } from "./image-urls";

describe("stalne adrese fotografija", () => {
  it("putanju iz skladišta pretvara u adresu sajta", () => {
    expect(publicImageUrl("products/slim-e-3017-1791913452406-e8bul.webp", "p")).toBe(
      "/img/p/products/slim-e-3017-1791913452406-e8bul.webp",
    );
    expect(publicImageUrl("home/hero-1783271825738.webp", "s")).toBe(
      "/img/s/home/hero-1783271825738.webp",
    );
  });

  it("pune adrese, /media/ i prazne vrednosti ostavlja kakve jesu", () => {
    expect(publicImageUrl("https://cdn.example.com/a.webp", "p")).toBe("https://cdn.example.com/a.webp");
    expect(publicImageUrl("/media/exit-logo.webp", "s")).toBe("/media/exit-logo.webp");
    expect(publicImageUrl(null, "p")).toBeNull();
    expect(publicImageUrl("", "p")).toBeNull();
  });

  it("pravi apsolutni URL za pretraživače", () => {
    expect(absoluteUrl("/img/p/products/a.webp", "https://www.exit.fashion")).toBe(
      "https://www.exit.fashion/img/p/products/a.webp",
    );
    expect(absoluteUrl("https://x.rs/a.webp", "https://www.exit.fashion")).toBe("https://x.rs/a.webp");
    expect(absoluteUrl("products/a.webp", "https://www.exit.fashion")).toBeNull();
  });

  it("adresa sa sajta vodi nazad na isti fajl u skladištu", () => {
    const path = "products/čista farmerka 1.webp";
    const url = publicImageUrl(path, "p");
    expect(parseImageRequest(url.slice("/img/".length))).toEqual({
      bucket: "product-images",
      path,
      contentType: "image/webp",
    });
    expect(parseImageRequest("s/home/hero.JPG")).toEqual({
      bucket: "site-assets",
      path: "home/hero.JPG",
      contentType: "image/jpeg",
    });
  });

  it("odbija skokove u druge foldere, nepoznate bucket-e i fajlove koji nisu slike", () => {
    expect(parseImageRequest("p/../secret.webp")).toBeNull();
    expect(parseImageRequest("p/products/%2e%2e/secret.webp")).toBeNull();
    expect(parseImageRequest("p//a.webp")).toBeNull();
    expect(parseImageRequest("x/products/a.webp")).toBeNull();
    expect(parseImageRequest("p/products/a.svg")).toBeNull();
    expect(parseImageRequest("p/products/a.html")).toBeNull();
    expect(parseImageRequest("p/products/a%5Cb.webp")).toBeNull();
    expect(parseImageRequest("p")).toBeNull();
    expect(parseImageRequest("p/%E0%A4%A.webp")).toBeNull();
  });
});
