import { QueryClient, dehydrate, hydrate } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    dehydrate: () => ({ queryState: JSON.stringify(dehydrate(queryClient, { shouldDehydrateMutation: () => false })) }),
    hydrate: (state) => { hydrate(queryClient, JSON.parse(state.queryState)); },
  });

  return router;
};
