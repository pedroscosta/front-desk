import { useForm } from "@tanstack/react-form";
import { Button } from "@workspace/ui/components/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Icon } from "@workspace/ui/components/logo";
import { Spinner } from "@workspace/ui/components/spinner";
import { useState } from "react";
import { z } from "zod";
import { authClient } from "~/lib/auth-client";

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const SignInForm = () => {
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInFormSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: "/app",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            setLoading(false);
          },
          onError: (ctx) => {
            setLoading(false);
            setError(ctx.error.message);
          },
        }
      );
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-xs items-center">
      <div className="size-fit p-4 border rounded-2xl bg-muted">
        <Icon className="size-12" />
      </div>
      <h1 className="text-xl font-medium">Sign In to FrontDesk</h1>
      {error ? <p className="text-destructive">{error}</p> : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-4 w-full"
      >
        <Field
          name="email"
          children={(field) => (
            <FormItem field={field}>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Field
          name="password"
          children={(field) => (
            <FormItem field={field}>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  type="password"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? <Spinner /> : null} Sign In
        </Button>
      </form>
    </div>
  );
};

const signUpFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    name: z.string().min(3),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignUpForm = () => {
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    validators: {
      onSubmit: signUpFormSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          name: value.name,
          password: value.password,
          callbackURL: "/app",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            setLoading(false);
          },
          onError: (ctx) => {
            setLoading(false);
            setError(ctx.error.message);
          },
        }
      );
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 w-xs items-center">
      <div className="size-fit p-4 border rounded-2xl bg-muted">
        <Icon className="size-12" />
      </div>
      <h1 className="text-xl font-medium">Sign Up to FrontDesk</h1>
      {error ? <p className="text-destructive">{error}</p> : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-4 w-full"
      >
        <Field
          name="name"
          children={(field) => (
            <FormItem field={field}>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Field
          name="email"
          children={(field) => (
            <FormItem field={field}>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Field
          name="password"
          children={(field) => (
            <FormItem field={field}>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  type="password"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Field
          name="confirmPassword"
          children={(field) => (
            <FormItem field={field}>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  type="password"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? <Spinner /> : null} Sign Up
        </Button>
      </form>
    </div>
  );
};
