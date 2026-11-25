import path from "node:path";
import { defineConfig } from "vitest/config";

// Testovi proveravaju čistu logiku, pa ne učitavaju ceo build (Nitro, SSR).
export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
