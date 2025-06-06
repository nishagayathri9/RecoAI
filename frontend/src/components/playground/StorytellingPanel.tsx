import React from 'react';
import { useStore } from '../../store/index';
import { Brain, ArrowRight, Target, Zap } from 'lucide-react';

const stepDescriptions = [
  {
    title: "Ready to Begin",
    description: "Select a sample input to start the neural network journey",
    icon: <Brain className="h-5 w-5" />
  },
  {
    title: "Input Processing",
    description: "Raw user behavior data enters the network",
    details: "User clicks, views, and interactions are captured",
    icon: <Target className="h-5 w-5" />
  },
  {
    title: "Embedding Transformation",
    description: "Sparse features converted to dense vector representations",
    details: "Categories and items mapped to latent space",
    icon: <Zap className="h-5 w-5" />
  },
  {
    title: "Behavior Sequence Analysis",
    description: "Processing temporal patterns in user behavior",
    details: "Sequential dependencies captured through GRU layers",
    icon: <ArrowRight className="h-5 w-5" />
  },
  {
    title: "Attention Mechanism",
    description: "AUGRU focuses on relevant behavioral patterns",
    details: "Attention weights highlight important interactions",
    icon: <Brain className="h-5 w-5" />
  },
  {
    title: "Interest Evolution",
    description: "Modeling how user interests change over time",
    details: "Dynamic interest representation for better predictions",
    icon: <Zap className="h-5 w-5" />
  },
  {
    title: "Final Prediction",
    description: "DeepFM generates click probability prediction",
    details: "91% confidence for recommended item",
    icon: <Target className="h-5 w-5" />
  }
];

export const StorytellingPanel: React.FC = () => {
  const { selectedSample, currentStep } = useStore();

  const currentStepInfo = stepDescriptions[currentStep] || stepDescriptions[0];

  return (
    <div className="bg-background-tertiary/80 rounded-xl p-6 shadow-lg border border-white/10 backdrop-blur-xl">
      <div className="flex items-center mb-6">
        <div className="mr-2 bg-purple-600/20 p-1.5 rounded-md">
          {currentStepInfo.icon}
        </div>
        <h3 className="text-lg font-semibold text-white">Neural Network Journey</h3>
      </div>

      {selectedSample ? (
        <div className="space-y-4">
          {/* Current Step */}
          <div className="p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg border border-purple-500/30">
            <h4 className="font-medium text-white mb-2">{currentStepInfo.title}</h4>
            <p className="text-sm text-white/70 mb-2">{currentStepInfo.description}</p>
            {currentStepInfo.details && (
              <p className="text-xs text-white/50">{currentStepInfo.details}</p>
            )}
          </div>

          {/* Sample Context */}
          <div className="p-4 bg-background/30 rounded-lg border border-white/10">
            <h5 className="text-sm font-medium text-white mb-2">Processing: {selectedSample.name}</h5>
            <div className="text-xs text-white/60">
              <p>Recent Search: "{selectedSample.metadata.recentSearch}"</p>
              <p>Categories: {selectedSample.metadata.categories.join(', ')}</p>
            </div>
          </div>

          {/* Step Progress */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-white/70 mb-3">Processing Steps</h5>
            {stepDescriptions.slice(1).map((step, index) => {
              const stepIndex = index + 1;
              const isCompleted = currentStep > stepIndex;
              const isCurrent = currentStep === stepIndex;
              
              return (
                <div
                  key={stepIndex}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-indigo-600/20 border border-indigo-500/30'
                      : isCompleted
                      ? 'bg-green-600/10 border border-green-500/20'
                      : 'bg-background/20 border border-white/10'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-white/20 text-white/40'
                  }`}>
                    {isCompleted ? '✓' : stepIndex}
                  </div>
                  <span className={`text-sm ${
                    isCurrent || isCompleted ? 'text-white' : 'text-white/50'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-white/70 text-sm">
            Select a sample input to begin the neural network storytelling journey
          </p>
        </div>
      )}
    </div>
  );
};