import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import { useStore } from '../../store/index';
import * as THREE from 'three';

const NetworkBlock: React.FC<{
  layer: any;
  isHighlighted: boolean;
  isActive: boolean;
}> = ({ layer, isHighlighted, isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isHighlighted) {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
      } else if (isActive) {
        meshRef.current.scale.setScalar(1.05);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }

    if (glowRef.current) {
      if (isHighlighted) {
        glowRef.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      } else if (isActive) {
        glowRef.current.material.opacity = 0.2;
      } else {
        glowRef.current.material.opacity = 0.1;
      }
    }
  });

  const blockDimensions = layer.blockType === 'wide' ? [2, 0.8, 1] : [1.2, 1.2, 1.2];

  return (
    <group position={layer.position}>
      {/* Main building block */}
      <mesh ref={meshRef}>
        <boxGeometry args={blockDimensions} />
        <meshStandardMaterial
          color={layer.color}
          emissive={layer.color}
          emissiveIntensity={isHighlighted ? 0.4 : isActive ? 0.2 : 0.1}
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={isActive || isHighlighted ? 0.9 : 0.7}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <boxGeometry args={[blockDimensions[0] * 1.3, blockDimensions[1] * 1.3, blockDimensions[2] * 1.3]} />
        <meshBasicMaterial
          color={layer.color}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Connection points */}
      {layer.connections.length > 0 && (
        <mesh position={[blockDimensions[0] / 2 + 0.2, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={isActive ? '#ffffff' : '#666666'}
            emissive={isActive ? '#ffffff' : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </mesh>
      )}
      
      {/* Input connection point */}
      {layer.id !== 'input' && (
        <mesh position={[-blockDimensions[0] / 2 - 0.2, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={isActive ? '#ffffff' : '#666666'}
            emissive={isActive ? '#ffffff' : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </mesh>
      )}
      
      {/* Label */}
      <Text
        position={[0, blockDimensions[1] / 2 + 0.6, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {layer.name}
      </Text>

      {/* Sub-label for layer type */}
      <Text
        position={[0, blockDimensions[1] / 2 + 0.3, 0]}
        fontSize={0.15}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        {layer.type}
      </Text>
    </group>
  );
};

const DataFlowParticles: React.FC<{
  fromLayer: any;
  toLayer: any;
  isActive: boolean;
}> = ({ fromLayer, toLayer, isActive }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [particles] = useState(() => {
    const count = 20;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = fromLayer.position[0] + (toLayer.position[0] - fromLayer.position[0]) * t;
      const y = fromLayer.position[1] + (toLayer.position[1] - fromLayer.position[1]) * t;
      const z = fromLayer.position[2] + (toLayer.position[2] - fromLayer.position[2]) * t;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      colors[i * 3] = 0.4;
      colors[i * 3 + 1] = 0.6;
      colors[i * 3 + 2] = 1;
    }
    
    return { positions, colors };
  });

  useFrame((state) => {
    if (particlesRef.current && isActive) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.length; i += 3) {
        const particleIndex = i / 3;
        const t = (particleIndex / (positions.length / 3) + time * 0.5) % 1;
        
        positions[i] = fromLayer.position[0] + (toLayer.position[0] - fromLayer.position[0]) * t;
        positions[i + 1] = fromLayer.position[1] + (toLayer.position[1] - fromLayer.position[1]) * t + Math.sin(time * 2 + particleIndex) * 0.1;
        positions[i + 2] = fromLayer.position[2] + (toLayer.position[2] - fromLayer.position[2]) * t;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!isActive) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles.positions}
          count={particles.positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={particles.colors}
          count={particles.colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.8}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const NetworkConnections: React.FC<{
  layers: any[];
  currentStep: number;
}> = ({ layers, currentStep }) => {
  const connections = [];
  const dataFlows = [];
  
  layers.forEach((layer, layerIndex) => {
    layer.connections.forEach((connectionId: string) => {
      const targetLayer = layers.find(l => l.id === connectionId);
      if (targetLayer) {
        const isActive = currentStep > layerIndex;
        
        // Connection line
        connections.push(
          <Line
            key={`${layer.id}-${connectionId}`}
            points={[
              [layer.position[0] + 0.6, layer.position[1], layer.position[2]],
              [targetLayer.position[0] - 0.6, targetLayer.position[1], targetLayer.position[2]]
            ]}
            color={isActive ? "#6366f1" : "#374151"}
            lineWidth={isActive ? 4 : 2}
            transparent
            opacity={isActive ? 0.8 : 0.3}
          />
        );

        // Data flow particles
        if (isActive) {
          dataFlows.push(
            <DataFlowParticles
              key={`flow-${layer.id}-${connectionId}`}
              fromLayer={layer}
              toLayer={targetLayer}
              isActive={isActive}
            />
          );
        }
      }
    });
  });

  return (
    <>
      {connections}
      {dataFlows}
    </>
  );
};

const StorytellingTooltip: React.FC = () => {
  const { selectedSample, currentStep } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  const stepDescriptions = [
    {
      title: "Ready to Begin",
      description: "Select a sample input to start the neural network journey",
      details: ""
    },
    {
      title: "Input Processing",
      description: "Raw user behavior data enters the network",
      details: selectedSample ? `Processing: ${selectedSample.name}` : ""
    },
    {
      title: "Embedding Transformation",
      description: "Sparse features converted to dense vector representations",
      details: "Categories and items mapped to latent space"
    },
    {
      title: "Behavior Sequence Analysis",
      description: "Processing temporal patterns in user behavior",
      details: "Sequential dependencies captured through GRU layers"
    },
    {
      title: "Attention Mechanism",
      description: "AUGRU focuses on relevant behavioral patterns",
      details: "Attention weights highlight important interactions"
    },
    {
      title: "Interest Evolution",
      description: "Modeling how user interests change over time",
      details: "Dynamic interest representation for better predictions"
    },
    {
      title: "Final Prediction",
      description: "DeepFM generates click probability prediction",
      details: "91% confidence for recommended item"
    }
  ];

  const currentStepInfo = stepDescriptions[currentStep] || stepDescriptions[0];

  useEffect(() => {
    if (selectedSample && currentStep > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, selectedSample]);

  if (!selectedSample || currentStep === 0) return null;

  return (
    <div 
      className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-background-tertiary/95 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/20 max-w-md">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse" />
          <h4 className="font-semibold text-white text-sm">{currentStepInfo.title}</h4>
        </div>
        <p className="text-white/80 text-sm mb-1">{currentStepInfo.description}</p>
        {currentStepInfo.details && (
          <p className="text-white/60 text-xs">{currentStepInfo.details}</p>
        )}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-white/50">Step {currentStep} of 6</span>
          <div className="w-16 h-1 bg-background/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ParticleField: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x += 0.0005;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6366f1"
        size={0.02}
        transparent
        opacity={0.4}
      />
    </points>
  );
};

const Scene: React.FC = () => {
  const { layers, highlightedLayer, currentStep, autoRotate } = useStore();

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#ffffff" />
      
      <ParticleField />
      
      <NetworkConnections 
        layers={layers} 
        currentStep={currentStep}
      />
      
      {layers.map((layer, index) => (
        <NetworkBlock
          key={layer.id}
          layer={layer}
          isHighlighted={highlightedLayer === layer.id}
          isActive={currentStep > index}
        />
      ))}
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={0.3}
        maxDistance={25}
        minDistance={8}
      />
    </>
  );
};

export const NetworkVisualization: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-background to-background-secondary rounded-xl overflow-hidden relative">
      <StorytellingTooltip />
      <Canvas camera={{ position: [15, 8, 15], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
};