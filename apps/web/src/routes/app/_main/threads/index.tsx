import { useLiveQuery } from "@live-state/sync/client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  Filter,
  FilterOptions,
  FilterValue,
} from "@workspace/ui/components/blocks/filter";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  PriorityIndicator,
  priorityText,
  StatusIndicator,
  statusValues,
} from "@workspace/ui/components/indicator";
import { getFirstTextContent, safeParseJSON } from "@workspace/ui/lib/tiptap";
import { formatRelativeTime } from "@workspace/ui/lib/utils";
import { useAtomValue } from "jotai/react";
import { CircleUser } from "lucide-react";
import { useState } from "react";
import { CreateThread } from "~/components/devtools/create-thread";
import { activeOrganizationAtom } from "~/lib/atoms";
import { query } from "~/lib/live-state";

export const Route = createFileRoute("/app/_main/threads/")({
  component: RouteComponent,
});

const ListItem = ({ threadId }: { threadId: string }) => {
  // TODO reverse sort messages by createdAt
  const thread = useLiveQuery(
    query.thread.one(threadId).include({
      messages: true,
      assignedUser: true,
    }),
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
                thread?.messages?.[thread?.messages?.length - 1]?.content ?? "",
              ),
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

  const organizationUsers = useLiveQuery(
    query.organizationUser
      .where({ organizationId: currentOrg!.id })
      .include({ user: true }),
  );

  const [filter, setFilter] = useState<FilterValue>({});

  let threadsQuery = query.thread.where({
    organizationId: currentOrg!.id,
  });

  if (filter && Object.keys(filter).some((key) => filter[key]?.length > 0)) {
    threadsQuery = threadsQuery.where(
      Object.fromEntries(
        Object.entries(filter).map(([key, values]) => [key, { $in: values }]),
      ),
    );
  }

  const filterOptions: FilterOptions = {
    status: {
      label: "Status",
      key: "status",
      icon: <StatusIndicator status={0} />,
      options: Object.entries(statusValues).map(([statusKey, value]) => {
        const status = Number(statusKey);
        return {
          label: value.label,
          value: status,
          icon: <StatusIndicator status={status} />,
        };
      }),
    },
    priority: {
      label: "Priority",
      key: "priority",
      icon: <PriorityIndicator priority={2} />,
      options: Object.entries(priorityText).map(([priorityKey, value]) => {
        const priority = Number(priorityKey);
        return {
          label: value,
          value: priority,
          icon: <PriorityIndicator priority={priority} />,
        };
      }),
    },
    assignedUserId: {
      label: "Assigned User",
      key: "assignedUserId",
      icon: <CircleUser className="size-4" />,
      options: (organizationUsers ?? []).map((user) => ({
        label: user.user.name,
        value: user.userId,
        icon: (
          <Avatar className="size-5">
            <AvatarFallback>{user.user.name[0]}</AvatarFallback>
          </Avatar>
        ),
      })),
    },
  };

  // Deep include thread messages and assigned user when live-state supports it
  const threads = useLiveQuery(threadsQuery);

  return (
    <>
      <CardHeader>
        <CardTitle className="gap-4">
          Threads
          <Filter
            options={filterOptions}
            value={filter}
            onValueChange={setFilter}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto gap-0 items-center">
        {threads
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((thread) => (
            <ListItem key={thread.id} threadId={thread.id} />
          ))}
      </CardContent>
      {import.meta.env.MODE === "development" && (
        <CardFooter>
          <CreateThread />
        </CardFooter>
      )}
    </>
  );
}
