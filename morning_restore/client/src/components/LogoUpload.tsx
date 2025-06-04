import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface LogoUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  label: string;
}

export default function LogoUpload({ currentUrl, onUpload, label }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const handleUrlInput = (url: string) => {
    setPreview(url);
    onUpload(url);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">Enter image URL for {label.toLowerCase()}</p>
        </div>
      )}

      <input
        type="url"
        placeholder="https://example.com/logo.png"
        className="w-full p-2 border rounded-md"
        onChange={(e) => handleUrlInput(e.target.value)}
        value={preview || ''}
      />
      
      <p className="text-xs text-gray-500">
        Enter a URL to an image (JPG, PNG, SVG)
      </p>
    </div>
  );
}