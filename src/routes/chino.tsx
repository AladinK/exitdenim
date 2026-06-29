import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "./jeans";

export const Route = createFileRoute("/chino")({
  head: () => ({
    meta: [
      { title: "Чино — EXIT Denim Wholesale" },
      { name: "description", content: "Мушки чино модели: беж, тегет, маслинаста. Меке тканине, класичне боје. Велепродаја за бутике." },
    ],
  }),
  component: () => (
    <CategoryPage
      title="Чино"
      eyebrow="Линија · 02 / 03"
      tagline="Беж · Тегет · Маслинаста"
      desc="Меке тканине, класичне боје, чисте линије. Панталоне које иду уз сваку топ колекцију бутика."
      slug="chino"
    />
  ),
});
