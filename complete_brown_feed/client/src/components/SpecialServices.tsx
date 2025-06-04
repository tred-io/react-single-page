import { Users, Truck, BookOpen, Clock } from "lucide-react";

export default function SpecialServices() {
  const services = [
    {
      title: "Expert Consultation",
      description: "Get personalized advice from our experienced team on nutrition and animal care",
      icon: Users
    },
    {
      title: "Feed Delivery",
      description: "Convenient delivery service for bulk orders throughout Lampasas County",
      icon: Truck
    },
    {
      title: "Nutritional Planning",
      description: "Custom feeding programs designed for your specific livestock needs",
      icon: BookOpen
    },
    {
      title: "Emergency Supply",
      description: "After-hours emergency feed supply for critical situations",
      icon: Clock
    }
  ];

  return (
    <section id="services" className="py-16 bg-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Special Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Beyond just selling feed, we provide comprehensive support for your agricultural needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
