import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "./jeans";

export const Route = createFileRoute("/cargo")({
  head: () => ({
    meta: [
      { title: "Cargo Line — EXIT Denim Wholesale" },
      { name: "description", content: "Cargo modeli sa funkcionalnim džepovima — Black i Sand. Najtraženija silueta sezone." },
    ],
  }),
  component: () => (
    <CategoryPage
      title="Cargo"
      eyebrow="Line · 03 / 03"
      tagline="Black · Sand · Seasonal"
      desc="Funkcionalni džepovi, čvrste tkanine, najtraženija silueta sezone. Stalno na repeat production-u."
      slug="cargo"
    />
  ),
});
