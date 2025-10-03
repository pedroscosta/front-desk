import { SubscriptionProvider } from "@live-state/sync/client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAtom } from "jotai/react";
import { activeOrganizationAtom } from "~/lib/atoms";
import { useOrganizationSwitcher } from "~/lib/hooks/query/use-organization-switcher";
import { client } from "~/lib/live-state";
import { getAuthUser } from "~/lib/server-funcs/get-auth-user";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await getAuthUser();

    if (!user) {
      throw redirect({
        to: "/",
      });
    }

    return user;
  },
});

function RouteComponent() {
  const { organizationUsers } = useOrganizationSwitcher();

  const [activeOrganization, setActiveOrganization] = useAtom(
    activeOrganizationAtom,
  );

  if (!activeOrganization) {
    setActiveOrganization(
      (Object.values(organizationUsers)[0] as any)?.organization,
    );
  }

  return (
    <SubscriptionProvider client={client}>
      <Outlet />
    </SubscriptionProvider>
  );
}
