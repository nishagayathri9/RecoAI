import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Bot, Layers, UserCircle } from 'lucide-react';

const features = [
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    title: 'Smart Product Recommendations',
    description: 'Leverage AI to suggest products based on user behavior, preferences, and purchase history.'
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms that continuously improve recommendation accuracy.'
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: 'Cold Start Solution',
    description: 'Innovative approaches to solve the cold start problem for new users and products.'
  },
  {
    icon: <UserCircle className="h-6 w-6" />,
    title: 'User Preference Learning',
    description: 'Intelligent system that learns and adapts to individual user preferences over time.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const Features = () => (
  <section className="section bg-background relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />

    <div className="container-custom">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h2
          className="heading-lg mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Powerful Features to Enhance Your <span className="gradient-text">Shopping Experience</span>
        </motion.h2>
        <motion.p
          className="text-white/70 text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Our AI-powered recommendation system offers cutting-edge capabilities to transform how users discover products and make purchases.
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <div className="text-primary">{feature.icon}</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-white/70">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Features;
