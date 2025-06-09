// store/steps.ts
export interface StepDescription {
  title: string;
  description: string;
  details?: string;
}

export const stepDescriptions: StepDescription[] = [
  { title: "Ready to Begin", description: "Select a sample input to start the neural network journey" },
  { title: "Multi-field Input", description: "Raw sparse features (user, item, context + history) enter the network" },
  { title: "User Embedding", description: "Convert user ID into a 64-dimensional dense vector", details: "Embeddings capture user preferences" },
  { title: "Item Embedding", description: "Convert item ID into a 64-dimensional dense vector", details: "Embeddings capture item characteristics" },
  { title: "Context Embedding", description: "Convert context/history into a 32-dimensional dense vector", details: "Embeddings capture situational factors" },
  { title: "DeepFM: Linear", description: "First-order feature interactions (sum of wᵢ·xᵢ)", details: "Linear term of the DeepFM model" },
  { title: "Interest Extraction (GRU)", description: "GRU processes behavior sequence to extract hidden states", details: "Capturing temporal patterns in user history" },
  { title: "Interest Evolution (AUGRU + Attention)", description: "Apply attention over GRU states to evolve user interest", details: "Attention highlights relevant past behavior" },
  { title: "DeepFM: Deep", description: "Higher-order feature interactions via MLP layers", details: "Deep term of the DeepFM model" },
  { title: "Fusion Layer", description: "Concatenate DIEN interest + DeepFM outputs, pass through MLP", details: "Combining two model streams for final representation" },
  { title: "Final Prediction", description: "Sigmoid(logit) → click probability", details: "e.g. 91% confidence for recommended item" },
];
