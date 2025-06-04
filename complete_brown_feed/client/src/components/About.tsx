import { Award, Users, Truck, Heart } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">About Brown Feed Store</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Brown Feed Store exterior"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
            <p className="text-gray-600 mb-6">
              Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. 
              What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas.
            </p>
            <p className="text-gray-600 mb-6">
              We believe in supporting our local community with quality products, fair prices, and the kind of personal service that only comes from knowing our customers by name.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <Award className="h-8 w-8 text-green-700 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">38+ Years</div>
                <div className="text-sm text-gray-600">Serving Community</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <Users className="h-8 w-8 text-green-700 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
