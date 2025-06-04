import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { StoreSettings, ProductCategory, SpecialService, FeaturedBrand } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();

  // Queries
  const { data: settings, isLoading } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
  });

  const { data: categories = [] } = useQuery<ProductCategory[]>({
    queryKey: ["/api/product-categories"],
  });

  const { data: services = [] } = useQuery<SpecialService[]>({
    queryKey: ["/api/special-services"],
  });

  const { data: brands = [] } = useQuery<FeaturedBrand[]>({
    queryKey: ["/api/featured-brands"],
  });

  // Store Settings Form State
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
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    fontFamily: "",
    facebookUrl: "",
    instagramUrl: "",
  });

  // Category Form State
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    imageUrl: "",
    featured: false,
    sortOrder: 0,
  });

  // Service Form State
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    icon: "",
    featured: false,
    sortOrder: 0,
  });

  // Brand Form State
  const [newBrand, setNewBrand] = useState({
    name: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    featured: false,
    sortOrder: 0,
  });

  // Edit states
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editingService, setEditingService] = useState<SpecialService | null>(null);
  const [editingBrand, setEditingBrand] = useState<FeaturedBrand | null>(null);

  // Initialize store form when settings load
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
        primaryColor: settings.primaryColor || "",
        secondaryColor: settings.secondaryColor || "",
        accentColor: settings.accentColor || "",
        fontFamily: settings.fontFamily || "",
        facebookUrl: settings.facebookUrl || "",
        instagramUrl: settings.instagramUrl || "",
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
        description: "Product category created successfully.",
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

  const createServiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/special-services", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/special-services"] });
      setNewService({ name: "", description: "", icon: "", featured: false, sortOrder: 0 });
      toast({
        title: "Success",
        description: "Special service created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create service.",
        variant: "destructive",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/special-services/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/special-services"] });
      setEditingService(null);
      toast({
        title: "Success",
        description: "Service updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service.",
        variant: "destructive",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/special-services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/special-services"] });
      toast({
        title: "Success",
        description: "Service deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service.",
        variant: "destructive",
      });
    },
  });

  const createBrandMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/featured-brands", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to create brand");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-brands"] });
      setNewBrand({ name: "", description: "", logoUrl: "", websiteUrl: "", featured: false, sortOrder: 0 });
      toast({
        title: "Success",
        description: "Featured brand created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create brand.",
        variant: "destructive",
      });
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/featured-brands/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update brand");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-brands"] });
      setEditingBrand(null);
      toast({
        title: "Success",
        description: "Brand updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update brand.",
        variant: "destructive",
      });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/featured-brands/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete brand");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-brands"] });
      toast({
        title: "Success",
        description: "Brand deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete brand.",
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

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, data: newService });
    } else {
      createServiceMutation.mutate(newService);
    }
  };

  const handleBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateBrandMutation.mutate({ id: editingBrand.id, data: newBrand });
    } else {
      createBrandMutation.mutate(newBrand);
    }
  };

  const startEditingCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      featured: category.featured,
      sortOrder: category.sortOrder,
    });
  };

  const startEditingService = (service: SpecialService) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      icon: service.icon,
      featured: service.featured,
      sortOrder: service.sortOrder,
    });
  };

  const startEditingBrand = (brand: FeaturedBrand) => {
    setEditingBrand(brand);
    setNewBrand({
      name: brand.name,
      description: brand.description,
      logoUrl: brand.logoUrl,
      websiteUrl: brand.websiteUrl || "",
      featured: brand.featured,
      sortOrder: brand.sortOrder,
    });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditingService(null);
    setEditingBrand(null);
    setNewCategory({ name: "", description: "", imageUrl: "", featured: false, sortOrder: 0 });
    setNewService({ name: "", description: "", icon: "", featured: false, sortOrder: 0 });
    setNewBrand({ name: "", description: "", logoUrl: "", websiteUrl: "", featured: false, sortOrder: 0 });
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
        <p className="text-muted-foreground">Comprehensive site content management</p>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store">Store Settings</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic store details and branding</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStoreSubmit} className="space-y-6">
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
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={storeForm.email}
                      onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      value={storeForm.foundedYear}
                      onChange={(e) => setStoreForm({ ...storeForm, foundedYear: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Hours of Operation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mondayHours">Monday</Label>
                      <Input
                        id="mondayHours"
                        value={storeForm.mondayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, mondayHours: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tuesdayHours">Tuesday</Label>
                      <Input
                        id="tuesdayHours"
                        value={storeForm.tuesdayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, tuesdayHours: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="wednesdayHours">Wednesday</Label>
                      <Input
                        id="wednesdayHours"
                        value={storeForm.wednesdayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, wednesdayHours: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="thursdayHours">Thursday</Label>
                      <Input
                        id="thursdayHours"
                        value={storeForm.thursdayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, thursdayHours: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fridayHours">Friday</Label>
                      <Input
                        id="fridayHours"
                        value={storeForm.fridayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, fridayHours: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="saturdayHours">Saturday</Label>
                      <Input
                        id="saturdayHours"
                        value={storeForm.saturdayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, saturdayHours: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sundayHours">Sunday</Label>
                      <Input
                        id="sundayHours"
                        value={storeForm.sundayHours}
                        onChange={(e) => setStoreForm({ ...storeForm, sundayHours: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About Section</h3>
                  <div>
                    <Label htmlFor="aboutTitle">About Title</Label>
                    <Input
                      id="aboutTitle"
                      value={storeForm.aboutTitle}
                      onChange={(e) => setStoreForm({ ...storeForm, aboutTitle: e.target.value })}
                    />
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
                  <div>
                    <Label htmlFor="aboutStory">About Story</Label>
                    <Textarea
                      id="aboutStory"
                      value={storeForm.aboutStory}
                      onChange={(e) => setStoreForm({ ...storeForm, aboutStory: e.target.value })}
                      rows={6}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Branding & Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        value={storeForm.logoUrl}
                        onChange={(e) => setStoreForm({ ...storeForm, logoUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="faviconUrl">Favicon URL</Label>
                      <Input
                        id="faviconUrl"
                        value={storeForm.faviconUrl}
                        onChange={(e) => setStoreForm({ ...storeForm, faviconUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Theme Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <Input
                        id="primaryColor"
                        value={storeForm.primaryColor}
                        onChange={(e) => setStoreForm({ ...storeForm, primaryColor: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <Input
                        id="secondaryColor"
                        value={storeForm.secondaryColor}
                        onChange={(e) => setStoreForm({ ...storeForm, secondaryColor: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <Input
                        id="accentColor"
                        value={storeForm.accentColor}
                        onChange={(e) => setStoreForm({ ...storeForm, accentColor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebookUrl">Facebook URL</Label>
                      <Input
                        id="facebookUrl"
                        value={storeForm.facebookUrl}
                        onChange={(e) => setStoreForm({ ...storeForm, facebookUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagramUrl">Instagram URL</Label>
                      <Input
                        id="instagramUrl"
                        value={storeForm.instagramUrl}
                        onChange={(e) => setStoreForm({ ...storeForm, instagramUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={updateSettingsMutation.isPending}
                  className="w-full"
                >
                  {updateSettingsMutation.isPending ? "Updating..." : "Update Store Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
              <CardDescription>Manage product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="categoryFeatured"
                      checked={newCategory.featured}
                      onCheckedChange={(checked) => setNewCategory({ ...newCategory, featured: !!checked })}
                    />
                    <Label htmlFor="categoryFeatured">Featured</Label>
                  </div>
                  <div>
                    <Label htmlFor="categorySortOrder">Sort Order</Label>
                    <Input
                      id="categorySortOrder"
                      type="number"
                      value={newCategory.sortOrder}
                      onChange={(e) => setNewCategory({ ...newCategory, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  >
                    {editingCategory ? "Update Category" : "Create Category"}
                  </Button>
                  {editingCategory && (
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <div className="flex gap-2 mt-1">
                        {category.featured && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Order: {category.sortOrder}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingCategory(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                        disabled={deleteCategoryMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingService ? "Edit Service" : "Add New Service"}</CardTitle>
              <CardDescription>Manage special services</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input
                      id="serviceName"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="serviceIcon">Icon</Label>
                    <Input
                      id="serviceIcon"
                      value={newService.icon}
                      onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                      placeholder="e.g., Truck, Wrench, etc."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="serviceDescription">Description</Label>
                  <Textarea
                    id="serviceDescription"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="serviceFeatured"
                      checked={newService.featured}
                      onCheckedChange={(checked) => setNewService({ ...newService, featured: !!checked })}
                    />
                    <Label htmlFor="serviceFeatured">Featured</Label>
                  </div>
                  <div>
                    <Label htmlFor="serviceSortOrder">Sort Order</Label>
                    <Input
                      id="serviceSortOrder"
                      type="number"
                      value={newService.sortOrder}
                      onChange={(e) => setNewService({ ...newService, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                  >
                    {editingService ? "Update Service" : "Create Service"}
                  </Button>
                  {editingService && (
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="flex gap-2 mt-1">
                        {service.featured && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Order: {service.sortOrder}
                        </span>
                        {service.icon && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Icon: {service.icon}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingService(service)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteServiceMutation.mutate(service.id)}
                        disabled={deleteServiceMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingBrand ? "Edit Brand" : "Add New Brand"}</CardTitle>
              <CardDescription>Manage featured brands</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBrandSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brandLogo">Logo URL</Label>
                    <Input
                      id="brandLogo"
                      value={newBrand.logoUrl}
                      onChange={(e) => setNewBrand({ ...newBrand, logoUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brandWebsite">Website URL</Label>
                    <Input
                      id="brandWebsite"
                      value={newBrand.websiteUrl}
                      onChange={(e) => setNewBrand({ ...newBrand, websiteUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="brandDescription">Description</Label>
                  <Textarea
                    id="brandDescription"
                    value={newBrand.description}
                    onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="brandFeatured"
                      checked={newBrand.featured}
                      onCheckedChange={(checked) => setNewBrand({ ...newBrand, featured: !!checked })}
                    />
                    <Label htmlFor="brandFeatured">Featured</Label>
                  </div>
                  <div>
                    <Label htmlFor="brandSortOrder">Sort Order</Label>
                    <Input
                      id="brandSortOrder"
                      type="number"
                      value={newBrand.sortOrder}
                      onChange={(e) => setNewBrand({ ...newBrand, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createBrandMutation.isPending || updateBrandMutation.isPending}
                  >
                    {editingBrand ? "Update Brand" : "Create Brand"}
                  </Button>
                  {editingBrand && (
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Brands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{brand.name}</h4>
                      <p className="text-sm text-muted-foreground">{brand.description}</p>
                      <div className="flex gap-2 mt-1">
                        {brand.featured && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Order: {brand.sortOrder}
                        </span>
                        {brand.websiteUrl && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Has Website
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingBrand(brand)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteBrandMutation.mutate(brand.id)}
                        disabled={deleteBrandMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}