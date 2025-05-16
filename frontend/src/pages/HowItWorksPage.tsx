import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Database, LineChart, Zap, 
  Users, ShoppingBag, ArrowRight,Lightbulb,MessageSquare, Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';


const steps = [
  {
    id: "data-collection",
    title: "Data Collection & Processing",
    description: "The foundation of any recommendation system is data. We collect user behavior data including product views, purchases, cart additions, and more. This data is anonymized, cleaned, and processed to eliminate noise and ensure quality.",
    icon: <Database className="h-8 w-8" />,
    color: "bg-primary/10 text-primary"
  },
  {
    id: "embedding-generation",
    title: "Embedding Generation",
    description: "Using advanced neural networks, we convert products and user preferences into high-dimensional embedding vectors. These vectors represent the characteristics and relationships between items in a mathematical space.",
    icon: <Cpu className="h-8 w-8" />,
    color: "bg-secondary/10 text-secondary"
  },
  {
    id: "similarity-calculation",
    title: "Similarity Calculation",
    description: "Once products are represented as vectors, we can calculate similarities between them using distance metrics. Products that are closer in the embedding space are considered more similar and are likely to be recommended together.",
    icon: <LineChart className="h-8 w-8" />,
    color: "bg-accent/10 text-accent"
  },
  {
    id: "personalization",
    title: "Personalization Engine",
    description: "For each user, we create a profile based on their interaction history. This profile is used to find products in the embedding space that align with their preferences, resulting in highly personalized recommendations.",
    icon: <Users className="h-8 w-8" />,
    color: "bg-primary/10 text-primary"
  },
  {
    id: "real-time-updates",
    title: "Real-time Updates",
    description: "As users interact with the platform, their profiles are updated in real-time. This ensures that recommendations adapt quickly to changing preferences and current shopping intentions.",
    icon: <Zap className="h-8 w-8" />,
    color: "bg-secondary/10 text-secondary"
  },
  {
    id: "recommendation-delivery",
    title: "Recommendation Delivery",
    description: "The final step is delivering personalized recommendations at strategic touchpoints throughout the shopping journey - from homepage displays to product detail pages, shopping carts, and even post-purchase emails.",
    icon: <ShoppingBag className="h-8 w-8" />,
    color: "bg-accent/10 text-accent"
  }
];

const HowItWorksPage: React.FC = () => {
  useEffect(() => {
    document.title = 'How It Works - RecoAI';
  }, []);

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section bg-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background-secondary"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(5,5,5,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(5,5,5,0.7)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="heading-xl mb-6">
                How <span className="gradient-text">RecoAI</span> Works
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover the technology behind our AI-powered recommendation system
              and how it transforms the e-commerce shopping experience.
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Process Steps */}
      <section className="section bg-background relative">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="heading-lg mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              The <span className="gradient-text">Recommendation Process</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-white/70"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our recommendation system follows a sophisticated process to deliver 
              accurate, personalized product suggestions.
            </motion.p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                className="flex flex-col md:flex-row gap-6 mb-16 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Step number and connecting line */}
                <div className="flex flex-col items-center">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full ${step.color} flex items-center justify-center z-10`}>
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-16 bg-white/10 mt-4"></div>
                  )}
                </div>
                
                <div className="flex-grow pt-2">
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Embedding Visualization */}
      <section className="section bg-background-tertiary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-lg mb-6">
                Understanding <span className="gradient-text">Embedding Spaces</span>
              </h2>
              <p className="text-white/70 text-lg mb-6 leading-relaxed">
                Product embeddings are high-dimensional vector representations that capture 
                semantic meaning and relationships between different items.
              </p>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                By mapping products to this mathematical space, our system can identify 
                clusters of similar items and make connections that traditional 
                category-based recommendations might miss.
              </p>
              <Link to="/playground" className="btn-primary group">
                Explore in 3D Playground
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
              <div className="aspect-square p-8 bg-background rounded-xl relative shadow-xl">
                {/* 3D scatter plot placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full max-w-md mx-auto" viewBox="0 0 300 300">
                    {/* Axes */}
                    <line x1="50" y1="250" x2="250" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <line x1="50" y1="250" x2="50" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <line x1="50" y1="250" x2="150" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    
                    {/* Axis labels */}
                    <text x="250" y="270" fill="rgba(255,255,255,0.5)" fontSize="12">Features</text>
                    <text x="30" y="50" fill="rgba(255,255,255,0.5)" fontSize="12">Similarity</text>
                    <text x="150" y="150" fill="rgba(255,255,255,0.5)" fontSize="12" transform="rotate(-45 150 150)">Categories</text>
                    
                    {/* Nodes - clothing */}
                    <circle cx="100" cy="100" r="6" fill="#6366F1" />
                    <circle cx="120" cy="110" r="5" fill="#6366F1" />
                    <circle cx="90" cy="120" r="7" fill="#6366F1" />
                    <circle cx="110" cy="90" r="4" fill="#6366F1" />
                    
                    {/* Nodes - electronics */}
                    <circle cx="200" cy="150" r="7" fill="#F472B6" />
                    <circle cx="220" cy="140" r="5" fill="#F472B6" />
                    <circle cx="190" cy="160" r="4" fill="#F472B6" />
                    <circle cx="210" cy="170" r="6" fill="#F472B6" />
                    
                    {/* Nodes - home goods */}
                    <circle cx="150" cy="200" r="6" fill="#F59E0B" />
                    <circle cx="130" cy="210" r="7" fill="#F59E0B" />
                    <circle cx="160" cy="220" r="5" fill="#F59E0B" />
                    <circle cx="140" cy="190" r="4" fill="#F59E0B" />
                    
                    {/* Connecting lines within groups */}
                    <line x1="100" y1="100" x2="120" y2="110" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="120" y1="110" x2="90" y2="120" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="90" y1="120" x2="110" y2="90" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="110" y1="90" x2="100" y2="100" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.3" />
                    
                    <line x1="200" y1="150" x2="220" y2="140" stroke="#F472B6" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="220" y1="140" x2="190" y2="160" stroke="#F472B6" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="190" y1="160" x2="210" y2="170" stroke="#F472B6" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="210" y1="170" x2="200" y2="150" stroke="#F472B6" strokeWidth="1" strokeOpacity="0.3" />
                    
                    <line x1="150" y1="200" x2="130" y2="210" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="130" y1="210" x2="160" y2="220" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="160" y1="220" x2="140" y2="190" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="140" y1="190" x2="150" y2="200" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" />
                    
                    {/* Labels */}
                    <text x="105" y="85" fill="white" fontSize="10">Clothing</text>
                    <text x="220" y="135" fill="white" fontSize="10">Electronics</text>
                    <text x="150" y="230" fill="white" fontSize="10">Home Goods</text>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Real-world Applications */}
      <section className="section bg-background relative">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="heading-lg mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="gradient-text">Real-world</span> Applications
            </motion.h2>
            <motion.p 
              className="text-white/70 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our recommendation technology solves critical business challenges across various 
              e-commerce scenarios.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Application cards */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Product Detail Page Recommendations
              </h3>
              <p className="text-white/70 mb-4">
                Show "Frequently bought together" and "You might also like" suggestions 
                based on product similarity and purchase patterns.
              </p>
              <div className="mt-4 p-4 bg-background rounded-lg">
                <div className="flex flex-col space-y-2">
                  <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                  <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                  <div className="flex space-x-2 mt-2">
                    <div className="h-8 w-8 rounded bg-primary/20"></div>
                    <div className="h-8 w-8 rounded bg-secondary/20"></div>
                    <div className="h-8 w-8 rounded bg-accent/20"></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Personalized Homepage Displays
              </h3>
              <p className="text-white/70 mb-4">
                Customize the shopping experience from the moment users arrive with 
                tailored product showcases based on previous interactions.
              </p>
              <div className="mt-4 p-4 bg-background rounded-lg">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 rounded bg-primary/20"></div>
                  <div className="h-12 rounded bg-secondary/20"></div>
                  <div className="h-12 rounded bg-accent/20"></div>
                  <div className="h-12 rounded bg-secondary/20"></div>
                  <div className="h-12 rounded bg-accent/20"></div>
                  <div className="h-12 rounded bg-primary/20"></div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Cart Upselling Opportunities
              </h3>
              <p className="text-white/70 mb-4">
                Increase average order value by suggesting complementary products 
                that enhance items already in the shopper's cart.
              </p>
              <div className="mt-4 p-4 bg-background rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-1/3 bg-white/10 rounded-full"></div>
                    <div className="h-3 w-16 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-1/4 bg-white/10 rounded-full"></div>
                    <div className="h-3 w-12 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="h-8 w-full bg-primary/20 rounded mt-2"></div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Email Marketing Campaigns
              </h3>
              <p className="text-white/70 mb-4">
                Enhance open and click-through rates with personalized product 
                recommendations in promotional and abandoned cart emails.
              </p>
              <div className="mt-4 p-4 bg-background rounded-lg">
                <div className="space-y-2">
                  <div className="h-3 w-2/3 bg-white/10 rounded-full"></div>
                  <div className="h-3 w-3/4 bg-white/10 rounded-full"></div>
                  <div className="h-3 w-1/2 bg-white/10 rounded-full"></div>
                  <div className="h-6 w-28 bg-primary/20 rounded mt-2"></div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Search Result Enhancement
              </h3>
              <p className="text-white/70 mb-4">
                Improve search functionality by suggesting related items and 
                understanding the semantic meaning behind search queries.
              </p>
              <div className="mt-4 p-4 bg-background rounded-lg">
                <div className="space-y-3">
                  <div className="h-8 w-full bg-white/10 rounded-full flex items-center px-3">
                    <div className="h-3 w-1/3 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 rounded bg-white/5"></div>
                    <div className="h-10 rounded bg-white/5"></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                New Product Introduction
              </h3>
              <p className="text-white/70 mb-4">
                Accelerate adoption of new products by identifying the right 
                customers based on their preference profiles.
              </p>
              <div className="mt-4 p-4 bg-background rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <div className="h-8 w-8 bg-accent/40 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-white/10 rounded-full"></div>
                    <div className="h-3 w-16 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    

            {/* What is Cold Start */}
      <section className="section bg-background relative overflow-hidden">
        <div className="absolute top-40 left-40 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="heading-lg mb-6">
                What Is the <span className="gradient-text">Cold Start</span> Problem?
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                The cold start problem occurs when a recommendation system doesn't have 
                enough data about a new user or product to make relevant recommendations.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div 
                className="card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-primary/10 p-4 rounded-lg inline-block mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">New User Cold Start</h3>
                <p className="text-white/70 leading-relaxed">
                  When a new user joins your platform, you have no information about their 
                  preferences or behavior. How do you recommend products they might like 
                  without any historical data?
                </p>
              </motion.div>
              
              <motion.div 
                className="card"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-secondary/10 p-4 rounded-lg inline-block mb-4">
                  <Database className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">New Item Cold Start</h3>
                <p className="text-white/70 leading-relaxed">
                  When you add new products to your catalog, they have no interaction 
                  history. How do you ensure these new items get recommended to the 
                  right users and don't remain invisible?
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              className="bg-background-tertiary rounded-xl p-6 border-l-4 border-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-2">Why It Matters</h3>
                  <p className="text-white/70 leading-relaxed">
                    Effectively solving the cold start problem is critical for user retention and 
                    revenue. New users who receive poor recommendations may leave your platform, 
                    while new products that aren't recommended may never gain traction, resulting 
                    in lost sales opportunities.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Solution */}
      <section className="section bg-background-tertiary relative overflow-hidden">
        <div className="absolute bottom-40 right-40 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="heading-lg mb-6">
                Our <span className="gradient-text">Solution</span>
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                RecoAI addresses the cold start problem through a multi-faceted approach 
                that combines various data sources and techniques.
              </p>
            </motion.div>
            
            <div className="space-y-8">
              <motion.div 
                className="bg-background rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="bg-primary/10 p-2 rounded-lg mr-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  Content-Based Filtering
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  For new users and products, we rely on content-based filtering that analyzes 
                  product attributes and metadata rather than user interactions.
                </p>
                <div className="bg-background-tertiary rounded-lg p-4">
                  <h4 className="font-medium mb-2">How It Works:</h4>
                  <ul className="list-disc list-inside space-y-2 text-white/70">
                    <li>Products are embedded based on their descriptions, attributes, and categories</li>
                    <li>For new users, we recommend based on the limited information we have (e.g., demographics, onboarding preferences)</li>
                    <li>New products are recommended based on their similarity to existing popular products</li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-background rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="bg-secondary/10 p-2 rounded-lg mr-3">
                    <Share2 className="h-5 w-5 text-secondary" />
                  </div>
                  Hybrid Recommendations
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  We blend multiple recommendation strategies to overcome cold start limitations.
                </p>
                <div className="bg-background-tertiary rounded-lg p-4">
                  <h4 className="font-medium mb-2">How It Works:</h4>
                  <ul className="list-disc list-inside space-y-2 text-white/70">
                    <li>Combine content-based filtering with collaborative filtering when partial data is available</li>
                    <li>Gradually transition from content-based to collaborative as more user data is collected</li>
                    <li>Use weighted blending that adjusts based on data availability</li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-background rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="bg-accent/10 p-2 rounded-lg mr-3">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  Active Learning Approach
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  We actively gather information to quickly move beyond the cold start phase.
                </p>
                <div className="bg-background-tertiary rounded-lg p-4">
                  <h4 className="font-medium mb-2">How It Works:</h4>
                  <ul className="list-disc list-inside space-y-2 text-white/70">
                    <li>Strategically present diverse recommendations to quickly learn user preferences</li>
                    <li>Use "explore vs. exploit" algorithms that balance showing new items with trusted recommendations</li>
                    <li>Contextual bandits approach to maximize information gain from each user interaction</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Real World Impact */}
      <section className="section bg-background relative">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="heading-lg mb-6">
                Real-World <span className="gradient-text">Impact</span>
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                Our cold start solutions deliver measurable improvements for e-commerce businesses.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div 
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-5xl font-bold text-primary mb-2">+42%</div>
                <h3 className="text-xl font-semibold mb-2">New User Engagement</h3>
                <p className="text-white/70">Increase in first-week engagement for new users</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="text-5xl font-bold text-secondary mb-2">+38%</div>
                <h3 className="text-xl font-semibold mb-2">New Product Visibility</h3>
                <p className="text-white/70">Improvement in discovery rate for new catalog items</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-5xl font-bold text-accent mb-2">-35%</div>
                <h3 className="text-xl font-semibold mb-2">Time to Relevance</h3>
                <p className="text-white/70">Reduction in time needed to generate highly relevant recommendations</p>
              </motion.div>
            </div>
            
            <motion.div 
              className="bg-background-tertiary rounded-xl p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
              
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-6">Case Study: Fashion Retailer</h3>
                <p className="text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto">
                  A leading fashion retailer struggled with recommending newly added seasonal 
                  items and onboarding new customers effectively. After implementing RecoAI's 
                  cold start solutions:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-background rounded-lg p-5">
                    <h4 className="font-semibold mb-3">Before RecoAI</h4>
                    <ul className="list-disc list-inside space-y-2 text-white/70 text-left">
                      <li>New products took 3-4 weeks to gain significant visibility</li>
                      <li>New user conversion rate was 2.3%</li>
                      <li>18% of new seasonal items received few or no recommendations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-background rounded-lg p-5">
                    <h4 className="font-semibold mb-3">After RecoAI</h4>
                    <ul className="list-disc list-inside space-y-2 text-white/70 text-left">
                      <li>New products gained visibility within 3-5 days</li>
                      <li>New user conversion rate increased to 5.8%</li>
                      <li>Only 3% of seasonal items received limited recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.7)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        
        <div className="container-custom relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg mb-6">
              Ready to See It <span className="gradient-text">In Action</span>?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience our recommendation system firsthand through our interactive 
              playground or learn how we solve the cold start problem.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/playground" className="btn-primary">
                Try Interactive Demo
              </Link>

            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default HowItWorksPage;