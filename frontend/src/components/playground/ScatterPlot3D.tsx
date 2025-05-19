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
import usersJson from '../../assets/data/users.json';

type Product = { 
  id: number;
  name: string;
  x: number; 
  y: number; 
  z: number; 
  cluster: number;
  category: string;
};

type User = { 
  user_id: string; 
  purchases: [number, number, number][]; 
};

// Mock data structure if JSON files don't exist
const mockProducts: Product[] = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  name: `Product ${i}`,
  x: (Math.random() - 0.5) * 40,
  y: (Math.random() - 0.5) * 40,
  z: (Math.random() - 0.5) * 40,
  cluster: Math.floor(Math.random() * 5),
  category: ['Clothing', 'Electronics', 'Home Goods', 'Sports', 'Beauty'][Math.floor(Math.random() * 5)]
}));

const mockUsers: User[] = Array.from({ length: 10 }, (_, i) => ({
  user_id: `user_${i}`,
  purchases: Array.from({ length: 5 }, () => [
    Math.floor(Math.random() * 200),
    Math.floor(Math.random() * 200),
    Math.floor(Math.random() * 200)
  ])
}));

// Use real data if available, otherwise mock data
const products: Product[] = 'id' in (productsJson[0] || {}) 
  ? productsJson as unknown as Product[]
  : mockProducts;

const users: User[] = 'user_id' in (usersJson[0] || {})
  ? usersJson as unknown as User[]
  : mockUsers;

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

// Colors for clusters
const CLUSTER_COLORS = [
  0x6366F1, // primary (indigo)
  0xF472B6, // secondary (pink)
  0xF59E0B, // accent (amber)
  0x10B981, // success (emerald)
  0xEF4444, // error (red)
];

const ScatterPlot3D = forwardRef<ScatterPlot3DHandle, ScatterPlot3DProps>(
  ({ height = '600px', className = '' }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const productMeshesRef = useRef<THREE.Mesh[]>([]);
    const userLinesRef = useRef<THREE.Line[]>([]);
    const highlightedMeshRef = useRef<THREE.Mesh | null>(null);
    
    const [isSearching, setIsSearching] = useState(false);

    // Camera position state
    const azimuthRef = useRef(0);
    const polarRef = useRef(Math.PI / 6);
    const radiusRef = useRef(50);
    const orbitEnabledRef = useRef(true);
    const targetPositionRef = useRef(new THREE.Vector3(0, 0, 0));

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      zoomIn() {
        radiusRef.current = Math.max(10, radiusRef.current - 5);
        updateCameraPosition();
      },
      zoomOut() {
        radiusRef.current += 5;
        updateCameraPosition();
      },
      toggleRotate() {
        orbitEnabledRef.current = !orbitEnabledRef.current;
        if (controlsRef.current) {
          controlsRef.current.autoRotate = orbitEnabledRef.current;
        }
      },
      resetView() {
        azimuthRef.current = 0;
        polarRef.current = Math.PI / 6;
        radiusRef.current = 50;
        targetPositionRef.current.set(0, 0, 0);
        updateCameraPosition();
        
        // Reset any highlighted products
        resetHighlights();
      },
      moveCamera(direction: 'left' | 'right' | 'up' | 'down') {
        const stepSize = 5;
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
      searchProduct(term: string) {
        if (!term) {
          resetHighlights();
          return;
        }
        
        setIsSearching(true);
        
        // Normalize search term
        const searchTerm = term.toLowerCase();
        
        // Find products that match the search term
        const matchingProducts = products.filter(p => 
          p.name.toLowerCase().includes(searchTerm) || 
          p.category.toLowerCase().includes(searchTerm)
        );
        
        if (matchingProducts.length > 0) {
          // Highlight matching products
          highlightProducts(matchingProducts);
          
          // Calculate center position of matching products
          const center = matchingProducts.reduce(
            (acc, product) => {
              acc.x += product.x;
              acc.y += product.y;
              acc.z += product.z;
              return acc;
            },
            { x: 0, y: 0, z: 0 }
          );
          
          const count = matchingProducts.length;
          targetPositionRef.current.set(
            center.x / count,
            center.y / count,
            center.z / count
          );
          
          // Move camera to look at the matching products
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
          mesh.material.color.setHex(CLUSTER_COLORS[product.cluster % CLUSTER_COLORS.length]);
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
          color: new THREE.Color(CLUSTER_COLORS[product.cluster % CLUSTER_COLORS.length])
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(product.x, product.y, product.z);
        mesh.userData = { productId: product.id, productName: product.name };
        
        scene.add(mesh);
        productMeshes.push(mesh);
      });
      
      productMeshesRef.current = productMeshes;
      
      // Create user journey lines
      const userLines: THREE.Line[] = [];
      
      users.slice(0, 5).forEach(user => {
        if (user.purchases.length < 2) return;
        
        const points: THREE.Vector3[] = user.purchases.map(purchaseId => {
          const product = products.find(p => p.id === purchaseId[0]);
          return product 
            ? new THREE.Vector3(product.x, product.y, product.z)
            : new THREE.Vector3(0, 0, 0);
        });
        
        if (points.length < 2) return;
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: 0xffffff,
          opacity: 0.3,
          transparent: true
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        userLines.push(line);
      });
      
      userLinesRef.current = userLines;

      // Setup raycaster for mouse interaction
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      const onMouseMove = (event: MouseEvent) => {
        if (!mountRef.current) return;
        
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