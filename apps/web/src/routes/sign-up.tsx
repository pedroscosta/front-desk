import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "~/components/auth";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <SignUpForm />
    </div>
  );
}
