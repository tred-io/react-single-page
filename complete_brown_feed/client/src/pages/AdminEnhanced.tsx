import { useState } from "react";
import { Save, Upload, Eye, Settings, Palette, FileText } from "lucide-react";

export default function AdminEnhanced() {
  const [activeTab, setActiveTab] = useState("store");
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Brown Feed Store",
    tagline: "Your Trusted Agricultural Partner in Lampasas, Texas",
    address: "1234 Highway 281, Lampasas, TX 76550",
    phone: "(512) 555-1234",
    email: "info@brownfeedstore.com",
    foundedYear: "1985"
  });

  const handleSave = () => {
    // In a real implementation, this would save to the backend
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "store", label: "Store Settings", icon: Settings },
    { id: "products", label: "Products", icon: FileText },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "preview", label: "Preview", icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Store Administration</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <a href="/" className="text-blue-600 hover:underline">← Back to Store</a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow p-6 mr-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {activeTab === "store" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Store Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={storeSettings.tagline}
                      onChange={(e) => setStoreSettings({...storeSettings, tagline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={storeSettings.address}
                      onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        value={storeSettings.phone}
                        onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Product Categories</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold">Livestock Feed</h3>
                    <p className="text-gray-600 text-sm">Complete nutrition for cattle, horses, goats, sheep, and swine</p>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold">Pet Food & Supplies</h3>
                    <p className="text-gray-600 text-sm">Premium nutrition and supplies for dogs, cats, and small animals</p>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                  </div>
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-gray-400 transition-colors">
                    + Add New Category
                  </button>
                </div>
              </div>
            )}

            {activeTab === "theme" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Theme Customization</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex items-center space-x-2">
                          <input type="color" value="#166534" className="w-12 h-10 rounded border" />
                          <span className="text-sm text-gray-600">#166534</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex items-center space-x-2">
                          <input type="color" value="#ea580c" className="w-12 h-10 rounded border" />
                          <span className="text-sm text-gray-600">#ea580c</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                        <div className="flex items-center space-x-2">
                          <input type="color" value="#2563eb" className="w-12 h-10 rounded border" />
                          <span className="text-sm text-gray-600">#2563eb</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <a href="/themes" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 inline-flex items-center">
                      <Palette className="h-4 w-4 mr-2" />
                      Open Theme Generator
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preview" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Store Preview</h2>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-gray-600 mb-4">Preview your store as customers will see it:</p>
                  <a 
                    href="/" 
                    target="_blank"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open Store in New Tab
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
