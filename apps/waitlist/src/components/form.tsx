import { useForm } from "@tanstack/react-form";
import { Button } from "@workspace/ui/components/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import { cn } from "@workspace/ui/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";
import { applySchema, applyToWaitlist } from "~/lib/sever-funcs";
import { Route } from "../routes/index";

export const WaitlistForm = () => {
  const { count, gitHubStars } = Route.useLoaderData();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: applySchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      await applyToWaitlist({ data: value })
        .then(() => {
          setSuccess(true);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <div className="flex flex-col gap-12 w-full max-w-lg items-center p-6">
      <Button className="px-6 py-3" asChild variant="secondary">
        <a href="https://github.com/pedroscosta/live-state">
          Star on GitHub
          <Star className="ml-2 h-4 w-4" />
          {gitHubStars}
        </a>
      </Button>
      <h1 className="text-6xl font-normal text-center">
        Support your customers wherever they are
      </h1>
      <span className="text-xl text-[#BEBEBE] text-center">
        The best way to support your customers is to be there when they need
        you.{" "}
        <span className="text-primary">
          FrontDesk is the open-source customer support platform that helps you
          do just that.
        </span>
      </span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col w-full max-w-md p-6"
      >
        <Field
          name="email"
          children={(field) => (
            <FormItem field={field}>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="your@email.com"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="bg-muted dark:bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={cn(
            "mt-6 w-full",
            success && "bg-emerald-700 hover:bg-emerald-600"
          )}
          disabled={loading}
        >
          {loading ? <Spinner /> : null}
          {success ? "Thank you!" : "Join waitlist"}
        </Button>
        <div className="text-sm text-muted-foreground w-full flex items-center gap-2 justify-center mt-1">
          <div className="flex item-center justify-center relative">
            <div className="size-2 rounded-full bg-emerald-700 animate-ping" />
            <div className="size-2 rounded-full bg-emerald-700 absolute" />
          </div>
          {count} people have joined
        </div>
      </form>
    </div>
  );
};
