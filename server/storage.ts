import { users, storeSettings, productCategories, type User, type InsertUser, type StoreSettings, type InsertStoreSettings, type ProductCategory, type InsertProductCategory } from "@shared/schema";

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
  // Custom pages
  getCustomPages(): Promise<CustomPage[]>;
  getCustomPageBySlug(slug: string): Promise<CustomPage | undefined>;
  createCustomPage(page: InsertCustomPage): Promise<CustomPage>;
  updateCustomPage(id: number, page: InsertCustomPage): Promise<CustomPage>;
  deleteCustomPage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private storeSettings: StoreSettings | undefined;
  private productCategories: Map<number, ProductCategory>;
  private currentUserId: number;
  private currentCategoryId: number;

  constructor() {
    this.users = new Map();
    this.productCategories = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    
    // Initialize with default store settings
    this.storeSettings = {
      id: 1,
      storeName: "Brown Feed Store",
      tagline: "Your Trusted Agricultural Partner in Lampasas, Texas",
      address: "1234 Highway 281, Lampasas, TX 76550",
      phone: "(512) 555-1234",
      email: "info@brownfeedstore.com",
      mondayFridayHours: "7:00 AM - 6:00 PM",
      saturdayHours: "7:00 AM - 6:00 PM",
      sundayHours: "9:00 AM - 4:00 PM",
      aboutTitle: "About Brown Feed Store",
      aboutDescription: "A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades",
      aboutStory: "Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas. We believe in supporting our local community with quality products, fair prices, and the kind of personal service that only comes from knowing our customers and their unique needs.",
      foundedYear: "1985"
    };
    
    // Initialize with default product categories
    const defaultCategories = [
      {
        title: "Livestock Feed",
        description: "Premium quality feed for cattle, horses, pigs, goats, and sheep. Custom mixes available.",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        items: ["Range Cubes & Pellets", "Sweet Feed & Grain", "Mineral Supplements", "Custom Blends"],
        displayOrder: 1
      },
      {
        title: "Pet Supplies",
        description: "Complete line of pet food, treats, toys, and care products for dogs, cats, and small animals.",
        imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        items: ["Premium Dog & Cat Food", "Treats & Supplements", "Toys & Accessories", "Grooming Supplies"],
        displayOrder: 2
      },
      {
        title: "Farm Equipment",
        description: "Essential tools and equipment for farming, ranching, and property maintenance.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        items: ["Hand Tools & Hardware", "Fencing Materials", "Water Systems", "Safety Equipment"],
        displayOrder: 3
      },
      {
        title: "Poultry Supplies",
        description: "Complete poultry care including feed, supplements, and housing solutions.",
        imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        items: ["Layer & Broiler Feed", "Poultry Vitamins", "Feeders & Waterers", "Coop Supplies"],
        displayOrder: 4
      },
      {
        title: "Seeds & Garden",
        description: "Quality seeds, fertilizers, and gardening supplies for your growing needs.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        items: ["Vegetable & Flower Seeds", "Grass & Pasture Seed", "Fertilizers & Soil", "Garden Tools"],
        displayOrder: 5
      },
      {
        title: "Animal Health",
        description: "Veterinary supplies, medications, and health products for livestock and pets.",
        imageUrl: "https://images.unsplash.com/photo-1559190394-df5a28aab5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        items: ["Vaccines & Medications", "Dewormers & Treatments", "First Aid Supplies", "Grooming Products"],
        displayOrder: 6
      }
    ];
    
    defaultCategories.forEach(category => {
      const id = this.currentCategoryId++;
      this.productCategories.set(id, { ...category, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getStoreSettings(): Promise<StoreSettings | undefined> {
    return this.storeSettings;
  }

  async updateStoreSettings(settings: InsertStoreSettings): Promise<StoreSettings> {
    this.storeSettings = { ...settings, id: 1, email: settings.email || null };
    return this.storeSettings;
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    return Array.from(this.productCategories.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async updateProductCategory(id: number, category: InsertProductCategory): Promise<ProductCategory> {
    const updated: ProductCategory = { ...category, id };
    this.productCategories.set(id, updated);
    return updated;
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const id = this.currentCategoryId++;
    const newCategory: ProductCategory = { ...category, id };
    this.productCategories.set(id, newCategory);
    return newCategory;
  }

  async deleteProductCategory(id: number): Promise<boolean> {
    return this.productCategories.delete(id);
  }
}

export const storage = new MemStorage();
