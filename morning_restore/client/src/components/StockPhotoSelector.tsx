import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Check, RefreshCw, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UnsplashPhoto {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  tags?: { title: string }[];
}

interface StockPhotoSelectorProps {
  category?: string;
  theme?: {
    style: string;
    mood: string;
  };
  onPhotoSelect: (photoUrl: string, description: string) => void;
  selectedPhoto?: string;
}

const BUSINESS_CATEGORIES = [
  { id: "agriculture", label: "Agriculture & Farming", keywords: "farm,agriculture,livestock,feed,barn,rural" },
  { id: "store", label: "Retail Store", keywords: "store,shop,retail,business,interior,products" },
  { id: "animals", label: "Animals & Pets", keywords: "animals,pets,livestock,horses,cattle,dogs,cats" },
  { id: "nature", label: "Nature & Outdoor", keywords: "nature,landscape,field,countryside,outdoor" },
  { id: "community", label: "Community & People", keywords: "community,people,family,local,service" },
  { id: "products", label: "Products & Supplies", keywords: "products,supplies,equipment,tools,feed" }
];

export default function StockPhotoSelector({ 
  category = "agriculture", 
  theme,
  onPhotoSelect,
  selectedPhoto 
}: StockPhotoSelectorProps) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(category);
  const { toast } = useToast();

  const searchPhotos = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/stock-photos/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      // Show demo photos if API is not available
      setPhotos(getDemoPhotos(query));
      toast({
        title: "Using Demo Photos",
        description: "Stock photo API not configured. Showing sample images.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDemoPhotos = (query: string): UnsplashPhoto[] => {
    const demoPhotos = [
      {
        id: "farm-1",
        urls: {
          small: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          regular: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          full: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
        },
        alt_description: "Rural farm landscape with green fields",
        description: "Beautiful rural farm landscape",
        user: { name: "Demo User", username: "demo" }
      },
      {
        id: "store-1",
        urls: {
          small: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          regular: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          full: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
        },
        alt_description: "Feed store interior with products",
        description: "Modern feed store interior",
        user: { name: "Demo User", username: "demo" }
      },
      {
        id: "animals-1",
        urls: {
          small: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          regular: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          full: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
        },
        alt_description: "Horses in a pasture",
        description: "Horses grazing in green pasture",
        user: { name: "Demo User", username: "demo" }
      }
    ];
    
    return demoPhotos.filter(photo => 
      photo.alt_description.toLowerCase().includes(query.toLowerCase()) ||
      photo.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    const categoryData = BUSINESS_CATEGORIES.find(cat => cat.id === activeCategory);
    if (categoryData) {
      searchPhotos(categoryData.keywords);
    }
  }, [activeCategory]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchPhotos(searchQuery);
    }
  };

  const handlePhotoSelect = (photo: UnsplashPhoto) => {
    onPhotoSelect(photo.urls.regular, photo.alt_description || photo.description);
    toast({
      title: "Photo Selected",
      description: `Selected: ${photo.alt_description || photo.description}`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Stock Photo Selection
          {theme && (
            <div className="flex gap-2 ml-auto">
              <Badge variant="secondary">{theme.style}</Badge>
              <Badge variant="outline">{theme.mood}</Badge>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <Input
            placeholder="Search for specific photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {BUSINESS_CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.label.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-video bg-gray-200 rounded-lg animate-pulse"
              />
            ))
          ) : (
            photos.map((photo) => (
              <div
                key={photo.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedPhoto === photo.urls.regular
                    ? 'border-primary shadow-lg'
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => handlePhotoSelect(photo)}
              >
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description || photo.description}
                  className="w-full aspect-video object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {selectedPhoto === photo.urls.regular ? (
                      <Check className="h-8 w-8 text-white" />
                    ) : (
                      <Download className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>
                
                {/* Photo Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-white text-xs truncate">
                    {photo.alt_description || photo.description}
                  </p>
                  <p className="text-white text-xs opacity-75">
                    by {photo.user.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {photos.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No photos found. Try a different search term.</p>
          </div>
        )}

        {/* Theme Suggestions */}
        {theme && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> For a {theme.style} and {theme.mood} theme, consider photos with 
              {theme.style === 'rustic' ? ' natural textures and warm lighting' : 
               theme.style === 'modern' ? ' clean lines and contemporary elements' :
               theme.style === 'professional' ? ' polished and business-focused imagery' :
               ' appropriate styling and mood'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}