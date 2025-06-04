import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import AdminEnhanced from "./pages/AdminEnhanced";
import ThemeGeneratorPage from "./pages/ThemeGeneratorPage";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const endpoint = queryKey[0] as string;
        if (endpoint === "/api/store-settings") {
          return {
            id: 1,
            storeName: "Brown Feed Store",
            tagline: "Your Trusted Agricultural Partner in Lampasas, Texas",
            address: "1234 Highway 281, Lampasas, TX 76550",
            phone: "(512) 555-1234",
            email: "info@brownfeedstore.com",
            mondayHours: "7:00 AM - 6:00 PM",
            tuesdayHours: "7:00 AM - 6:00 PM",
            wednesdayHours: "7:00 AM - 6:00 PM",
            thursdayHours: "7:00 AM - 6:00 PM",
            fridayHours: "7:00 AM - 6:00 PM",
            saturdayHours: "7:00 AM - 6:00 PM",
            sundayHours: "9:00 AM - 4:00 PM",
            aboutTitle: "About Brown Feed Store",
            aboutDescription: "A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades",
            aboutStory: "Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County.",
            foundedYear: "1985",
            heroImageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
            aboutImageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            primaryColor: "#166534",
            secondaryColor: "#15803d",
            accentColor: "#22c55e",
            fontFamily: "Inter"
          };
        }
        if (endpoint === "/api/product-categories") {
          return [
            {
              id: 1,
              title: "Livestock Feed",
              description: "Complete nutrition for cattle, horses, goats, sheep, and swine",
              imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
              iconName: "Wheat",
              items: ["Cattle Feed & Supplements", "Horse Feed & Hay", "Goat & Sheep Feed", "Swine Feed", "Range Cubes & Mineral Blocks"],
              displayOrder: 1
            },
            {
              id: 2,
              title: "Pet Food & Supplies",
              description: "Premium nutrition and supplies for dogs, cats, and small animals",
              imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
              iconName: "Dog",
              items: ["Premium Dog Food", "Cat Food & Treats", "Pet Toys & Accessories", "Leashes & Collars", "Pet Health Supplements"],
              displayOrder: 2
            }
          ];
        }
        if (endpoint === "/api/special-services") {
          return [
            {
              id: 1,
              title: "Expert Consultation",
              description: "Get personalized advice from our experienced team on nutrition and animal care",
              iconName: "Users",
              displayOrder: 1
            },
            {
              id: 2,
              title: "Feed Delivery",
              description: "Convenient delivery service for bulk orders throughout Lampasas County",
              iconName: "Truck",
              displayOrder: 2
            }
          ];
        }
        if (endpoint === "/api/featured-brands") {
          return [];
        }
        return {};
      },
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={AdminEnhanced} />
        <Route path="/themes" component={ThemeGeneratorPage} />
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
