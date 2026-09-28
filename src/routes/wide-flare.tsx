import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/wide-flare")({
  beforeLoad: () => { throw redirect({ to: "/katalog", search: { group: "wide", fit: undefined } }); },
});
