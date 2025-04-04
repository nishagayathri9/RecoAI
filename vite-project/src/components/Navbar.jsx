import React from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'landing', label: 'RecoAI' },
  { id: 'how-it-works', label: 'Demo' },
  { id: 'product-rec', label: 'Product Recommendations' },
  { id: 'cold-start', label: 'Cold Start' }
];

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center py-6 z-50 fixed top-0">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-blue-100  px-6 py-3 rounded-full shadow-md backdrop-blur-md flex space-x-8"
      >
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.id}
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            activeClass="text-blue-600"
            className="cursor-pointer transition duration-200 px-3 py-1 rounded"
          >
            {item.label}
          </Link>
        ))}
      </motion.div>
    </nav>
  );
}
