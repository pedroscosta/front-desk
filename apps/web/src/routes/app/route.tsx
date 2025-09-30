import { SubscriptionProvider } from "@live-state/sync/client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAtom } from "jotai/react";
import { activeOrganizationAtom } from "~/lib/atoms";
import { useOrganizationSwitcher } from "~/lib/hooks/query/use-organization-switcher";
import { client, fetchClient } from "~/lib/live-state";
import { getAuthUser } from "~/lib/server-funcs/get-auth-user";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
  loader: async () => {
    const user = await getAuthUser();
    if (!user) {
      throw redirect({
        to: "/",
      });
    }
    const orgUsers = await fetchClient.organizationUser
      .get({
        include: {
          organization: true,
        },
      })
      .catch(() => null);

    if (!orgUsers || Object.keys(orgUsers).length === 0) {
      throw redirect({
        to: "/onboarding",
      });
    }

    return {
      organizationUser: orgUsers,
      user,
    };
  },
});

function RouteComponent() {
  const { organizationUser } = useOrganizationSwitcher();

  const [activeOrganization, setActiveOrganization] = useAtom(
    activeOrganizationAtom,
  );

  if (!activeOrganization) {
    setActiveOrganization(
      (Object.values(organizationUser)[0] as any)?.organization,
    );
  }

  return (
    <SubscriptionProvider client={client}>
      <Outlet />
    </SubscriptionProvider>
  );
}
