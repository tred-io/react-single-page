import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export function getClientTables(clientName: string) {
  const storeSettings = pgTable(`${clientName}_store_settings`, {
    id: integer("id").primaryKey(),
    storeName: varchar("store_name", { length: 255 }),
    tagline: text("tagline"),
    address: text("address"),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    mondayHours: varchar("monday_hours", { length: 100 }),
    tuesdayHours: varchar("tuesday_hours", { length: 100 }),
    wednesdayHours: varchar("wednesday_hours", { length: 100 }),
    thursdayHours: varchar("thursday_hours", { length: 100 }),
    fridayHours: varchar("friday_hours", { length: 100 }),
    saturdayHours: varchar("saturday_hours", { length: 100 }),
    sundayHours: varchar("sunday_hours", { length: 100 }),
    aboutTitle: varchar("about_title", { length: 255 }),
    aboutDescription: text("about_description"),
    aboutStory: text("about_story"),
    foundedYear: varchar("founded_year", { length: 10 }),
    logoUrl: text("logo_url"),
    faviconUrl: text("favicon_url"),
    heroImageUrl: text("hero_image_url"),
    aboutImageUrl: text("about_image_url"),
    primaryColor: varchar("primary_color", { length: 10 }),
    secondaryColor: varchar("secondary_color", { length: 10 }),
    accentColor: varchar("accent_color", { length: 10 }),
    fontFamily: varchar("font_family", { length: 100 }),
    facebookUrl: text("facebook_url"),
    instagramUrl: text("instagram_url"),
    xUrl: text("x_url"),
    googleUrl: text("google_url"),
    yelpUrl: text("yelp_url"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    seoKeywords: text("seo_keywords"),
  });

  const productCategories = pgTable(`${clientName}_product_categories`, {
    id: integer("id").primaryKey(),
    title: varchar("title", { length: 255 }),
    description: text("description"),
    imageUrl: text("image_url"),
    iconName: varchar("icon_name", { length: 100 }),
    items: jsonb("items"),
    displayOrder: integer("display_order"),
  });

  const specialServices = pgTable(`${clientName}_special_services`, {
    id: integer("id").primaryKey(),
    title: varchar("title", { length: 255 }),
    description: text("description"),
    iconName: varchar("icon_name", { length: 100 }),
    displayOrder: integer("display_order"),
  });

  const featuredBrands = pgTable(`${clientName}_featured_brands`, {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: 255 }),
    logoUrl: text("logo_url"),
    displayOrder: integer("display_order"),
  });

  return {
    storeSettings,
    productCategories,
    specialServices,
    featuredBrands,
  };
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
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  facebookUrl?: string;
  instagramUrl?: string;
  xUrl?: string;
  googleUrl?: string;
  yelpUrl?: string;
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