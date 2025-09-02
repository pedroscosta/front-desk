import { useLiveQuery } from "@live-state/sync/client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useAtomValue } from "jotai/react";
import { activeOrganizationAtom } from "~/lib/atoms";
import { query } from "~/lib/live-state";

export const Route = createFileRoute("/app/threads/")({
  component: RouteComponent,
});

function RouteComponent() {
  const currentOrg = useAtomValue(activeOrganizationAtom);

  const orgObj = useLiveQuery(
    query.organization.where({ id: currentOrg!.id }).include({
      threads: true,
    })
  )?.[0];

  return (
    <>
      <CardHeader>
        <CardTitle className="justify-self-center">Threads</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto gap-0 items-center">
        {orgObj?.threads
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((thread) => (
            <Link
              key={thread.id}
              to={"/app/threads/$id"}
              params={{ id: thread.id }}
              className="border w-full max-w-5xl flex flex-col p-2.5 gap-2 not-first:border-t-0"
            >
              <div className="flex justify-between">{thread.name}</div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground border rounded-full h-6 px-2 items-center flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Bug
                </span>
                <Avatar className="size-5">
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              </div>
            </Link>
          ))}
      </CardContent>
    </>
  );
}
