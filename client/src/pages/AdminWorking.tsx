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
    name: "",
    description: "",
    imageUrl: "",
    featured: false,
    sortOrder: 0
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="store" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Store Settings</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Product Categories</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Page Management</span>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <Input
                        value={storeForm.address}
                        onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={storeForm.phone}
                        onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                      <Input
                        type="email"
                        value={storeForm.email || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Founded Year</label>
                      <Input
                        value={storeForm.foundedYear}
                        onChange={(e) => setStoreForm({ ...storeForm, foundedYear: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Monday-Friday Hours</label>
                      <Input
                        value={storeForm.mondayFridayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, mondayFridayHours: e.target.value })}
                        placeholder="7:00 AM - 6:00 PM"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Saturday Hours</label>
                      <Input
                        value={storeForm.saturdayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, saturdayHours: e.target.value })}
                        placeholder="7:00 AM - 6:00 PM"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Sunday Hours</label>
                      <Input
                        value={storeForm.sundayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, sundayHours: e.target.value })}
                        placeholder="9:00 AM - 4:00 PM"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">About Section Title</label>
                    <Input
                      value={storeForm.aboutTitle}
                      onChange={(e) => setStoreForm({ ...storeForm, aboutTitle: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">About Description</label>
                    <Textarea
                      value={storeForm.aboutDescription}
                      onChange={(e) => setStoreForm({ ...storeForm, aboutDescription: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">About Story</label>
                    <Textarea
                      value={storeForm.aboutStory}
                      onChange={(e) => setStoreForm({ ...storeForm, aboutStory: e.target.value })}
                      rows={5}
                      required
                    />
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
                        {category.imageUrl && (
                          <div className="mb-4">
                            <img 
                              src={category.imageUrl} 
                              alt={category.title} 
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                          </div>
                        )}
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
                            Edit & Manage Image
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Page Management</CardTitle>
                <p className="text-gray-600">Create additional pages like FAQ, Services, Policies, etc.</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium mb-4">Create New Page</h4>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Page Title</label>
                      <Input placeholder="Page Title (e.g., FAQ, Services)" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Page URL Slug</label>
                      <Input placeholder="Page URL slug (e.g., faq, services)" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Page Content</label>
                      <Textarea 
                        placeholder="Write your page content here..." 
                        rows={8}
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 w-fit">
                      Create Page (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Category Modal with Image Management */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Category: {editingCategory.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category Title</label>
                    <Input
                      value={editingCategory.title}
                      onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                    />
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <label className="block text-sm font-medium mb-2 text-green-800">🖼️ Category Image URL</label>
                    <Input
                      type="url"
                      value={editingCategory.imageUrl}
                      onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                      placeholder="https://example.com/category-image.jpg"
                      className="border-green-300"
                    />
                    {editingCategory.imageUrl && (
                      <img 
                        src={editingCategory.imageUrl} 
                        alt="Category preview" 
                        className="mt-2 w-full h-32 object-cover border rounded bg-white"
                      />
                    )}
                    <p className="text-xs text-green-600 mt-1">Displays as category header image</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Items (comma-separated)</label>
                    <Textarea
                      value={editingCategory.items.join(", ")}
                      onChange={(e) => setEditingCategory({ ...editingCategory, items: e.target.value.split(", ").filter(item => item.trim()) })}
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleCategoryUpdate(editingCategory)}
                      disabled={updateCategoryMutation.isPending}
                      className="bg-chocolate-orange hover:bg-orange-600"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {updateCategoryMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}