import { ServerCog, Dog, Wrench, Egg, Sprout, Stethoscope } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ProductCategory } from "@shared/schema";

const iconMap: { [key: string]: any } = {
  "Livestock Feed": ServerCog,
  "Pet Supplies": Dog,
  "Farm Equipment": Wrench,
  "Poultry Supplies": Egg,
  "Seeds & Garden": Sprout,
  "Animal Health": Stethoscope,
};

export default function Products() {
  const { data: productCategories = [] } = useQuery<ProductCategory[]>({
    queryKey: ["/api/product-categories"],
  });

  if (productCategories.length === 0) {
    return (
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const services = [
    {
      icon: Truck,
      title: "Free Local Delivery",
      description: "Orders over $100 within 15 miles"
    },
    {
      icon: ClipboardList,
      title: "Custom Feed Mixing",
      description: "Tailored nutrition for your animals"
    },
    {
      icon: GraduationCap,
      title: "Expert Consultation",
      description: "Free advice from our experienced team"
    }
  ];

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-saddle-brown mb-4">Products & Services</h2>
          <p className="text-lg text-gray-600">Everything you need for your farm, ranch, and beloved animals</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productCategories.map((category, index) => {
            const IconComponent = iconMap[category.title] || ServerCog;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={category.imageUrl} 
                  alt={category.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <IconComponent className="text-chocolate-orange h-6 w-6 mr-3" />
                    <h3 className="text-xl font-serif font-bold text-saddle-brown">{category.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
