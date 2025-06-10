import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import dashboardPic from '../assets/dashboardpic.png';
import Navbar from '../components/common/Navbar'; // ← make sure this path is correct
// Components
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'RecoAI - AI-Powered Recommendation System';
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      
          {/* How It Works Preview */}
      <section className="section bg-background-secondary relative overflow-hidden">
        <div className="absolute top-40 left-40 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-lg mb-6">
                Understanding <span className="gradient-text">How It Works</span>
              </h2>
              <p className="text-white/70 text-lg mb-6 leading-relaxed">
                Our recommendation system uses advanced AI techniques to analyze user behavior,
                product attributes, and historical interactions to generate highly accurate
                product suggestions.
              </p>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                By leveraging embedding vectors and similarity calculations in a multidimensional
                space, we can identify patterns and connections that traditional systems miss.
              </p>
              <Link to="/how-it-works" className="btn-primary group">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-video bg-background rounded-xl overflow-hidden shadow-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-overlay"></div>
                <img 
                  src={dashboardPic} 
                  alt="AI Recommendation System Dashboard" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-8 -right-8 bg-background p-4 rounded-lg shadow-lg w-40"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                <div className="h-2 w-20 bg-primary/40 rounded-full mb-2"></div>
                <div className="h-2 w-12 bg-secondary/40 rounded-full mb-2"></div>
                <div className="h-2 w-16 bg-accent/40 rounded-full"></div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-8 -left-8 bg-background p-4 rounded-lg shadow-lg flex items-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <div className="w-6 h-6 rounded-full bg-primary/60"></div>
                </div>
                <div>
                  <div className="h-2 w-20 bg-white/40 rounded-full mb-2"></div>
                  <div className="h-2 w-12 bg-white/20 rounded-full"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Interactive Playground Preview */}
      <section className="section bg-background relative overflow-hidden">
        <div className="absolute bottom-40 right-40 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="order-2 lg:order-1 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-square bg-background-tertiary rounded-xl overflow-hidden shadow-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 mix-blend-overlay"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 h-4/5 relative">
                    {/* 3D scatter plot placeholder */}
                    <div className="absolute inset-0">
                      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                      <div className="absolute top-1/3 left-1/2 w-3 h-3 rounded-full bg-secondary animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-2/3 left-1/3 w-5 h-5 rounded-full bg-accent animate-pulse" style={{animationDelay: '0.8s'}}></div>
                      <div className="absolute top-1/2 left-2/3 w-4 h-4 rounded-full bg-primary animate-pulse" style={{animationDelay: '1.2s'}}></div>
                      <div className="absolute top-3/4 left-3/4 w-3 h-3 rounded-full bg-secondary animate-pulse" style={{animationDelay: '0.3s'}}></div>
                      
                      {/* Connecting lines */}
                      <div className="absolute inset-0 opacity-40">
                        <svg width="100%" height="100%">
                          <line x1="25%" y1="25%" x2="50%" y2="33%" stroke="#6366F1" strokeWidth="1" />
                          <line x1="50%" y1="33%" x2="33%" y2="67%" stroke="#F472B6" strokeWidth="1" />
                          <line x1="33%" y1="67%" x2="67%" y2="50%" stroke="#F59E0B" strokeWidth="1" />
                          <line x1="67%" y1="50%" x2="75%" y2="75%" stroke="#6366F1" strokeWidth="1" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating UI elements */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-background p-3 rounded-lg shadow-lg"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              >
                <div className="flex space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="h-2 w-24 bg-white/20 rounded-full mb-2"></div>
                <div className="h-2 w-20 bg-white/10 rounded-full"></div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-background p-3 rounded-lg shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <div className="h-2 w-12 bg-white/30 rounded-full mb-1"></div>
                    <div className="h-2 w-8 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-lg mb-6">
                Explore Our <span className="gradient-text">Interactive Playground</span>
              </h2>
              <p className="text-white/70 text-lg mb-6 leading-relaxed">
                Dive into our interactive 3D visualization of product embeddings to see how 
                our AI clusters similar items and creates meaningful connections between them.
              </p>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                This playground allows you to explore the multi-dimensional space where product 
                recommendations live, providing insights into how our algorithm works and why 
                certain items are recommended together.
              </p>
              <Link to="/playground" className="btn-primary group">
                Explore Playground
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.7)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg mb-6">
              Ready to Transform Your <span className="gradient-text">Shopping Experience</span>?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Try our interactive playground, upload your own dataset, or explore how our AI-powered 
              recommendation system can solve real-world e-commerce challenges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/playground" className="btn-primary">
                Try Interactive Demo
              </Link>
              <Link to="/dashboard" className="btn-outline">
                Create Your Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;