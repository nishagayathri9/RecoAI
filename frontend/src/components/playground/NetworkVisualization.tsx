import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line, Box, Cylinder, Sphere } from '@react-three/drei';
import { LayerInfo, useStore } from '../../store/index';
import FlowParticles from './FlowParticles'; 

import * as THREE from 'three';


interface ProfessionalDataFlowProps {
  fromLayer: any;
  toLayer:   any;
  isActive:  boolean;
}

/**
 * Professional neural network layer representations based on the reference image
 */
function getLayerGeometry(layer: any): [React.ReactNode, [number, number, number]] {
  const baseProps = { 
    castShadow: true,
    receiveShadow: true
  };

  const SwirlElement: React.FC<{ index: number }> = ({ index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + index * Math.PI / 3;
      const radius = 1.3;
      meshRef.current.position.x = Math.cos(time * 2) * radius;
      meshRef.current.position.z = Math.sin(time * 2) * radius;
      meshRef.current.position.y = Math.sin(time * 3) * 0.5;
    }
  });

  return (
    <Box ref={meshRef} args={[0.1, 0.8, 0.1]} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#ffffff" 
        metalness={0.8} 
        roughness={0.2}
        emissive="#ffffff"
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
      />
    </Box>
  );
};

  switch (layer.id) {
    case 'input':
      // Large input feature matrix - like the leftmost layer in the image
      return [
        <group key="input-group">
          <Box args={[0.3, 4, 3]} {...baseProps}>
            <meshStandardMaterial 
              color="#4f46e5" 
              metalness={0.1} 
              roughness={0.8}
              transparent
              opacity={0.9}
            />
          </Box>
          {/* Grid pattern to show feature matrix */}
          {Array.from({ length: 12 }, (_, i) => (
            <Box 
              key={i}
              args={[0.32, 0.25, 0.2]} 
              position={[0, (i - 5.5) * 0.3, (i % 3 - 1) * 0.8]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color="#6366f1" 
                metalness={0.2} 
                roughness={0.6}
                transparent
                opacity={0.7}
              />
            </Box>
          ))}
        </group>,
        [0.3, 4, 3]
      ];
      
    case 'embedding_user':
    case 'embedding_item': 
    case 'embedding_context':
      // Dense embedding blocks - smaller, more compact
      return [
        <group key={`${layer.id}-group`}>
          <Box args={[0.8, 2.5, 1.5]} {...baseProps}>
            <meshStandardMaterial 
              color={layer.color}
              metalness={0.3}
              roughness={0.4}
              transparent
              opacity={0.85}
            />
          </Box>
          {/* Internal structure showing embedding dimensions */}
          {Array.from({ length: 8 }, (_, i) => (
            <Box 
              key={i}
              args={[0.82, 0.25, 0.1]} 
              position={[0, (i - 3.5) * 0.3, 0.6]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.8} 
                roughness={0.2}
                transparent
                opacity={0.6}
              />
            </Box>
          ))}
        </group>,
        [0.8, 2.5, 1.5]
      ];
      
    case 'dien_extractor':
      // GRU layers - stacked recurrent blocks
      return [
        <group key="gru-group">
          {[0, 0.6, 1.2].map((y, i) => (
            <Box 
              key={i}
              args={[1.2, 0.4, 2]} 
              position={[0, y - 0.6, 0]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color={layer.color}
                metalness={0.4}
                roughness={0.3}
                transparent
                opacity={0.8}
              />
            </Box>
          ))}
          {/* GRU gates representation */}
          {Array.from({ length: 6 }, (_, i) => (
            <Sphere 
              key={i}
              args={[0.08]} 
              position={[
                (i % 3 - 1) * 0.4,
                Math.floor(i / 3) * 0.6 - 0.3,
                0.8
              ]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color="#fbbf24" 
                metalness={0.9} 
                roughness={0.1}
                emissive="#fbbf24"
                emissiveIntensity={0.3}
              />
            </Sphere>
          ))}
        </group>,
        [1.2, 1.2, 2]
      ];
      
    case 'dien_evolution':
      // AUGRU with attention - more complex structure
      return [
        <group key="augru-group">
          <Box args={[1.5, 1, 2.2]} {...baseProps}>
            <meshStandardMaterial 
              color={layer.color}
              metalness={0.5}
              roughness={0.2}
              transparent
              opacity={0.8}
            />
          </Box>
          {/* Attention mechanism visualization */}
          {Array.from({ length: 8 }, (_, i) => (
            <Box 
              key={i}
              args={[0.05, 0.8, 0.05]}
              position={[
                (i % 4 - 1.5) * 0.3,
                0,
                Math.floor(i / 4) * 0.8 - 0.4
              ]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color="#f59e0b" 
                metalness={0.8} 
                roughness={0.1}
                emissive="#f59e0b"
                emissiveIntensity={0.4}
              />
            </Box>
          ))}
        </group>,
        [1.5, 1, 2.2]
      ];
      
    case 'deepfm_linear':
      // Linear component - simple flat layer
      return [
        <Box args={[2, 0.3, 1.8]} {...baseProps}>
          <meshStandardMaterial 
            color={layer.color}
            metalness={0.6}
            roughness={0.2}
            transparent
            opacity={0.85}
          />
        </Box>,
        [2, 0.3, 1.8]
      ];
      
    case 'deepfm_fm':
      // Factorization Machine - cross-interaction representation
      return [
        <group key="fm-group">
          <Box args={[1.8, 0.8, 1.6]} {...baseProps}>
            <meshStandardMaterial 
              color={layer.color}
              metalness={0.4}
              roughness={0.3}
              transparent
              opacity={0.8}
            />
          </Box>
          {/* Cross connections showing factorization */}
          {Array.from({ length: 12 }, (_, i) => (
            <Box 
              key={i}
              args={[0.02, 0.6, 0.02]}
              position={[
                Math.cos(i * Math.PI / 6) * 0.7,
                0,
                Math.sin(i * Math.PI / 6) * 0.6
              ]}
              rotation={[0, i * Math.PI / 6, 0]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.9} 
                roughness={0.1}
                emissive="#ffffff"
                emissiveIntensity={0.3}
              />
            </Box>
          ))}
        </group>,
        [1.8, 0.8, 1.6]
      ];
      
    case 'deepfm_deep':
      // Deep MLP stack - like the conv layers in the image
      return [
        <group key="deep-group">
          {[0, 0.5, 1.0].map((y, i) => (
            <Box 
              key={i}
              args={[1.6 - i * 0.2, 0.4, 1.4 - i * 0.2]} 
              position={[0, y - 0.5, 0]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color={layer.color}
                metalness={0.3 + i * 0.1}
                roughness={0.4 - i * 0.05}
                transparent
                opacity={0.8}
              />
            </Box>
          ))}
          {/* Neural connections between layers */}
          {Array.from({ length: 15 }, (_, i) => (
            <Cylinder 
              key={i}
              args={[0.02, 0.02, 0.4]}
              position={[
                (i % 5 - 2) * 0.25,
                0.25,
                (Math.floor(i / 5) - 1) * 0.25
              ]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color="#64748b" 
                metalness={0.7} 
                roughness={0.3}
                transparent
                opacity={0.6}
              />
            </Cylinder>
          ))}
        </group>,
        [1.6, 1, 1.4]
      ];
      
case 'fusion_layer': {
  // Fusion layer – sphere with swirling elements
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      sphereRef.current.scale.setScalar(pulse);
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02;
    }
  });

  return [
    <group key="fusion-group">
      <Sphere ref={sphereRef} args={[1.0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={layer.color}
          metalness={0.7}
          roughness={0.1}
          transparent
          opacity={0.85}
          emissive={layer.color}
          emissiveIntensity={0.2}
        />
      </Sphere>

      <group ref={groupRef}>
        {Array.from({ length: 6 }, (_, i) => (
          <SwirlElement key={i} index={i} />
        ))}
      </group>
    </group>,
    // adjust collision/spacing bounds
    [2.0, 2.0, 2.0]
  ];
}

    case 'output':
      // Final prediction layer - like the rightmost spheres in the image
      return [
        <group key="output-group">
          {Array.from({ length: 10 }, (_, i) => (
            <Sphere 
              key={i}
              args={[0.15]} 
              position={[0, (i - 4.5) * 0.3, 0]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color={layer.color}
                metalness={0.8}
                roughness={0.1}
                emissive={layer.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.9}
              />
            </Sphere>
          ))}
          {/* Output labels */}
          {Array.from({ length: 10 }, (_, i) => (
            <Box 
              key={`label-${i}`}
              args={[0.3, 0.15, 0.05]}
              position={[0.4, (i - 4.5) * 0.3, 0]}
              {...baseProps}
            >
              <meshStandardMaterial 
                color="#64748b" 
                metalness={0.5} 
                roughness={0.4}
                transparent
                opacity={0.7}
              />
            </Box>
          ))}
        </group>,
        [0.7, 3, 0.3]
      ];
      
    default:
      return [
        <Box args={[1, 1, 1]} {...baseProps}>
          <meshStandardMaterial color={layer.color} />
        </Box>,
        [1, 1, 1]
      ];
  }
}

const ProfessionalNetworkBlock: React.FC<{
  layer: any;
  isHighlighted: boolean;
  isActive: boolean;
}> = ({ layer, isHighlighted, isActive }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const [geometry, dims] = getLayerGeometry(layer);

  useFrame((state) => {
    if (groupRef.current) {
      if (isHighlighted) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        groupRef.current.scale.setScalar(1.05 + Math.sin(state.clock.elapsedTime * 3) * 0.02);
      } else if (isActive) {
        groupRef.current.scale.setScalar(1.02);
      } else {
        groupRef.current.scale.setScalar(1);
        groupRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <group position={layer.position} ref={groupRef}>
      {/* Main geometry */}
      {geometry}

      {/* Connection ports */}
      {layer.connections.length > 0 && (
        <Cylinder 
          args={[0.05, 0.05, 0.2]} 
          position={[dims[0] / 2 + 0.2, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={isActive ? '#10b981' : '#6b7280'}
            metalness={0.8}
            roughness={0.2}
            emissive={isActive ? '#10b981' : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </Cylinder>
      )}
      
      {layer.id !== 'input' && (
        <Cylinder 
          args={[0.05, 0.05, 0.2]} 
          position={[-dims[0] / 2 - 0.2, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={isActive ? '#10b981' : '#6b7280'}
            metalness={0.8}
            roughness={0.2}
            emissive={isActive ? '#10b981' : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </Cylinder>
      )}

      {/* Professional labels */}
      <Text
        position={[0, dims[1] / 2 + 0.8, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {layer.name}
      </Text>
      <Text
        position={[0, dims[1] / 2 + 0.4, 0]}
        fontSize={0.18}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {layer.type}
      </Text>
      <Text
        position={[0, dims[1] / 2 + 0.1, 0]}
        fontSize={0.14}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        {layer.dimensions}
      </Text>
    </group>
  );
};


const ProfessionalDataFlow: React.FC<ProfessionalDataFlowProps> = ({ fromLayer, toLayer, isActive }) => {
  // Precompute the two end‐points for the line.
  const points = useMemo(() => {
    // Optionally offset the endpoints a bit so the line does not cut inside each geometry
    const OFFSET = 0.6;

    // Rough “half‐width” of the connecting spheres on each side:
    const startX = fromLayer.position[0] + OFFSET;
    const startY = fromLayer.position[1];
    const startZ = fromLayer.position[2];

    const endX = toLayer.position[0] - OFFSET;
    const endY = toLayer.position[1];
    const endZ = toLayer.position[2];

    return [
      new THREE.Vector3(startX, startY, startZ),
      new THREE.Vector3(endX,   endY,   endZ),
    ];
  }, [fromLayer, toLayer]);

  return (
    <>
      {/* 1) Static line: */}
      <Line
        points={points}
        color={isActive ? '#70d8db' : '#374151'}  // bright blue if active, dim gray if not
        lineWidth={isActive ? 1 : 0.5}
        transparent
        opacity={isActive ? 0.8 : 0.25}
      />

      {/* 2) FlowParticles: */}
      {isActive && (
        <FlowParticles
          fromLayer={fromLayer}
          toLayer={toLayer}
          isActive={isActive}
        />
      )}
    </>
  );
};

interface ProfessionalConnectionsProps {
  layers:       any[];
  currentStep:  number;
}

const ProfessionalConnections: React.FC<ProfessionalConnectionsProps> = ({ layers, currentStep }) => {
  const items: JSX.Element[] = [];

  layers.forEach((layer, layerIdx) => {
    layer.connections.forEach((connId: string) => {
      const targetLayer = layers.find(l => l.id === connId);
      if (!targetLayer) return;

      // Only show this connection once layerIdx < currentStep
      const isActive = currentStep > layerIdx;

      items.push(
        <ProfessionalDataFlow
          key={`flow-${layer.id}-${connId}`}
          fromLayer={layer}
          toLayer={targetLayer}
          isActive={isActive}
        />
      );
    });
  });

  return <>{items}</>;
};

const ProfessionalEnvironment: React.FC = () => {
  return (
    <>
      {/* Professional lighting setup */}
      <ambientLight intensity={0.4} color="#f8fafc" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.6} 
        color="#e2e8f0"
      />
      <pointLight position={[0, 8, 0]} intensity={0.8} color="#f1f5f9" />
      
      {/* Professional grid floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.1} 
          roughness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Grid lines */}
      {Array.from({ length: 21 }, (_, i) => (
        <Line
          key={`grid-x-${i}`}
          points={[[-20, -2.99, (i - 10) * 2], [20, -2.99, (i - 10) * 2]]}
          color="#334155"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
      {Array.from({ length: 21 }, (_, i) => (
        <Line
          key={`grid-z-${i}`}
          points={[[(i - 10) * 2, -2.99, -20], [(i - 10) * 2, -2.99, 20]]}
          color="#334155"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
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
    },
    {
      title: "Final Prediction",
      description: "DeepFM generates click probability prediction",
      details: "91% confidence for recommended item"
    },
    {
      title: "Final Prediction",
      description: "DeepFM generates click probability prediction",
      details: "91% confidence for recommended item"
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

const Scene: React.FC = () => {
  const { layers, highlightedLayer, currentStep, autoRotate } = useStore();

  return (
    <>
      {/* (Lighting, particle‐background, etc…) */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#ffffff" />

      <ProfessionalEnvironment />

      {/* 1) Draw all connection lines + particles */}
      <ProfessionalConnections
        layers={layers}
        currentStep={currentStep}
      />

      {/* 2) Draw each block on top: */}
      {layers.map((layer, idx) => (
        <ProfessionalNetworkBlock
          key={layer.id}
          layer={layer}
          isHighlighted={highlightedLayer === layer.id}
          isActive={currentStep > idx}
        />
      ))}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
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