import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-green-800">Brown Feed Store</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-green-800 transition-colors">Home</a>
            <a href="#about" className="text-gray-700 hover:text-green-800 transition-colors">About</a>
            <a href="#products" className="text-gray-700 hover:text-green-800 transition-colors">Products</a>
            <a href="#services" className="text-gray-700 hover:text-green-800 transition-colors">Services</a>
            <a href="#contact" className="text-gray-700 hover:text-green-800 transition-colors">Contact</a>
            <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Admin</a>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <a href="#home" className="text-gray-700 hover:text-green-800 py-2">Home</a>
              <a href="#about" className="text-gray-700 hover:text-green-800 py-2">About</a>
              <a href="#products" className="text-gray-700 hover:text-green-800 py-2">Products</a>
              <a href="#services" className="text-gray-700 hover:text-green-800 py-2">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-green-800 py-2">Contact</a>
              <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">Admin</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
