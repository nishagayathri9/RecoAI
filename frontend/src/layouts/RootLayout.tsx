import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Cursor from '../components/ui/Cursor';

const RootLayout: React.FC = () => {
  const location = useLocation();
  const [showCursor, setShowCursor] = useState(false);
  
  useEffect(() => {
    // Only show custom cursor on desktop
    const handleResize = () => setShowCursor(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <>
      {showCursor && <Cursor />}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default RootLayout;