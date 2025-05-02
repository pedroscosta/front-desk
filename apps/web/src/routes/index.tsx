import { useLiveQuery } from "@repo/live-state/client";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { ulid } from "ulid";
import { store } from "../lib/live-state";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const issues = useLiveQuery(store.issues);

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button
        variant="default"
        onClick={() => store.issues.insert({ id: ulid(), title: "test" })}
      >
        test
      </Button>
      <pre>{JSON.stringify(issues ?? {}, null, 2)}</pre>
    </div>
  );
}
