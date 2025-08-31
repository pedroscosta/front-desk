import { router as createRouter, routeFactory } from "@repo/live-state/server";
import { ulid } from "ulid";
import { z } from "zod";
import { schema } from "./schema";

const publicRoute = routeFactory();

const privateRoute = publicRoute.use(async ({ req, next }) => {
  if (!req.context.session && !req.context.discordBotKey) {
    throw new Error("Unauthorized");
  }

  return next(req);
});

export const router = createRouter({
  schema,
  routes: {
    organization: publicRoute
      .createBasicRoute(schema.organization)
      .withMutations(({ mutation }) => ({
        create: mutation(
          z.object({ name: z.string(), slug: z.string() })
        ).handler(async ({ req, db }) => {
          const organizationId = ulid().toLowerCase();

          await db.insert(schema.organization, {
            id: organizationId,
            name: req.input!.name,
            slug: req.input!.slug,
            createdAt: new Date(),
          });

          await db.insert(schema.organizationUser, {
            id: ulid().toLowerCase(),
            organizationId,
            userId: req.context.session.userId,
            enabled: true,
          });
        }),
      })),
    organizationUser: privateRoute.createBasicRoute(schema.organizationUser),
    thread: privateRoute.createBasicRoute(schema.thread),
    message: privateRoute.createBasicRoute(schema.message),
  },
});

export type Router = typeof router;
