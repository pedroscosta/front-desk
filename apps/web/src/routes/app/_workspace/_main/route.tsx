import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Card } from "@workspace/ui/components/card";
import { AppSidebar } from "~/components/sidebar/app-sidebar";

export const Route = createFileRoute("/app/_workspace/_main")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <AppSidebar />
      <Card className="flex-1 bg-muted/30 relative m-2 ml-0 h-auto">
        <Outlet />
      </Card>
    </div>
  );
}
