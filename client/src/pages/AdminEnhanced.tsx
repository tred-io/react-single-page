import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertStoreSettingsSchema, insertProductCategorySchema, insertSpecialServiceSchema, insertFeaturedBrandSchema, type InsertStoreSettings, type StoreSettings, type ProductCategory, type InsertProductCategory, type SpecialService, type InsertSpecialService, type FeaturedBrand, type InsertFeaturedBrand } from "@shared/schema";
import LogoUpload from "@/components/LogoUpload";
import FileUpload from "@/components/FileUpload";
import ThemeGenerator from "@/components/ThemeGenerator";
import { Copy, Palette, Plus, Edit2, Trash2 } from "lucide-react";

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
  const [newCategory, setNewCategory] = useState<InsertProductCategory>({
    title: "",
    description: "",
    imageUrl: "",
    iconName: "",
    items: [],
    displayOrder: 0
  });

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
    defaultValues: storeSettings || {
      storeName: "",
      tagline: "",
      address: "",
      phone: "",
      email: "",
      mondayHours: "7:00 AM - 6:00 PM",
      tuesdayHours: "7:00 AM - 6:00 PM",
      wednesdayHours: "7:00 AM - 6:00 PM",
      thursdayHours: "7:00 AM - 6:00 PM",
      fridayHours: "7:00 AM - 6:00 PM",
      saturdayHours: "7:00 AM - 6:00 PM",
      sundayHours: "9:00 AM - 4:00 PM",
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
      xUrl: "",
      googleUrl: "",
      yelpUrl: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: ""
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: InsertStoreSettings) => {
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
        title: "Category updated",
        description: "Product category has been updated successfully.",
      });
    },
  });

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
        title: "",
        description: "",
        imageUrl: "",
        iconName: "",
        items: [],
        displayOrder: 0
      });
      toast({
        title: "Category created",
        description: "New product category has been created successfully.",
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
        title: "Category deleted",
        description: "Product category has been deleted successfully.",
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
              <TabsList className="grid w-full grid-cols-9 text-xs">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="hours">Hours</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
                <TabsTrigger value="themes">Themes</TabsTrigger>
                <TabsTrigger value="branding">Design</TabsTrigger>
                <TabsTrigger value="social">Social/SEO</TabsTrigger>
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
                                <Input {...field} placeholder="7:00 AM - 6:00 PM" />
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
                        <FormField
                          control={form.control}
                          name="tuesdayHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tuesday</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="7:00 AM - 6:00 PM" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="wednesdayHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wednesday</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="7:00 AM - 6:00 PM" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="thursdayHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thursday</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="7:00 AM - 6:00 PM" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fridayHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Friday</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="7:00 AM - 6:00 PM" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="saturdayHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Saturday</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="7:00 AM - 6:00 PM" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="sundayHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sunday</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="9:00 AM - 4:00 PM" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Section</CardTitle>
                    <CardDescription>Tell your story and showcase what makes your business special</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="aboutTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="About Our Business" />
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
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="A brief overview of your business..."
                              className="min-h-[80px]"
                            />
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
                          <FormLabel>Your Story</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Tell the story of your business, its history, values, and what sets you apart..."
                              className="min-h-[120px]"
                            />
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
                            <Input {...field} placeholder="1985" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Categories</CardTitle>
                    <CardDescription>Manage your product categories and their details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Existing Categories */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Current Categories</h4>
                      {categories.map((category) => (
                        <div key={category.id} className="border rounded-lg p-4">
                          {editingCategory?.id === category.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`edit-title-${category.id}`}>Title</Label>
                                  <Input
                                    id={`edit-title-${category.id}`}
                                    value={editingCategory.title}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`edit-icon-${category.id}`}>Icon Name</Label>
                                  <Input
                                    id={`edit-icon-${category.id}`}
                                    value={editingCategory.iconName}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, iconName: e.target.value })}
                                    placeholder="Heart, Wrench, Beef, etc."
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
                              <div>
                                <Label htmlFor={`edit-items-${category.id}`}>Items (one per line)</Label>
                                <Textarea
                                  id={`edit-items-${category.id}`}
                                  value={editingCategory.items.join('\n')}
                                  onChange={(e) => setEditingCategory({ 
                                    ...editingCategory, 
                                    items: e.target.value.split('\n').filter(item => item.trim()) 
                                  })}
                                  className="min-h-[100px]"
                                />
                              </div>
                              <FileUpload
                                onUpload={(url) => setEditingCategory({ ...editingCategory, imageUrl: url })}
                                currentUrl={editingCategory.imageUrl}
                                label="Category Image"
                                accept="image/*"
                              />
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  onClick={() => updateCategoryMutation.mutate({ id: category.id, data: editingCategory })}
                                  disabled={updateCategoryMutation.isPending}
                                >
                                  {updateCategoryMutation.isPending ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditingCategory(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">{category.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {category.items.length} items • Icon: {category.iconName}
                                </p>
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

                    {/* Add New Category */}
                    <div className="border-t pt-6">
                      <h4 className="font-medium text-gray-900 mb-4">Add New Category</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="new-title">Title</Label>
                            <Input
                              id="new-title"
                              value={newCategory.title}
                              onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                              placeholder="Category name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-icon">Icon Name</Label>
                            <Input
                              id="new-icon"
                              value={newCategory.iconName}
                              onChange={(e) => setNewCategory({ ...newCategory, iconName: e.target.value })}
                              placeholder="Heart, Wrench, Beef, etc."
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="new-description">Description</Label>
                          <Textarea
                            id="new-description"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            placeholder="Describe this category..."
                            className="min-h-[80px]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-items">Items (one per line)</Label>
                          <Textarea
                            id="new-items"
                            value={newCategory.items.join('\n')}
                            onChange={(e) => setNewCategory({ 
                              ...newCategory, 
                              items: e.target.value.split('\n').filter(item => item.trim()) 
                            })}
                            placeholder="Item 1&#10;Item 2&#10;Item 3"
                            className="min-h-[100px]"
                          />
                        </div>
                        <FileUpload
                          onUpload={(url) => setNewCategory({ ...newCategory, imageUrl: url })}
                          currentUrl={newCategory.imageUrl}
                          label="Category Image"
                          accept="image/*"
                        />
                        <Button
                          type="button"
                          onClick={() => createCategoryMutation.mutate({
                            ...newCategory,
                            displayOrder: categories.length + 1
                          })}
                          disabled={createCategoryMutation.isPending}
                          className="bg-chocolate-brown hover:bg-chocolate-brown/90"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {createCategoryMutation.isPending ? "Adding..." : "Add Category"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="branding" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Branding & Design
                    </CardTitle>
                    <CardDescription>Customize your brand colors, fonts, and visual identity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Images & Branding</h4>
                        <div className="space-y-4">
                          <div>
                            <FileUpload
                              currentUrl={form.watch("logoUrl")}
                              onUpload={(url) => form.setValue("logoUrl", url)}
                              label="Business Logo"
                              accept=".jpg,.jpeg,.png,.svg,.webp"
                              maxSize={2}
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 200x80px, appears in navigation</p>
                          </div>
                          
                          <div>
                            <FileUpload
                              currentUrl={form.watch("faviconUrl")}
                              onUpload={(url) => form.setValue("faviconUrl", url)}
                              label="Favicon"
                              accept=".ico,.png,.svg"
                              maxSize={1}
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 32x32px or 16x16px, appears in browser tab</p>
                          </div>
                          
                          <div>
                            <FileUpload
                              currentUrl={form.watch("heroImageUrl")}
                              onUpload={(url) => form.setValue("heroImageUrl", url)}
                              label="Hero Background Image"
                              accept=".jpg,.jpeg,.png,.webp"
                              maxSize={5}
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 1920x600px, appears behind main hero text</p>
                          </div>
                          
                          <div>
                            <FileUpload
                              currentUrl={form.watch("aboutImageUrl")}
                              onUpload={(url) => form.setValue("aboutImageUrl", url)}
                              label="About Section Image"
                              accept=".jpg,.jpeg,.png,.webp"
                              maxSize={5}
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 600x400px, appears in about section</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Colors</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="primaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Color</FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input {...field} type="color" className="w-16 h-10 p-1" />
                                  </FormControl>
                                  <Input 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    placeholder="#8B4513"
                                    className="flex-1"
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="secondaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secondary Color</FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input {...field} type="color" className="w-16 h-10 p-1" />
                                  </FormControl>
                                  <Input 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    placeholder="#2F4F4F"
                                    className="flex-1"
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="accentColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Accent Color</FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input {...field} type="color" className="w-16 h-10 p-1" />
                                  </FormControl>
                                  <Input 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    placeholder="#CD853F"
                                    className="flex-1"
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="fontFamily"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Font Family</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a font" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fontOptions.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Special Services</CardTitle>
                    <CardDescription>Showcase the extra services that set your business apart (max 3 recommended)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Services */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Current Services</h4>
                      {services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-4 flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium">{service.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            <p className="text-xs text-gray-500 mt-2">Icon: {service.iconName}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Set editing state for services
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Delete service
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Service */}
                    <div className="border-t pt-6">
                      <h4 className="font-medium text-gray-900 mb-4">Add New Service</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Service Title</Label>
                            <Input placeholder="Expert Consultation" />
                          </div>
                          <div>
                            <Label>Icon Name</Label>
                            <Input placeholder="Users, Truck, Settings, etc." />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea placeholder="Describe this service..." className="min-h-[80px]" />
                        </div>
                        <Button type="button" className="bg-chocolate-brown hover:bg-chocolate-brown/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Service
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="brands" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Brands</CardTitle>
                    <CardDescription>Showcase the trusted brands you carry</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Brands */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Current Brands</h4>
                      {brands.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No brands added yet</p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {brands.map((brand) => (
                            <div key={brand.id} className="border rounded-lg p-4 text-center">
                              <img 
                                src={brand.logoUrl} 
                                alt={brand.name}
                                className="max-h-12 w-auto mx-auto mb-2"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <p className="text-sm font-medium">{brand.name}</p>
                              <div className="flex gap-1 mt-2 justify-center">
                                <Button variant="outline" size="sm">
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add New Brand */}
                    <div className="border-t pt-6">
                      <h4 className="font-medium text-gray-900 mb-4">Add New Brand</h4>
                      <div className="space-y-4">
                        <div>
                          <Label>Brand Name</Label>
                          <Input placeholder="Brand Name" />
                        </div>
                        <FileUpload
                          onUpload={(url) => {}}
                          currentUrl=""
                          label="Brand Logo"
                          accept="image/*"
                        />
                        <Button type="button" className="bg-chocolate-brown hover:bg-chocolate-brown/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Brand
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="themes" className="space-y-6">
                <div className="space-y-6">
                  <ThemeGenerator />
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Media</CardTitle>
                      <CardDescription>Add your social media profiles (leave empty to hide)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="facebookUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://facebook.com/yourbusiness" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="instagramUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://instagram.com/yourbusiness" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="xUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>X (Twitter) URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://x.com/yourbusiness" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="googleUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Google Business URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://maps.google.com/your-business" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="yelpUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yelp URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://yelp.com/biz/your-business" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Settings</CardTitle>
                      <CardDescription>Optimize your website for search engines</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="seoTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Page Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your Business - Quality Products in Your City" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="seoDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="A compelling description of your business for search results..."
                                className="min-h-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="seoKeywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Keywords</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="keyword1, keyword2, keyword3" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-8">
              <Button 
                type="submit" 
                className="bg-forest-green hover:bg-green-700 text-white font-semibold px-8 py-3 text-base shadow-lg"
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending ? "Saving..." : "Save All Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}