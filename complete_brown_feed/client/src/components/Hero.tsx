import { MapPin, Phone, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative">
      <div 
        className="bg-cover bg-center h-96 lg:h-[500px] relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">Brown Feed Store</h1>
            <p className="text-xl lg:text-2xl mb-6">Your Trusted Agricultural Partner in Lampasas, Texas</p>
            <p className="text-lg mb-8">Serving our community since 1985 with quality feed, supplies, and local expertise</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <MapPin className="mr-2 h-5 w-5" />
                View Products
              </button>
              <a 
                href="tel:5125551234"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call (512) 555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-green-800 text-white py-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">Today: 7:00 AM - 6:00 PM</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-5 w-5 flex-shrink-0" />
              <a 
                href="https://maps.google.com/?q=1234+Highway+281,+Lampasas,+TX+76550"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                1234 Highway 281, Lampasas, TX 76550
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
