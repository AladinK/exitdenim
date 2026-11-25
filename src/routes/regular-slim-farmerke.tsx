import { createFileRoute } from "@tanstack/react-router";
import { CategoryLanding, landingHead } from "@/components/CategoryLanding";
import { landingByPath } from "@/lib/landing-pages";
import { loadCatalog } from "@/lib/catalog-loader";

const page = landingByPath("/regular-slim-farmerke");

export const Route = createFileRoute("/regular-slim-farmerke")({
  loader: ({ context }) => loadCatalog(context.queryClient),
  head: () => landingHead(page),
  component: () => <CategoryLanding page={page} />,
});
