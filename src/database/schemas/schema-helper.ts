// // 📌 database.schema.ts
// import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// // 🕒 Reusable timestamps — Define once, use everywhere!
// export const timestamps = {
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at'),
//   deletedAt: timestamp('deleted_at'),
// };

// export const users = pgTable('users', {
//   id: uuid("id").primaryKey().defaultRandom(),
//   name: text('name').notNull(),
//   email: text('email').unique().notNull(),
//   ...timestamps, // Reuse timestamps across tables ⏳
// });

// export const posts = pgTable('posts', {
//   id: uuid("id").primaryKey().defaultRandom(),
//   title: text('title').notNull(),
//   content: text('content'),
//   authorId: uuid('author_id').references(() => users.id),
//   ...timestamps, // No need to redefine timestamps for each table! 🔥
// });