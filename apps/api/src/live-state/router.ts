import { router as createRouter, routeFactory } from "@repo/live-state/server";
import { auth } from "../lib/auth";
import { schema } from "./schema";

const publicRoute = routeFactory();

export const router = createRouter({
  schema,
  routes: {
    organization: publicRoute(schema.organization).use(
      async ({ req, next }) => {
        const session = await auth.api.getSession({
          headers: new Headers(req.headers),
        });

        console.log("session", session);
        return next(req);
      }
    ),
    organizationUser: publicRoute(schema.organizationUser),
  },
});

export type Router = typeof router;
