/**
 * Database Schema Configuration
 * Combines all individual schema definitions into a single export
 * for database initialization and type definitions
 */

// Internal Schema Imports
import * as taskSchema from "./schemas/task.schema";
import * as orderSchema from "./schemas/order.schema";

/**
 * Combined schema object containing all database schemas

 * Used for database initialization and type definitions
 */
export const schema = {
  ...taskSchema,
  ...orderSchema,
};
