import { betterAuth } from "better-auth";
import { Pool } from "pg";
import "../env";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN ?? "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
});

export const getSession = async (req: { headers: Record<string, any> }) => {
  const headers = new Headers();

  Object.entries(req.headers).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return await auth.api.getSession({ headers }).catch(() => null);
};
