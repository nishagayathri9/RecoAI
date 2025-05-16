import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { DataPoint } from '../../types';

// Sample data points for demonstration
const generateDummyData = (count: number): DataPoint[] => {
  const categories = ['Clothing', 'Electronics', 'Home Goods', 'Sports', 'Beauty'];
  const colors = ['#6366F1', '#F472B6', '#F59E0B', '#10B981', '#EF4444'];
  
  return Array.from({ length: count }).map((_, i) => {
    const categoryIndex = Math.floor(Math.random() * categories.length);
    return {
      id: i,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ],
      color: colors[categoryIndex],
      label: `Product ${i + 1}`,
      category: categories[categoryIndex],
      details: {
        price: `$${(Math.random() * 100).toFixed(2)}`,
        rating: (Math.random() * 5).toFixed(1),
        reviews: Math.floor(Math.random() * 500)
      }
    };
  });
};

interface DataPointProps {
  point: DataPoint;
  onHover: (point: DataPoint | null) => void;
  selectedCategory: string | null;
}

const DataPointObject: React.FC<DataPointProps> = ({ point, onHover, selectedCategory }) => {
  const isHighlighted = !selectedCategory || selectedCategory === point.category;
  const scale = isHighlighted ? 1 : 0.5;
  const opacity = isHighlighted ? 1 : 0.3;
  
  return (
    <mesh
      position={point.position}
      onPointerOver={() => onHover(point)}
      onPointerOut={() => onHover(null)}
      scale={scale}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={point.color} opacity={opacity} transparent />
    </mesh>
  );
};

interface TooltipProps {
  point: DataPoint | null;
}

const Tooltip: React.FC<TooltipProps> = ({ point }) => {
  if (!point) return null;
  
  return (
    <Html position={[point.position[0], point.position[1] + 0.5, point.position[2]]}>
      <div className="bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/10 text-sm w-48">
        <div className="font-medium mb-1">{point.label}</div>
        <div className="text-white/70 mb-2">Category: {point.category}</div>
        {point.details && (
          <div className="space-y-1 pt-2 border-t border-white/10">
            <div className="flex justify-between">
              <span>Price:</span>
              <span>{point.details.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Rating:</span>
              <span>⭐ {point.details.rating}</span>
            </div>
            <div className="flex justify-between">
              <span>Reviews:</span>
              <span>{point.details.reviews}</span>
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};

interface ScatterPlot3DProps {
  data?: DataPoint[];
  height?: string;
}

const ScatterPlot3D: React.FC<ScatterPlot3DProps> = ({ 
  data = generateDummyData(100),
  height = '600px'
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Extract unique categories from data
    const categories = [...new Set(data.map(point => point.category))];
    setUniqueCategories(categories);
  }, [data]);
  
  return (
    <div className="w-full rounded-xl overflow-hidden bg-background-tertiary relative" style={{ height }}>
      {/* Category filter */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null 
              ? 'bg-white/20 text-white' 
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {uniqueCategories.map(category => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category 
                ? 'bg-white/20 text-white' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            onClick={() => setSelectedCategory(
              selectedCategory === category ? null : category
            )}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Interactive help */}
      <motion.div 
        className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-sm text-white/80 max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-start">
          <div className="bg-primary/20 rounded-full p-2 mr-3">
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p>Use mouse to rotate the view, scroll to zoom, and right-click to pan.</p>
            <p className="mt-1">Hover over points to see product details.</p>
          </div>
        </div>
      </motion.div>
      
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Render axes for orientation */}
        <group position={[0, 0, 0]}>
          {/* X axis */}
          <line>
            <bufferGeometry attach="geometry" args={[new Float32Array([-5, 0, 0, 5, 0, 0]), 3]} />
            <lineBasicMaterial attach="material" color="red" linewidth={1} />
          </line>
          <Text position={[5.5, 0, 0]} fontSize={0.5} color="red">
            X
          </Text>
          
          {/* Y axis */}
          <line>
            <bufferGeometry attach="geometry" args={[new Float32Array([0, -5, 0, 0, 5, 0]), 3]} />
            <lineBasicMaterial attach="material" color="green" linewidth={1} />
          </line>
          <Text position={[0, 5.5, 0]} fontSize={0.5} color="green">
            Y
          </Text>
          
          {/* Z axis */}
          <line>
            <bufferGeometry attach="geometry" args={[new Float32Array([0, 0, -5, 0, 0, 5]), 3]} />
            <lineBasicMaterial attach="material" color="blue" linewidth={1} />
          </line>
          <Text position={[0, 0, 5.5]} fontSize={0.5} color="blue">
            Z
          </Text>
        </group>
        
        {/* Data points */}
        {data.map((point) => (
          <DataPointObject 
            key={point.id} 
            point={point} 
            onHover={setHoveredPoint}
            selectedCategory={selectedCategory}
          />
        ))}
        
        {/* Tooltip */}
        {hoveredPoint && <Tooltip point={hoveredPoint} />}
        
        {/* Controls */}
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          rotateSpeed={0.5}
          zoomSpeed={0.7}
        />
      </Canvas>
    </div>
  );
};

export default ScatterPlot3D;