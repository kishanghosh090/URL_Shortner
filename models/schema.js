import { text, pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),

  firstName: varchar("first_name", { length: 55 }).notNull(),
  lastName: varchar("last_name", { length: 55 }),

  email: varchar({ varchar: 255 }),

  password: text().notNull(),
  salt: text().notNull(),

  cretatedAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const urlsTable = pgTable("urls", {
  id: uuid().primaryKey().defaultRandom(),
  shortCode: varchar("code", { length: 155 }).notNull().unique(),
  targetURL: text("target_url").notNull(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  cretatedAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
