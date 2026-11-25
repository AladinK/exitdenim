import { createFileRoute } from "@tanstack/react-router";
import { CategoryLanding, landingHead } from "@/components/CategoryLanding";
import { landingByPath } from "@/lib/landing-pages";
import { loadCatalog } from "@/lib/catalog-loader";

const page = landingByPath("/wide-flare");

export const Route = createFileRoute("/wide-flare")({
  loader: ({ context }) => loadCatalog(context.queryClient),
  head: () => landingHead(page),
  component: () => <CategoryLanding page={page} />,
});
