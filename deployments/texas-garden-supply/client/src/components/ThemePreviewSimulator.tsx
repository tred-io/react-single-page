import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Clock, Mail, Tractor, Star, Package, Users, Truck, ArrowRight } from "lucide-react";
import type { ThemeOption } from "@shared/schema";

interface ThemePreviewSimulatorProps {
  theme: ThemeOption;
  storeName: string;
  tagline: string;
  phone: string;
}

export default function ThemePreviewSimulator({ 
  theme, 
  storeName = "Your Store Name", 
  tagline = "Your business tagline here",
  phone = "(555) 123-4567"
}: ThemePreviewSimulatorProps) {
  const [activePreview, setActivePreview] = useState("homepage");
  const [isMobileView, setIsMobileView] = useState(false);

  const getColorPreview = (hslColor: string) => {
    return `hsl(${hslColor})`;
  };

  const themeStyles = {
    primary: getColorPreview(theme.primaryColor),
    secondary: getColorPreview(theme.secondaryColor),
    accent: getColorPreview(theme.accentColor),
    fontFamily: theme.fontFamily
  };

  const HomepagePreview = () => (
    <div className="space-y-4" style={{ fontFamily: themeStyles.fontFamily }}>
      {/* Navigation Preview */}
      <div 
        className="p-4 rounded-lg shadow-sm"
        style={{ backgroundColor: themeStyles.primary, color: 'white' }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tractor className="h-6 w-6" />
            <span className="font-bold text-lg">{storeName}</span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm">
            <span className="hover:opacity-75 cursor-pointer">Home</span>
            <span className="hover:opacity-75 cursor-pointer">Products</span>
            <span className="hover:opacity-75 cursor-pointer">About</span>
            <span className="hover:opacity-75 cursor-pointer">Contact</span>
          </div>
        </div>
      </div>

      {/* Hero Section Preview */}
      <div 
        className="p-8 rounded-lg text-center bg-cover bg-center"
        style={{
          backgroundColor: themeStyles.secondary,
          backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')"
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">{storeName}</h1>
        <p className="text-xl text-white mb-6">{tagline}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            className="px-6 py-2 rounded-lg font-semibold transition-colors text-white"
            style={{ backgroundColor: themeStyles.primary }}
          >
            <MapPin className="inline mr-2 h-4 w-4" />
            View Products
          </button>
          <button 
            className="px-6 py-2 rounded-lg font-semibold transition-colors text-white"
            style={{ backgroundColor: themeStyles.accent }}
          >
            <Phone className="inline mr-2 h-4 w-4" />
            Call {phone}
          </button>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div 
        className="p-3 rounded-lg"
        style={{ backgroundColor: themeStyles.secondary, color: themeStyles.primary }}
      >
        <div className="flex justify-center items-center space-x-6 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Today: 7:00 AM - 6:00 PM</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span>info@{storeName.toLowerCase().replace(/\s+/g, '')}.com</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductsPreview = () => (
    <div className="space-y-4" style={{ fontFamily: themeStyles.fontFamily }}>
      <h2 className="text-2xl font-bold" style={{ color: themeStyles.primary }}>
        Our Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Livestock Feed', 'Pet Supplies', 'Farm Equipment'].map((product, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
            <div 
              className="w-full h-32 rounded-lg mb-3 flex items-center justify-center"
              style={{ backgroundColor: themeStyles.secondary }}
            >
              <Package className="h-12 w-12" style={{ color: themeStyles.primary }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: themeStyles.primary }}>
              {product}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Quality {product.toLowerCase()} for all your needs
            </p>
            <button 
              className="w-full py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: themeStyles.accent }}
            >
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const AboutPreview = () => (
    <div className="space-y-6" style={{ fontFamily: themeStyles.fontFamily }}>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: themeStyles.primary }}>
          About {storeName}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A family-owned business serving our community with quality products and trusted expertise since 1985.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Users, title: "Expert Team", desc: "Knowledgeable staff ready to help" },
          { icon: Star, title: "Quality Products", desc: "Only the best for your animals" },
          { icon: Truck, title: "Fast Delivery", desc: "Quick and reliable service" }
        ].map((feature, index) => (
          <div key={index} className="text-center p-6 rounded-lg bg-white shadow-sm">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: themeStyles.secondary }}
            >
              <feature.icon className="h-8 w-8" style={{ color: themeStyles.primary }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: themeStyles.primary }}>
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Interactive Preview: {theme.name}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileView(!isMobileView)}
              className="text-xs"
            >
              {isMobileView ? "Desktop" : "Mobile"} View
            </Button>
            <span className="text-sm font-normal text-muted-foreground">
              {theme.style} • {theme.mood}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activePreview} onValueChange={setActivePreview}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="homepage" className="mt-6">
            <div className={`border rounded-lg p-4 bg-gray-50 min-h-96 transition-all ${
              isMobileView ? "max-w-sm mx-auto" : ""
            }`}>
              <HomepagePreview />
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="mt-6">
            <div className={`border rounded-lg p-4 bg-gray-50 min-h-96 transition-all ${
              isMobileView ? "max-w-sm mx-auto" : ""
            }`}>
              <ProductsPreview />
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <div className={`border rounded-lg p-4 bg-gray-50 min-h-96 transition-all ${
              isMobileView ? "max-w-sm mx-auto" : ""
            }`}>
              <AboutPreview />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Why this works:</strong> {theme.reasoning}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{theme.style}</Badge>
            <Badge variant="outline">{theme.mood}</Badge>
            <Badge variant="outline" style={{ fontFamily: themeStyles.fontFamily }}>
              {theme.fontFamily}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 border rounded">
              <div 
                className="w-4 h-4 rounded mx-auto mb-1"
                style={{ backgroundColor: themeStyles.primary }}
              />
              <span>Primary</span>
            </div>
            <div className="text-center p-2 border rounded">
              <div 
                className="w-4 h-4 rounded mx-auto mb-1"
                style={{ backgroundColor: themeStyles.secondary }}
              />
              <span>Secondary</span>
            </div>
            <div className="text-center p-2 border rounded">
              <div 
                className="w-4 h-4 rounded mx-auto mb-1"
                style={{ backgroundColor: themeStyles.accent }}
              />
              <span>Accent</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}