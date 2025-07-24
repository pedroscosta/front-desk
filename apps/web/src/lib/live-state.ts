import { createClient } from "@live-state/sync/client";
import { createClient as createFetchClient } from "@live-state/sync/client/fetch";
import { getHeaders } from "@tanstack/react-start/server";
import type { Router } from "api/router";
import { schema } from "api/schema";
import { authClient } from "./auth-client";

export const { client, store } = createClient<Router>({
  url: "ws://localhost:3333/api/ls/ws",
  schema,
  credentials: async () => ({
    token: (await authClient.oneTimeToken.generate()).data?.token ?? "",
  }),
});

export const fetchClient = createFetchClient<Router>({
  url: "http://localhost:3333/api/ls",
  schema,
  credentials: () =>
    typeof window === "undefined"
      ? (getHeaders() as Record<string, string>)
      : {},
});
