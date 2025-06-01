import { useLiveQuery } from "@live-state/sync/client";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Suspense, use } from "react";
import { ulid } from "ulid";
import { store } from "~/lib/live-state";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function Organization({ id }: { id: string }) {
  const org = useLiveQuery(store.organization[id]);

  return <div>{JSON.stringify(org)}</div>;
}

const OrganizationList = () => {
  const { $organizations } = getRouteApi("/app").useLoaderData();
  const organizations = use($organizations);
  return <pre>{JSON.stringify(organizations)}</pre>;
};

function RouteComponent() {
  const orgs = useLiveQuery(store.organization);
  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center">
      <Suspense fallback={<div>Loading organization...</div>}>
        <OrganizationList />
      </Suspense>
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
        Add Organization
      </Button>
    </div>
  );
}
