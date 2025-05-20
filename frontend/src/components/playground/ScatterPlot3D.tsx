import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styles from './ScatterPlot3D.module.css';

// Typed imports for data
import productsJson from '../../assets/data/products.json';

type Product = {
  id: number;
  product_title: string;
  x: number;
  y: number;
  z: number;
  category: string;
  subcategory: string;
};

// Use real data if available, otherwise mock data
const products: Product[] = productsJson as unknown as Product[];

export interface ScatterPlot3DHandle {
  zoomIn(): void;
  zoomOut(): void;
  toggleRotate(): void;
  resetView(): void;
  moveCamera(direction: 'left' | 'right' | 'up' | 'down'): void;
  searchProduct(term: string): void;
}

interface ScatterPlot3DProps {
  height?: string;
  className?: string;
}

const CATEGORY_COLORS = [
  0x6366F1, // indigo
  0xF472B6, // pink
  0xF59E0B, // amber
  0x10B981, // emerald
  0xEF4444, // red
  0x8B5CF6, // violet
  0x34D399, // green
  0xF97316, // orange
];

const getCategoryColor = (() => {
  const cache: Record<string, number> = {};
  return (category: string) => {
    if (!cache[category]) {
      const nextIndex = Object.keys(cache).length % CATEGORY_COLORS.length;
      cache[category] = CATEGORY_COLORS[nextIndex];
    }
    return cache[category];
  };
})();

const ScatterPlot3D = forwardRef<ScatterPlot3DHandle, ScatterPlot3DProps>(
  ({ height = '600px', className = '' }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const productMeshesRef = useRef<THREE.Mesh[]>([]);
    const highlightedMeshRef = useRef<THREE.Mesh | null>(null);
    
    const [isSearching, setIsSearching] = useState(false);

    // Camera position state
    const azimuthRef = useRef(0);
    const polarRef = useRef(Math.PI / 6);
    const radiusRef = useRef(100);
    const orbitEnabledRef = useRef(true);
    const targetPositionRef = useRef(new THREE.Vector3(0, 0, 0));

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      /** Zoom the camera in (closer to the plot) */
      zoomIn() {
        radiusRef.current = Math.max(10, radiusRef.current - 5);
        updateCameraPosition();
      },

      /** Zoom the camera out (farther from the plot) */
      zoomOut() {
        radiusRef.current += 5;
        updateCameraPosition();
      },

      /** Toggle automatic orbit-rotation on/off */
      toggleRotate() {
        orbitEnabledRef.current = !orbitEnabledRef.current;
        if (controlsRef.current) {
          controlsRef.current.autoRotate = orbitEnabledRef.current;
        }
      },

      /** Reset camera, target and highlights to their defaults */
      resetView() {
        azimuthRef.current = 0;
        polarRef.current = Math.PI / 6;
        radiusRef.current = 100;
        targetPositionRef.current.set(0, 0, 0);
        updateCameraPosition();
        resetHighlights();
      },

      /** Pan the camera in 90-degree increments */
      moveCamera(direction: 'left' | 'right' | 'up' | 'down') {
        switch (direction) {
          case 'left':
            azimuthRef.current -= Math.PI / 16;
            break;
          case 'right':
            azimuthRef.current += Math.PI / 16;
            break;
          case 'up':
            polarRef.current = Math.max(0.1, polarRef.current - Math.PI / 16);
            break;
          case 'down':
            polarRef.current = Math.min(Math.PI - 0.1, polarRef.current + Math.PI / 16);
            break;
        }
        updateCameraPosition();
      },

      /** Keyword search across product_title, category and subcategory */
      searchProduct(term: string) {
        if (!term) {
          resetHighlights();
          return;
        }

        setIsSearching(true);
        const searchTerm = term.trim().toLowerCase();

        const matchingProducts = products.filter(
          p =>
            p.product_title.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm) ||
            p.subcategory.toLowerCase().includes(searchTerm)
        );

        if (matchingProducts.length) {
          highlightProducts(matchingProducts);

          // Calculate the geometric centre of the matches
          const centre = matchingProducts.reduce(
            (acc, { x, y, z }) => {
              acc.x += x;
              acc.y += y;
              acc.z += z;
              return acc;
            },
            { x: 0, y: 0, z: 0 }
          );

          const count = matchingProducts.length;
          targetPositionRef.current.set(
            centre.x / count,
            centre.y / count,
            centre.z / count
          );

          // Re-target the controls so the camera orbits the highlighted cluster
          if (cameraRef.current && controlsRef.current) {
            controlsRef.current.target.copy(targetPositionRef.current);
          }
        } else {
          resetHighlights();
        }

        setIsSearching(false);
      }
    }));

    
    // Helper functions
    const updateCameraPosition = () => {
      if (!cameraRef.current || !controlsRef.current) return;
      
      const sinP = Math.sin(polarRef.current);
      
      // Update camera position
      cameraRef.current.position.set(
        targetPositionRef.current.x + radiusRef.current * sinP * Math.cos(azimuthRef.current),
        targetPositionRef.current.y + radiusRef.current * Math.cos(polarRef.current),
        targetPositionRef.current.z + radiusRef.current * sinP * Math.sin(azimuthRef.current)
      );
      
      // Update controls target
      controlsRef.current.target.copy(targetPositionRef.current);
      
      // Update camera
      cameraRef.current.lookAt(targetPositionRef.current);
      cameraRef.current.updateProjectionMatrix();
      controlsRef.current.update();
    };
    
    const resetHighlights = () => {
      // Reset all product meshes to their original colors
      productMeshesRef.current.forEach((mesh, index) => {
        const product = products[index];
        if (product && mesh.material instanceof THREE.MeshLambertMaterial) {
          mesh.material.color.setHex(getCategoryColor(product.category));
          mesh.material.emissive.setHex(0x000000);
          mesh.scale.set(1, 1, 1);
        }
      });
      
      // Remove any highlight mesh
      if (highlightedMeshRef.current && sceneRef.current) {
        sceneRef.current.remove(highlightedMeshRef.current);
        highlightedMeshRef.current = null;
      }
    };
    
    const highlightProducts = (matchingProducts: Product[]) => {
      // Reset previous highlights
      resetHighlights();
      
      // Highlight matching products
      matchingProducts.forEach(product => {
        const index = products.findIndex(p => p.id === product.id);
        if (index >= 0 && index < productMeshesRef.current.length) {
          const mesh = productMeshesRef.current[index];
          if (mesh.material instanceof THREE.MeshLambertMaterial) {
            // Make the product glow and larger
            mesh.material.emissive.setHex(0x555555);
            mesh.scale.set(1.5, 1.5, 1.5);
          }
        }
      });
    };

    useEffect(() => {
      if (!mountRef.current) return;

      const width = mountRef.current.clientWidth;
      const heightPx = parseInt(height, 10) || mountRef.current.clientHeight;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x111111);
      sceneRef.current = scene;
      
      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        60,
        width / heightPx,
        0.1,
        1000
      );
      camera.position.set(0, 30, 50);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      // Grid & Axes
      const grid = new THREE.GridHelper(200, 50, 0x222222, 0x222222);
      grid.position.y = -0.1;
      scene.add(grid);
      
      const axesHelper = new THREE.AxesHelper(50);
      scene.add(axesHelper);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(10, 20, 10);
      scene.add(dirLight);

      // Orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = orbitEnabledRef.current;
      controls.autoRotateSpeed = 0.5;
      controlsRef.current = controls;

      // Create product points
      const productMeshes: THREE.Mesh[] = [];
      
      // Create product geometry for instancing
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      
      products.forEach((product, index) => {
        const material = new THREE.MeshLambertMaterial({
          color: new THREE.Color(getCategoryColor(product.category))
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(product.x, product.y, product.z);
        
        scene.add(mesh);
        productMeshes.push(mesh);
      });
      
      productMeshesRef.current = productMeshes;
      
      // Setup raycaster for mouse interaction
      let lastPick = 0;          // time of the last ray-cast
      const PICK_DELAY = 50;     // ms between picks  (≈ 20 fps)
  
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      const onMouseMove = (event: MouseEvent) => {
        if (!mountRef.current) return;
      
        const now = performance.now();
        if (now - lastPick < PICK_DELAY) return;   // skip this frame
        lastPick = now;

        // Calculate mouse position in normalized device coordinates
        const rect = mountRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersections
        const intersects = raycaster.intersectObjects(productMeshes);
        
        if (intersects.length > 0) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'default';
        }
      };
      
      // Attach mouse move listener
      mountRef.current.addEventListener('mousemove', onMouseMove);

      // Camera updater
      updateCameraPosition();

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Auto-rotate if enabled
        controls.update();
        
        renderer.render(scene, camera);
      };
      
      animate();

      // Handle window resize
      const handleResize = () => {
        if (!mountRef.current) return;
        
        const newWidth = mountRef.current.clientWidth;
        const newHeight = parseInt(height, 10) || mountRef.current.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(newWidth, newHeight);
      };
      
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        
        if (mountRef.current) {
          mountRef.current.removeEventListener('mousemove', onMouseMove);
          mountRef.current.innerHTML = '';
        }
        
        controls.dispose();
        renderer.dispose();
        
        // Dispose geometries and materials
        geometry.dispose();
        productMeshes.forEach(mesh => {
          if (mesh.material instanceof THREE.Material) {
            mesh.material.dispose();
          }
        });
      };
    }, [height]);

    return (
      <div
        ref={mountRef}
        className={`${styles.scatterContainer} ${className} ${isSearching ? styles.searching : ''}`}
        style={{ height }}
      />
    );
  }
);

export default ScatterPlot3D;