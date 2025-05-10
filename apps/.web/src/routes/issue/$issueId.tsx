import { useLiveQuery } from "@repo/live-state/client";
import { createFileRoute } from "@tanstack/react-router";
import { store } from "../../lib/live-state";

export const Route = createFileRoute("/issue/$issueId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { issueId } = Route.useParams();
  const name = useLiveQuery(store.issues[issueId]).title;
  return <div>{name}</div>;
}
