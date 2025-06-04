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
