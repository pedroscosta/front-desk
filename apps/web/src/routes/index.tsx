import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
      <Button>Click me</Button>
    </div>
  );
}
