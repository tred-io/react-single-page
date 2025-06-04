import { Wheat, Dog, Cat, Fish, Bird } from "lucide-react";

export default function Products() {
  const categories = [
    {
      title: "Livestock Feed",
      description: "Complete nutrition for cattle, horses, goats, sheep, and swine",
      icon: Wheat,
      items: [
        "Cattle Feed & Supplements",
        "Horse Feed & Hay",
        "Goat & Sheep Feed",
        "Swine Feed",
        "Range Cubes & Mineral Blocks"
      ],
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    },
    {
      title: "Pet Food & Supplies",
      description: "Premium nutrition and supplies for dogs, cats, and small animals",
      icon: Dog,
      items: [
        "Premium Dog Food",
        "Cat Food & Treats",
        "Pet Toys & Accessories",
        "Leashes & Collars",
        "Pet Health Supplements"
      ],
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    },
    {
      title: "Poultry & Game Bird",
      description: "Specialized feeds for chickens, turkeys, ducks, and game birds",
      icon: Bird,
      items: [
        "Layer Feed",
        "Broiler Feed",
        "Turkey Feed",
        "Game Bird Feed",
        "Poultry Supplements"
      ],
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    },
    {
      title: "Farm Supplies",
      description: "Essential equipment and supplies for modern farming operations",
      icon: Fish,
      items: [
        "Fencing Materials",
        "Water Tanks & Troughs",
        "Feed Buckets & Tools",
        "Barn Equipment",
        "Agricultural Tools"
      ],
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    }
  ];

  return (
    <section id="products" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Quality feed and supplies for all your agricultural and pet care needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={category.image}
                  alt={category.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <IconComponent className="h-6 w-6 text-green-700 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                        {item}
                      </li>
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
