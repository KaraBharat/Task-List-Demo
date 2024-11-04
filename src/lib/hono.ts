import { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

/**
 * Hono client configuration
 * This client is used for making API requests to the application's backend.
 */

/**
 * Create a typed Hono client instance
 * @type {ReturnType<typeof hc<AppType>>}
 */
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

// Ensure the environment variable is set
if (!process.env.NEXT_PUBLIC_APP_URL) {
  console.warn("API URL is not set. API requests may fail.");
}
