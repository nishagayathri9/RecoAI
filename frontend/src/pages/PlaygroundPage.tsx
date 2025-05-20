import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, Maximize2, 
  ArrowRight, FileSpreadsheet
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import ScatterPlot3D, { ScatterPlot3DHandle } from '../components/playground/ScatterPlot3D';
import ControlPanel from '../components/playground/ControlPanel';

const PlaygroundPage: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const ref3dView = useRef<HTMLDivElement>(null);
  const plotRef = useRef<ScatterPlot3DHandle>(null);
  
  useEffect(() => {
    document.title = 'Interactive Playground - RecoAI';
  }, []);
  
  const handleReset = () => {
    plotRef.current?.resetView();
  };
  
  const handleZoomIn = () => {
    plotRef.current?.zoomIn();
  };
  
  const handleZoomOut = () => {
    plotRef.current?.zoomOut();
  };
  
  const handleRotate = () => {
    plotRef.current?.toggleRotate();
  };
  
  const handleMoveCamera = (direction: 'left' | 'right' | 'up' | 'down') => {
    plotRef.current?.moveCamera(direction);
  };
  
  const handleSearch = (term: string) => {
    plotRef.current?.searchProduct(term);
  };

  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);


  // Data for insights
  const categoryData = [
    { name: 'Beauty & Personal Care', pct: 25 },
    { name: 'Electronics', pct: 22.9 },
    { name: 'Tools & Home Improvement', pct: 21.3 },
    { name: 'Clothing, Shoes & Jewelry', pct: 20.9 },
    { name: 'Power & Hand Tools', pct: 5.1 },
    { name: 'Shoe, Jewelry & Watch Accessories', pct: 3.1 },
    { name: 'Car & Vehicle Electronics', pct: 1.7 },
  ];

  const clusterBuckets = ['High','Low','High','Medium','High','Low','Medium'];


  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section bg-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background-secondary"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(5,5,5,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(5,5,5,0.7)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="heading-xl mb-6">
                Interactive <span className="gradient-text">Embedding</span> Playground
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore the multi-dimensional space of product embeddings and see how our 
              recommendation system connects similar items. Use keyboard controls or the control panel.
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Main Visualization */}
      <section className="section bg-background relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="relative" ref={ref3dView}>
                <div className="absolute top-4 right-4 z-10">
                </div>
                <ScatterPlot3D height="600px" ref={plotRef} />
              </div>
              
              {/* Product Insights */}
              <div className="mt-6 bg-background-tertiary rounded-xl p-5 border border-white/10">
                <h3 className="text-xl font-semibold flex items-center mb-4">
                  <LayoutGrid className="mr-2 h-5 w-5 text-primary" />
                  Product Insights
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Distribution */}
                  <div className="bg-background/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Category Distribution</h4>
                    <div className="space-y-2">
                      {categoryData.map((cat, idx) => {
                        const barWidth = Math.max(cat.pct, 5);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">{cat.name}</span>
                              <span>{cat.pct}%</span>
                            </div>
                            <div className="w-full bg-background/50 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${barWidth}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Cluster Density */}
                  <div className="bg-background/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Cluster Density</h4>
                    <div className="space-y-2">
                      {['High','Low','High','Medium','Low','Medium','High'].map((bucket, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Cluster {idx + 1}</span>
                            <span>{bucket}</span>
                          </div>
                          <div className="w-full bg-background/50 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: bucket === 'High' ? '85%' : bucket === 'Medium' ? '50%' : '15%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-1">
            <ControlPanel
              onReset={handleReset}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onRotate={handleRotate}
              onMoveCamera={handleMoveCamera}
              plotRef={plotRef}            // ← keep only this
            />
              
            </div>
          </div>
        </div>
      </section>
      
      {/* Explanation Section */}
      <section className="section bg-background-tertiary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              className="heading-lg mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Understanding the <span className="gradient-text">Visualization</span>
            </motion.h2>
            
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-background rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-4">What Am I Looking At?</h3>
                <p className="text-white/70 leading-relaxed">
                  The 3D visualization represents product embeddings in a multi-dimensional space. 
                  Each point is a product, and the distance between points indicates their similarity. 
                  Products that are closer together are more likely to be recommended together.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-4">Behind the Scenes</h3>
                <p className="text-white/70 leading-relaxed">
                  This visualization is created using the UMAP (Uniform Manifold Approximation and Projection) 
                  algorithm, which reduces the high-dimensional embedding vectors (typically 100+ dimensions) 
                  to a 3D representation while preserving the relationships between products. This allows us 
                  to visualize complex patterns and clusters that would otherwise be impossible to see.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(5,5,5,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(5,5,5,0.7)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        
        <div className="container-custom relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg mb-6">
              Ready to Create Your <span className="gradient-text">Own Visualization</span>?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Upload your product dataset to our dashboard and get personalized 
              recommendations and visualizations for your specific use case.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/dashboard" className="btn-primary">
                Create Dashboard
              </Link>
              <Link to="/how-it-works" className="btn-outline">
                Learn About How it Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PlaygroundPage;