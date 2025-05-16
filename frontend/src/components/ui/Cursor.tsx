import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Cursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === 'A' || 
         e.target.tagName === 'BUTTON' || 
         e.target.closest('a') || 
         e.target.closest('button') ||
         e.target.classList.contains('cursor-hover'))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Outer cursor */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-white/30 pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          mass: 0.3,
          stiffness: 100,
          damping: 10,
        }}
      />
      
      {/* Inner cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          mass: 0.1,
          stiffness: 150,
          damping: 5,
        }}
      />
    </>
  );
};

export default Cursor;