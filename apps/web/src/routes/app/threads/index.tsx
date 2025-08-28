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
import { store } from "~/lib/live-state";

export const Route = createFileRoute("/app/threads/")({
  component: RouteComponent,
});

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function RouteComponent() {
  const currentOrg = useAtomValue(activeOrganizationAtom);

  // const orgObj = useLiveQuery(store.organization);
  const orgObj = useLiveQuery(store.organization[currentOrg!.id]);
  const threads = orgObj?.threads ?? [];

  return (
    <>
      {/* <Button
        onClick={() => {
          const threadId = ulid().toLowerCase();
          store.thread.insert({
            id: threadId,
            organizationId: currentOrg!.id,
            name: `Thread ${threads.length + 1}`,
            createdAt: new Date(),
          });

          const messagesCount = randomIntFromInterval(5, 10);

          for (let i = 0; i < messagesCount; i++) {
            store.message.insert({
              id: ulid().toLowerCase(),
              threadId,
              author: faker.person.firstName(),
              content: faker.lorem.paragraphs(randomIntFromInterval(1, 3)),
              createdAt: new Date(),
            });
          }
        }}
      >
        Add Thread
      </Button> */}
      <CardHeader>
        <CardTitle className="justify-self-center">Threads</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto gap-0 items-center">
        {threads
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
