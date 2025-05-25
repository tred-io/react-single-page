import { ServerCog, Dog, Wrench, Egg, Sprout, Stethoscope, Truck, ClipboardList, GraduationCap } from "lucide-react";

export default function Products() {
  const productCategories = [
    {
      icon: ServerCog,
      title: "Livestock Feed",
      description: "Premium quality feed for cattle, horses, pigs, goats, and sheep. Custom mixes available.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      items: ["Range Cubes & Pellets", "Sweet Feed & Grain", "Mineral Supplements", "Custom Blends"]
    },
    {
      icon: Dog,
      title: "Pet Supplies",
      description: "Complete line of pet food, treats, toys, and care products for dogs, cats, and small animals.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      items: ["Premium Dog & Cat Food", "Treats & Supplements", "Toys & Accessories", "Grooming Supplies"]
    },
    {
      icon: Wrench,
      title: "Farm Equipment",
      description: "Essential tools and equipment for farming, ranching, and property maintenance.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      items: ["Hand Tools & Hardware", "Fencing Materials", "Water Systems", "Safety Equipment"]
    },
    {
      icon: Egg,
      title: "Poultry Supplies",
      description: "Complete poultry care including feed, supplements, and housing solutions.",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      items: ["Layer & Broiler Feed", "Poultry Vitamins", "Feeders & Waterers", "Coop Supplies"]
    },
    {
      icon: Sprout,
      title: "Seeds & Garden",
      description: "Quality seeds, fertilizers, and gardening supplies for your growing needs.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      items: ["Vegetable & Flower Seeds", "Grass & Pasture Seed", "Fertilizers & Soil", "Garden Tools"]
    },
    {
      icon: Stethoscope,
      title: "Animal Health",
      description: "Veterinary supplies, medications, and health products for livestock and pets.",
      image: "https://images.unsplash.com/photo-1559190394-df5a28aab5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      items: ["Vaccines & Medications", "Dewormers & Treatments", "First Aid Supplies", "Grooming Products"]
    }
  ];

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
            const IconComponent = category.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={category.image} 
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
        
        {/* Special Services */}
        <div className="mt-16 bg-saddle-brown text-white rounded-lg p-8">
          <h3 className="text-2xl font-serif font-bold text-center mb-8">Special Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="text-chocolate-orange h-8 w-8 mb-3 mx-auto" />
                  <h4 className="font-semibold mb-2">{service.title}</h4>
                  <p className="text-warm-beige text-sm">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
