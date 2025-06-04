import { Award, Handshake, Heart, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { StoreSettings } from "@shared/schema";

export default function About() {
  const { data: settings } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
  });

  if (!settings) {
    return <div className="py-16 bg-white"><div className="max-w-6xl mx-auto px-4 h-96 bg-gray-200 animate-pulse rounded-lg"></div></div>;
  }

  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - parseInt(settings.foundedYear);

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-saddle-brown mb-4">{settings.aboutTitle}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{settings.aboutDescription}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Historic feed store exterior" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          
          <div>
            <h3 className="text-2xl font-serif font-bold text-saddle-brown mb-6">Our Story & Mission</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {settings.aboutStory}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3">
                <Award className="text-chocolate-orange h-6 w-6" />
                <span className="font-semibold">{yearsInBusiness}+ Years Experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <Handshake className="text-chocolate-orange h-6 w-6" />
                <span className="font-semibold">Local Family Owned</span>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="text-chocolate-orange h-6 w-6" />
                <span className="font-semibold">Community Focused</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="text-chocolate-orange h-6 w-6" />
                <span className="font-semibold">Quality Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
