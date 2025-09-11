import { PostHogConfig } from "posthog-js";
import { PostHogProvider as PostHogProviderComponent } from "posthog-js/react";

const posthogOptions: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
};

export const PosthogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (import.meta.env.DISABLE_POSTHOG) return <>{children}</>;

  return (
    <PostHogProviderComponent
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={posthogOptions}
    >
      {children}
    </PostHogProviderComponent>
  );
};
