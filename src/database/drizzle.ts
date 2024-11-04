import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

/**
 * Database Connection Setup
 */

// Initialize the Neon database connection
export const sql = neon(process.env.DATABASE_URL!);

// Create a Drizzle ORM instance
export const db = drizzle(sql);
