import OpenAI from "openai";
import type { ThemeOption, ThemeGenerationResult } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateThemes(businessDescription: string): Promise<ThemeGenerationResult> {
  try {
    const prompt = `You are an expert brand designer creating website themes for businesses. 

Business Description: "${businessDescription}"

Analyze this business and create 3 distinct theme options that would appeal to their target customers. Each theme should have a different personality but all should be appropriate for the business type.

Consider:
- Industry conventions and customer expectations
- Geographic/regional factors if mentioned
- Business personality (traditional, modern, family-owned, etc.)
- Target demographic
- Competition differentiation

For colors, use HSL format (hue saturation% lightness%) and ensure good contrast and accessibility.

For fonts, choose from these options:
- Inter (modern, clean)
- Merriweather (traditional, readable)
- Poppins (friendly, approachable)  
- Playfair Display (elegant, serif)
- Montserrat (professional, versatile)
- Source Sans Pro (neutral, corporate)

Respond with JSON in this exact format:
{
  "businessAnalysis": "Brief analysis of the business type and target audience",
  "themes": [
    {
      "id": "theme-1",
      "name": "Theme Name",
      "description": "Brief description of this theme's personality",
      "primaryColor": "210 15% 25%",
      "secondaryColor": "45 25% 85%", 
      "accentColor": "25 85% 55%",
      "fontFamily": "Inter",
      "style": "modern",
      "mood": "Professional and trustworthy",
      "reasoning": "Why this theme works for this business"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert brand designer with deep knowledge of color psychology, typography, and industry design trends. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    const result = JSON.parse(content);
    
    // Validate and ensure we have exactly 3 themes
    if (!result.themes || result.themes.length !== 3) {
      throw new Error("Expected exactly 3 themes in response");
    }

    // Add IDs if missing
    result.themes.forEach((theme: any, index: number) => {
      if (!theme.id) {
        theme.id = `theme-${index + 1}`;
      }
    });

    return result as ThemeGenerationResult;

  } catch (error) {
    console.error("Theme generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error("Failed to generate themes: " + errorMessage);
  }
}

function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(' ').map((val, index) => {
    if (index === 0) return parseInt(val);
    return parseInt(val.replace('%', '')) / 100;
  });
  
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function applyThemeToStoreSettings(theme: ThemeOption, storeSettings: any) {
  return {
    ...storeSettings,
    primaryColor: hslToHex(theme.primaryColor),
    secondaryColor: hslToHex(theme.secondaryColor), 
    accentColor: hslToHex(theme.accentColor),
    fontFamily: theme.fontFamily
  };
}