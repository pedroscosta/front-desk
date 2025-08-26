import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/threads/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/thread/"!</div>;
}
