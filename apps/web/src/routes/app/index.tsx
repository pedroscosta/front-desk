import { createFileRoute } from "@tanstack/react-router";
import { getAuthUser } from "~/lib/server-funcs/get-auth-user";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  loader: async () => {
    return getAuthUser();
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <div className="w-full h-dvh flex items-center justify-center">
      Hello "/app/"! {JSON.stringify(data)}
    </div>
  );
}
