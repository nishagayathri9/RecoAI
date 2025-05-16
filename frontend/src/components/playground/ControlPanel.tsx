import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sliders, Search, Zap, RefreshCcw, Download, 
  Plus, Minus, RotateCcw, Info
} from 'lucide-react';

interface ControlPanelProps {
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onSearch: (term: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onReset,
  onZoomIn,
  onZoomOut,
  onRotate,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  return (
    <div className="bg-background-tertiary rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Sliders className="mr-2 h-5 w-5 text-primary" />
          Control Panel
        </h3>
        <button 
          className="text-white/70 hover:text-white transition-colors"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="h-5 w-5" />
        </button>
      </div>
      
      {showInfo && (
        <motion.div 
          className="bg-background/50 rounded-lg p-4 mb-6 border border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-medium mb-2">About This Visualization</h4>
          <p className="text-white/70 text-sm">
            This 3D scatter plot visualizes product embeddings in a high-dimensional space.
            Each point represents a product, with similar products positioned closer together.
            The colors represent different product categories.
          </p>
          <p className="text-white/70 text-sm mt-2">
            Use the controls below to interact with the visualization and explore the
            relationships between products.
          </p>
        </motion.div>
      )}
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-background rounded-lg border border-white/10 py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-400 transition-colors"
          >
            <Zap className="h-4 w-4" />
          </button>
        </div>
      </form>
      
      <div className="space-y-4">
        <div className="bg-background/30 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Visualization Controls</h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="bg-background/50 hover:bg-background/70 border border-white/10 rounded-lg p-3 flex items-center justify-center transition-colors"
              onClick={onZoomIn}
            >
              <Plus className="h-5 w-5 mr-2" />
              Zoom In
            </button>
            <button 
              className="bg-background/50 hover:bg-background/70 border border-white/10 rounded-lg p-3 flex items-center justify-center transition-colors"
              onClick={onZoomOut}
            >
              <Minus className="h-5 w-5 mr-2" />
              Zoom Out
            </button>
            <button 
              className="bg-background/50 hover:bg-background/70 border border-white/10 rounded-lg p-3 flex items-center justify-center transition-colors"
              onClick={onRotate}
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Rotate
            </button>
            <button 
              className="bg-background/50 hover:bg-background/70 border border-white/10 rounded-lg p-3 flex items-center justify-center transition-colors"
              onClick={onReset}
            >
              <RefreshCcw className="h-5 w-5 mr-2" />
              Reset
            </button>
          </div>
        </div>
        
        <div className="bg-background/30 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Data Options</h4>
          <button className="w-full bg-primary hover:bg-primary-600 rounded-lg p-3 flex items-center justify-center transition-colors">
            <Download className="h-5 w-5 mr-2" />
            Export Visualization
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;