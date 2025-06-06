import { create } from 'zustand';

export type InputSample = {
  id: number;
  name: string;
  description: string;
  userBehavior: string[];
  metadata: Record<string, any>;
};

export type ViewMode = 'free' | 'guided';

export type LayerInfo = {
  id: string;
  name: string;
  type: string;
  description: string;
  position: [number, number, number];
  color: string;
  size: number;
  blockType: 'cube' | 'wide';
  connections: string[];
};

interface StoreState {
  selectedSample: InputSample | null;
  sampleInputs: InputSample[];
  currentStep: number;
  maxSteps: number;
  isPlaying: boolean;
  viewMode: ViewMode;
  cameraPosition: { x: number; y: number; z: number };
  autoRotate: boolean;
  highlightedLayer: string | null;
  layers: LayerInfo[];
  showSummary: boolean;
  // Actions
  selectSample: (sample: InputSample) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetPlayground: () => void;
  setPlaying: (playing: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setCameraPosition: (position: { x: number; y: number; z: number }) => void;
  toggleAutoRotate: () => void;
  highlightLayer: (layerId: string | null) => void;
  setShowSummary: (show: boolean) => void;
}

// Sample inputs
const sampleInputs: InputSample[] = [
  {
    id: 1,
    name: "Office Furniture Shopper",
    description: "User interested in minimalist desks and office furniture",
    userBehavior: [
      "Viewed Minimalist Desks",
      "Viewed Office Chairs", 
      "Viewed Cable Management",
      "Added Ash Wood Desk to Cart"
    ],
    metadata: {
      categories: ["Furniture", "Office", "Minimalist"],
      priceRange: "$$",
      recentSearch: "space saving desk"
    }
  },
  {
    id: 2,
    name: "Tech Enthusiast",
    description: "User browsing high-end electronics and accessories",
    userBehavior: [
      "Viewed Gaming Laptops",
      "Viewed Mechanical Keyboards",
      "Viewed Ultrawide Monitors", 
      "Added Gaming Headset to Cart"
    ],
    metadata: {
      categories: ["Electronics", "Gaming", "Peripherals"],
      priceRange: "$$$",
      recentSearch: "best gaming setup 2025"
    }
  },
  {
    id: 3,
    name: "Kitchen Renovator", 
    description: "User looking for kitchen appliances and fixtures",
    userBehavior: [
      "Viewed Kitchen Faucets",
      "Viewed Refrigerators",
      "Viewed Countertop Materials",
      "Added Smart Dishwasher to Cart"
    ],
    metadata: {
      categories: ["Kitchen", "Appliances", "Smart Home"],
      priceRange: "$$$", 
      recentSearch: "modern kitchen design"
    }
  }
];

// Neural network layers based on DIEN + DeepFM architecture with building block styling
const layers: LayerInfo[] = [
  {
    id: 'input',
    name: 'Input Layer',
    type: 'Data Input',
    description: 'Raw user behavior sequence and features',
    position: [-8, 0, 0],
    color: '#22d3ee',
    size: 1.2,
    blockType: 'cube',
    connections: ['embedding']
  },
  {
    id: 'embedding',
    name: 'Embedding',
    type: 'Feature Transform',
    description: 'Convert sparse features to dense embeddings',
    position: [-5, 0, 0],
    color: '#3b82f6',
    size: 1.0,
    blockType: 'wide',
    connections: ['behavior', 'gru']
  },
  {
    id: 'behavior',
    name: 'Behavior Layer',
    type: 'Sequence Processing',
    description: 'Process user behavior sequence',
    position: [-2, -2, 0],
    color: '#8b5cf6',
    size: 0.8,
    blockType: 'cube',
    connections: ['gru']
  },
  {
    id: 'gru',
    name: 'GRU Layer',
    type: 'Recurrent Unit',
    description: 'Gated Recurrent Unit for sequence modeling',
    position: [1, -1, 0],
    color: '#a855f7',
    size: 0.9,
    blockType: 'wide',
    connections: ['attention']
  },
  {
    id: 'attention',
    name: 'AUGRU',
    type: 'Attention Mechanism',
    description: 'Attention-based GRU with focus mechanism',
    position: [4, 0, 0],
    color: '#c084fc',
    size: 1.1,
    blockType: 'cube',
    connections: ['interest_evolving']
  },
  {
    id: 'interest_evolving',
    name: 'Interest Evolution',
    type: 'Dynamic Modeling',
    description: 'Model evolving user interests over time',
    position: [7, 1, 0],
    color: '#f97316',
    size: 1.0,
    blockType: 'wide',
    connections: ['deepfm']
  },
  {
    id: 'deepfm',
    name: 'DeepFM',
    type: 'Factorization Machine',
    description: 'Deep factorization machine for final processing',
    position: [10, -1, 0], 
    color: '#10b981',
    size: 0.9,
    blockType: 'cube',
    connections: ['output']
  },
  {
    id: 'output',
    name: 'Prediction',
    type: 'Output Layer',
    description: 'Final click probability prediction',
    position: [13, 0, 0],
    color: '#ef4444',
    size: 1.3,
    blockType: 'cube',
    connections: []
  }
];

export const useStore = create<StoreState>((set) => ({
  selectedSample: null,
  sampleInputs,
  currentStep: 0,
  maxSteps: 6,
  isPlaying: false,
  viewMode: 'free',
  cameraPosition: { x: 5, y: 2, z: 5 },
  autoRotate: false,
  highlightedLayer: null,
  layers,
  showSummary: false,

  selectSample: (sample) => set({ 
    selectedSample: sample, 
    currentStep: 1, 
    isPlaying: false,
    showSummary: false 
  }),
  
  nextStep: () => set((state) => {
    const nextStep = Math.min(state.currentStep + 1, state.maxSteps);
    return {
      currentStep: nextStep,
      isPlaying: nextStep < state.maxSteps,
      showSummary: nextStep === state.maxSteps
    };
  }),
  
  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 0),
    isPlaying: false,
    showSummary: false
  })),
  
  setStep: (step) => set({
    currentStep: step,
    isPlaying: false,
    showSummary: step === 6
  }),
  
  resetPlayground: () => set({
    selectedSample: null,
    currentStep: 0,
    isPlaying: false,
    showSummary: false
  }),
  
  setPlaying: (playing) => set({ isPlaying: playing }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setCameraPosition: (position) => set({ cameraPosition: position }),
  
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  
  highlightLayer: (layerId) => set({ highlightedLayer: layerId }),

  setShowSummary: (show) => set({ showSummary: show })
}));