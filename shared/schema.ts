import { z } from "zod";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  serial,
  boolean,
  pgSchema,
} from "drizzle-orm/pg-core";

// Multi-tenant schema support
export function createClientSchema(clientName: string) {
  return pgSchema(clientName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase());
}

// Get schema-aware tables for a specific client
export function getClientTables(clientName: string) {
  const schema = createClientSchema(clientName);
  
  return {
    storeSettings: schema.table("store_settings", {
      id: serial("id").primaryKey(),
      storeName: varchar("store_name", { length: 255 }).notNull(),
      tagline: text("tagline").notNull(),
      address: text("address").notNull(),
      phone: varchar("phone", { length: 50 }).notNull(),
      email: varchar("email", { length: 255 }),
      mondayHours: varchar("monday_hours", { length: 100 }).notNull(),
      tuesdayHours: varchar("tuesday_hours", { length: 100 }).notNull(),
      wednesdayHours: varchar("wednesday_hours", { length: 100 }).notNull(),
      thursdayHours: varchar("thursday_hours", { length: 100 }).notNull(),
      fridayHours: varchar("friday_hours", { length: 100 }).notNull(),
      saturdayHours: varchar("saturday_hours", { length: 100 }).notNull(),
      sundayHours: varchar("sunday_hours", { length: 100 }).notNull(),
      aboutTitle: varchar("about_title", { length: 255 }).notNull(),
      aboutDescription: text("about_description").notNull(),
      aboutStory: text("about_story").notNull(),
      foundedYear: varchar("founded_year", { length: 10 }).notNull(),
      logoUrl: text("logo_url"),
      faviconUrl: text("favicon_url"),
      heroImageUrl: text("hero_image_url"),
      aboutImageUrl: text("about_image_url"),
      primaryColor: varchar("primary_color", { length: 20 }).notNull(),
      secondaryColor: varchar("secondary_color", { length: 20 }).notNull(),
      accentColor: varchar("accent_color", { length: 20 }).notNull(),
      fontFamily: varchar("font_family", { length: 100 }).notNull(),
      facebookUrl: text("facebook_url"),
      instagramUrl: text("instagram_url"),
      xUrl: text("x_url"),
      googleUrl: text("google_url"),
      yelpUrl: text("yelp_url"),
      seoTitle: varchar("seo_title", { length: 255 }).notNull(),
      seoDescription: text("seo_description").notNull(),
      seoKeywords: text("seo_keywords").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
    }),
    
    productCategories: schema.table("product_categories", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description").notNull(),
      imageUrl: text("image_url").notNull(),
      featured: boolean("featured").notNull().default(false),
      sortOrder: integer("sort_order").notNull().default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
    }),
    
    specialServices: schema.table("special_services", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description").notNull(),
      icon: varchar("icon", { length: 100 }).notNull(),
      featured: boolean("featured").notNull().default(false),
      sortOrder: integer("sort_order").notNull().default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
    }),
    
    featuredBrands: schema.table("featured_brands", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description").notNull(),
      logoUrl: text("logo_url").notNull(),
      websiteUrl: text("website_url").notNull(),
      featured: boolean("featured").notNull().default(false),
      sortOrder: integer("sort_order").notNull().default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
    }),
  };
}

// Simple TypeScript types for business website template
export interface SimpleUser {
  id: number;
  username: string;
  password: string;
}

export interface StoreSettings {
  id: number;
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  email?: string;
  mondayHours: string;
  tuesdayHours: string;
  wednesdayHours: string;
  thursdayHours: string;
  fridayHours: string;
  saturdayHours: string;
  sundayHours: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutStory: string;
  foundedYear: string;
  logoUrl?: string;
  faviconUrl?: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
  // Theme & Branding
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  // Social URLs
  facebookUrl?: string;
  instagramUrl?: string;
  xUrl?: string;
  googleUrl?: string;
  yelpUrl?: string;
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  sortOrder: number;
}

export interface SpecialService {
  id: number;
  name: string;
  description: string;
  icon: string;
  featured: boolean;
  sortOrder: number;
}

export interface FeaturedBrand {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  featured: boolean;
  sortOrder: number;
}

export interface CustomPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  style: 'modern' | 'rustic' | 'professional' | 'elegant' | 'bold' | 'minimal';
  mood: string;
  reasoning: string;
}

export interface ThemeGenerationResult {
  businessAnalysis: string;
  themes: ThemeOption[];
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertStoreSettingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().optional(),
  mondayHours: z.string().min(1, "Monday hours are required"),
  tuesdayHours: z.string().min(1, "Tuesday hours are required"),
  wednesdayHours: z.string().min(1, "Wednesday hours are required"),
  thursdayHours: z.string().min(1, "Thursday hours are required"),
  fridayHours: z.string().min(1, "Friday hours are required"),
  saturdayHours: z.string().min(1, "Saturday hours are required"),
  sundayHours: z.string().min(1, "Sunday hours are required"),
  aboutTitle: z.string().min(1, "About title is required"),
  aboutDescription: z.string().min(1, "About description is required"),
  aboutStory: z.string().min(1, "About story is required"),
  foundedYear: z.string().min(1, "Founded year is required"),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  aboutImageUrl: z.string().optional(),
  // Theme & Branding
  primaryColor: z.string().min(1, "Primary color is required"),
  secondaryColor: z.string().min(1, "Secondary color is required"),
  accentColor: z.string().min(1, "Accent color is required"),
  fontFamily: z.string().min(1, "Font family is required"),
  // Social URLs
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  xUrl: z.string().optional(),
  googleUrl: z.string().optional(),
  yelpUrl: z.string().optional(),
  // SEO
  seoTitle: z.string().min(1, "SEO title is required"),
  seoDescription: z.string().min(1, "SEO description is required"),
  seoKeywords: z.string().min(1, "SEO keywords are required"),
});

export const insertProductCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

export const insertSpecialServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  featured: z.boolean().default(false),
  sortOrder: z.number().min(0).default(0),
});

export const insertFeaturedBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  description: z.string().min(1, "Description is required"),
  logoUrl: z.string().min(1, "Logo URL is required"),
  websiteUrl: z.string().min(1, "Website URL is required"),
  featured: z.boolean().default(false),
  sortOrder: z.number().min(0).default(0),
});

export const insertCustomPageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  isPublished: z.boolean().default(false),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStoreSettings = z.infer<typeof insertStoreSettingsSchema>;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type InsertSpecialService = z.infer<typeof insertSpecialServiceSchema>;
export type InsertFeaturedBrand = z.infer<typeof insertFeaturedBrandSchema>;
export type InsertCustomPage = z.infer<typeof insertCustomPageSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

// Database tables
export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: varchar("store_name", { length: 255 }).notNull(),
  tagline: text("tagline").notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  mondayHours: varchar("monday_hours", { length: 100 }).notNull(),
  tuesdayHours: varchar("tuesday_hours", { length: 100 }).notNull(),
  wednesdayHours: varchar("wednesday_hours", { length: 100 }).notNull(),
  thursdayHours: varchar("thursday_hours", { length: 100 }).notNull(),
  fridayHours: varchar("friday_hours", { length: 100 }).notNull(),
  saturdayHours: varchar("saturday_hours", { length: 100 }).notNull(),
  sundayHours: varchar("sunday_hours", { length: 100 }).notNull(),
  aboutTitle: varchar("about_title", { length: 255 }).notNull(),
  aboutDescription: text("about_description").notNull(),
  aboutStory: text("about_story").notNull(),
  foundedYear: varchar("founded_year", { length: 10 }).notNull(),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  heroImageUrl: text("hero_image_url"),
  aboutImageUrl: text("about_image_url"),
  primaryColor: varchar("primary_color", { length: 20 }).notNull(),
  secondaryColor: varchar("secondary_color", { length: 20 }).notNull(),
  accentColor: varchar("accent_color", { length: 20 }).notNull(),
  fontFamily: varchar("font_family", { length: 100 }).notNull(),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  xUrl: text("x_url"),
  googleUrl: text("google_url"),
  yelpUrl: text("yelp_url"),
  seoTitle: varchar("seo_title", { length: 255 }).notNull(),
  seoDescription: text("seo_description").notNull(),
  seoKeywords: text("seo_keywords").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const specialServices = pgTable("special_services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 100 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const featuredBrands = pgTable("featured_brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url").notNull(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type DatabaseUser = typeof users.$inferSelect;