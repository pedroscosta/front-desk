import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { WorkerDb } from "./db";

export const applySchema = z.object({
  email: z.email(),
});

export const applyToWaitlist = createServerFn()
  .validator(applySchema)
  .handler(async ({ data: { email } }) => {
    const db = await WorkerDb.getInstance();

    await db.insertInto("waitlist").values({ email }).execute();

    return { success: true };
  });

export const waitlistCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = await WorkerDb.getInstance();

    const count = await db
      .selectFrom("waitlist")
      .select(({ fn }) => [fn.count("id").as("count")])
      .executeTakeFirst();

    return { count: count?.count ?? 0 };
  }
);
