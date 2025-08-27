import { cn } from "@workspace/ui/lib/utils";

export function MessageCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "text-card-foreground flex flex-col rounded-md border",
        className
      )}
      {...props}
    />
  );
}
