import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, Package, Save, Plus, Trash2, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import FileUpload from "@/components/FileUpload";
import type { StoreSettings, ProductCategory, InsertStoreSettings, InsertProductCategory } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();

  // Store Settings
  const { data: settings } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
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

  const storeSettingsMutation = useMutation({
    mutationFn: async (data: InsertStoreSettings) => {
      const response = await apiRequest("PUT", "/api/store-settings", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated!",
        description: "Store settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/store-settings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update store settings.",
        variant: "destructive",
      });
    },
  });

  // Product Categories
  const { data: categories = [] } = useQuery<ProductCategory[]>({
    queryKey: ["/api/product-categories"],
  });

  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [newCategory, setNewCategory] = useState<InsertProductCategory>({
    title: "",
    description: "",
    imageUrl: "",
    items: [],
    displayOrder: categories.length + 1,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProductCategory }) => {
      const response = await apiRequest("PUT", `/api/product-categories/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Category Updated!",
        description: "Product category has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      setEditingCategory(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product category.",
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertProductCategory) => {
      const response = await apiRequest("POST", "/api/product-categories", data);
      const contentType = response.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Server returned non-JSON response. Please check server logs.");
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to create category");
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Category Created!",
        description: "New product category has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      setNewCategory({
        title: "",
        description: "",
        imageUrl: "",
        items: [],
        displayOrder: categories.length + 2,
      });
    },
    onError: (error: any) => {
      console.error("Category creation error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create product category.",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/product-categories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Category Deleted!",
        description: "Product category has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product category.",
        variant: "destructive",
      });
    },
  });

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storeSettingsMutation.mutate(storeForm);
  };

  const handleCategoryUpdate = (category: ProductCategory) => {
    const { id, ...data } = category;
    updateCategoryMutation.mutate({ id, data });
  };

  const handleCategoryCreate = () => {
    // Validate required fields before submitting
    if (!newCategory.title.trim() || !newCategory.description.trim() || !newCategory.imageUrl.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, description, and image URL.",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure items array is not empty
    const categoryData = {
      ...newCategory,
      items: newCategory.items.length > 0 ? newCategory.items : ["Coming Soon"]
    };
    
    createCategoryMutation.mutate(categoryData);
  };

  const handleCategoryDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  // Update form when settings load
  if (settings && storeForm.storeName === "") {
    setStoreForm({
      storeName: settings.storeName,
      tagline: settings.tagline,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      mondayFridayHours: settings.mondayFridayHours,
      saturdayHours: settings.saturdayHours,
      sundayHours: settings.sundayHours,
      aboutTitle: settings.aboutTitle,
      aboutDescription: settings.aboutDescription,
      aboutStory: settings.aboutStory,
      foundedYear: settings.foundedYear,
    });
  }

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
              <FileText className="h-4 w-4" />
              <span>Custom Pages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStoreSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Store Name</label>
                      <Input
                        value={storeForm.storeName}
                        onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                        required
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <Input
                      value={storeForm.tagline}
                      onChange={(e) => setStoreForm({ ...storeForm, tagline: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={storeForm.phone}
                        onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                      <Input
                        type="email"
                        value={storeForm.email || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <Input
                        value={storeForm.address}
                        onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUpload
                      label="Business Logo"
                      accept=".jpg,.jpeg,.png,.svg"
                      currentUrl={storeForm.logoUrl}
                      onUpload={(url) => setStoreForm({ ...storeForm, logoUrl: url })}
                      maxSize={5}
                    />
                    <FileUpload
                      label="Favicon"
                      accept=".ico,.png,.svg"
                      currentUrl={storeForm.faviconUrl}
                      onUpload={(url) => setStoreForm({ ...storeForm, faviconUrl: url })}
                      maxSize={2}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={storeSettingsMutation.isPending}
                    className="bg-chocolate-orange hover:bg-orange-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {storeSettingsMutation.isPending ? "Saving..." : "Save Store Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-6">
              {/* Existing Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {category.title}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategoryDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={category.imageUrl}
                        alt={category.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <div className="text-xs text-gray-500">
                        Items: {category.items.join(", ")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add New Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5" />
                    Add New Product Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={newCategory.title}
                        onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                        placeholder="e.g., Livestock Feed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL</label>
                      <Input
                        value={newCategory.imageUrl}
                        onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      rows={3}
                      placeholder="Brief description of this product category"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Items (comma-separated)</label>
                    <Textarea
                      value={newCategory.items.join(", ")}
                      onChange={(e) => setNewCategory({ ...newCategory, items: e.target.value.split(", ").filter(item => item.trim()) })}
                      rows={2}
                      placeholder="Item 1, Item 2, Item 3"
                    />
                  </div>
                  <Button
                    onClick={handleCategoryCreate}
                    disabled={createCategoryMutation.isPending || !newCategory.title.trim() || !newCategory.description.trim()}
                    className="bg-chocolate-orange hover:bg-orange-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Category: {editingCategory.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={editingCategory.title}
                      onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <Input
                      value={editingCategory.imageUrl}
                      onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                    />
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
          </TabsContent>

        {/* Custom Pages Tab */}
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Custom Pages</CardTitle>
              <p className="text-gray-600">Create additional pages like FAQ, Services, Policies, etc.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Manage Pages</h3>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      // Add page creation logic here
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Page
                  </Button>
                </div>

                {/* Page creation form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium mb-4">Create New Page</h4>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Page Title</label>
                      <Input placeholder="e.g. FAQ, Privacy Policy, Services" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">URL Slug</label>
                      <Input placeholder="e.g. faq, privacy-policy, services" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Page Content</label>
                      <Textarea 
                        placeholder="Write your page content here..." 
                        rows={8}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Show in navigation menu</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Published</span>
                      </label>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 w-fit">
                      Create Page
                    </Button>
                  </div>
                </div>

                {/* Placeholder for existing pages list */}
                <div>
                  <h4 className="font-medium mb-3">Existing Pages</h4>
                  <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    No custom pages created yet. Create your first page above!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}