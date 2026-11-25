import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  SUPABASE_PUBLISHABLE_KEY_NAMES,
  SUPABASE_SECRET_KEY_NAMES,
  SUPABASE_URL_NAMES,
} from "./env";

const viteConfig = readFileSync(
  path.resolve(import.meta.dirname, "../../../vite.config.ts"),
  "utf8",
);
const listIn = (source: string, name: string) => {
  const match = source.match(new RegExp(`${name}\\s*=\\s*\\[([^\\]]*)\\]`));
  return match ? [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : null;
};

describe("podešavanja baze", () => {
  it("pregledač i server biraju adresu i ključ po istom redosledu", () => {
    expect(listIn(viteConfig, "SUPABASE_URL_NAMES")).toEqual(SUPABASE_URL_NAMES);
    expect(listIn(viteConfig, "SUPABASE_PUBLISHABLE_KEY_NAMES")).toEqual(
      SUPABASE_PUBLISHABLE_KEY_NAMES,
    );
  });

  it("prihvata imena koja upisuje Supabase integracija na Vercel-u", () => {
    expect(SUPABASE_URL_NAMES).toContain("SUPABASE_URL");
    expect(SUPABASE_PUBLISHABLE_KEY_NAMES).toContain("SUPABASE_PUBLISHABLE_KEY");
    expect(SUPABASE_PUBLISHABLE_KEY_NAMES).toContain("SUPABASE_ANON_KEY");
    expect(SUPABASE_SECRET_KEY_NAMES).toEqual(["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"]);
  });

  it("tajni ključ se nikad ne ugrađuje u kod za pregledač", () => {
    for (const name of SUPABASE_SECRET_KEY_NAMES) expect(viteConfig).not.toContain(`"${name}"`);
  });
});

describe("ponavljanje čitanja kada veza zakaže", () => {
  const base = "https://abc.supabase.co";

  it("ponavlja samo čitanja, nikad upise", async () => {
    const { isRepeatableRead } = await import("./env");
    expect(isRepeatableRead("GET", `${base}/rest/v1/products_public?select=*`)).toBe(true);
    expect(isRepeatableRead("HEAD", `${base}/rest/v1/profiles`)).toBe(true);
    expect(isRepeatableRead("POST", `${base}/rest/v1/rpc/get_stock_availability`)).toBe(true);
    expect(isRepeatableRead("POST", `${base}/rest/v1/rpc/has_role`)).toBe(true);
    expect(isRepeatableRead("POST", `${base}/storage/v1/object/sign/product-images`)).toBe(true);
    expect(isRepeatableRead("POST", `${base}/rest/v1/customer_orders`)).toBe(false);
    expect(isRepeatableRead("POST", `${base}/rest/v1/rpc/create_order`)).toBe(false);
    expect(isRepeatableRead("PATCH", `${base}/rest/v1/products`)).toBe(false);
    expect(isRepeatableRead("DELETE", `${base}/rest/v1/products`)).toBe(false);
    expect(isRepeatableRead("POST", `${base}/storage/v1/object/product-images/a.webp`)).toBe(false);
  });

  it("posle zaglavljene veze čitanje uspeva iz drugog pokušaja", async () => {
    const { createSupabaseFetch } = await import("./env");
    const calls: string[] = [];
    const original = globalThis.fetch;
    globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      calls.push(String(input));
      if (calls.length === 1) {
        // Prvi pokušaj visi dok ga rok ne prekine (kao mrtva veza posle pauze).
        return new Promise((_, reject) =>
          init?.signal?.addEventListener("abort", () => reject(init.signal!.reason)),
        );
      }
      return Promise.resolve(new Response("[]", { status: 200 }));
    }) as typeof fetch;
    try {
      const f = createSupabaseFetch("sb_publishable_x", { timeoutMs: 1_000, firstAttemptTimeoutMs: 30 });
      const res = await f(`${base}/rest/v1/products_public?select=*`, { method: "GET" });
      expect(res.status).toBe(200);
      expect(calls).toHaveLength(2);
    } finally {
      globalThis.fetch = original;
    }
  });

  it("upis se ne ponavlja ni kada veza zakaže", async () => {
    const { createSupabaseFetch } = await import("./env");
    let calls = 0;
    const original = globalThis.fetch;
    globalThis.fetch = ((_input: RequestInfo | URL, init?: RequestInit) => {
      calls++;
      return new Promise((_, reject) =>
        init?.signal?.addEventListener("abort", () => reject(init.signal!.reason)),
      );
    }) as typeof fetch;
    try {
      const f = createSupabaseFetch("sb_secret_x", { timeoutMs: 40, firstAttemptTimeoutMs: 10 });
      await expect(
        f(`${base}/rest/v1/customer_orders`, { method: "POST", body: "{}" }),
      ).rejects.toThrow();
      expect(calls).toBe(1);
    } finally {
      globalThis.fetch = original;
    }
  });
});
