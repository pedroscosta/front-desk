import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchClient } from "~/lib/live-state";

export const Route = createFileRoute("/app/_workspace")({
  beforeLoad: async ({ context }) => {
    const user = context.user;

    const orgUsers = await fetchClient.organizationUser
      .get({
        include: {
          organization: true,
        },
        where: {
          userId: user.id,
        },
      })
      .catch(() => null);

    if (!orgUsers || Object.keys(orgUsers).length === 0) {
      throw redirect({
        to: "/onboarding",
      });
    }

    return {
      organizationUsers: orgUsers,
    };
  },
});
