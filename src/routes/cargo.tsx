import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cargo")({
  beforeLoad: () => { throw redirect({ to: "/katalog" }); },
});
