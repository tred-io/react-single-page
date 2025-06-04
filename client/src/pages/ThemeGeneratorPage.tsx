import ThemeGenerator from "@/components/ThemeGeneratorSimple";

export default function ThemeGeneratorPage() {
  return (
    <div className="min-h-screen bg-sage-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-chocolate-brown mb-2">AI Theme Generator</h1>
          <p className="text-gray-600">Generate professional themes tailored to your business</p>
        </div>
        
        <ThemeGenerator />
      </div>
    </div>
  );
}