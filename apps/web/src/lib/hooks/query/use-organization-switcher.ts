import { getRouteApi } from "@tanstack/react-router";

export const useOrganizationSwitcher = () => {
  const route = getRouteApi("/app/_workspace");
  const { organizationUsers } = route.useRouteContext();

  return { organizationUsers };
};
