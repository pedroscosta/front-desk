import { createClient } from "@repo/live-state/client";
import type { Router } from "api/router";
import { schema } from "api/schema";

export const { client, store } = createClient<Router>({
  url: "ws://localhost:3333/ws",
  schema,
});
