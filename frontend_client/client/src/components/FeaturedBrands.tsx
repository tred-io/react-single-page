import { useQuery } from "@tanstack/react-query";
import { type FeaturedBrand } from "@shared/schema";

export default function FeaturedBrands() {
  const { data: brands = [] } = useQuery<FeaturedBrand[]>({
    queryKey: ["/api/featured-brands"],
  });

  if (brands.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-chocolate-brown mb-4">
            Featured Brands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We proudly carry trusted brands that deliver quality and reliability for your agricultural needs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
              <img 
                src={brand.logoUrl} 
                alt={brand.name}
                className="max-h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="text-gray-600 font-medium text-center">${brand.name}</div>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}