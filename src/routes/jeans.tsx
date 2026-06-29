import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jeans")({
  beforeLoad: () => { throw redirect({ to: "/katalog" }); },
});
