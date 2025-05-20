import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders, Search, Zap, RefreshCw,
  Plus, Minus, RotateCw, Info,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Eye, EyeOff
} from 'lucide-react';
import { ScatterPlot3DHandle } from './ScatterPlot3D';

interface ControlPanelProps {
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onMoveCamera: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onSearch: (term: string) => void;
  plotRef: React.RefObject<ScatterPlot3DHandle>;
}

type Tab = 'navigation' | 'filters';

const ControlPanel: React.FC<ControlPanelProps> = ({
  onReset,
  onZoomIn,
  onZoomOut,
  onRotate,
  onMoveCamera,
  onSearch,
  plotRef
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('navigation');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ────────────────────────────────────────────────────────────────────────────────
  // Event handlers
  // ────────────────────────────────────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) onSearch(searchTerm);
  };

  const handleRotateToggle = () => {
    setIsAutoRotate(!isAutoRotate);
    onRotate();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Skip shortcuts when typing in the search field
    if (e.target === searchInputRef.current) return;

    switch (e.key) {
      case 'ArrowUp':
        onMoveCamera('up');
        break;
      case 'ArrowDown':
        onMoveCamera('down');
        break;
      case 'ArrowLeft':
        onMoveCamera('left');
        break;
      case 'ArrowRight':
        onMoveCamera('right');
        break;
      case '+':
        onZoomIn();
        break;
      case '-':
        onZoomOut();
        break;
      case 'r':
        onReset();
        break;
      case 'o':
        handleRotateToggle();
        break;
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [isAutoRotate]);

  // ────────────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ────────────────────────────────────────────────────────────────────────────────
  const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
    <button
      className={`px-4 py-2 text-sm font-medium ${
        activeTab === tab
          ? 'text-primary border-b-2 border-primary'
          : 'text-white/70 hover:text-white'
      }`}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );

  return (
    <div
      className="bg-background-tertiary rounded-xl p-5 shadow-lg border border-white/10 backdrop-blur-sm"
      tabIndex={0}
    >
      {/* Header */}
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

      {/* Info dropdown */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="bg-background/50 rounded-lg p-4 mb-6 border border-white/10"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-medium mb-2">Keyboard Controls</h4>
            <div className="grid grid-cols-2 gap-2 text-white/70 text-sm">
              <div>Arrow Keys: Move camera</div>
              <div>+/-: Zoom in/out</div>
              <div>R: Reset view</div>
              <div>O: Toggle rotation</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products..."
            className="w-full bg-background rounded-lg border border-white/10 py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-400 transition-colors"
          >
            <Zap className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-4">
        <TabButton tab="navigation" label="Navigation" />
        <TabButton tab="filters" label="Filters" />
      </div>

      {/* Tab content */}
      <div className="space-y-4">
        {activeTab === 'navigation' && (
          <div className="space-y-4">
            {/* Zoom controls */}
            <div className="bg-background/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Zoom Controls</h4>
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
              </div>
            </div>

            {/* Camera controls */}
            <div className="bg-background/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Camera Controls</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-start-2">
                  <button
                    className="w-full bg-background/50 hover:bg-background/70 border border-white/10 rounded-lg p-3 flex items-center justify-center transition-colors"
                    onClick={() => onMoveCamera('up')}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                </div>

                <div className="col-start-1 row-start-2">
                  <button
                    className="w-full bg-background/50 hover:bg-background/70 border border-white/10 rounded-lg p-3 flex items-center justify-center transition-colors"
                    onClick={() => onMoveCamera('left')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </div>

                <div className="col-start-2 row-start-2">
                  <button
                    className="w-full bg-background/50 hover:bg-background/70 border border-white/10 rounded-lg p-3 flex items-center justify-center transition-colors"
                    onClick={onReset}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>

                <div className="col-start-3 row-start-2">
                  <button
                    className="w-full bg-background/50 hover:bg-background/70 border border-white/10 rounded-lg p-3 flex items-center justify-center transition-colors"
                    onClick={() => onMoveCamera('right')}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="col-start-2 row-start-3">
                  <button
                    className="w-full bg-background/50 hover:bg-background/70 border border-white/10 rounded-lg p-3 flex items-center justify-center transition-colors"
                    onClick={() => onMoveCamera('down')}
                  >
                    <ArrowDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Auto‑rotate toggle */}
            <div className="bg-background/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Animation</h4>
              <button
                className={`w-full ${isAutoRotate ? 'bg-primary' : 'bg-background/50'} hover:bg-primary/90 rounded-lg p-3 flex items-center justify-center transition-colors`}
                onClick={handleRotateToggle}
              >
                {isAutoRotate ? (
                  <>
                    <EyeOff className="h-5 w-5 mr-2" />
                    Stop Rotation
                  </>
                ) : (
                  <>
                    <RotateCw className="h-5 w-5 mr-2" />
                    Enable Rotation
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="space-y-4">
            <div className="bg-background/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Product Categories</h4>
              <div className="space-y-2">
                {['Clothing', 'Electronics', 'Home Goods', 'Sports', 'Beauty'].map((category, index) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                    <span className="text-sm">{category}</span>
                    <div
                      className="w-3 h-3 rounded-full ml-2"
                      style={{ backgroundColor: ['#6366F1', '#F472B6', '#F59E0B', '#10B981', '#EF4444'][index] }}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-background/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                  <span className="text-sm">Show Clusters</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                  <span className="text-sm">Show Axes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                  <span className="text-sm">Show Grid</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
