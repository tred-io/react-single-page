import { MapPin, Phone, Clock, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { StoreSettings } from "@shared/schema";

// Function to check if today is a federal holiday
function isFederalHoliday(): boolean {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const date = today.getDate();
  
  // Fixed date holidays
  const fixedHolidays = [
    { month: 0, date: 1 },   // New Year's Day
    { month: 6, date: 4 },   // Independence Day
    { month: 11, date: 25 }, // Christmas Day
  ];
  
  // Check fixed holidays
  for (const holiday of fixedHolidays) {
    if (month === holiday.month && date === holiday.date) {
      return true;
    }
  }
  
  // Variable holidays (calculated)
  // Memorial Day - Last Monday in May
  if (month === 4) {
    const memorialDay = getLastWeekdayOfMonth(year, 4, 1); // Last Monday
    if (date === memorialDay) return true;
  }
  
  // Labor Day - 1st Monday in September
  if (month === 8) {
    const laborDay = getNthWeekdayOfMonth(year, 8, 1, 1); // 1st Monday
    if (date === laborDay) return true;
  }
  
  // Thanksgiving - 4th Thursday in November
  if (month === 10) {
    const thanksgiving = getNthWeekdayOfMonth(year, 10, 4, 4); // 4th Thursday
    if (date === thanksgiving) return true;
  }
  
  return false;
}

// Helper function to get the nth weekday of a month
function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): number {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const offset = (weekday - firstWeekday + 7) % 7;
  return 1 + offset + (n - 1) * 7;
}

// Helper function to get the last weekday of a month
function getLastWeekdayOfMonth(year: number, month: number, weekday: number): number {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const lastDate = new Date(year, month, lastDay);
  const lastWeekday = lastDate.getDay();
  const offset = (lastWeekday - weekday + 7) % 7;
  return lastDay - offset;
}

export default function Hero() {
  const { data: settings } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
  });

  if (!settings) {
    return <div className="h-96 lg:h-[500px] bg-gray-200 animate-pulse"></div>;
  }

  return (
    <section id="home" className="relative">
      {/* Hero Background */}
      <div 
        className="bg-cover bg-center h-96 lg:h-[500px] relative"
        style={{
          backgroundImage: `url('${settings.heroImageUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080'}')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-4">{settings.storeName}</h1>
            <p className="text-xl lg:text-2xl mb-6">{settings.tagline}</p>
            <p className="text-lg mb-8">Serving our community since {settings.foundedYear} with quality feed, supplies, and local expertise</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <MapPin className="mr-2 h-5 w-5" />
                View Products
              </button>
              <a 
                href={`tel:${settings.phone.replace(/[^\d]/g, '')}`}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call {settings.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Info Bar */}
      <div className="bg-secondary text-secondary-foreground py-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">
                Today: {settings.mondayHours}
                {isFederalHoliday() && <span className="text-xs opacity-75 ml-1">*</span>}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-5 w-5 flex-shrink-0" />
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                {settings.address}
              </a>
            </div>
          </div>
        </div>
        {isFederalHoliday() && (
          <div className="text-center text-xs opacity-75 mt-2">
            *Hours may vary on federal holidays
          </div>
        )}
      </div>
    </section>
  );
}
