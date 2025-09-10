import { type Generated, Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";

interface WaitlistTable {
  id: Generated<number>;
  created_at: Generated<Date>;
  email: string;
}

const dialect = new PostgresJSDialect({
  postgres: postgres({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    max: 10,
  }),
});

export const db = new Kysely<{ waitlist: WaitlistTable }>({
  dialect,
});
