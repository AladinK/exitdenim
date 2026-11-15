import { createFileRoute } from "@tanstack/react-router";
import { EnglishB2B } from "@/components/EnglishB2B";
import { englishB2BHead } from "@/lib/b2b-english";

export const Route = createFileRoute("/en/manufacturing")({
  head: () => englishB2BHead("manufacturing"),
  component: () => <EnglishB2B page="manufacturing" />,
});