import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { StoreSettings, ProductCategory, SpecialService, FeaturedBrand } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();

  // Store Settings
  const { data: settings, isLoading } = useQuery<StoreSettings>({
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

  const [storeForm, setStoreForm] = useState<InsertStoreSettings>({
    storeName: settings?.storeName || "",
    tagline: settings?.tagline || "",
    address: settings?.address || "",
    phone: settings?.phone || "",
    email: settings?.email || "",
    mondayHours: settings?.mondayHours || "",
    tuesdayHours: settings?.tuesdayHours || "",
    wednesdayHours: settings?.wednesdayHours || "",
    thursdayHours: settings?.thursdayHours || "",
    fridayHours: settings?.fridayHours || "",
    saturdayHours: settings?.saturdayHours || "",
    sundayHours: settings?.sundayHours || "",
    aboutTitle: settings?.aboutTitle || "",
    aboutDescription: settings?.aboutDescription || "",
    aboutStory: settings?.aboutStory || "",
    foundedYear: settings?.foundedYear || "",
    logoUrl: settings?.logoUrl || "",
    faviconUrl: settings?.faviconUrl || "",
    primaryColor: settings?.primaryColor || "",
    secondaryColor: settings?.secondaryColor || "",
    accentColor: settings?.accentColor || "",
    fontFamily: settings?.fontFamily || "",
    facebookUrl: settings?.facebookUrl || "",
    instagramUrl: settings?.instagramUrl || "",
  });

  const [newCategory, setNewCategory] = useState<InsertProductCategory>({
    name: "",
    description: "",
    imageUrl: "",
    featured: false,
    sortOrder: 0
  });

  // Update store settings mutation
  const updateStoreSettingsMutation = useMutation({
    mutationFn: async (data: InsertStoreSettings) => {
      const response = await fetch("/api/store-settings", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update store settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-settings"] });
      toast({
        title: "Settings updated",
        description: "Store settings have been updated successfully.",
      });
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertProductCategory) => {
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
      setNewCategory({
        name: "",
        description: "",
        imageUrl: "",
        featured: false,
        sortOrder: 0
      });
      toast({
        title: "Category created",
        description: "New product category has been created successfully.",
      });
    },
  });

  // Delete category mutation
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
        title: "Category deleted",
        description: "Product category has been deleted successfully.",
      });
    },
  });

  const handleStoreSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettingsMutation.mutate(storeForm);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(newCategory);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your store settings and content</p>
      </div>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStoreSettingsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeForm.storeName}
                  onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={storeForm.tagline}
                  onChange={(e) => setStoreForm({ ...storeForm, tagline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={storeForm.phone}
                  onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="aboutDescription">About Description</Label>
              <Textarea
                id="aboutDescription"
                value={storeForm.aboutDescription}
                onChange={(e) => setStoreForm({ ...storeForm, aboutDescription: e.target.value })}
                rows={4}
              />
            </div>
            <Button 
              type="submit" 
              disabled={updateStoreSettingsMutation.isPending}
            >
              {updateStoreSettingsMutation.isPending ? "Updating..." : "Update Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Product Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>Manage your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Add New Category */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryImage">Image URL</Label>
                    <Input
                      id="categoryImage"
                      value={newCategory.imageUrl}
                      onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                </Button>
              </form>
            </div>

            {/* Existing Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Existing Categories</h3>
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      {category.featured && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                          Featured
                        </span>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCategoryMutation.mutate(category.id)}
                      disabled={deleteCategoryMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-muted-foreground">Special services</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands.length}</div>
            <p className="text-muted-foreground">Featured brands</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}