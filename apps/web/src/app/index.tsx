import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center">
      Hello
    </div>
  );
}
