import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Palette, Sparkles } from "lucide-react";
import ThemePreviewSimulator from "./ThemePreviewSimulator";
import StockPhotoSelector from "./StockPhotoSelector";
import type { StoreSettings, ThemeOption, ThemeGenerationResult } from "@shared/schema";

const businessDescriptionSchema = z.object({
  description: z.string().min(10, "Please provide at least 10 characters describing your business")
});

export default function ThemeGenerator() {
  const [generatedThemes, setGeneratedThemes] = useState<ThemeGenerationResult | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<ThemeOption | null>(null);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: storeSettings } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
  });

  const form = useForm<z.infer<typeof businessDescriptionSchema>>({
    resolver: zodResolver(businessDescriptionSchema),
    defaultValues: {
      description: ""
    }
  });

  const generateThemesMutation = useMutation({
    mutationFn: async (data: { description: string }) => {
      const response = await fetch('/api/generate-themes', {
        method: 'POST',
        body: JSON.stringify({ businessDescription: data.description }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate themes');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedThemes(data);
      toast({
        title: "Themes Generated!",
        description: `Created ${data.themes.length} custom theme options for your business.`
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const applyThemeMutation = useMutation({
    mutationFn: async (data: { themeId: string; themes: ThemeOption[]; heroImage?: string }) => {
      const response = await fetch("/api/apply-theme", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply theme');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/store-settings'] });
      toast({
        title: "Theme Applied",
        description: selectedPhoto ? "Theme and hero image updated successfully!" : "Theme applied successfully! Check the home page to see the changes."
      });
      setGeneratedThemes(null);
      setSelectedTheme(null);
      setSelectedPhoto("");
      setShowPhotoSelector(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to Apply Theme",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: z.infer<typeof businessDescriptionSchema>) => {
    generateThemesMutation.mutate(data);
  };

  const handleApplyTheme = () => {
    if (selectedTheme && generatedThemes) {
      applyThemeMutation.mutate({
        themeId: selectedTheme,
        themes: generatedThemes.themes,
        heroImage: selectedPhoto || undefined
      });
    }
  };

  const getColorPreview = (hslColor: string) => {
    return `hsl(${hslColor})`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Theme Generator
          </CardTitle>
          <CardDescription>
            Describe your business and get custom theme recommendations powered by AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="Describe your business in detail. What do you sell? What's your style? Who are your customers? What feeling should your website convey?"
                        className="min-h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={generateThemesMutation.isPending}
                className="w-full"
              >
                {generateThemesMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Themes...
                  </>
                ) : (
                  <>
                    <Palette className="mr-2 h-4 w-4" />
                    Generate Custom Themes
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedThemes && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{generatedThemes.businessAnalysis}</p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            {generatedThemes.themes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`cursor-pointer transition-all ${
                  selectedTheme === theme.id 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{theme.name}</h3>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">Colors & Style</p>
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: getColorPreview(theme.primaryColor) }}
                        title="Primary"
                      />
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: getColorPreview(theme.secondaryColor) }}
                        title="Secondary"
                      />
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: getColorPreview(theme.accentColor) }}
                        title="Accent"
                      />
                      <span className="text-xs ml-2" style={{ fontFamily: theme.fontFamily }}>
                        {theme.fontFamily}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Style & Mood</p>
                    <p className="text-xs text-muted-foreground">{theme.style} • {theme.mood}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Why this works</p>
                    <p className="text-xs text-muted-foreground">{theme.reasoning}</p>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTheme(theme);
                      }}
                    >
                      Interactive Preview
                    </Button>
                    
                    <div 
                      className="border rounded p-3 text-xs"
                      style={{
                        backgroundColor: getColorPreview(theme.secondaryColor),
                        color: getColorPreview(theme.primaryColor),
                        fontFamily: theme.fontFamily
                      }}
                    >
                      <div className="font-bold text-base mb-1" style={{ color: getColorPreview(theme.primaryColor) }}>
                        Quick Preview
                      </div>
                      <div className="text-xs mb-2" style={{ color: getColorPreview(theme.accentColor) }}>
                        {theme.style} • {theme.mood}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTheme && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ready to apply the selected theme to your website?
                </p>
                
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => setShowPhotoSelector(!showPhotoSelector)}
                  >
                    {showPhotoSelector ? "Hide" : "Add"} Photos
                  </Button>
                  
                  <Button 
                    onClick={handleApplyTheme}
                    disabled={applyThemeMutation.isPending}
                    size="lg"
                  >
                    {applyThemeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Applying Theme...
                      </>
                    ) : (
                      "Apply Selected Theme"
                    )}
                  </Button>
                </div>
                
                {selectedPhoto && (
                  <p className="text-xs text-green-600">
                    Photo selected for hero image
                  </p>
                )}
              </div>
              
              <p className="text-xs text-center text-muted-foreground max-w-md">
                This will update your website's colors, fonts, and styling. You can always generate new themes or manually adjust colors in the admin panel.
              </p>
            </div>
          )}

          {previewTheme && storeSettings && (
            <div className="mt-8">
              <ThemePreviewSimulator
                theme={previewTheme}
                storeName={storeSettings.storeName}
                tagline={storeSettings.tagline}
                phone={storeSettings.phone}
              />
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setPreviewTheme(null)}
                >
                  Close Preview
                </Button>
              </div>
            </div>
          )}

          {showPhotoSelector && selectedTheme && (
            <div className="mt-8">
              <StockPhotoSelector
                category="agriculture"
                theme={generatedThemes?.themes.find(t => t.id === selectedTheme)}
                onPhotoSelect={(photoUrl, description) => {
                  setSelectedPhoto(photoUrl);
                }}
                selectedPhoto={selectedPhoto}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}