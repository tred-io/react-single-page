import { MapPin, Phone, Clock, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { StoreSettings } from "@shared/schema";

export default function Hero() {
  const { data: settings } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
  });

  if (!settings) {
    return <div className="h-96 lg:h-[500px] bg-gray-200 animate-pulse"></div>;
  }

  return (
    <section id="home" className="relative">
      {/* Hero Background */}
      <div 
        className="bg-cover bg-center h-96 lg:h-[500px] relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-4">{settings.storeName}</h1>
            <p className="text-xl lg:text-2xl mb-6">{settings.tagline}</p>
            <p className="text-lg mb-8">Serving our community since {settings.foundedYear} with quality feed, supplies, and local expertise</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-chocolate-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Visit Our Store
              </button>
              <a 
                href={`tel:${settings.phone.replace(/[^\d]/g, '')}`}
                className="bg-forest-green hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call {settings.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Info Bar */}
      <div className="bg-forest-green text-white py-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">Today: {settings.mondayHours}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-5 w-5 flex-shrink-0" />
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                {settings.address}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
