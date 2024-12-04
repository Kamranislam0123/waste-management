import {
  integer,
  varchar,
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const Reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id),
  location: text("location").notNull(),
  wasteType: varchar("waste_type").notNull(),
  amount: varchar("amount", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  verificationResult: jsonb("verification_result").notNull(),
  status: varchar("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  collectorID: integer("collector_id").references(() => Users.id),
});

export const Rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id),
  points: integer("points").notNull().default(0),
  description:text("description").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  collectionInfo: jsonb("collection_info").notNull(),
  isAvilable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  verified: boolean("verified").notNull().default(false),
});

export const CollectedWaste = pgTable("collected_waste", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id),
  reportId: integer("report_id").references(() => Reports.id).notNull(),
  collectorId: integer("collector_id").references(() => Users.id).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  collectionDate: timestamp("collection_date").notNull(),
  status: varchar("status", { length: 255 }).notNull().default("Collected"),
});


export const Notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id),
  message: varchar("message", { length: 255 }).notNull(),
  isRead : boolean("is_read").notNull().default(false),
  type: varchar("type", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id),
  type: varchar("type", { length: 255 }).notNull(),
  amount: varchar("amount", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});