import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/chino")({
  beforeLoad: () => { throw redirect({ to: "/katalog" }); },
});
