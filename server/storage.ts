import { type User, type InsertUser, type StoreSettings, type InsertStoreSettings, type ProductCategory, type InsertProductCategory, type SpecialService, type InsertSpecialService, type FeaturedBrand, type InsertFeaturedBrand } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private storeSettings: StoreSettings | undefined;
  private productCategories: Map<number, ProductCategory>;
  private specialServices: Map<number, SpecialService>;
  private featuredBrands: Map<number, FeaturedBrand>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentServiceId: number;
  private currentBrandId: number;

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
      mondayHours: "7:00 AM - 6:00 PM",
      tuesdayHours: "7:00 AM - 6:00 PM",
      wednesdayHours: "7:00 AM - 6:00 PM",
      thursdayHours: "7:00 AM - 6:00 PM",
      fridayHours: "7:00 AM - 6:00 PM",
      saturdayHours: "7:00 AM - 6:00 PM",
      sundayHours: "9:00 AM - 4:00 PM",
      aboutTitle: "About Brown Feed Store",
      aboutDescription: "A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades",
      aboutStory: "Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas. We believe in supporting our local community with quality products, fair prices, and the kind of personal service that only comes from knowing our customers and their unique needs.",
      foundedYear: "1985",
      logoUrl: "",
      faviconUrl: "",
      heroImageUrl: "",
      aboutImageUrl: "",
      // Theme & Branding
      primaryColor: "#8B4513",
      secondaryColor: "#2F4F4F", 
      accentColor: "#CD853F",
      fontFamily: "Inter",
      // Social URLs
      facebookUrl: "",
      instagramUrl: "",
      xUrl: "",
      googleUrl: "",
      yelpUrl: "",
      // SEO
      seoTitle: "Brown Feed Store - Quality Agricultural Supplies in Lampasas, TX",
      seoDescription: "Your trusted agricultural partner since 1985. Premium livestock feed, farming equipment, and expert advice in Lampasas County, Texas.",
      seoKeywords: "feed store, livestock feed, agricultural supplies, farming equipment, Lampasas Texas, cattle feed, horse feed"
    };
    
    // Initialize with default product categories
    const defaultCategories = [
      {
        title: "Livestock Feed",
        description: "Premium quality feed for cattle, horses, pigs, goats, and sheep. Custom mixes available.",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        iconName: "Beef",
        items: ["Range Cubes & Pellets", "Sweet Feed & Grain", "Mineral Supplements", "Custom Blends"],
        displayOrder: 1
      },
      {
        title: "Pet Supplies",
        description: "Complete line of pet food, treats, toys, and care products for dogs, cats, and small animals.",
        imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        iconName: "Heart",
        items: ["Premium Dog & Cat Food", "Treats & Supplements", "Toys & Accessories", "Grooming Supplies"],
        displayOrder: 2
      },
      {
        title: "Farm Equipment",
        description: "Essential tools and equipment for farming, ranching, and property maintenance.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        iconName: "Wrench",
        items: ["Hand Tools & Hardware", "Fencing Materials", "Water Systems", "Safety Equipment"],
        displayOrder: 3
      },
      {
        title: "Poultry Supplies",
        description: "Complete poultry care including feed, supplements, and housing solutions.",
        imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        iconName: "Bird",
        items: ["Layer & Broiler Feed", "Poultry Vitamins", "Feeders & Waterers", "Coop Supplies"],
        displayOrder: 4
      },
      {
        title: "Seeds & Garden",
        description: "Quality seeds, fertilizers, and gardening supplies for your growing needs.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        iconName: "Sprout",
        items: ["Vegetable & Flower Seeds", "Grass & Pasture Seed", "Fertilizers & Soil", "Garden Tools"],
        displayOrder: 5
      },
      {
        title: "Animal Health",
        description: "Veterinary supplies, medications, and health products for livestock and pets.",
        imageUrl: "https://images.unsplash.com/photo-1559190394-df5a28aab5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        iconName: "Stethoscope",
        items: ["Vaccines & Medications", "Dewormers & Treatments", "First Aid Supplies", "Grooming Products"],
        displayOrder: 6
      }
    ];
    
    defaultCategories.forEach(category => {
      const id = this.currentCategoryId++;
      this.productCategories.set(id, { ...category, id });
    });

    // Initialize special services and featured brands storage
    this.specialServices = new Map();
    this.featuredBrands = new Map();
    this.currentServiceId = 1;
    this.currentBrandId = 1;

    // Initialize with default special services
    const defaultServices = [
      {
        title: "Expert Consultation",
        description: "Get personalized advice from our agricultural specialists",
        iconName: "Users",
        displayOrder: 1
      },
      {
        title: "Local Delivery",
        description: "Free delivery for orders over $100 within 20 miles",
        iconName: "Truck",
        displayOrder: 2
      },
      {
        title: "Custom Feed Mixing",
        description: "Tailored nutrition solutions for your livestock",
        iconName: "Settings",
        displayOrder: 3
      }
    ];

    defaultServices.forEach(service => {
      const id = this.currentServiceId++;
      this.specialServices.set(id, { ...service, id });
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
    this.storeSettings = { ...settings, id: 1, email: settings.email || undefined };
    return this.storeSettings!;
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

  // Special Services methods
  async getSpecialServices(): Promise<SpecialService[]> {
    return Array.from(this.specialServices.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async updateSpecialService(id: number, service: InsertSpecialService): Promise<SpecialService> {
    const updated: SpecialService = { ...service, id };
    this.specialServices.set(id, updated);
    return updated;
  }

  async createSpecialService(service: InsertSpecialService): Promise<SpecialService> {
    const id = this.currentServiceId++;
    const newService: SpecialService = { ...service, id };
    this.specialServices.set(id, newService);
    return newService;
  }

  async deleteSpecialService(id: number): Promise<boolean> {
    return this.specialServices.delete(id);
  }

  // Featured Brands methods
  async getFeaturedBrands(): Promise<FeaturedBrand[]> {
    return Array.from(this.featuredBrands.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async updateFeaturedBrand(id: number, brand: InsertFeaturedBrand): Promise<FeaturedBrand> {
    const updated: FeaturedBrand = { ...brand, id };
    this.featuredBrands.set(id, updated);
    return updated;
  }

  async createFeaturedBrand(brand: InsertFeaturedBrand): Promise<FeaturedBrand> {
    const id = this.currentBrandId++;
    const newBrand: FeaturedBrand = { ...brand, id };
    this.featuredBrands.set(id, newBrand);
    return newBrand;
  }

  async deleteFeaturedBrand(id: number): Promise<boolean> {
    return this.featuredBrands.delete(id);
  }
}

export const storage = new MemStorage();
