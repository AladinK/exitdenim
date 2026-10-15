import { createFileRoute } from "@tanstack/react-router";
import { CategoryLanding, landingHead } from "@/components/CategoryLanding";
import { landingByPath } from "@/lib/landing-pages";
import { productsQuery } from "@/lib/product-queries";

const page = landingByPath("/flare-farmerke");

export const Route = createFileRoute("/flare-farmerke")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  head: () => landingHead(page),
  component: () => <CategoryLanding page={page} />,
});
