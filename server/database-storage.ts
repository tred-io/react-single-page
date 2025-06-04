import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { type SimpleUser as User, type StoreSettings, type InsertStoreSettings, type ProductCategory, type InsertProductCategory, type SpecialService, type InsertSpecialService, type FeaturedBrand, type InsertFeaturedBrand, getClientTables } from "@shared/schema";

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

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

export class DatabaseStorage implements IStorage {
  private tables = getClientTables('brown_feed');

  constructor() {
    this.initializeTables();
  }

  private async initializeTables() {
    try {
      const [settings] = await db.select().from(this.tables.storeSettings).limit(1);
      if (!settings) {
        await this.createDefaultData();
      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  private async createDefaultData() {
    // Insert default Brown Feed Store settings
    await db.insert(this.tables.storeSettings).values({
      id: 1,
      storeName: "Brown Feed Store",
      tagline: "Your Trusted Agricultural Partner in Lampasas, Texas",
      address: "1234 Highway 281, Lampasas, TX 76550",
      phone: "(512) 555-1234",
      email: "info@brownfeedstore.com",
      mondayHours: "7:00 AM - 6:00 PM",
      tuesdayHours: "7:00 AM - 6:00 PM",
      wednesdayHours: "7:00 AM - 6:00 PM",
      thursdayHours: "7:00 AM - 6:00 PM",
      fridayHours: "7:00 AM - 6:00 PM",
      saturdayHours: "7:00 AM - 6:00 PM",
      sundayHours: "9:00 AM - 4:00 PM",
      aboutTitle: "About Brown Feed Store",
      aboutDescription: "A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades",
      aboutStory: "Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas. We believe in supporting our local community with quality products, fair prices, and expert advice.",
      foundedYear: "1985",
      heroImageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      aboutImageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      primaryColor: "#166534",
      secondaryColor: "#15803d", 
      accentColor: "#22c55e",
      fontFamily: "Inter",
      seoTitle: "Brown Feed Store - Your Trusted Agricultural Partner in Lampasas, Texas",
      seoDescription: "Brown Feed Store has been serving Lampasas County with quality livestock feed, pet supplies, and farm equipment since 1985.",
      seoKeywords: "feed store, livestock feed, pet food, farm supplies, Lampasas Texas"
    });

    // Insert default product categories
    await db.insert(this.tables.productCategories).values([
      {
        id: 1,
        title: "Livestock Feed",
        description: "Complete nutrition for cattle, horses, goats, sheep, and swine",
        imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        iconName: "Wheat",
        items: ["Cattle Feed & Supplements", "Horse Feed & Hay", "Goat & Sheep Feed", "Swine Feed", "Range Cubes & Mineral Blocks"],
        displayOrder: 1
      },
      {
        id: 2,
        title: "Pet Food & Supplies", 
        description: "Premium nutrition and supplies for dogs, cats, and small animals",
        imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        iconName: "Dog",
        items: ["Premium Dog Food", "Cat Food & Treats", "Pet Toys & Accessories", "Leashes & Collars", "Pet Health Supplements"],
        displayOrder: 2
      }
    ]);

    // Insert default special services
    await db.insert(this.tables.specialServices).values([
      {
        id: 1,
        title: "Expert Consultation",
        description: "Get personalized advice from our experienced team on nutrition and animal care",
        iconName: "Users",
        displayOrder: 1
      },
      {
        id: 2,
        title: "Feed Delivery",
        description: "Convenient delivery service for bulk orders throughout Lampasas County", 
        iconName: "Truck",
        displayOrder: 2
      }
    ]);
  }

  // User methods (placeholder for now)
  async getUser(id: number): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    throw new Error("User creation not implemented");
  }

  // Store Settings methods
  async getStoreSettings(): Promise<StoreSettings | undefined> {
    const [settings] = await db.select().from(this.tables.storeSettings).where(eq(this.tables.storeSettings.id, 1));
    return settings;
  }

  async updateStoreSettings(settings: InsertStoreSettings): Promise<StoreSettings> {
    const [updated] = await db
      .update(this.tables.storeSettings)
      .set(settings)
      .where(eq(this.tables.storeSettings.id, 1))
      .returning();
    return updated;
  }

  // Product Categories methods
  async getProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(this.tables.productCategories).orderBy(this.tables.productCategories.displayOrder);
  }

  async updateProductCategory(id: number, category: InsertProductCategory): Promise<ProductCategory> {
    const [updated] = await db
      .update(this.tables.productCategories)
      .set(category)
      .where(eq(this.tables.productCategories.id, id))
      .returning();
    return updated;
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const [created] = await db.insert(this.tables.productCategories).values(category).returning();
    return created;
  }

  async deleteProductCategory(id: number): Promise<boolean> {
    const result = await db.delete(this.tables.productCategories).where(eq(this.tables.productCategories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Special Services methods
  async getSpecialServices(): Promise<SpecialService[]> {
    return await db.select().from(this.tables.specialServices).orderBy(this.tables.specialServices.displayOrder);
  }

  async updateSpecialService(id: number, service: InsertSpecialService): Promise<SpecialService> {
    const [updated] = await db
      .update(this.tables.specialServices)
      .set(service)
      .where(eq(this.tables.specialServices.id, id))
      .returning();
    return updated;
  }

  async createSpecialService(service: InsertSpecialService): Promise<SpecialService> {
    const [created] = await db.insert(this.tables.specialServices).values(service).returning();
    return created;
  }

  async deleteSpecialService(id: number): Promise<boolean> {
    const result = await db.delete(this.tables.specialServices).where(eq(this.tables.specialServices.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Featured Brands methods
  async getFeaturedBrands(): Promise<FeaturedBrand[]> {
    return await db.select().from(this.tables.featuredBrands).orderBy(this.tables.featuredBrands.displayOrder);
  }

  async updateFeaturedBrand(id: number, brand: InsertFeaturedBrand): Promise<FeaturedBrand> {
    const [updated] = await db
      .update(this.tables.featuredBrands)
      .set(brand)
      .where(eq(this.tables.featuredBrands.id, id))
      .returning();
    return updated;
  }

  async createFeaturedBrand(brand: InsertFeaturedBrand): Promise<FeaturedBrand> {
    const [created] = await db.insert(this.tables.featuredBrands).values(brand).returning();
    return created;
  }

  async deleteFeaturedBrand(id: number): Promise<boolean> {
    const result = await db.delete(this.tables.featuredBrands).where(eq(this.tables.featuredBrands.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();