import { cn } from "@workspace/ui/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

function Card({ className, ...props }: React.ComponentProps<"div">) {
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

const headerVariants = cva(
  "@container/card-header grid auto-cols-min grid-cols-[auto] items-center gap-1.5 has-data-[slot=card-action]:grid-cols-[auto_1fr_auto] border-b",
  {
    variants: {
      variant: {
        default: "bg-muted/25",
        transparent: "bg-inherit",
      },
      size: {
        default: "h-10 p-2.5",
        sm: "h-8 p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function CardHeader({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof headerVariants>) {
  return (
    <div
      data-slot="card-header"
      className={cn(headerVariants({ variant, size, className }))}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none flex gap-2 items-center", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

const actionVariants = cva("flex gap-2", {
  variants: {
    side: {
      left: "col-start-1 justify-self-start",
      right: "col-start-3 justify-self-end",
    },
  },
});

function CardActions({
  className,
  side,
  ...props
}: React.ComponentProps<"div"> &
  Required<VariantProps<typeof actionVariants>>) {
  return (
    <div
      data-slot="card-action"
      className={cn(actionVariants({ side, className }))}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("p-4", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardActions as CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
