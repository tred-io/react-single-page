import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { type SpecialService } from "@shared/schema";
import * as Icons from "lucide-react";

export default function SpecialServices() {
  const { data: services = [] } = useQuery<SpecialService[]>({
    queryKey: ["/api/special-services"],
  });

  if (services.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-saddle-brown text-white rounded-lg p-8">
          <h3 className="text-2xl font-serif font-bold text-center mb-8">Special Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = (Icons as any)[service.iconName] || Icons.Star;
              
              return (
                <div key={service.id} className="text-center">
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