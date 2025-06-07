import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlowParticlesProps {
  fromLayer: { position: [number, number, number] };
  toLayer:   { position: [number, number, number] };
  isActive:  boolean;
}

/**
 * FlowParticles will render N small dots that continuously move
 * from fromLayer.position to toLayer.position, looping around.
 */
const FlowParticles: React.FC<FlowParticlesProps> = ({ fromLayer, toLayer, isActive }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Choose how many “orbs” you want flowing along each connection:
  const COUNT = 20;

  // Precompute initial positions and colors once.
  const [buffers] = useState(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      // t ∈ [0,1] evenly spaced along the line
      const t = i / COUNT;

      // Linear interpolation betw. from / to
      positions[i * 3]     = fromLayer.position[0] + (toLayer.position[0] - fromLayer.position[0]) * t;
      positions[i * 3 + 1] = fromLayer.position[1] + (toLayer.position[1] - fromLayer.position[1]) * t;
      positions[i * 3 + 2] = fromLayer.position[2] + (toLayer.position[2] - fromLayer.position[2]) * t;

      // Give each point a color (for example, a bluish tint)
      colors[i * 3]     = 0.4;
      colors[i * 3 + 1] = 0.6;
      colors[i * 3 + 2] = 1.0;
    }

    return { positions, colors };
  });

  // On each frame, shift each point’s “t” slightly forward (so they move)
  useFrame((state) => {
    if (!isActive || !pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime * 0.5; // speed factor

    // For each particle i, recompute its current t = base_t + time (mod 1)
    for (let i = 0; i < COUNT; i++) {
      const baseT = i / COUNT;
      const t = (baseT + time) % 1; // loop around when >= 1

      positions[i * 3]     = fromLayer.position[0] + (toLayer.position[0] - fromLayer.position[0]) * t;
      positions[i * 3 + 1] = fromLayer.position[1] + (toLayer.position[1] - fromLayer.position[1]) * t
                             + Math.sin(time * 2 + i) * 0.05; 
                             // a small “wobble” in Y just for extra liveliness
      positions[i * 3 + 2] = fromLayer.position[2] + (toLayer.position[2] - fromLayer.position[2]) * t;
    }

    posAttr.needsUpdate = true;
  });

  if (!isActive) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={buffers.positions}
          count={buffers.positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={buffers.colors}
          count={buffers.colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default FlowParticles;
