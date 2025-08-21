import { getRouteApi } from "@tanstack/react-router";

export const useOrganizationSwitcher = () => {
  const route = getRouteApi("/app");
  const { organizationUser } = route.useLoaderData();

  return { organizationUser };
};
