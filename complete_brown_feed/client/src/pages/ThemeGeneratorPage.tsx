import { useState } from "react";
import { Palette, Download, Eye, ArrowLeft, Sparkles } from "lucide-react";

export default function ThemeGeneratorPage() {
  const [businessDescription, setBusinessDescription] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const predefinedThemes = [
    {
      id: "agricultural-green",
      name: "Agricultural Green",
      description: "Classic farm and feed store theme with earthy green tones",
      primaryColor: "#166534",
      secondaryColor: "#15803d",
      accentColor: "#22c55e",
      preview: "bg-green-700"
    },
    {
      id: "rustic-brown",
      name: "Rustic Brown",
      description: "Warm, traditional colors reminiscent of farm equipment and soil",
      primaryColor: "#92400e",
      secondaryColor: "#b45309",
      accentColor: "#f59e0b",
      preview: "bg-amber-700"
    },
    {
      id: "texas-blue",
      name: "Texas Blue",
      description: "Bold blue theme representing the wide Texas sky",
      primaryColor: "#1e40af",
      secondaryColor: "#2563eb",
      accentColor: "#3b82f6",
      preview: "bg-blue-700"
    },
    {
      id: "barn-red",
      name: "Barn Red",
      description: "Classic red barn colors with warm undertones",
      primaryColor: "#dc2626",
      secondaryColor: "#ef4444",
      accentColor: "#f87171",
      preview: "bg-red-600"
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate theme generation
    setTimeout(() => {
      setIsGenerating(false);
      alert("Custom themes generated! Check the predefined themes below for inspiration.");
    }, 2000);
  };

  const handleApplyTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    alert(`Theme "${predefinedThemes.find(t => t.id === themeId)?.name}" applied! Changes will appear after saving in the admin panel.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Palette className="h-8 w-8 mr-3 text-purple-600" />
                Theme Generator
              </h1>
            </div>
            <div className="flex space-x-4">
              <a href="/admin" className="text-blue-600 hover:underline flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Admin
              </a>
              <a href="/" className="text-blue-600 hover:underline">← Back to Store</a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Theme Generator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                AI Theme Generator
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Describe your business to generate custom themes
              </p>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe your feed store: location, specialty products, target customers, atmosphere you want to create..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleGenerate}
                disabled={!businessDescription.trim() || isGenerating}
                className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Themes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Theme Options */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Available Themes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {predefinedThemes.map((theme) => (
                  <div 
                    key={theme.id} 
                    className={`border rounded-lg p-4 transition-all ${
                      selectedTheme === theme.id 
                        ? "border-purple-500 ring-2 ring-purple-200" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                      <div className={`w-8 h-8 rounded-full ${theme.preview}`}></div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{theme.description}</p>
                    
                    <div className="flex space-x-2 mb-4">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.primaryColor }}
                        title="Primary Color"
                      ></div>
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.secondaryColor }}
                        title="Secondary Color"
                      ></div>
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.accentColor }}
                        title="Accent Color"
                      ></div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApplyTheme(theme.id)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Apply Theme
                      </button>
                      <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to Use the Theme Generator</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>1. Describe your feed store business in the text area</li>
            <li>2. Click "Generate Themes" to create custom options</li>
            <li>3. Browse and preview available themes</li>
            <li>4. Apply your chosen theme to see changes on your store</li>
            <li>5. Fine-tune colors and settings in the Admin panel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
