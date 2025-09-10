import { type Generated, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

interface WaitlistTable {
  id: Generated<number>;
  created_at: Generated<Date>;
  email: string;
}

const dialect = new PostgresDialect({
  pool: new Pool({
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
