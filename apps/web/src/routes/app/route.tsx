import { SubscriptionProvider } from "@live-state/sync/client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Card } from "@workspace/ui/components/card";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
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
  return (
    <SubscriptionProvider client={client}>
      <div className="w-screen h-screen flex overflow-hidden">
        <AppSidebar />
        <Card className="flex-1 bg-muted/30 relative m-2 ml-0 h-auto">
          <Outlet />
        </Card>
      </div>
    </SubscriptionProvider>
  );
}
