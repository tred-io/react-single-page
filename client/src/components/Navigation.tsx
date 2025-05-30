import { useState, useEffect } from "react";
import { Menu, X, Tractor, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const isAdmin = location === "/admin";

  return (
    <nav className={`bg-primary shadow-lg sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "py-2" : "py-4"
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Tractor className="text-primary-foreground text-2xl" />
              <h1 className="text-primary-foreground font-serif text-xl font-bold">Brown Feed Store</h1>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin ? (
              <>
                <button 
                  onClick={() => scrollToSection("home")}
                  className="text-warm-beige hover:text-chocolate-orange transition-colors duration-300"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection("about")}
                  className="text-warm-beige hover:text-chocolate-orange transition-colors duration-300"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection("products")}
                  className="text-warm-beige hover:text-chocolate-orange transition-colors duration-300"
                >
                  Products
                </button>
              </>
            ) : (
              <Link href="/">
                <button className="text-warm-beige hover:text-chocolate-orange transition-colors duration-300">
                  Back to Website
                </button>
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/admin">
                <button className="flex items-center space-x-2 text-warm-beige hover:text-chocolate-orange transition-colors duration-300">
                  <Settings className="h-4 w-4" />
                  <span>{isAdmin ? "Admin" : "Manage"}</span>
                </button>
              </Link>
            )}
            {isAuthenticated && (
              <button 
                onClick={logout}
                className="flex items-center space-x-2 text-warm-beige hover:text-chocolate-orange transition-colors duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-warm-beige"
          >
            {isMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-saddle-brown border-t border-chocolate-orange">
            <div className="py-2">
              {!isAdmin ? (
                <>
                  <button 
                    onClick={() => scrollToSection("home")}
                    className="block w-full text-left px-4 py-2 text-warm-beige hover:bg-chocolate-orange transition-colors"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => scrollToSection("about")}
                    className="block w-full text-left px-4 py-2 text-warm-beige hover:bg-chocolate-orange transition-colors"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => scrollToSection("products")}
                    className="block w-full text-left px-4 py-2 text-warm-beige hover:bg-chocolate-orange transition-colors"
                  >
                    Products
                  </button>
                </>
              ) : (
                <Link href="/">
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-4 py-2 text-warm-beige hover:bg-chocolate-orange transition-colors"
                  >
                    Back to Website
                  </button>
                </Link>
              )}
              {isAuthenticated && (
                <Link href="/admin">
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-4 py-2 text-warm-beige hover:bg-chocolate-orange transition-colors"
                  >
                    {isAdmin ? "Admin Dashboard" : "Manage Store"}
                  </button>
                </Link>
              )}
              {isAuthenticated && (
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-warm-beige hover:bg-chocolate-orange transition-colors"
                >
                  <LogOut className="inline w-4 h-4 mr-2" />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
