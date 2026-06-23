import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "./jeans";

export const Route = createFileRoute("/chino")({
  head: () => ({
    meta: [
      { title: "Chino Line — EXIT Denim Wholesale" },
      { name: "description", content: "Muški chino modeli: Beige, Navy, Olive. Mekane tkanine, klasične boje. Wholesale za butike." },
    ],
  }),
  component: () => (
    <CategoryPage
      title="Chino"
      eyebrow="Line · 02 / 03"
      tagline="Beige · Navy · Olive"
      desc="Mekane tkanine, klasične boje, čiste linije. Pant koji ide uz svaku top kolekciju butika."
      slug="chino"
    />
  ),
});
