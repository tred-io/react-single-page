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
  mondayFridayHours: string;
  saturdayHours: string;
  sundayHours: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutStory: string;
  foundedYear: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface ProductCategory {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  items: string[];
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
  mondayFridayHours: z.string().min(1, "Monday-Friday hours are required"),
  saturdayHours: z.string().min(1, "Saturday hours are required"),
  sundayHours: z.string().min(1, "Sunday hours are required"),
  aboutTitle: z.string().min(1, "About title is required"),
  aboutDescription: z.string().min(1, "About description is required"),
  aboutStory: z.string().min(1, "About story is required"),
  foundedYear: z.string().min(1, "Founded year is required"),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});

export const insertProductCategorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  items: z.array(z.string()).min(1, "At least one item is required"),
  displayOrder: z.number().default(0),
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
export type InsertCustomPage = z.infer<typeof insertCustomPageSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;