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
