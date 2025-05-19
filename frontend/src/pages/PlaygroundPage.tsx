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
  
  const toggleFullscreen = () => {
    if (!ref3dView.current) return;
    
    if (!isFullscreen) {
      if (ref3dView.current.requestFullscreen) {
        ref3dView.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
                  <button 
                    className="bg-background/60 backdrop-blur-sm hover:bg-background/80 p-2 rounded-lg text-white/80 hover:text-white transition-colors"
                    onClick={toggleFullscreen}
                  >
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </div>
                <ScatterPlot3D height="600px" ref={plotRef} />
              </div>
              
              <div className="mt-6 bg-background-tertiary rounded-xl p-5 border border-white/10">
                <h3 className="text-xl font-semibold flex items-center mb-4">
                  <LayoutGrid className="mr-2 h-5 w-5 text-primary" />
                  Product Insights
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Category Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Clothing</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Electronics</span>
                        <span>22%</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-secondary h-2 rounded-full" style={{ width: '22%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Home Goods</span>
                        <span>18%</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Sports</span>
                        <span>17%</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: '17%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Beauty</span>
                        <span>15%</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-error h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Cluster Density</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Cluster 1</span>
                        <span>High</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Cluster 2</span>
                        <span>Medium</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-secondary h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Cluster 3</span>
                        <span>Medium</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Cluster 4</span>
                        <span>Low</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Cluster 5</span>
                        <span>Low</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-error h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Connected Products</h4>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ 
                              backgroundColor: ['#6366F1', '#F472B6', '#F59E0B', '#10B981', '#EF4444'][index]
                            }}
                          ></div>
                          <div className="text-sm">
                            <div className="font-medium">Product {index + 1}</div>
                            <div className="text-white/60 text-xs">Connections: {Math.floor(Math.random() * 10) + 1}</div>
                          </div>
                        </div>
                      ))}
                      
                      <button className="w-full text-primary text-sm flex items-center justify-center mt-2">
                        View All
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
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
                onSearch={handleSearch}
                plotRef={plotRef}
              />
              
              <div className="mt-6 bg-background-tertiary rounded-xl p-5 border border-white/10">
                <h3 className="text-xl font-semibold flex items-center mb-4">
                  <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                  My Datasets
                </h3>
                
                <p className="text-white/70 text-sm mb-4">
                  Upload your own dataset to generate a custom visualization and recommendation dashboard.
                </p>
                
                <Link to="/dashboard" className="btn-primary w-full justify-center">
                  Go to Dashboard
                </Link>
              </div>
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
                <h3 className="text-xl font-semibold mb-4">Color Coding</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Colors represent different product categories:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                    <span>Clothing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-secondary mr-2"></div>
                    <span>Electronics</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-accent mr-2"></div>
                    <span>Home Goods</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-success mr-2"></div>
                    <span>Sports</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-error mr-2"></div>
                    <span>Beauty</span>
                  </div>
                </div>
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