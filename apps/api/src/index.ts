import "./env";

import expressWs from "@wll8/express-ws";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import process from "node:process";
import { auth } from "./lib/auth";

const { app } = expressWs(express());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Allow specified origin or default to localhost:3000
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent with requests
};

// Apply CORS middleware
app.use(cors(corsOptions));

// const lsServer = server({
//   router,
//   storage: new InMemoryStorage(),
//   schema,
// });

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

// app.ws("/ws", webSocketAdapter(lsServer));

app.get("/", (req, res) => {
  console.log("Hello World!");
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server running on port ${process.env.PORT || 3333}`);
});
