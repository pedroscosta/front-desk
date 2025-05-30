import { router as createRouter, routeFactory } from "@repo/live-state/server";
import { schema } from "./schema";

const publicRoute = routeFactory();

export const router = createRouter({
  schema,
  routes: {
    organization: publicRoute(schema.organization),
    organizationUser: publicRoute(schema.organizationUser),
  },
});

export type Router = typeof router;
