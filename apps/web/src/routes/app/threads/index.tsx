import { faker } from "@faker-js/faker";
import { useLiveQuery } from "@live-state/sync/client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue } from "jotai/react";
import { ulid } from "ulid";
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
  const messages = useLiveQuery(store.message);

  console.log(messages);

  return (
    <div>
      <Button
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
      </Button>
      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>
            <Link to="/app/threads/$id" params={{ id: thread.id }}>
              {thread.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
