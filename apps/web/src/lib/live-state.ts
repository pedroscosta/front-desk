import { createClient } from "@live-state/sync/client";
import { createClient as createFetchClient } from "@live-state/sync/client/fetch";
import type { Router } from "api/router";
import { schema } from "api/schema";

export const { client, store } = createClient<Router>({
  url: "ws://localhost:3333/api/ls/ws",
  schema,
});

export const fetchClient = createFetchClient<Router>({
  url: "http://localhost:3333/api/ls",
  schema,
});
