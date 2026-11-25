import { createFileRoute, redirect } from "@tanstack/react-router";

// Ancienne page remplacée par /services (refonte nov. 2026).
export const Route = createFileRoute("/activites")({
  beforeLoad: () => {
    throw redirect({ to: "/services", statusCode: 301 });
  },
});
