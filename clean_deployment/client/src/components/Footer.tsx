import { Tractor, MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaGoogle, FaYelp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { type StoreSettings } from "@shared/schema";

export default function Footer() {
  const { data: settings } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!settings) return null;

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
              <p className="flex items-start">
                <MapPin className="text-chocolate-orange h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-chocolate-orange transition-colors leading-tight"
                >
                  {settings.address.includes(',') ? (
                    <>
                      {settings.address.split(',')[0]}<br />
                      {settings.address.split(',').slice(1).join(',').trim()}
                    </>
                  ) : (
                    settings.address
                  )}
                </a>
              </p>
              <p className="flex items-center">
                <Phone className="text-chocolate-orange h-4 w-4 mr-2" />
                <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="hover:text-chocolate-orange transition-colors">
                  {settings.phone}
                </a>
              </p>
              {settings.email && (
                <p className="flex items-center">
                  <Mail className="text-chocolate-orange h-4 w-4 mr-2" />
                  <a href={`mailto:${settings.email}`} className="hover:text-chocolate-orange transition-colors">
                    {settings.email}
                  </a>
                </p>
              )}
              <div className="mt-4">
                <p className="font-semibold">Store Hours:</p>
                <div className="text-sm space-y-1">
                  {(() => {
                    const weekdayHours = settings.mondayHours;
                    const allWeekdaysSame = [
                      settings.tuesdayHours,
                      settings.wednesdayHours,
                      settings.thursdayHours,
                      settings.fridayHours
                    ].every(hours => hours === weekdayHours);
                    
                    if (allWeekdaysSame && settings.mondayHours === settings.tuesdayHours) {
                      return (
                        <>
                          <p>Mon-Fri: {weekdayHours}</p>
                          <p>Sat: {settings.saturdayHours}</p>
                          <p>Sun: {settings.sundayHours}</p>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <p>Mon: {settings.mondayHours}</p>
                          <p>Tue: {settings.tuesdayHours}</p>
                          <p>Wed: {settings.wednesdayHours}</p>
                          <p>Thu: {settings.thursdayHours}</p>
                          <p>Fri: {settings.fridayHours}</p>
                          <p>Sat: {settings.saturdayHours}</p>
                          <p>Sun: {settings.sundayHours}</p>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>
              
              {/* Social Media Links */}
              {(settings.facebookUrl || settings.instagramUrl || settings.xUrl || settings.googleUrl || settings.yelpUrl) && (
                <div className="mt-6">
                  <p className="font-semibold mb-3">Follow Us:</p>
                  <div className="flex space-x-4">
                    {settings.facebookUrl && (
                      <a 
                        href={settings.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-chocolate-orange transition-colors"
                        aria-label="Facebook"
                      >
                        <FaFacebook className="h-6 w-6" />
                      </a>
                    )}
                    {settings.instagramUrl && (
                      <a 
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-chocolate-orange transition-colors"
                        aria-label="Instagram"
                      >
                        <FaInstagram className="h-6 w-6" />
                      </a>
                    )}
                    {settings.xUrl && (
                      <a 
                        href={settings.xUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-chocolate-orange transition-colors"
                        aria-label="X (Twitter)"
                      >
                        <FaXTwitter className="h-6 w-6" />
                      </a>
                    )}
                    {settings.googleUrl && (
                      <a 
                        href={settings.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-chocolate-orange transition-colors"
                        aria-label="Google Business"
                      >
                        <FaGoogle className="h-6 w-6" />
                      </a>
                    )}
                    {settings.yelpUrl && (
                      <a 
                        href={settings.yelpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-chocolate-orange transition-colors"
                        aria-label="Yelp"
                      >
                        <FaYelp className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 {settings.storeName}. All rights reserved. | Proudly serving since {settings.foundedYear}</p>
          <p className="text-xs text-gray-500 mt-2">
            Built with sustainable business practices in mind
          </p>
        </div>
      </div>
    </footer>
  );
}
