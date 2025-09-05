import { useLiveQuery } from "@live-state/sync/client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { InputBox } from "@workspace/ui/components/blocks/input-box";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useAutoScroll } from "@workspace/ui/hooks/use-auto-scroll";
import { cn, formatRelativeTime } from "@workspace/ui/lib/utils";
import { ulid } from "ulid";
import { mutate, query } from "~/lib/live-state";

export const Route = createFileRoute("/app/threads/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const thread = useLiveQuery(
    query.thread.where({ id }).include({ organization: true, messages: true })
  )?.[0];

  const { scrollRef, disableAutoScroll } = useAutoScroll({
    smooth: false,
    content: thread?.messages,
    offset: 264,
  });

  return (
    <>
      <CardHeader>
        <CardTitle className="justify-self-center">{thread?.name}</CardTitle>
      </CardHeader>
      <div className="flex flex-col p-4 gap-4 flex-1 w-full max-w-5xl mx-auto overflow-hidden">
        <div
          className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto"
          ref={scrollRef}
          onScroll={disableAutoScroll}
          onTouchMove={disableAutoScroll}
        >
          {thread?.messages
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((message) => (
              <Card
                key={message.id}
                className={cn(
                  "relative before:w-[1px] before:h-4 before:left-4 before:absolute before:-top-4 not-first:before:bg-border",
                  !message.origin && "border-[#2662D9]/20"
                )}
              >
                {/* TODO: update the way it's checking if it's an message from the current user */}
                <CardHeader
                  size="sm"
                  className={cn(
                    !message.origin && "bg-[#2662D9]/15 border-[#2662D9]/20"
                  )}
                >
                  <CardTitle>
                    <Avatar className="size-5">
                      <AvatarFallback>{message.author[0]}</AvatarFallback>
                    </Avatar>
                    <p>{message.author}</p>
                    <p className="text-muted-foreground">
                      {formatRelativeTime(message.createdAt as Date)}
                    </p>
                    {message.origin === "discord" && (
                      <>
                        <span className="bg-muted-foreground size-0.75 rounded-full" />
                        <p className="text-muted-foreground">
                          Imported from Discord
                        </p>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>{message.content}</CardContent>
              </Card>
            ))}
        </div>
        <InputBox
          className="bottom-2.5 w-full shadow-lg bg-[#1B1B1E]"
          onSubmit={(value) => {
            mutate.message.insert({
              id: ulid().toLowerCase(),
              author: "Pedro",
              content: JSON.stringify(value),
              threadId: id,
              createdAt: new Date(),
            });
          }}
        />
      </div>
    </>
  );
}
