import { createFileRoute, redirect } from "@tanstack/react-router";

// Anciennes fiches activités remplacées par /services (refonte nov. 2026).
export const Route = createFileRoute("/activites_/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/services", statusCode: 301 });
  },
});
