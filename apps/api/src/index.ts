import { toNodeHandler } from "better-auth/node";
import process from "node:process";
import express from "ultimate-express";
import { auth } from "./lib/auth";

require("dotenv").config({ path: [".env.local", ".env"] });

const app = express();

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server running on port ${process.env.PORT || 3333}`);
});
