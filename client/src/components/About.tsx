import { Award, Handshake, Heart, Star } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-saddle-brown mb-4">About Brown Feed Store</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades</p>
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
              Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We believe in supporting our local community with quality products, fair prices, and the kind of personal service that only comes from knowing our customers and their unique needs. Whether you're raising cattle, caring for horses, or feeding backyard chickens, we're here to help you succeed.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3">
                <Award className="text-chocolate-orange h-6 w-6" />
                <span className="font-semibold">38+ Years Experience</span>
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
