import { boolean, doublePrecision, integer, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const entityTypeEnum = pgEnum("entity_type", ["post", "answer"]);

export const users = pgTable("users", {
    ocid: varchar({ length: 255 }).notNull().primaryKey(),
    wallet: varchar({ length: 64 }).unique().notNull(),
    avatar: varchar({ length: 255 }),
    balance: doublePrecision().notNull().default(0),
    verified: boolean().default(false),
    registeredAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
    name: varchar({ length: 255 }).notNull().primaryKey(),
    description: varchar({ length: 1000 }),
});

export const posts = pgTable("posts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar()
        .notNull()
        .references(() => users.ocid),
    slug: varchar({ length: 255 }).notNull(),
    title: varchar({ length: 128 }).notNull(),
    content: varchar({ length: 15000 }).notNull(),
    category: varchar()
        .notNull()
        .references(() => categories.name),
    upvotes: integer().notNull().default(0),
    downvotes: integer().notNull().default(0),
    bounty: doublePrecision().notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const answers = pgTable("answers", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar()
        .notNull()
        .references(() => users.ocid),
    postId: integer()
        .notNull()
        .references(() => posts.id),
    content: varchar({ length: 10000 }).notNull(),
    upvotes: integer().notNull().default(0),
    downvotes: integer().notNull().default(0),
    isAccepted: boolean().notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const votes = pgTable("votes", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar()
        .notNull()
        .references(() => users.ocid),
    entityId: integer().notNull(),
    postId: integer().notNull(),
    isUpvote: boolean().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const verificationWallets = pgTable("verification_wallets", {
    address: varchar({ length: 64 }).notNull().primaryKey(),
    privateKey: varchar().notNull(),
    userId: varchar()
        .notNull()
        .references(() => users.ocid),
    verified: boolean().notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const stats = pgTable("stats", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    distributedUpvotePrize: doublePrecision().notNull().default(0),
    distributedDownvoteCutoff: doublePrecision().notNull().default(0),
});
