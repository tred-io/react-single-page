import {
  type StoreSettings,
  type ProductCategory,
  type SpecialService,
  type FeaturedBrand,
  type InsertStoreSettings,
  type InsertProductCategory,
  type InsertSpecialService,
  type InsertFeaturedBrand,
} from "@shared/schema";

interface User {
  id: number;
  username: string;
  password: string;
}

export type InsertUser = Omit<User, 'id'>;

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getStoreSettings(): Promise<StoreSettings | undefined>;
  updateStoreSettings(settings: InsertStoreSettings): Promise<StoreSettings>;
  getProductCategories(): Promise<ProductCategory[]>;
  updateProductCategory(id: number, category: InsertProductCategory): Promise<ProductCategory>;
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;
  deleteProductCategory(id: number): Promise<boolean>;
  getSpecialServices(): Promise<SpecialService[]>;
  updateSpecialService(id: number, service: InsertSpecialService): Promise<SpecialService>;
  createSpecialService(service: InsertSpecialService): Promise<SpecialService>;
  deleteSpecialService(id: number): Promise<boolean>;
  getFeaturedBrands(): Promise<FeaturedBrand[]>;
  updateFeaturedBrand(id: number, brand: InsertFeaturedBrand): Promise<FeaturedBrand>;
  createFeaturedBrand(brand: InsertFeaturedBrand): Promise<FeaturedBrand>;
  deleteFeaturedBrand(id: number): Promise<boolean>;
}

class SimpleMap<T> {
  private items = new Map<number, T>();
  private nextId = 1;

  create(item: Omit<T, 'id'>): T {
    const id = this.nextId++;
    const newItem = { ...item, id } as T;
    this.items.set(id, newItem);
    return newItem;
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  get(id: number): T | undefined {
    return this.items.get(id);
  }

  update(id: number, updates: Partial<T>): T | undefined {
    const existing = this.items.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.items.set(id, updated);
    return updated;
  }

  delete(id: number): boolean {
    return this.items.delete(id);
  }
}

export class MemStorage implements IStorage {
  private storeSettings: StoreSettings = {
    id: 1,
    storeName: "Brown Feed Store",
    tagline: "Your Agricultural Supply Partner Since 1967",
    address: "123 Main Street, Lampasas, TX 76550",
    phone: "(512) 556-3467",
    email: "info@brownfeedstore.com",
    mondayHours: "8:00 AM - 6:00 PM",
    tuesdayHours: "8:00 AM - 6:00 PM",
    wednesdayHours: "8:00 AM - 6:00 PM",
    thursdayHours: "8:00 AM - 6:00 PM",
    fridayHours: "8:00 AM - 6:00 PM",
    saturdayHours: "8:00 AM - 5:00 PM",
    sundayHours: "Closed",
    facebookUrl: "https://facebook.com/brownfeedstore",
    instagramUrl: "https://instagram.com/brownfeedstore",
    twitterUrl: "https://twitter.com/brownfeedstore",
    websiteUrl: "https://brownfeedstore.com",
    heroTitle: "Quality Feed & Farm Supplies",
    heroSubtitle: "Serving Central Texas farmers and ranchers for over 50 years",
    aboutTitle: "About Brown Feed Store",
    aboutDescription: "Family-owned and operated since 1967, Brown Feed Store has been the trusted partner for farmers and ranchers throughout Central Texas. We provide high-quality feed, farm supplies, and expert advice to help your operation thrive.",
    footerText: "© 2024 Brown Feed Store. All rights reserved.",
    primaryColor: "#8B4513",
    secondaryColor: "#D2691E",
    accentColor: "#228B22",
    backgroundColor: "#F5F5DC",
    textColor: "#2F2F2F",
    headingFont: "Georgia",
    bodyFont: "Arial",
    buttonStyle: "rounded",
    layoutStyle: "traditional",
    showTestimonials: true,
    showNewsletter: true,
    showSocialMedia: true,
    metaTitle: "Brown Feed Store - Quality Feed & Farm Supplies in Lampasas, TX",
    metaDescription: "Brown Feed Store provides premium feed, farm supplies, and expert service to Central Texas farmers and ranchers. Family-owned since 1967.",
    metaKeywords: "feed store, farm supplies, livestock feed, Lampasas Texas, agricultural supplies"
  };

  private productCategories = new SimpleMap<ProductCategory>();
  private specialServices = new SimpleMap<SpecialService>();
  private featuredBrands = new SimpleMap<FeaturedBrand>();
  private currentCategoryId = 1;
  private currentServiceId = 1;
  private currentBrandId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize product categories
    this.productCategories.create({
      name: "Livestock Feed",
      description: "Premium feed for cattle, horses, goats, and other livestock",
      imageUrl: "/images/livestock-feed.jpg",
      featured: true,
      sortOrder: 1
    });

    this.productCategories.create({
      name: "Pet Food & Supplies",
      description: "Quality nutrition and supplies for dogs, cats, and small animals",
      imageUrl: "/images/pet-food.jpg",
      featured: true,
      sortOrder: 2
    });

    this.productCategories.create({
      name: "Farm Equipment",
      description: "Tools and equipment for efficient farm operations",
      imageUrl: "/images/farm-equipment.jpg",
      featured: false,
      sortOrder: 3
    });

    this.productCategories.create({
      name: "Seeds & Plants",
      description: "High-quality seeds and plants for crops and gardens",
      imageUrl: "/images/seeds.jpg",
      featured: true,
      sortOrder: 4
    });

    // Initialize special services
    this.specialServices.create({
      name: "Custom Feed Mixing",
      description: "We'll create custom feed blends tailored to your livestock's specific nutritional needs",
      icon: "mix",
      featured: true,
      sortOrder: 1
    });

    this.specialServices.create({
      name: "Delivery Service",
      description: "Free delivery on orders over $500 within 25 miles of our store",
      icon: "truck",
      featured: true,
      sortOrder: 2
    });

    this.specialServices.create({
      name: "Agricultural Consulting",
      description: "Expert advice on feed programs, livestock management, and farm optimization",
      icon: "consulting",
      featured: true,
      sortOrder: 3
    });

    // Initialize featured brands
    this.featuredBrands.create({
      name: "Purina",
      description: "Trusted nutrition for livestock and pets",
      logoUrl: "/images/purina-logo.jpg",
      websiteUrl: "https://purina.com",
      featured: true,
      sortOrder: 1
    });

    this.featuredBrands.create({
      name: "Blue Buffalo",
      description: "Natural pet food made with real meat and wholesome ingredients",
      logoUrl: "/images/blue-buffalo-logo.jpg",
      websiteUrl: "https://bluebuffalo.com",
      featured: true,
      sortOrder: 2
    });

    this.featuredBrands.create({
      name: "Tractor Supply Co.",
      description: "Farm and ranch supplies for every need",
      logoUrl: "/images/tsc-logo.jpg",
      websiteUrl: "https://tractorsupply.com",
      featured: false,
      sortOrder: 3
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = Math.floor(Math.random() * 1000000);
    const user: User = { ...insertUser, id };
    return user;
  }

  async getStoreSettings(): Promise<StoreSettings | undefined> {
    return this.storeSettings;
  }

  async updateStoreSettings(settings: InsertStoreSettings): Promise<StoreSettings> {
    this.storeSettings = { ...this.storeSettings, ...settings };
    return this.storeSettings;
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    return this.productCategories.getAll().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async updateProductCategory(id: number, category: InsertProductCategory): Promise<ProductCategory> {
    const updated = this.productCategories.update(id, category);
    if (!updated) throw new Error("Category not found");
    return updated;
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    return this.productCategories.create(category);
  }

  async deleteProductCategory(id: number): Promise<boolean> {
    return this.productCategories.delete(id);
  }

  async getSpecialServices(): Promise<SpecialService[]> {
    return this.specialServices.getAll().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async updateSpecialService(id: number, service: InsertSpecialService): Promise<SpecialService> {
    const updated = this.specialServices.update(id, service);
    if (!updated) throw new Error("Service not found");
    return updated;
  }

  async createSpecialService(service: InsertSpecialService): Promise<SpecialService> {
    return this.specialServices.create(service);
  }

  async deleteSpecialService(id: number): Promise<boolean> {
    return this.specialServices.delete(id);
  }

  async getFeaturedBrands(): Promise<FeaturedBrand[]> {
    return this.featuredBrands.getAll().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async updateFeaturedBrand(id: number, brand: InsertFeaturedBrand): Promise<FeaturedBrand> {
    const updated = this.featuredBrands.update(id, brand);
    if (!updated) throw new Error("Brand not found");
    return updated;
  }

  async createFeaturedBrand(brand: InsertFeaturedBrand): Promise<FeaturedBrand> {
    return this.featuredBrands.create(brand);
  }

  async deleteFeaturedBrand(id: number): Promise<boolean> {
    return this.featuredBrands.delete(id);
  }
}

// Database-backed storage that routes to client-specific schemas
class DatabaseStorage implements IStorage {
  private clientName: string;
  private tables: any;

  constructor() {
    this.clientName = process.env.CLIENT_NAME || 'default';
    this.tables = this.getClientTables();
  }

  private getClientTables() {
    if (process.env.DATABASE_URL && process.env.CLIENT_NAME) {
      const { getClientTables } = require("@shared/schema");
      return getClientTables(this.clientName);
    }
    return null;
  }

  async getUser(id: number): Promise<User | undefined> {
    if (!this.tables) return undefined;
    const { db } = require("./db");
    const { eq } = require("drizzle-orm");
    const result = await db.select().from(this.tables.users).where(eq(this.tables.users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.tables) return undefined;
    const { db } = require("./db");
    const { eq } = require("drizzle-orm");
    const result = await db.select().from(this.tables.users).where(eq(this.tables.users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!this.tables) throw new Error("Database not configured");
    const { db } = require("./db");
    const result = await db.insert(this.tables.users).values(insertUser).returning();
    return result[0];
  }

  async getStoreSettings(): Promise<StoreSettings | undefined> {
    if (!this.tables) return this.getDefaultStoreSettings();
    const { db } = require("./db");
    const result = await db.select().from(this.tables.storeSettings).limit(1);
    return result[0] || this.getDefaultStoreSettings();
  }

  async updateStoreSettings(settings: InsertStoreSettings): Promise<StoreSettings> {
    if (!this.tables) throw new Error("Database not configured");
    const { db } = require("./db");
    const result = await db.update(this.tables.storeSettings).set(settings).returning();
    return result[0];
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    if (!this.tables) return this.getDefaultProductCategories();
    const { db } = require("./db");
    const result = await db.select().from(this.tables.productCategories).orderBy(this.tables.productCategories.sortOrder);
    return result.length > 0 ? result : this.getDefaultProductCategories();
  }

  async updateProductCategory(id: number, category: InsertProductCategory): Promise<ProductCategory> {
    if (!this.tables) throw new Error("Database not configured");
    const { db } = require("./db");
    const { eq } = require("drizzle-orm");
    const result = await db.update(this.tables.productCategories).set(category).where(eq(this.tables.productCategories.id, id)).returning();
    return result[0];
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    if (!this.tables) throw new Error("Database not configured");
    const { db } = require("./db");
    const result = await db.insert(this.tables.productCategories).values(category).returning();
    return result[0];
  }

  async deleteProductCategory(id: number): Promise<boolean> {
    if (!this.tables) return false;
    const { db } = require("./db");
    const { eq } = require("drizzle-orm");
    await db.delete(this.tables.productCategories).where(eq(this.tables.productCategories.id, id));
    return true;
  }

  async getSpecialServices(): Promise<SpecialService[]> {
    if (!this.tables) return this.getDefaultSpecialServices();
    const { db } = require("./db");
    const result = await db.select().from(this.tables.specialServices).orderBy(this.tables.specialServices.sortOrder);
    return result.length > 0 ? result : this.getDefaultSpecialServices();
  }

  async updateSpecialService(id: number, service: InsertSpecialService): Promise<SpecialService> {
    if (!this.tables) throw new Error("Database not configured");
    const { db } = require("./db");
    const { eq } = require("drizzle-orm");
    const result = await db.update(this.tables.specialServices).set(service).where(eq(this.tables.specialServices.id, id)).returning();
    return result[0];
  }

  async createSpecialService(service: InsertSpecialService): Promise<SpecialService> {
    if (!this.tables) throw new Error("Database not configured");
    const { db } = require("./db");
    const result = await db.insert(this.tables.specialServices).values(service).returning();
    return result[0];
  }

  async deleteSpecialService(id: number): Promise<boolean> {
    if (!this.tables) return false;
    const { db } = require("./db");
    const { eq } = require("drizzle-orm");
    await db.delete(this.tables.specialServices).where(eq(this.tables.specialServices.id, id));
    return true;
  }

  async getFeaturedBrands(): Promise<FeaturedBrand[]> {
    if (!this.tables) return this.getDefaultFeaturedBrands();
    const { db } = require("./db");
    const result = await db.select().from(this.tables.featuredBrands).orderBy(this.tables.featuredBrands.sortOrder);
    return result.length > 0 ? result : this.getDefaultFeaturedBrands();
  }

  async updateFeaturedBrand(id: number, brand: InsertFeaturedBrand): Promise<FeaturedBrand> {
    if (!this.tables) throw new Error("Database not configured");
    const { db } = require("./db");
    const { eq } = require("drizzle-orm");
    const result = await db.update(this.tables.featuredBrands).set(brand).where(eq(this.tables.featuredBrands.id, id)).returning();
    return result[0];
  }

  async createFeaturedBrand(brand: InsertFeaturedBrand): Promise<FeaturedBrand> {
    if (!this.tables) throw new Error("Database not configured");
    const { db } = require("./db");
    const result = await db.insert(this.tables.featuredBrands).values(brand).returning();
    return result[0];
  }

  async deleteFeaturedBrand(id: number): Promise<boolean> {
    if (!this.tables) return false;
    const { db } = require("./db");
    const { eq } = require("drizzle-orm");
    await db.delete(this.tables.featuredBrands).where(eq(this.tables.featuredBrands.id, id));
    return true;
  }

  // Fallback methods for development/local testing
  private getDefaultStoreSettings(): StoreSettings {
    return {
      id: 1,
      storeName: "Brown Feed Store",
      tagline: "Your Agricultural Supply Partner Since 1967",
      address: "123 Main Street, Lampasas, TX 76550",
      phone: "(512) 556-3467",
      email: "info@brownfeedstore.com",
      mondayHours: "8:00 AM - 6:00 PM",
      tuesdayHours: "8:00 AM - 6:00 PM",
      wednesdayHours: "8:00 AM - 6:00 PM",
      thursdayHours: "8:00 AM - 6:00 PM",
      fridayHours: "8:00 AM - 6:00 PM",
      saturdayHours: "8:00 AM - 5:00 PM",
      sundayHours: "Closed",
      aboutTitle: "About Brown Feed Store",
      aboutDescription: "Family-owned and operated since 1967, Brown Feed Store has been the trusted partner for farmers and ranchers throughout Central Texas. We provide high-quality feed, farm supplies, and expert advice to help your operation thrive.",
      aboutStory: "Our story begins with a simple mission: to serve the hardworking farmers and ranchers of Central Texas with the highest quality products and most reliable service. Founded in 1967 by the Brown family, we've grown from a small local feed store to a comprehensive agricultural supply center while maintaining our commitment to personal service and community values.",
      foundedYear: "1967",
      logoUrl: "/images/brown-feed-logo.png",
      faviconUrl: "/images/favicon.ico",
      heroImageUrl: "/images/hero-farm.jpg",
      aboutImageUrl: "/images/store-front.jpg",
      primaryColor: "25 76% 31%",
      secondaryColor: "25 75% 47%",
      accentColor: "120 61% 34%",
      fontFamily: "Inter",
      facebookUrl: "https://facebook.com/brownfeedstore",
      instagramUrl: "https://instagram.com/brownfeedstore",
      xUrl: "https://twitter.com/brownfeedstore",
      googleUrl: "https://maps.google.com/brownfeedstore",
      yelpUrl: "https://yelp.com/brownfeedstore",
      seoTitle: "Brown Feed Store - Quality Feed & Farm Supplies in Central Texas",
      seoDescription: "Family-owned feed store serving Central Texas since 1967. Quality livestock feed, farm supplies, and expert advice for farmers and ranchers.",
      seoKeywords: "feed store, farm supplies, livestock feed, agricultural supplies, Central Texas, Lampasas"
    };
  }

  private getDefaultProductCategories(): ProductCategory[] {
    return [
      {
        id: 1,
        name: "Livestock Feed",
        description: "High-quality feed for cattle, horses, goats, and other livestock",
        imageUrl: "/images/livestock-feed.jpg",
        featured: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: "Farm Equipment",
        description: "Tools and equipment for farming operations",
        imageUrl: "/images/farm-equipment.jpg",
        featured: true,
        sortOrder: 2
      },
      {
        id: 3,
        name: "Pet & Poultry",
        description: "Feed and supplies for pets and poultry",
        imageUrl: "/images/pet-poultry.jpg",
        featured: true,
        sortOrder: 3
      }
    ];
  }

  private getDefaultSpecialServices(): SpecialService[] {
    return [
      {
        id: 1,
        name: "Custom Feed Mixing",
        description: "Personalized feed blends for your specific livestock needs",
        icon: "Wheat",
        featured: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: "Delivery Service",
        description: "Convenient delivery to your farm or ranch",
        icon: "Truck",
        featured: true,
        sortOrder: 2
      },
      {
        id: 3,
        name: "Nutritional Consulting",
        description: "Expert advice on livestock nutrition and feeding programs",
        icon: "Heart",
        featured: true,
        sortOrder: 3
      }
    ];
  }

  private getDefaultFeaturedBrands(): FeaturedBrand[] {
    return [
      {
        id: 1,
        name: "Purina",
        description: "Trusted nutrition for livestock and pets",
        logoUrl: "/images/purina-logo.jpg",
        websiteUrl: "https://purina.com",
        featured: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: "Southern States",
        description: "Quality farm and feed products",
        logoUrl: "/images/southern-states-logo.jpg",
        websiteUrl: "https://southernstates.com",
        featured: true,
        sortOrder: 2
      }
    ];
  }
}

// Use database storage for production, memory storage for development
export const storage = process.env.DATABASE_URL && process.env.CLIENT_NAME 
  ? new DatabaseStorage() 
  : new MemStorage();