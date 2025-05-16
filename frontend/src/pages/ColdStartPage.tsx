import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Lightbulb, Database, Users, 
  MessageSquare, Share2, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ColdStartPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Cold Start Problem - RecoAI';
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
                Solving the <span className="gradient-text">Cold Start</span> Problem
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              How our recommendation system overcomes one of the biggest 
              challenges in personalization.
            </motion.p>
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
      <section className="py-24 bg-background-tertiary relative overflow-hidden">
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
              Experience Our <span className="gradient-text">Solution</span> in Action
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Try our interactive playground to see how our recommendation system handles 
              cold start scenarios, or upload your own dataset to create a custom dashboard.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/playground" className="btn-primary group">
                Explore Playground
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/dashboard" className="btn-outline">
                Create Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ColdStartPage;