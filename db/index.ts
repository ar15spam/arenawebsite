import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "@/db/schema"; 

config({ path: ".env.local" }); // or .env.local

const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle({ client: sql, schema: schema });