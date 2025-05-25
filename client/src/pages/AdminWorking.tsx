import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, Package, Save, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import type { StoreSettings, ProductCategory, InsertStoreSettings, InsertProductCategory } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();

  // Store Settings
  const { data: settings } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
  });

  // Product Categories
  const { data: categories = [] } = useQuery<ProductCategory[]>({
    queryKey: ["/api/product-categories"],
  });

  const [storeForm, setStoreForm] = useState<InsertStoreSettings>({
    storeName: settings?.storeName || "",
    tagline: settings?.tagline || "",
    address: settings?.address || "",
    phone: settings?.phone || "",
    email: settings?.email || "",
    mondayFridayHours: settings?.mondayFridayHours || "",
    saturdayHours: settings?.saturdayHours || "",
    sundayHours: settings?.sundayHours || "",
    aboutTitle: settings?.aboutTitle || "",
    aboutDescription: settings?.aboutDescription || "",
    aboutStory: settings?.aboutStory || "",
    foundedYear: settings?.foundedYear || "",
    logoUrl: settings?.logoUrl || "",
    faviconUrl: settings?.faviconUrl || "",
  });

  const [newCategory, setNewCategory] = useState<InsertProductCategory>({
    title: "",
    description: "",
    items: [],
    imageUrl: "",
  });

  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: InsertStoreSettings) => {
      return await apiRequest("/api/store-settings", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-settings"] });
      toast({
        title: "Settings Updated",
        description: "Store settings including logo have been saved successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProductCategory }) => {
      return await apiRequest(`/api/product-categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      setEditingCategory(null);
      toast({
        title: "Category Updated",
        description: "Product category has been updated successfully!",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertProductCategory) => {
      return await apiRequest("/api/product-categories", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      setNewCategory({ title: "", description: "", items: [], imageUrl: "" });
      toast({
        title: "Category Created",
        description: "New product category has been created successfully!",
      });
    },
  });

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      setStoreForm({
        storeName: settings.storeName || "",
        tagline: settings.tagline || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
        mondayFridayHours: settings.mondayFridayHours || "",
        saturdayHours: settings.saturdayHours || "",
        sundayHours: settings.sundayHours || "",
        aboutTitle: settings.aboutTitle || "",
        aboutDescription: settings.aboutDescription || "",
        aboutStory: settings.aboutStory || "",
        foundedYear: settings.foundedYear || "",
        logoUrl: settings.logoUrl || "",
        faviconUrl: settings.faviconUrl || "",
      });
    }
  }, [settings]);

  const handleCategoryUpdate = (category: ProductCategory) => {
    updateCategoryMutation.mutate({
      id: category.id,
      data: {
        title: category.title,
        description: category.description,
        items: category.items,
        imageUrl: category.imageUrl,
      },
    });
  };

  // Show login screen if not authenticated
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-saddle-brown mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store information and product categories</p>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="store" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Store Settings</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Product Categories</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <p className="text-gray-600">Update your store details and branding</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Logo and Favicon Upload - NEW FEATURE! */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-800">🎨 Business Logo URL</label>
                      <Input
                        type="url"
                        value={storeForm.logoUrl || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="border-blue-300"
                      />
                      {storeForm.logoUrl && (
                        <img src={storeForm.logoUrl} alt="Logo preview" className="mt-2 w-16 h-16 object-contain border rounded bg-white" />
                      )}
                      <p className="text-xs text-blue-600 mt-1">Displays in navigation bar</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-800">🔷 Favicon URL</label>
                      <Input
                        type="url"
                        value={storeForm.faviconUrl || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, faviconUrl: e.target.value })}
                        placeholder="https://example.com/favicon.ico"
                        className="border-blue-300"
                      />
                      {storeForm.faviconUrl && (
                        <img src={storeForm.faviconUrl} alt="Favicon preview" className="mt-2 w-8 h-8 object-contain border rounded bg-white" />
                      )}
                      <p className="text-xs text-blue-600 mt-1">Shows in browser tab</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Store Name</label>
                      <Input
                        value={storeForm.storeName}
                        onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tagline</label>
                      <Input
                        value={storeForm.tagline}
                        onChange={(e) => setStoreForm({ ...storeForm, tagline: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => updateSettingsMutation.mutate(storeForm)}
                    disabled={updateSettingsMutation.isPending}
                    className="bg-chocolate-orange hover:bg-orange-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateSettingsMutation.isPending ? "Saving..." : "Save Store Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <p className="text-gray-600">Manage your product categories and services</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category) => (
                    <Card key={category.id} className="border-l-4 border-l-chocolate-orange">
                      <CardHeader>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <p className="text-gray-600">{category.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Items:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {category.items.map((item, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-chocolate-orange rounded-full mr-2"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}