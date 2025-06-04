import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings, Package, Save, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { StoreSettings, ProductCategory, SpecialService, FeaturedBrand } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();

  // Store Settings
  const { data: settings } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
  });

  // Product Categories
  const { data: categories = [] } = useQuery<ProductCategory[]>({
    queryKey: ["/api/product-categories"],
  });

  // Special Services
  const { data: services = [] } = useQuery<SpecialService[]>({
    queryKey: ["/api/special-services"],
  });

  // Featured Brands
  const { data: brands = [] } = useQuery<FeaturedBrand[]>({
    queryKey: ["/api/featured-brands"],
  });

  const [storeForm, setStoreForm] = useState({
    storeName: "",
    tagline: "",
    address: "",
    phone: "",
    email: "",
    mondayHours: "",
    tuesdayHours: "",
    wednesdayHours: "",
    thursdayHours: "",
    fridayHours: "",
    saturdayHours: "",
    sundayHours: "",
    aboutTitle: "",
    aboutDescription: "",
    aboutStory: "",
    foundedYear: "",
    logoUrl: "",
    faviconUrl: "",
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    imageUrl: "",
    featured: false,
    sortOrder: 0,
  });

  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  // Initialize form when settings load
  useEffect(() => {
    if (settings) {
      setStoreForm({
        storeName: settings.storeName || "",
        tagline: settings.tagline || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
        mondayHours: settings.mondayHours || "",
        tuesdayHours: settings.tuesdayHours || "",
        wednesdayHours: settings.wednesdayHours || "",
        thursdayHours: settings.thursdayHours || "",
        fridayHours: settings.fridayHours || "",
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

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/store-settings", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-settings"] });
      toast({
        title: "Success",
        description: "Store settings updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update store settings.",
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/product-categories", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to create category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      setNewCategory({ name: "", description: "", imageUrl: "", featured: false, sortOrder: 0 });
      toast({
        title: "Success",
        description: "Category created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to create category.",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/product-categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      setEditingCategory(null);
      setNewCategory({ name: "", description: "", imageUrl: "", featured: false, sortOrder: 0 });
      toast({
        title: "Success",
        description: "Category updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update category.",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/product-categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive",
      });
    },
  });

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(storeForm);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: newCategory });
    } else {
      createCategoryMutation.mutate(newCategory);
    }
  };

  const handleCategoryUpdate = (category: ProductCategory) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      featured: category.featured,
      sortOrder: category.sortOrder,
    });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategory({ name: "", description: "", imageUrl: "", featured: false, sortOrder: 0 });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-muted-foreground">Manage your store content and settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="store" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Store Settings</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger value="brands" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Brands</span>
            </TabsTrigger>
          </TabsList>

          {/* Store Settings Tab */}
          <TabsContent value="store" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Store Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStoreSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Store Name</label>
                      <Input
                        value={storeForm.storeName}
                        onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                        placeholder="Enter store name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tagline</label>
                      <Input
                        value={storeForm.tagline}
                        onChange={(e) => setStoreForm({ ...storeForm, tagline: e.target.value })}
                        placeholder="Enter tagline"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <Input
                        value={storeForm.address}
                        onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                        placeholder="Enter address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={storeForm.phone}
                        onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={storeForm.email}
                        onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Founded Year</label>
                      <Input
                        value={storeForm.foundedYear}
                        onChange={(e) => setStoreForm({ ...storeForm, foundedYear: e.target.value })}
                        placeholder="Enter founded year"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Hours of Operation</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Monday</label>
                        <Input
                          value={storeForm.mondayHours}
                          onChange={(e) => setStoreForm({ ...storeForm, mondayHours: e.target.value })}
                          placeholder="e.g., 8:00 AM - 6:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tuesday</label>
                        <Input
                          value={storeForm.tuesdayHours}
                          onChange={(e) => setStoreForm({ ...storeForm, tuesdayHours: e.target.value })}
                          placeholder="e.g., 8:00 AM - 6:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Wednesday</label>
                        <Input
                          value={storeForm.wednesdayHours}
                          onChange={(e) => setStoreForm({ ...storeForm, wednesdayHours: e.target.value })}
                          placeholder="e.g., 8:00 AM - 6:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Thursday</label>
                        <Input
                          value={storeForm.thursdayHours}
                          onChange={(e) => setStoreForm({ ...storeForm, thursdayHours: e.target.value })}
                          placeholder="e.g., 8:00 AM - 6:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Friday</label>
                        <Input
                          value={storeForm.fridayHours}
                          onChange={(e) => setStoreForm({ ...storeForm, fridayHours: e.target.value })}
                          placeholder="e.g., 8:00 AM - 6:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Saturday</label>
                        <Input
                          value={storeForm.saturdayHours}
                          onChange={(e) => setStoreForm({ ...storeForm, saturdayHours: e.target.value })}
                          placeholder="e.g., 8:00 AM - 5:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Sunday</label>
                        <Input
                          value={storeForm.sundayHours}
                          onChange={(e) => setStoreForm({ ...storeForm, sundayHours: e.target.value })}
                          placeholder="e.g., Closed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">About Section</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2">About Title</label>
                      <Input
                        value={storeForm.aboutTitle}
                        onChange={(e) => setStoreForm({ ...storeForm, aboutTitle: e.target.value })}
                        placeholder="Enter about title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">About Description</label>
                      <Textarea
                        value={storeForm.aboutDescription}
                        onChange={(e) => setStoreForm({ ...storeForm, aboutDescription: e.target.value })}
                        placeholder="Enter about description"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">About Story</label>
                      <Textarea
                        value={storeForm.aboutStory}
                        onChange={(e) => setStoreForm({ ...storeForm, aboutStory: e.target.value })}
                        placeholder="Enter your story"
                        rows={6}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={updateSettingsMutation.isPending} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {updateSettingsMutation.isPending ? "Saving..." : "Save Store Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>{editingCategory ? "Edit Category" : "Add New Category"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category Name</label>
                      <Input
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="Enter category name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL</label>
                      <Input
                        value={newCategory.imageUrl}
                        onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Enter category description"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                      <Plus className="h-4 w-4 mr-2" />
                      {editingCategory ? "Update Category" : "Add Category"}
                    </Button>
                    {editingCategory && (
                      <Button type="button" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Categories ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        {category.featured && (
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCategoryUpdate(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                          disabled={deleteCategoryMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Special Services ({services.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        {service.featured && (
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brands Tab */}
          <TabsContent value="brands" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Brands ({brands.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{brand.name}</h3>
                        <p className="text-sm text-muted-foreground">{brand.description}</p>
                        {brand.featured && (
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
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