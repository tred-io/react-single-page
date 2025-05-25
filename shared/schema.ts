import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").notNull(),
  tagline: text("tagline").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  mondayFridayHours: text("monday_friday_hours").notNull(),
  saturdayHours: text("saturday_hours").notNull(),
  sundayHours: text("sunday_hours").notNull(),
  aboutTitle: text("about_title").notNull(),
  aboutDescription: text("about_description").notNull(),
  aboutStory: text("about_story").notNull(),
  foundedYear: text("founded_year").notNull(),
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  items: text("items").array().notNull(),
  displayOrder: integer("display_order").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStoreSettingsSchema = createInsertSchema(storeSettings).pick({
  storeName: true,
  tagline: true,
  address: true,
  phone: true,
  email: true,
  mondayFridayHours: true,
  saturdayHours: true,
  sundayHours: true,
  aboutTitle: true,
  aboutDescription: true,
  aboutStory: true,
  foundedYear: true,
}).extend({
  email: z.string().optional(),
});

export const insertProductCategorySchema = createInsertSchema(productCategories).pick({
  title: true,
  description: true,
  imageUrl: true,
  items: true,
  displayOrder: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertStoreSettings = z.infer<typeof insertStoreSettingsSchema>;
export type StoreSettings = typeof storeSettings.$inferSelect;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type ProductCategory = typeof productCategories.$inferSelect;
