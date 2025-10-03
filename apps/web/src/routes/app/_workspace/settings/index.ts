import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_workspace/settings/")({
  loader: () => {
    throw redirect({
      to: "/app/settings/organization",
    });
  },
});
