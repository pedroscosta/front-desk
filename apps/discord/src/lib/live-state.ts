import { createClient } from "@live-state/sync/client";
import type { Router } from "api/router";
import { schema } from "api/schema";

export const { client, store } = createClient<Router>({
  url: "ws://localhost:3333/api/ls/ws",
  schema,
  credentials: async () => ({
    discordBotKey: process.env.DISCORD_BOT_KEY ?? "",
  }),
  storage: false,
});

client.subscribe();
