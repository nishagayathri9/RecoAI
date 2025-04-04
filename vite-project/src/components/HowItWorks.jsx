import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="p-8 ">
      {/* Header */}
      <h2 className="text-5xl font-bold text-center mt-12 mb-12">How It Works</h2>
      
      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-8 ml-25 mr-25">
        {[
          {
            icon: <ShoppingBag className="w-8 h-8 text-purple-500 text-center" />,
            title: "Smart Shopping",
            description: "Personalized recommendations based on user behavior and preferences",
          },
          {
            icon: <Sparkles className="w-8 h-8 text-blue-500 text-center" />,
            title: "AI-Powered",
            description: "Advanced machine learning algorithms for accurate predictions",
          },
          {
            icon: <TrendingUp className="w-8 h-8 text-green-500 text-center" />,
            title: "Increased Sales",
            description: "Boost conversion rates with targeted product suggestions",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Button Below the Grid */}
      <div className="flex justify-center mt-20 mb-10 ">
        <a
        href="/demo"
        className="relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50"
        >
        <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
        <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </span>
        <span className="relative group-hover:text-white">See It in Action</span>
        </a>



      </div>
    </div>
  );
};

export default HowItWorks;
