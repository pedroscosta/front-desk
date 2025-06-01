import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Card } from "@workspace/ui/components/card";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { fetchClient } from "~/lib/live-state";
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

    return {
      $organizations: fetchClient.organization.get().then(async (orgs) => {
        if (Object.keys(orgs).length === 0)
          throw redirect({
            to: "/onboarding",
          });

        return orgs;
      }),
    };
  },
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen flex">
      <AppSidebar />
      <div className="h-full flex-1 shrink p-2 pl-0 relative">
        <Card className="size-full">
          <Outlet />
        </Card>
      </div>
    </div>
  );
}
