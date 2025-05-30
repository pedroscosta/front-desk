import { useLiveQuery } from "@live-state/sync/client";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { ulid } from "ulid";
import { store } from "~/lib/live-state";
import { getAuthUser } from "~/lib/server-funcs/get-auth-user";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  loader: async () => {
    return getAuthUser();
  },
});

function Organization({ id }: { id: string }) {
  const org = useLiveQuery(store.organization[id]);

  return <div>{JSON.stringify(org)}</div>;
}

function RouteComponent() {
  const data = Route.useLoaderData();

  const orgs = useLiveQuery(store.organization);
  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center">
      {JSON.stringify(orgs)}
      {orgs &&
        Object.entries(orgs).map(([id, org]) => (
          <Organization key={id} id={id} />
        ))}
      <Button
        onClick={() =>
          store.organization.insert({
            id: ulid().toLowerCase(),
            name: "Acme Inc",
            slug: "acme",
          })
        }
      >
        Add Organization{" "}
      </Button>
    </div>
  );
}
