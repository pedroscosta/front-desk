import { useLiveQuery } from "@live-state/sync/client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  PriorityIndicator,
  StatusIndicator,
} from "@workspace/ui/components/indicator";
import { getFirstTextContent, safeParseJSON } from "@workspace/ui/lib/tiptap";
import { formatRelativeTime } from "@workspace/ui/lib/utils";
import { useAtomValue } from "jotai/react";
import { CircleUser } from "lucide-react";
import { activeOrganizationAtom } from "~/lib/atoms";
import { query } from "~/lib/live-state";

export const Route = createFileRoute("/app/threads/")({
  component: RouteComponent,
});

const ListItem = ({ threadId }: { threadId: string }) => {
  // TODO reverse sort messages by createdAt
  const thread = useLiveQuery(
    query.thread.one(threadId).include({
      messages: true,
      assignedUser: true,
    })
  );

  return (
    <Link
      to={"/app/threads/$id"}
      params={{ id: threadId }}
      className="w-full max-w-5xl flex flex-col p-3 gap-2 hover:bg-muted"
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-5">
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <div>{thread?.name}</div>
        </div>
        <div className="flex items-center gap-2">
          {thread?.assignedUser ? (
            <Avatar className="size-5">
              <AvatarFallback>{thread.assignedUser.name[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <CircleUser className="size-4" />
          )}
          <PriorityIndicator priority={thread?.priority ?? 0} />
          <StatusIndicator status={thread?.status ?? 0} />
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">
          <span className="font-medium">
            {thread?.messages?.[thread?.messages?.length - 1]?.author}:&nbsp;
          </span>
          <span className="truncate">
            {getFirstTextContent(
              safeParseJSON(
                thread?.messages?.[thread?.messages?.length - 1]?.content ?? ""
              )
            )}
          </span>
        </span>
        <div className="text-muted-foreground">
          {formatRelativeTime(thread?.createdAt as Date)}
        </div>
      </div>
    </Link>
  );
};

function RouteComponent() {
  const currentOrg = useAtomValue(activeOrganizationAtom);

  // Deep include thread messages and assigned user when live-state supports it
  const orgObj = useLiveQuery(
    query.organization.one(currentOrg!.id).include({
      threads: true,
    })
  );

  return (
    <>
      <CardHeader>
        <CardTitle className="justify-self-center">Threads</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto gap-0 items-center">
        {orgObj?.threads
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((thread) => (
            <ListItem key={thread.id} threadId={thread.id} />
          ))}
      </CardContent>
    </>
  );
}
