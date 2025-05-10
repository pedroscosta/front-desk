import { useLiveQuery } from "@repo/live-state/client";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { ulid } from "ulid";
import { store } from "../lib/live-state";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const issues = useLiveQuery(store.issues);

  return (
    <div className="p-2 flex flex-col">
      {Object.entries(issues ?? {}).map(([id, issue]) => (
        <Link
          to="/issue/$issueId"
          params={{ issueId: id }}
          key={id}
          className="border flex items-center h-10"
        >
          {issue.title}
        </Link>
      ))}
      <Button
        onClick={() =>
          store.issues.insert({ title: "New issue", id: ulid().toLowerCase() })
        }
      >
        Add issue
      </Button>
    </div>
  );
}
