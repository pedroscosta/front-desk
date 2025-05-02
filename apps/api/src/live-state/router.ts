import { router as createRouter, routeFactory } from "@repo/live-state/server";
import { issue } from "./schema";

const publicRoute = routeFactory();

export const router = createRouter({
  routes: {
    issues: publicRoute(issue),
  },
});

export type Router = typeof router;
