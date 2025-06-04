import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertStoreSettingsSchema, insertProductCategorySchema, insertSpecialServiceSchema, insertFeaturedBrandSchema, type InsertStoreSettings, type StoreSettings, type ProductCategory, type InsertProductCategory, type SpecialService, type InsertSpecialService, type FeaturedBrand, type InsertFeaturedBrand } from "@shared/schema";

import { Copy, Palette, Plus, Edit2, Trash2, Save, X } from "lucide-react";

const fontOptions = [
  { value: "Inter", label: "Inter (Modern Sans-serif)" },
  { value: "Roboto", label: "Roboto (Clean & Professional)" },
  { value: "Open Sans", label: "Open Sans (Friendly & Readable)" },
  { value: "Lato", label: "Lato (Elegant & Corporate)" },
  { value: "Poppins", label: "Poppins (Modern & Geometric)" },
  { value: "Merriweather", label: "Merriweather (Traditional Serif)" },
  { value: "Playfair Display", label: "Playfair Display (Elegant Serif)" },
  { value: "Source Sans Pro", label: "Source Sans Pro (Professional)" }
];

export default function AdminEnhanced() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editingService, setEditingService] = useState<SpecialService | null>(null);
  const [editingBrand, setEditingBrand] = useState<FeaturedBrand | null>(null);

  const { data: storeSettings, isLoading } = useQuery<StoreSettings>({
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

  const form = useForm<InsertStoreSettings>({
    resolver: zodResolver(insertStoreSettingsSchema),
    defaultValues: {
      storeName: "",
      tagline: "",
      address: "",
      phone: "",
      email: "",
      mondayHours: "8:00 AM - 6:00 PM",
      tuesdayHours: "8:00 AM - 6:00 PM",
      wednesdayHours: "8:00 AM - 6:00 PM",
      thursdayHours: "8:00 AM - 6:00 PM",
      fridayHours: "8:00 AM - 6:00 PM",
      saturdayHours: "8:00 AM - 5:00 PM",
      sundayHours: "Closed",

      heroSubtitle: "",
      aboutTitle: "",
      aboutDescription: "",
      aboutStory: "",
      foundedYear: "",
      logoUrl: "",
      faviconUrl: "",
      heroImageUrl: "",
      aboutImageUrl: "",
      primaryColor: "#8B4513",
      secondaryColor: "#2F4F4F",
      accentColor: "#CD853F",
      fontFamily: "Inter",
      facebookUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      websiteUrl: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: ""
    },
  });

  // Update form when storeSettings data is loaded
  useEffect(() => {
    if (storeSettings) {
      form.reset(storeSettings);
    }
  }, [storeSettings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: InsertStoreSettings) => {
      const res = await apiRequest("PUT", "/api/store-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-settings"] });
      toast({
        title: "Settings updated",
        description: "Your store settings have been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProductCategory }) => {
      const res = await apiRequest("PUT", `/api/product-categories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      setEditingCategory(null);
      toast({
        title: "Category updated",
        description: "Product category has been updated successfully.",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertProductCategory) => {
      const res = await apiRequest("POST", "/api/product-categories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      toast({
        title: "Category created",
        description: "New product category has been created successfully.",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/product-categories/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-categories"] });
      toast({
        title: "Category deleted",
        description: "Product category has been deleted successfully.",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertSpecialService }) => {
      const res = await apiRequest("PUT", `/api/special-services/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/special-services"] });
      setEditingService(null);
      toast({
        title: "Service updated",
        description: "Special service has been updated successfully.",
      });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: InsertSpecialService) => {
      const res = await apiRequest("POST", "/api/special-services", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/special-services"] });
      toast({
        title: "Service created",
        description: "New special service has been created successfully.",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/special-services/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/special-services"] });
      toast({
        title: "Service deleted",
        description: "Special service has been deleted successfully.",
      });
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertFeaturedBrand }) => {
      const res = await apiRequest("PUT", `/api/featured-brands/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-brands"] });
      setEditingBrand(null);
      toast({
        title: "Brand updated",
        description: "Featured brand has been updated successfully.",
      });
    },
  });

  const createBrandMutation = useMutation({
    mutationFn: async (data: InsertFeaturedBrand) => {
      const res = await apiRequest("POST", "/api/featured-brands", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-brands"] });
      toast({
        title: "Brand created",
        description: "New featured brand has been created successfully.",
      });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/featured-brands/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-brands"] });
      toast({
        title: "Brand deleted",
        description: "Featured brand has been deleted successfully.",
      });
    },
  });

  const onSubmit = (data: InsertStoreSettings) => {
    updateSettingsMutation.mutate(data);
  };

  const copyHours = (sourceDay: keyof InsertStoreSettings) => {
    const sourceHours = form.getValues(sourceDay as any);
    const days = ['tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours'] as const;
    
    days.forEach(day => {
      form.setValue(day, sourceHours as string);
    });
    
    toast({
      title: "Hours copied",
      description: "Monday hours have been copied to Tuesday through Friday.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chocolate-brown mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-chocolate-brown mb-2">Store Management</h1>
          <p className="text-gray-600">Customize your store settings, branding, and content.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 text-xs">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="hours">Hours</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Essential store details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="storeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your Store Name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tagline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tagline</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your Store Tagline" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="123 Main St, City, State 12345" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(555) 123-4567" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="info@yourstore.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateSettingsMutation.isPending}
                        className="min-w-[120px]"
                      >
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hours" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                    <CardDescription>Set your operating hours for each day of the week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name="mondayHours"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Monday</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="8:00 AM - 6:00 PM" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyHours('mondayHours')}
                          className="mt-6"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Weekdays
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours'].map((day) => (
                          <FormField
                            key={day}
                            control={form.control}
                            name={day as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{day.charAt(0).toUpperCase() + day.slice(1).replace('Hours', '')}</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="8:00 AM - 6:00 PM or Closed" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateSettingsMutation.isPending}
                        className="min-w-[120px]"
                      >
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Section</CardTitle>
                    <CardDescription>Tell your story and showcase your business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="heroTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hero Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Main headline" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="foundedYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Founded Year</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="1967" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="heroSubtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Subtitle</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Supporting headline" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aboutTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="About [Store Name]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aboutDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Brief description of your business" className="min-h-[100px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aboutStory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Story</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Your detailed business story" className="min-h-[150px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateSettingsMutation.isPending}
                        className="min-w-[120px]"
                      >
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Categories</CardTitle>
                    <CardDescription>Manage your product categories and their display</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add New Category */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium mb-4">Add New Category</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="new-category-name">Name</Label>
                            <Input
                              id="new-category-name"
                              placeholder="Category name"
                              onChange={(e) => {
                                // Handle new category creation
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-category-image">Image URL</Label>
                            <Input
                              id="new-category-image"
                              placeholder="https://example.com/image.jpg"
                              onChange={(e) => {
                                // Handle new category creation
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="new-category-description">Description</Label>
                          <Textarea
                            id="new-category-description"
                            placeholder="Category description"
                            className="min-h-[80px]"
                            onChange={(e) => {
                              // Handle new category creation
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="new-category-featured" />
                          <Label htmlFor="new-category-featured">Featured category</Label>
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            createCategoryMutation.mutate({
                              name: "",
                              description: "",
                              imageUrl: "",
                              featured: false,
                              sortOrder: categories.length
                            });
                          }}
                          disabled={createCategoryMutation.isPending}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {createCategoryMutation.isPending ? "Adding..." : "Add Category"}
                        </Button>
                      </div>
                    </div>

                    {/* Existing Categories */}
                    <div className="space-y-4">
                      {categories.map((category) => (
                        <div key={category.id} className="border rounded-lg p-4">
                          {editingCategory?.id === category.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`edit-name-${category.id}`}>Name</Label>
                                  <Input
                                    id={`edit-name-${category.id}`}
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`edit-image-${category.id}`}>Image URL</Label>
                                  <Input
                                    id={`edit-image-${category.id}`}
                                    value={editingCategory.imageUrl}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`edit-description-${category.id}`}>Description</Label>
                                <Textarea
                                  id={`edit-description-${category.id}`}
                                  value={editingCategory.description}
                                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                  className="min-h-[80px]"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`edit-featured-${category.id}`}
                                  checked={editingCategory.featured}
                                  onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, featured: !!checked })}
                                />
                                <Label htmlFor={`edit-featured-${category.id}`}>Featured category</Label>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  onClick={() => updateCategoryMutation.mutate({ id: category.id, data: editingCategory })}
                                  disabled={updateCategoryMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  {updateCategoryMutation.isPending ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditingCategory(null)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">{category.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                {category.featured && (
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingCategory(category)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteCategoryMutation.mutate(category.id)}
                                  disabled={deleteCategoryMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Special Services</CardTitle>
                    <CardDescription>Manage your special services and offerings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add New Service */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium mb-4">Add New Service</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="new-service-name">Name</Label>
                            <Input
                              id="new-service-name"
                              placeholder="Service name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-service-image">Image URL</Label>
                            <Input
                              id="new-service-image"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="new-service-description">Description</Label>
                          <Textarea
                            id="new-service-description"
                            placeholder="Service description"
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="new-service-featured" />
                          <Label htmlFor="new-service-featured">Featured service</Label>
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            createServiceMutation.mutate({
                              name: "",
                              description: "",
                              imageUrl: "",
                              featured: false,
                              sortOrder: services.length
                            });
                          }}
                          disabled={createServiceMutation.isPending}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {createServiceMutation.isPending ? "Adding..." : "Add Service"}
                        </Button>
                      </div>
                    </div>

                    {/* Existing Services */}
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-4">
                          {editingService?.id === service.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`edit-service-name-${service.id}`}>Name</Label>
                                  <Input
                                    id={`edit-service-name-${service.id}`}
                                    value={editingService.name}
                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`edit-service-image-${service.id}`}>Image URL</Label>
                                  <Input
                                    id={`edit-service-image-${service.id}`}
                                    value={editingService.imageUrl}
                                    onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`edit-service-description-${service.id}`}>Description</Label>
                                <Textarea
                                  id={`edit-service-description-${service.id}`}
                                  value={editingService.description}
                                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                  className="min-h-[80px]"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`edit-service-featured-${service.id}`}
                                  checked={editingService.featured}
                                  onCheckedChange={(checked) => setEditingService({ ...editingService, featured: !!checked })}
                                />
                                <Label htmlFor={`edit-service-featured-${service.id}`}>Featured service</Label>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  onClick={() => updateServiceMutation.mutate({ id: service.id, data: editingService })}
                                  disabled={updateServiceMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  {updateServiceMutation.isPending ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditingService(null)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">{service.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                {service.featured && (
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingService(service)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteServiceMutation.mutate(service.id)}
                                  disabled={deleteServiceMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="brands" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Brands</CardTitle>
                    <CardDescription>Manage your featured brands and partnerships</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add New Brand */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium mb-4">Add New Brand</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="new-brand-name">Name</Label>
                            <Input
                              id="new-brand-name"
                              placeholder="Brand name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-brand-image">Image URL</Label>
                            <Input
                              id="new-brand-image"
                              placeholder="https://example.com/logo.jpg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="new-brand-description">Description</Label>
                          <Textarea
                            id="new-brand-description"
                            placeholder="Brand description"
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="new-brand-featured" />
                          <Label htmlFor="new-brand-featured">Featured brand</Label>
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            createBrandMutation.mutate({
                              name: "",
                              description: "",
                              imageUrl: "",
                              featured: false,
                              sortOrder: brands.length
                            });
                          }}
                          disabled={createBrandMutation.isPending}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {createBrandMutation.isPending ? "Adding..." : "Add Brand"}
                        </Button>
                      </div>
                    </div>

                    {/* Existing Brands */}
                    <div className="space-y-4">
                      {brands.map((brand) => (
                        <div key={brand.id} className="border rounded-lg p-4">
                          {editingBrand?.id === brand.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`edit-brand-name-${brand.id}`}>Name</Label>
                                  <Input
                                    id={`edit-brand-name-${brand.id}`}
                                    value={editingBrand.name}
                                    onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`edit-brand-image-${brand.id}`}>Image URL</Label>
                                  <Input
                                    id={`edit-brand-image-${brand.id}`}
                                    value={editingBrand.imageUrl}
                                    onChange={(e) => setEditingBrand({ ...editingBrand, imageUrl: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`edit-brand-description-${brand.id}`}>Description</Label>
                                <Textarea
                                  id={`edit-brand-description-${brand.id}`}
                                  value={editingBrand.description}
                                  onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                                  className="min-h-[80px]"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`edit-brand-featured-${brand.id}`}
                                  checked={editingBrand.featured}
                                  onCheckedChange={(checked) => setEditingBrand({ ...editingBrand, featured: !!checked })}
                                />
                                <Label htmlFor={`edit-brand-featured-${brand.id}`}>Featured brand</Label>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  onClick={() => updateBrandMutation.mutate({ id: brand.id, data: editingBrand })}
                                  disabled={updateBrandMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  {updateBrandMutation.isPending ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditingBrand(null)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">{brand.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{brand.description}</p>
                                {brand.featured && (
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingBrand(brand)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteBrandMutation.mutate(brand.id)}
                                  disabled={deleteBrandMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}