import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found - RecoAI';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-8 inline-block">
            <div className="text-[150px] font-bold opacity-10 text-primary">404</div>
            <div className="absolute inset-0 flex items-center justify-center text-xl">
              <span className="gradient-text text-4xl font-bold">Page Not Found</span>
            </div>
          </div>
        </motion.div>
        
        <motion.p
          className="text-white/70 mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/" className="btn-primary">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <button 
            className="btn-outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;