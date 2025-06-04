import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  type StoreSettings,
  type ProductCategory,
  type SpecialService,
  type FeaturedBrand,
  type CustomPage,
  type InsertStoreSettings,
  type InsertProductCategory,
  type InsertSpecialService,
  type InsertFeaturedBrand,
  type InsertCustomPage,
  getClientTables,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private clientName: string;
  private tables: ReturnType<typeof getClientTables>;

  constructor(clientName: string) {
    this.clientName = clientName;
    this.tables = getClientTables(clientName);
  }

  // Store Settings
  async getStoreSettings(): Promise<StoreSettings | undefined> {
    try {
      const [settings] = await db.select().from(this.tables.storeSettings).limit(1);
      if (settings) {
        return {
          ...settings,
          email: settings.email || undefined,
          logoUrl: settings.logoUrl || undefined,
          faviconUrl: settings.faviconUrl || undefined,
          heroImageUrl: settings.heroImageUrl || undefined,
          aboutImageUrl: settings.aboutImageUrl || undefined,
          facebookUrl: settings.facebookUrl || undefined,
          instagramUrl: settings.instagramUrl || undefined,
          xUrl: settings.xUrl || undefined,
          googleUrl: settings.googleUrl || undefined,
          yelpUrl: settings.yelpUrl || undefined,
        };
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching store settings:", error);
      return undefined;
    }
  }

  async updateStoreSettings(settings: InsertStoreSettings): Promise<StoreSettings> {
    const [updated] = await db
      .insert(this.tables.storeSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: this.tables.storeSettings.id,
        set: { ...settings, updatedAt: new Date() },
      })
      .returning();
    
    return {
      ...updated,
      email: updated.email || undefined,
      logoUrl: updated.logoUrl || undefined,
      faviconUrl: updated.faviconUrl || undefined,
      heroImageUrl: updated.heroImageUrl || undefined,
      aboutImageUrl: updated.aboutImageUrl || undefined,
      facebookUrl: updated.facebookUrl || undefined,
      instagramUrl: updated.instagramUrl || undefined,
      xUrl: updated.xUrl || undefined,
      googleUrl: updated.googleUrl || undefined,
      yelpUrl: updated.yelpUrl || undefined,
    };
  }

  // Product Categories
  async getProductCategories(): Promise<ProductCategory[]> {
    try {
      const categories = await db
        .select()
        .from(this.tables.productCategories)
        .orderBy(this.tables.productCategories.sortOrder);
      
      return categories.map(category => ({
        ...category,
        featured: Boolean(category.featured),
      }));
    } catch (error) {
      console.error("Error fetching product categories:", error);
      return [];
    }
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const [created] = await db
      .insert(this.tables.productCategories)
      .values(category)
      .returning();
    
    return {
      ...created,
      featured: Boolean(created.featured),
    };
  }

  async updateProductCategory(id: number, category: Partial<InsertProductCategory>): Promise<ProductCategory> {
    const [updated] = await db
      .update(this.tables.productCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(this.tables.productCategories.id, id))
      .returning();
    
    return {
      ...updated,
      featured: Boolean(updated.featured),
    };
  }

  async deleteProductCategory(id: number): Promise<void> {
    await db.delete(this.tables.productCategories).where(eq(this.tables.productCategories.id, id));
  }

  // Special Services
  async getSpecialServices(): Promise<SpecialService[]> {
    try {
      const services = await db
        .select()
        .from(this.tables.specialServices)
        .orderBy(this.tables.specialServices.sortOrder);
      
      return services.map(service => ({
        ...service,
        featured: Boolean(service.featured),
      }));
    } catch (error) {
      console.error("Error fetching special services:", error);
      return [];
    }
  }

  async createSpecialService(service: InsertSpecialService): Promise<SpecialService> {
    const [created] = await db
      .insert(this.tables.specialServices)
      .values(service)
      .returning();
    
    return {
      ...created,
      featured: Boolean(created.featured),
    };
  }

  async updateSpecialService(id: number, service: Partial<InsertSpecialService>): Promise<SpecialService> {
    const [updated] = await db
      .update(this.tables.specialServices)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(this.tables.specialServices.id, id))
      .returning();
    
    return {
      ...updated,
      featured: Boolean(updated.featured),
    };
  }

  async deleteSpecialService(id: number): Promise<void> {
    await db.delete(this.tables.specialServices).where(eq(this.tables.specialServices.id, id));
  }

  // Featured Brands
  async getFeaturedBrands(): Promise<FeaturedBrand[]> {
    try {
      const brands = await db
        .select()
        .from(this.tables.featuredBrands)
        .orderBy(this.tables.featuredBrands.sortOrder);
      
      return brands.map(brand => ({
        ...brand,
        featured: Boolean(brand.featured),
      }));
    } catch (error) {
      console.error("Error fetching featured brands:", error);
      return [];
    }
  }

  async createFeaturedBrand(brand: InsertFeaturedBrand): Promise<FeaturedBrand> {
    const [created] = await db
      .insert(this.tables.featuredBrands)
      .values(brand)
      .returning();
    
    return {
      ...created,
      featured: Boolean(created.featured),
    };
  }

  async updateFeaturedBrand(id: number, brand: Partial<InsertFeaturedBrand>): Promise<FeaturedBrand> {
    const [updated] = await db
      .update(this.tables.featuredBrands)
      .set({ ...brand, updatedAt: new Date() })
      .where(eq(this.tables.featuredBrands.id, id))
      .returning();
    
    return {
      ...updated,
      featured: Boolean(updated.featured),
    };
  }

  async deleteFeaturedBrand(id: number): Promise<void> {
    await db.delete(this.tables.featuredBrands).where(eq(this.tables.featuredBrands.id, id));
  }

  // Custom Pages
  async getCustomPages(): Promise<CustomPage[]> {
    try {
      return await db.select().from(this.tables.customPages);
    } catch (error) {
      console.error("Error fetching custom pages:", error);
      return [];
    }
  }

  async createCustomPage(page: InsertCustomPage): Promise<CustomPage> {
    const [created] = await db
      .insert(this.tables.customPages)
      .values(page)
      .returning();
    return created;
  }

  async updateCustomPage(id: number, page: Partial<InsertCustomPage>): Promise<CustomPage> {
    const [updated] = await db
      .update(this.tables.customPages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(this.tables.customPages.id, id))
      .returning();
    return updated;
  }

  async deleteCustomPage(id: number): Promise<void> {
    await db.delete(this.tables.customPages).where(eq(this.tables.customPages.id, id));
  }

  // Initialize with sample data
  async initializeWithSampleData(): Promise<void> {
    try {
      // Check if store settings already exist
      const existingSettings = await this.getStoreSettings();
      if (!existingSettings) {
        await this.updateStoreSettings({
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
          aboutDescription: "Family-owned and operated since 1967, Brown Feed Store has been the trusted partner for farmers and ranchers throughout Central Texas. We provide high-quality feed, supplies, and expert advice to help your operation thrive.",
          aboutStory: "Founded by Jim and Mary Brown in 1967, our store has grown from a small family business to Central Texas's premier agricultural supply destination. Three generations later, we continue to serve our community with the same dedication to quality and customer service that started it all.",
          foundedYear: "1967",
          primaryColor: "#8B4513",
          secondaryColor: "#D2691E", 
          accentColor: "#228B22",
          fontFamily: "Inter",
          facebookUrl: "https://facebook.com/brownfeedstore",
          instagramUrl: "https://instagram.com/brownfeedstore",
          seoTitle: "Brown Feed Store - Quality Agricultural Supplies in Lampasas, TX",
          seoDescription: "Brown Feed Store has served Central Texas since 1967 with premium livestock feed, farm supplies, and expert agricultural advice. Visit us in Lampasas!",
          seoKeywords: "feed store, livestock feed, farm supplies, Lampasas TX, agricultural supplies, animal feed"
        });
      }

      // Initialize product categories
      const existingCategories = await this.getProductCategories();
      if (existingCategories.length === 0) {
        await this.createProductCategory({
          name: "Livestock Feed",
          description: "Premium feed for cattle, horses, goats, and other livestock",
          imageUrl: "/images/livestock-feed.jpg",
          featured: true,
          sortOrder: 1
        });

        await this.createProductCategory({
          name: "Pet Food & Supplies",
          description: "Quality nutrition and supplies for dogs, cats, and small animals",
          imageUrl: "/images/pet-food.jpg",
          featured: true,
          sortOrder: 2
        });

        await this.createProductCategory({
          name: "Farm Equipment",
          description: "Tools and equipment for efficient farm operations",
          imageUrl: "/images/farm-equipment.jpg",
          featured: false,
          sortOrder: 3
        });

        await this.createProductCategory({
          name: "Seeds & Plants",
          description: "High-quality seeds and plants for crops and gardens",
          imageUrl: "/images/seeds.jpg",
          featured: true,
          sortOrder: 4
        });
      }

      // Initialize special services
      const existingServices = await this.getSpecialServices();
      if (existingServices.length === 0) {
        await this.createSpecialService({
          name: "Custom Feed Mixing",
          description: "We'll create custom feed blends tailored to your livestock's specific nutritional needs",
          icon: "mix",
          featured: true,
          sortOrder: 1
        });

        await this.createSpecialService({
          name: "Delivery Service",
          description: "Free delivery on orders over $100 within 25 miles of our store",
          icon: "truck",
          featured: true,
          sortOrder: 2
        });

        await this.createSpecialService({
          name: "Nutritional Consulting",
          description: "Expert advice on animal nutrition and feeding programs from our experienced staff",
          icon: "consulting",
          featured: true,
          sortOrder: 3
        });
      }

      // Initialize featured brands
      const existingBrands = await this.getFeaturedBrands();
      if (existingBrands.length === 0) {
        await this.createFeaturedBrand({
          name: "Purina",
          description: "Trusted nutrition for livestock and pets",
          logoUrl: "/images/purina-logo.png",
          websiteUrl: "https://www.purina.com",
          featured: true,
          sortOrder: 1
        });

        await this.createFeaturedBrand({
          name: "Blue Seal",
          description: "Premium feeds for all your animals",
          logoUrl: "/images/blueseal-logo.png", 
          websiteUrl: "https://www.blueseal.com",
          featured: true,
          sortOrder: 2
        });

        await this.createFeaturedBrand({
          name: "Southern States",
          description: "Quality farm and feed supplies",
          logoUrl: "/images/southern-states-logo.png",
          websiteUrl: "https://www.southernstates.com",
          featured: true,
          sortOrder: 3
        });
      }

      console.log(`✅ Database initialized for client: ${this.clientName}`);
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }
}