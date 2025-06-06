// src/components/playground/SampleSelector.tsx
import React, { useState } from 'react';
import { useStore } from '../../store/index';
import { ArrowRight, Laptop, BarChart2, Zap, Briefcase, Activity, ChefHat} from 'lucide-react';

export const SampleSelector: React.FC = () => {
  const { sampleInputs, selectSample } = useStore();
  // Hover state now holds a number|null, matching sample.id's type
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Return an icon based on the numeric sampleId
  const getIconForSample = (sampleId: number) => {
    switch (sampleId) {
      case 1:
        return <Briefcase className="text-cyan-400" />;
      case 2:
        return <Laptop className="text-secondary" />;
      case 3:
        return <ChefHat className="text-orange-400" />;
      default:
        return <Zap className="text-primary" />;
    }
  };

  return (
    <div className="bg-background-tertiary/80 rounded-xl p-6 shadow-lg border border-white/10 backdrop-blur-xl relative overflow-hidden transition-all duration-300">
      {/* Ambient background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 z-0" />
      <div className="absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-indigo-500/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="mr-2 bg-indigo-600/20 p-1.5 rounded-md">
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Select a Sample Input
          </h2>
        </div>

        <p className="text-white/70 text-sm mb-6">
          Choose a sample user profile to visualize how their data flows through the neural network.
        </p>

        {/* Animated dot pattern behind cards */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 z-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse 3s infinite ${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Horizontal scrolling row of cards */}
        <div className="flex space-x-4 overflow-x-auto pb-2 -mx-2 px-2">
          {sampleInputs.map((sample) => (
            <div
              key={sample.id}
              className={`
                relative
                bg-background/30 
                rounded-lg 
                p-5 
                flex-shrink-0 
                min-w-[260px]
                border border-white/10
                transition-all duration-300
                cursor-pointer
                overflow-hidden
                group
                ${
                  hoveredCard === sample.id
                    ? 'border-indigo-500/70 shadow-[0_0_15px_rgba(99,102,241,0.2)] scale-[1.02]'
                    : 'hover:border-indigo-500/50 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                }
              `}
              onClick={() => selectSample(sample)}
              onMouseEnter={() => setHoveredCard(sample.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow background on hover */}
              <div
                className={`
                  absolute -inset-0.5 
                  bg-gradient-to-r from-indigo-500 to-purple-600 
                  rounded-lg 
                  opacity-0 
                  transition-opacity duration-300 
                  -z-10 
                  blur-xl
                  ${hoveredCard === sample.id ? 'opacity-20' : 'group-hover:opacity-10'}
                `}
              />

              {/* Top highlight bar on hover */}
              <div
                className={`
                  absolute top-0 left-0 right-0 h-0.5 
                  bg-gradient-to-r from-indigo-500 to-purple-600
                  transform origin-left 
                  transition-transform duration-500 ease-out
                  ${hoveredCard === sample.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                `}
              />

              <div className="flex justify-between items-start h-full">
                <div className="pr-2 flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className={`
                        p-1.5 rounded-md
                        ${
                          hoveredCard === sample.id
                            ? 'bg-indigo-600/30'
                            : 'bg-background-tertiary/50'
                        }
                        transition-colors duration-300
                      `}
                    >
                      {getIconForSample(sample.id)}
                    </div>
                    <h3 className="font-medium text-white">{sample.name}</h3>
                  </div>

                  <p className="text-white/70 text-sm mt-1">
                    {sample.description}
                  </p>

                  <div className="mt-3">
                    <span className="text-xs text-white/50">Recent actions:</span>
                    <ul className="mt-1 text-xs text-white/70">
                      {sample.userBehavior.slice(0, 2).map((action, idx) => (
                        <li
                          key={idx}
                          className={`
                            flex items-center mt-1.5 group/item
                          `}
                        >
                          <span
                            className={`
                              w-1.5 h-1.5 rounded-full mr-1.5
                              ${
                                hoveredCard === sample.id
                                  ? 'bg-indigo-400 animate-pulse'
                                  : 'bg-primary'
                              }
                              transition-colors duration-300
                            `}
                          />
                          <span
                            className={`
                              transition-transform duration-300
                              ${hoveredCard === sample.id ? 'translate-x-0.5' : ''}
                            `}
                          >
                            {action}
                          </span>
                        </li>
                      ))}
                      {sample.userBehavior.length > 2 && (
                        <li className="text-white/50 text-xs mt-1.5 pl-3">
                          + {sample.userBehavior.length - 2} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <button
                  className={`
                    ml-2 
                    self-start 
                    p-2 
                    rounded-full 
                    transition-all 
                    duration-300
                    ${
                      hoveredCard === sample.id
                        ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                        : 'bg-primary/80 group-hover:bg-indigo-600/90'
                    }
                  `}
                >
                  <ArrowRight
                    size={16}
                    className={`
                      text-white
                      transition-transform duration-300
                      ${hoveredCard === sample.id ? 'translate-x-0.5' : ''}
                    `}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe animation for pulsing dots */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0.3; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
