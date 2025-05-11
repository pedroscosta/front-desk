import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "~/components/auth";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <SignInForm />
    </div>
  );
}
