import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Palette, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const businessDescriptionSchema = z.object({
  description: z.string().min(10, "Please provide a detailed description (at least 10 characters)")
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
      setSelectedTheme(null);
      toast({
        title: "Themes Generated",
        description: "3 custom themes created for your business!"
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
      if (!generatedThemes) throw new Error("No themes available");
      
      const response = await fetch('/api/apply-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          themeId, 
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
        description: "Your website theme has been updated!"
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
            Describe your business and get 3 professionally designed theme options tailored to your brand
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
                        placeholder="Describe your business... For example: 'Family-owned feed store serving rural Texas since 1985. We specialize in livestock feed, farm supplies, and have a rustic, traditional atmosphere. Our customers are ranchers and farmers who value quality and personal service.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include details about your business type, location, target customers, and personality
                    </FormDescription>
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
                    Generate Theme Options
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedThemes && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{generatedThemes.businessAnalysis}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {generatedThemes.themes.map((theme) => (
              <Card 
                key={theme.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTheme === theme.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {theme.name}
                    <Badge variant="outline">{theme.style}</Badge>
                  </CardTitle>
                  <CardDescription>{theme.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Colors</p>
                    <div className="flex gap-2">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: getColorPreview(theme.primaryColor) }}
                        title="Primary"
                      />
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: getColorPreview(theme.secondaryColor) }}
                        title="Secondary"
                      />
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: getColorPreview(theme.accentColor) }}
                        title="Accent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Font</p>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                      {theme.fontFamily}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Mood</p>
                    <p className="text-sm text-muted-foreground">{theme.mood}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Why this works</p>
                    <p className="text-xs text-muted-foreground">{theme.reasoning}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTheme && (
            <div className="flex justify-center">
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
          )}
        </div>
      )}
    </div>
  );
}