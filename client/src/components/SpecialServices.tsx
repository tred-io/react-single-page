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
    <section className="py-16 bg-sage-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-chocolate-brown mb-4">
            Special Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We go beyond just selling products - discover the extra services that make us your complete agricultural partner.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = (Icons as any)[service.iconName] || Icons.Star;
            
            return (
              <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-chocolate-orange rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-chocolate-brown mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}