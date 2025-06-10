import { create } from 'zustand';
import { stepDescriptions } from './steps';


export interface Layer {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  color: string;
  connections: string[];
  description: string;
  dimensions: string;
}

export type InputSample = {
  id: number;
  name: string;
  description: string;
  userBehavior: string[];
  metadata: Record<string, any>;
};

export type ViewMode = 'free' | 'guided';

// We’ll define LayerInfo exactly as we use it below:
export type LayerInfo = {
  id: string;
  name: string;
  type: string;
  description?: string;          // ← now optional
  position: [number, number, number];
  color: string;
  size?: number;                 // ← now optional
  blockType?: 'cube' | 'wide';   // ← now optional
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
  showSummary: boolean;
  layers: LayerInfo[];

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
  toggleSummary: () => void;

}

const networkLayers: LayerInfo[] = [
  {
    id: 'input',
    name: 'Multi-field Input',
    type: 'Raw Sparse Features (User/Item/Context + History)',
    description: 'Raw sparse features including user ID, item ID, context ID, and click history',
    position: [-13, 0, 0],
    color: '#2563EB',
    size: 1.5,
    blockType: 'wide',
    connections: ['embed_user', 'embed_item', 'embed_context'],
  },
  {
    id: 'embed_user',
    name: 'User Embedding',
    type: 'Dense Embedding (64D)',
    description: 'Convert user ID into a 64-dimensional dense vector',
    position: [-8, 6, 0],
    color: '#9333EA',
    size: 1.0,
    blockType: 'cube',
    connections: ['deepfm_linear'],
  },
  {
    id: 'embed_item',
    name: 'Item Embedding',
    type: 'Dense Embedding (64D)',
    description: 'Convert item ID into a 64-dimensional dense vector',
    position: [-8, 2, 0],
    color: '#9333EA',
    size: 1.0,
    blockType: 'cube',
    connections: ['deepfm_deep'],
  },
  {
    id: 'embed_context',
    name: 'User Clicked History',
    type: 'Dense Embedding (64D)',
    description: 'Convert context ID into a 64-dimensional dense vector',
    position: [-8, -2, 0],
    color: '#9333EA',
    size: 1.0,
    blockType: 'cube',
    connections: ['deepfm_linear'],
  },
  {
    id: 'deepfm_linear',
    name: 'Interest Embedding Layer',
    type: 'Linear Layer',
    description: 'First-order feature interactions (sum of wᵢ xᵢ)',
    position: [-4, 4, -4],
    color: '#EF4444',
    size: 1.0,
    blockType: 'wide',
    connections: ['dien_gru'],
  },
  {
    id: 'dien_gru',
    name: 'Interest Extractor\n(GRU)',
    type: 'GRU Layer (64hidden)',
    description: 'Run history through a GRU to get hidden states',
    position: [-1, 1, 0],
    color: '#10B981',
    size: 1.2,
    blockType: 'wide',
    connections: ['dien_augru'],
  },
  {
    id: 'dien_augru',
    name: 'Interest Evolution\n(Attention + AUGRU)',
    type: 'AUGRU + Attention (64D)',
    description: 'Apply attention over GRU hidden states to produce interest vector',
    position: [3, 1, 0],
    color: '#F59E0B',
    size: 1.2,
    blockType: 'wide',
    connections: ['fusion_layer'],
  },
  {
    id: 'deepfm_deep',
    name: 'DeepFM: Deep',
    type: 'Deep Neural Network',
    description: 'Higher-order interactions via MLP layers',
    position: [-4, 0, 5],
    color: '#84CC16',
    size: 1.0,
    blockType: 'wide',
    connections: ['fusion_layer'],
  },
  {
    id: 'fusion_layer',
    name: 'Fusion Layer',
    type: 'Concat + MLP',
    description: 'Concatenate DIEN’s interest vector + DeepFM’s output, then pass through a small MLP',
    position: [7, 0, 0],
    color: '#6366F1',
    size: 1.3,
    blockType: 'cube',
    connections: ['output'],
  },
  {
    id: 'output',
    name: 'Output\n(CTR ∈ [0,1])',
    type: 'Final Probability',
    description: 'Sigmoid(⋅) on final logit → click probability',
    position: [11, 0, 0],
    color: '#E11D48',
    size: 1.2,
    blockType: 'cube',
    connections: [],
  },
];
const sampleInputs: InputSample[] = [
  {
    id: 1,
    name: "Office Furniture Shopper",
    description: "User interested in minimalist desks and office furniture",
    userBehavior: [
      "Clicked Minimalist Desks",
      "Clicked Office Chairs",
      "Clicked Cable Management",
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
      "Clicked Gaming Laptops",
      "Clicked Mechanical Keyboards",
      "Clicked Ultrawide Monitors",
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
      "Clicked Kitchen Faucets",
      "Clicked Refrigerators",
      "Clicked Countertop Materials",
      "Added Smart Dishwasher to Cart"
    ],
    metadata: {
      categories: ["Kitchen", "Appliances", "Smart Home"],
      priceRange: "$$$",
      recentSearch: "modern kitchen design"
    }
  }
];

export const useStore = create<{
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

  selectSample: (sample: InputSample) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetPlayground: () => void;
  setPlaying: (flag: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setCameraPosition: (pos: { x: number; y: number; z: number }) => void;
  toggleAutoRotate: () => void;
  highlightLayer: (layerId: string | null) => void;
  toggleSummary: () => void;
}>((set) => ({
  selectedSample: null,
  sampleInputs,                        // your array
  currentStep: 0,
  maxSteps: stepDescriptions.length - 1,
  isPlaying: false,
  viewMode: 'free',
  cameraPosition: { x: 5, y: 2, z: 5 },
  autoRotate: false,
  highlightedLayer: null,
  layers: networkLayers,
  showSummary: false,

  selectSample: (sample) =>
    set({
      selectedSample: sample,
      currentStep: 1,
      isPlaying: false,
      highlightedLayer: null,
    }),

  nextStep: () =>
    set((state) => {
      const next = Math.min(state.currentStep + 1, state.maxSteps);
      return {
        currentStep: next,
        isPlaying: next < state.maxSteps,
        showSummary: next === state.maxSteps  // ← set it exactly when you hit the last step
      };
    }),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
      isPlaying: false,
    })),

  setStep: (step) =>
    set({
      currentStep: step,
      isPlaying: false,
    }),

  resetPlayground: () =>
    set({
      selectedSample: null,
      currentStep: 0,
      isPlaying: false,
    }),

  setPlaying: (playing) => set({ isPlaying: playing }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setCameraPosition: (position) => set({ cameraPosition: position }),

  toggleAutoRotate: () =>
    set((state) => ({ autoRotate: !state.autoRotate })),

  highlightLayer: (layerId) => set({ highlightedLayer: layerId }),

  toggleSummary: () =>
    set((state) => ({ showSummary: !state.showSummary })),
}));