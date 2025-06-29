import React from 'react';
import { useStore } from '../../store/index';
import { ChevronDown, Target, Brain, TrendingUp, ShoppingCart } from 'lucide-react';

export const SummaryTree: React.FC = () => {
  const { selectedSample, showSummary } = useStore();

  if (!selectedSample || !showSummary) return null;

  // Fallbacks in case userBehavior or metadata are missing
  const category = selectedSample.metadata?.categories?.[0] ?? 'Unknown';
  const lastAction = selectedSample.userBehavior?.[selectedSample.userBehavior.length - 1] ?? 'N/A';

  // Persona-specific logic (mocked from your screenshot)
  const personaData = {
    "Office Furniture Shopper": {
      targetProduct: "Standing Desk",
      scores: [
        ["Minimalist Desks", 0.8],
        ["Office Chairs", 0.2]
      ]
    },
    "Tech Enthusiast": {
      targetProduct: "4K Gaming Monitor",
      scores: [
        ["Gaming Laptops", 0.85],
        ["Mechanical Keyboards", 0.15]
      ]
    },
    "Kitchen Renovator": {
      targetProduct: "Built-In-Oven",
      scores: [
        ["Kitchen Faucets", 0.3],
        ["Refrigerators", 0.7]
      ]
    }
  };

  const persona = selectedSample.name;
  const personaEntry = personaData[persona as keyof typeof personaData];

  const treeData = [
    {
      level: 0,
      text: 'User Clicks',
      icon: <Target className="h-4 w-4" />,
      color: 'text-cyan-400',
    },
    {
      level: 1,
      text: `Viewed Category: ${category}`,
      icon: <ChevronDown className="h-4 w-4" />,
      color: 'text-blue-400',
    },
    {
      level: 1,
      text: `Target Product: "${personaEntry?.targetProduct}"`,
      icon: <ShoppingCart className="h-4 w-4" />,
      color: 'text-yellow-400',
    },
    {
      level: 1,
      text: 'Embedded into latent vector [0.12, -0.8, ...]',
      icon: <ChevronDown className="h-4 w-4" />,
      color: 'text-purple-400',
    },
    {
      level: 1,
      text: 'Activated DeepFM path (Weight: 0.84)',
      icon: <ChevronDown className="h-4 w-4" />,
      color: 'text-green-400',
    },
    ...(personaEntry?.scores.map(([cat, score]) => ({
      level: 1,
      text: `Category Score → ${cat}: ${score}`,
      icon: <ChevronDown className="h-4 w-4" />,
      color: 'text-orange-400',
    })) || []),
    {
      level: 1,
      text: `Scored Item: ${lastAction} → 91% confidence`,
      icon: <ChevronDown className="h-4 w-4" />,
      color: 'text-orange-400',
    }
  ];

  return (
    <div className="bg-background-tertiary/80 rounded-xl p-6 shadow-lg border border-white/10 backdrop-blur-xl">
      <div className="flex items-center mb-6">
        <div className="mr-2 bg-green-600/20 p-1.5 rounded-md">
          <TrendingUp className="h-4 w-4 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Journey Summary</h3>
      </div>

      <div className="space-y-3">
        {treeData.map((node, index) => (
          <div
            key={index}
            className="flex items-start space-x-3"
            style={{ paddingLeft: `${node.level * 20}px` }}
          >
            <div className={`flex-shrink-0 mt-1 ${node.color}`}>{node.icon}</div>
            <div className="flex-1">
              <p className={`text-sm ${node.level === 0 ? 'font-semibold text-white' : 'text-white/80'}`}>
                {node.text}
              </p>
              {node.level > 0 && index < treeData.length - 1 && (
                <div className="w-px h-4 bg-white/20 ml-2 mt-1" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg border border-green-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-white">Prediction Confidence</span>
        </div>
        <div className="text-2xl font-bold text-green-400 mb-1">91%</div>
        <p className="text-xs text-white/60">
          High confidence recommendation based on user behavior patterns and neural network analysis
        </p>
      </div>
    </div>
  );
};
