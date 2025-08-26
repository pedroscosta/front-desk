import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  loader: () => {
    throw redirect({
      to: "/app/threads",
    });
  },
});

function RouteComponent() {
  return null;
}
