import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, MousePointer } from 'lucide-react';
// Update the path below to where your video is located
import bgVideo from '../../assets/option8.mp4';

const Hero: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    // Hero is full-height minus the 5 rem header (h-20)
    <div
      ref={targetRef}
      className="relative overflow-hidden bg-black h-[calc(100vh-5rem)] flex items-center"
    >
      {/* Grid pattern – lowest layer */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(5,5,5,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(5,5,5,0.7)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Background video – scaled to 70 % */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-10 filter brightness-100 opacity-10 transform scale-[0.7] origin-bottom-right"
        style={{ objectPosition: 'right bottom' }}
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Gradient blobs above video but below content */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Content wrapper */}
      <div className="container-custom relative pt-24 z-30">
        <motion.div className="max-w-3xl" style={{ opacity, y: translateY }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading-xl mb-6">
              <span className="gradient-text">Infuse AI</span> into <br />
              Every Shopping Cart.
            </h1>
          </motion.div>

          <motion.p
            className="text-xl text-white/80 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Revolutionizing customer interactions through recommendations that align with preferences and behaviors.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/playground" className="btn-primary group">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Try Demo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/how-it-works" className="btn-outline">
              Learn How It Works
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator – pinned to very bottom */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-sm text-white/60 mb-2">Scroll to explore</span>
        <MousePointer className="text-primary animate-bounce h-5 w-5" />
      </motion.div>
    </div>
  );
};

export default Hero;
