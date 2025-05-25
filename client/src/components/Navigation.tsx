import { useState, useEffect } from "react";
import { Menu, X, Tractor } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <nav className={`bg-saddle-brown shadow-lg sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "py-2" : "py-4"
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Tractor className="text-warm-beige text-2xl" />
            <h1 className="text-warm-beige font-serif text-xl font-bold">Brown Feed Store</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
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
            <button 
              onClick={() => scrollToSection("contact")}
              className="text-warm-beige hover:text-chocolate-orange transition-colors duration-300"
            >
              Contact
            </button>
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
              <button 
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-4 py-2 text-warm-beige hover:bg-chocolate-orange transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
