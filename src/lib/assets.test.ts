import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");
const assetsDir = path.join(root, "src/assets");

type Pointer = { url: string; original_filename: string; size: number; content_type: string };
type Manifest = { defaultOrigin: string; items: { file: string; source: string; bytes: number }[] };

const pointers = readdirSync(assetsDir)
  .filter((name) => name.endsWith(".asset.json"))
  .map((name) => ({
    name,
    data: JSON.parse(readFileSync(path.join(assetsDir, name), "utf8")) as Pointer,
  }));
const manifest = JSON.parse(
  readFileSync(path.join(root, "scripts/media.manifest.json"), "utf8"),
) as Manifest;

describe("fotografije brenda", () => {
  it("svaka slika koju sajt koristi služi se sa sopstvenog domena, iz /media/", () => {
    expect(pointers.length).toBeGreaterThan(0);
    for (const { name, data } of pointers) {
      expect(data.url, name).toBe(`/media/${data.original_filename}`);
      expect(JSON.stringify(data), name).not.toContain("__l5e");
    }
  });

  it("svaka je u spisku za preuzimanje, sa istom veličinom", () => {
    const listed = new Map(manifest.items.map((item) => [item.file, item]));
    for (const { name, data } of pointers) {
      const item = listed.get(data.original_filename);
      expect(item, `${name} nije u scripts/media.manifest.json`).toBeDefined();
      expect(item?.bytes, name).toBe(data.size);
    }
  });

  it("spisak nema viškova ni duplikata, a imena fajlova su bezbedna", () => {
    const used = new Set(pointers.map((p) => p.data.original_filename));
    const names = manifest.items.map((item) => item.file);
    expect(new Set(names).size).toBe(names.length);
    for (const item of manifest.items) {
      expect(used.has(item.file), `${item.file} se više ne koristi`).toBe(true);
      expect(item.file).toMatch(/^[A-Za-z0-9][A-Za-z0-9._-]*$/);
      expect(item.source.endsWith(`/${item.file}`), item.file).toBe(true);
    }
  });
});
