import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "./jeans";

export const Route = createFileRoute("/chino")({
  head: () => ({
    meta: [
      { title: "Chino — EXIT Denim Wholesale" },
      { name: "description", content: "Muški chino modeli: Beige, Navy, Olive. Wholesale za butike u regiji." },
    ],
  }),
  component: () => <CategoryPage title="Chino" desc="Beige · Navy · Olive — mekane tkanine, klasične boje." slug="chino" />,
});
