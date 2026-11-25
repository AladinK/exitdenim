import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MEDIA, absoluteMedia } from "./media";

const manifest = JSON.parse(
  readFileSync(path.resolve(import.meta.dirname, "../../scripts/media.manifest.json"), "utf8"),
) as { items: { file: string; source: string }[] };

describe("fotografije brenda", () => {
  it("svaka fotografija koju sajt koristi postoji u spisku za preuzimanje", () => {
    const listed = new Set(manifest.items.map((item) => `/media/${item.file}`));
    for (const [name, url] of Object.entries(MEDIA)) {
      expect(listed.has(url), `${name} (${url}) nije u scripts/media.manifest.json`).toBe(true);
    }
  });

  it("imena fajlova su bezbedna i jedinstvena", () => {
    const names = manifest.items.map((item) => item.file);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) expect(name).toMatch(/^[A-Za-z0-9][A-Za-z0-9._-]*$/);
  });

  it("adrese za deljenje su apsolutne", () => {
    expect(absoluteMedia(MEDIA.coverSeated)).toBe("https://exitdenim.shop/media/exit-seated-cover.webp");
    expect(absoluteMedia("https://primer.rs/a.jpg")).toBe("https://primer.rs/a.jpg");
  });
});
