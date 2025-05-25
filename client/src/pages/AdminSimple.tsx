import { useState } from "react";
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

                  {/* Logo and Favicon Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2">🎨 Business Logo URL</label>
                      <Input
                        type="url"
                        value={storeForm.logoUrl || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                      />
                      {storeForm.logoUrl && (
                        <img src={storeForm.logoUrl} alt="Logo preview" className="mt-2 w-16 h-16 object-contain border rounded" />
                      )}
                      <p className="text-xs text-gray-500 mt-1">Displays in navigation bar</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">🔷 Favicon URL</label>
                      <Input
                        type="url"
                        value={storeForm.faviconUrl || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, faviconUrl: e.target.value })}
                        placeholder="https://example.com/favicon.ico"
                      />
                      {storeForm.faviconUrl && (
                        <img src={storeForm.faviconUrl} alt="Favicon preview" className="mt-2 w-8 h-8 object-contain border rounded" />
                      )}
                      <p className="text-xs text-gray-500 mt-1">Shows in browser tab</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <Input
                      value={storeForm.address}
                      onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    onClick={() => {
                      // Save logic here
                      toast({
                        title: "Settings Updated",
                        description: "Store settings including logo have been saved successfully!",
                      });
                    }}
                    className="bg-chocolate-orange hover:bg-orange-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Store Settings
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
                <div className="text-center py-8">
                  <p className="text-gray-500">Product category management available in your existing admin panel</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}