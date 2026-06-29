import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "./jeans";

export const Route = createFileRoute("/cargo")({
  head: () => ({
    meta: [
      { title: "Карго — EXIT Denim Wholesale" },
      { name: "description", content: "Карго модели са функционалним џеповима — црна и песак. Најтраженија силуета сезоне." },
    ],
  }),
  component: () => (
    <CategoryPage
      title="Карго"
      eyebrow="Линија · 03 / 03"
      tagline="Црна · Песак · Сезонска"
      desc="Функционални џепови, чврсте тканине, најтраженија силуета сезоне. Стално у поновној производњи."
      slug="cargo"
    />
  ),
});
