import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  authProvider: text("auth_provider").notNull(), // 'google', 'apple', 'email'
  firebaseUid: text("firebase_uid"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  meditationCount: integer("meditation_count").default(0).notNull(),
  preferences: jsonb("preferences").default({}).notNull(),
});

export const meditations = pgTable("meditations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'manifestation', 'relaxation', 'sleep', 'visualization', 'affirmations', 'mindfulness'
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  script: text("script").notNull(),
  audioUrl: text("audio_url"), // base64 or file path
  settings: jsonb("settings").notNull(), // voice, background, visual preferences
  customization: jsonb("customization"), // user-specific goals, focus areas
  createdAt: timestamp("created_at").defaultNow().notNull(),
  playCount: integer("play_count").default(0).notNull(),
  isShared: boolean("is_shared").default(false).notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
});

export const communityMeditations = pgTable("community_meditations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalMeditationId: varchar("original_meditation_id").references(() => meditations.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  playCount: integer("play_count").default(0).notNull(),
  rating: integer("rating").default(0).notNull(), // 1-5 stars
  ratingCount: integer("rating_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meditationRatings = pgTable("meditation_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  communityMeditationId: varchar("community_meditation_id").references(() => communityMeditations.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  meditations: many(meditations),
  ratings: many(meditationRatings),
}));

export const meditationRelations = relations(meditations, ({ one, many }) => ({
  user: one(users, {
    fields: [meditations.userId],
    references: [users.id],
  }),
  communityMeditation: many(communityMeditations),
}));

export const communityMeditationRelations = relations(communityMeditations, ({ one, many }) => ({
  originalMeditation: one(meditations, {
    fields: [communityMeditations.originalMeditationId],
    references: [meditations.id],
  }),
  ratings: many(meditationRatings),
}));

export const meditationRatingRelations = relations(meditationRatings, ({ one }) => ({
  user: one(users, {
    fields: [meditationRatings.userId],
    references: [users.id],
  }),
  communityMeditation: one(communityMeditations, {
    fields: [meditationRatings.communityMeditationId],
    references: [communityMeditations.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  meditationCount: true,
});

export const insertMeditationSchema = createInsertSchema(meditations).omit({
  id: true,
  createdAt: true,
  playCount: true,
});

export const insertCommunityMeditationSchema = createInsertSchema(communityMeditations).omit({
  id: true,
  createdAt: true,
  playCount: true,
  rating: true,
  ratingCount: true,
});

export const insertMeditationRatingSchema = createInsertSchema(meditationRatings).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Meditation = typeof meditations.$inferSelect;
export type InsertMeditation = z.infer<typeof insertMeditationSchema>;
export type CommunityMeditation = typeof communityMeditations.$inferSelect;
export type InsertCommunityMeditation = z.infer<typeof insertCommunityMeditationSchema>;
export type MeditationRating = typeof meditationRatings.$inferSelect;
export type InsertMeditationRating = z.infer<typeof insertMeditationRatingSchema>;
