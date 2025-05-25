import { Tractor, MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaGoogle, FaYelp } from "react-icons/fa";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-gray text-warm-beige py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Tractor className="text-chocolate-orange h-8 w-8" />
              <h3 className="text-xl font-serif font-bold">Brown Feed Store</h3>
            </div>
            <p className="text-gray-300 mb-4">Your trusted agricultural partner in Lampasas County since 1985. Quality products, local expertise, and personalized service.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-chocolate-orange hover:text-orange-400 transition-colors">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-chocolate-orange hover:text-orange-400 transition-colors">
                <FaGoogle className="h-6 w-6" />
              </a>
              <a href="#" className="text-chocolate-orange hover:text-orange-400 transition-colors">
                <FaYelp className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection("home")}
                  className="text-gray-300 hover:text-chocolate-orange transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("about")}
                  className="text-gray-300 hover:text-chocolate-orange transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("products")}
                  className="text-gray-300 hover:text-chocolate-orange transition-colors"
                >
                  Products & Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-300 hover:text-chocolate-orange transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Store Information</h4>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <MapPin className="text-chocolate-orange h-4 w-4 mr-2" />
                1234 Highway 281, Lampasas, TX 76550
              </p>
              <p className="flex items-center">
                <Phone className="text-chocolate-orange h-4 w-4 mr-2" />
                <a href="tel:+15125551234" className="hover:text-chocolate-orange transition-colors">
                  (512) 555-1234
                </a>
              </p>
              <p className="flex items-center">
                <Mail className="text-chocolate-orange h-4 w-4 mr-2" />
                <a href="mailto:info@brownfeedstore.com" className="hover:text-chocolate-orange transition-colors">
                  info@brownfeedstore.com
                </a>
              </p>
              <div className="mt-4">
                <p className="font-semibold">Store Hours:</p>
                <p className="text-sm">Mon-Sat: 7AM-6PM</p>
                <p className="text-sm">Sunday: 9AM-4PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 Brown Feed Store. All rights reserved. | Proudly serving Lampasas County since 1985</p>
        </div>
      </div>
    </footer>
  );
}
