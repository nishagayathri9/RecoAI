import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, ChevronRight } from 'lucide-react';

// Logo component
const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <span className="text-2xl font-bold">
      <span className="text-white">Reco</span>
      <span className="text-primary">AI</span>
    </span>
    <div className="flex gap-1 mt-1">
      <div className="w-2 h-2 rounded-full bg-primary"></div>
      <div className="w-2 h-2 rounded-full bg-secondary"></div>
      <div className="w-2 h-2 rounded-full bg-accent"></div>
    </div>
  </Link>
);

const navItems = [
  { name: "Home", path: "/" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Interactive Playground", path: "/playground" },
  { name: "Dashboard", path: "/dashboard" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container-custom py-4 lg:py-5">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className={`text-sm font-medium py-2 transition-colors hover:text-primary relative group ${
                      location.pathname === item.path ? 'text-primary' : 'text-white/80'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute left-0 right-0 bottom-0 h-0.5 transform origin-left transition-transform duration-300 ${
                      location.pathname === item.path ? 'bg-primary scale-x-100' : 'bg-primary scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 text-white focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="lg:hidden bg-background-secondary fixed inset-0 z-40 pt-20"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container-custom py-8">
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <motion.li 
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link 
                      to={item.path} 
                      className={`flex items-center justify-between text-lg font-medium p-3 rounded-lg transition-colors ${
                        location.pathname === item.path 
                          ? 'bg-primary/20 text-primary' 
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      {item.name}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Link to="/playground" className="btn-primary w-full justify-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Try It Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;