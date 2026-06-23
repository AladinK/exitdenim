import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "./jeans";

export const Route = createFileRoute("/cargo")({
  head: () => ({
    meta: [
      { title: "Cargo — EXIT Denim Wholesale" },
      { name: "description", content: "Cargo modeli sa funkcionalnim džepovima — Black i Sand. Wholesale za butike." },
    ],
  }),
  component: () => <CategoryPage title="Cargo" desc="Black · Sand — funkcionalni džepovi, najtraženija silueta sezone." slug="cargo" />,
});
