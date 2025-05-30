import { z } from "zod";

// Simple TypeScript types for business website template
export interface User {
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
  title: string;
  description: string;
  imageUrl: string;
  iconName: string;
  items: string[];
  displayOrder: number;
}

export interface SpecialService {
  id: number;
  title: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface FeaturedBrand {
  id: number;
  name: string;
  logoUrl: string;
  displayOrder: number;
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
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  iconName: z.string().min(1, "Icon name is required"),
  items: z.array(z.string()).min(1, "At least one item is required"),
  displayOrder: z.number().default(0),
});

export const insertSpecialServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "Icon name is required"),
  displayOrder: z.number().min(0).default(0),
});

export const insertFeaturedBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().min(1, "Logo URL is required"),
  displayOrder: z.number().min(0).default(0),
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