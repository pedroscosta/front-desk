import {
  InMemoryStorage,
  server,
  webSocketAdapter,
} from "@repo/live-state/server";
import expressWs from "@wll8/express-ws";
import { toNodeHandler } from "better-auth/node";
import express from "express";
import process from "node:process";
import { auth } from "./lib/auth";
import { router } from "./live-state/router";
import { schema } from "./live-state/schema";

require("dotenv").config({ path: [".env.local", ".env"] });

const { app } = expressWs(express());

const lsServer = server({
  router,
  storage: new InMemoryStorage(),
  schema,
});

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.ws("/ws", webSocketAdapter(lsServer));

app.get("/", (req, res) => {
  console.log("Hello World!");
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server running on port ${process.env.PORT || 3333}`);
});
