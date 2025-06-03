import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Palette, Sparkles } from "lucide-react";

const businessDescriptionSchema = z.object({
  description: z.string().min(10, "Please provide at least 10 characters describing your business")
});

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  style: string;
  mood: string;
  reasoning: string;
}

interface ThemeGenerationResult {
  businessAnalysis: string;
  themes: ThemeOption[];
}

export default function ThemeGenerator() {
  const [generatedThemes, setGeneratedThemes] = useState<ThemeGenerationResult | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof businessDescriptionSchema>>({
    resolver: zodResolver(businessDescriptionSchema),
    defaultValues: {
      description: ""
    }
  });

  const generateThemesMutation = useMutation({
    mutationFn: async (data: { description: string }): Promise<ThemeGenerationResult> => {
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
    onSuccess: (data: ThemeGenerationResult) => {
      setGeneratedThemes(data);
      toast({
        title: "Themes Generated!",
        description: `Created ${data.themes.length} custom theme options for your business.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const applyThemeMutation = useMutation({
    mutationFn: async (themeId: string) => {
      if (!generatedThemes) {
        throw new Error('No themes available');
      }
      
      const response = await fetch("/api/apply-theme", {
        method: "POST",
        body: JSON.stringify({ 
          themeId: themeId,
          themes: generatedThemes.themes 
        }),
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
        description: "Your website theme has been updated! Check the home page to see the changes."
      });
      setGeneratedThemes(null);
      setSelectedTheme(null);
      form.reset();
    },
    onError: (error: Error) => {
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
    if (selectedTheme) {
      applyThemeMutation.mutate(selectedTheme);
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

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Preview</p>
                    <div 
                      className="border rounded p-3 text-xs"
                      style={{
                        backgroundColor: getColorPreview(theme.secondaryColor),
                        color: getColorPreview(theme.primaryColor),
                        fontFamily: theme.fontFamily
                      }}
                    >
                      <div className="font-bold text-base mb-1" style={{ color: getColorPreview(theme.primaryColor) }}>
                        Your Store Name
                      </div>
                      <div className="text-xs mb-2" style={{ color: getColorPreview(theme.accentColor) }}>
                        Quality products since 1985
                      </div>
                      <div className="text-xs">
                        Welcome to our store! We provide excellent service...
                      </div>
                      <div 
                        className="inline-block mt-2 px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: getColorPreview(theme.accentColor),
                          color: 'white'
                        }}
                      >
                        Shop Now
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTheme && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Ready to apply the selected theme to your website?
                </p>
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
              <p className="text-xs text-center text-muted-foreground max-w-md">
                This will update your website's colors, fonts, and styling. You can always generate new themes or manually adjust colors in the admin panel.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}