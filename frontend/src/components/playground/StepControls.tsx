// src/components/playground/StepControls.tsx
import React, { useEffect } from 'react';
import { useStore } from '../../store/index';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Eye,
  Settings
} from 'lucide-react';

export const StepControls: React.FC = () => {
  const {
    selectedSample,
    currentStep,
    maxSteps,
    isPlaying,
    autoRotate,
    viewMode,
    nextStep,
    prevStep,
    resetPlayground,
    setPlaying,
    toggleAutoRotate,
    setViewMode
  } = useStore();

  // If no sample is selected, render nothing
  if (!selectedSample) return null;

  // Derive progress percentage
  const progressPercentage = (currentStep / maxSteps) * 100;

  return (
    <div className="h-full flex flex-col bg-background-tertiary/80 rounded-xl p-6 shadow-lg border border-white/10 backdrop-blur-xl relative overflow-hidden transition-all duration-300">
      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 z-0" />
      {/* Blurred circular highlight */}
      <div className="absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-indigo-500/5 rounded-full blur-3xl" />

      {/* Pulsing dots in the background */}
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

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col flex-grow overflow-y-auto">
        {/* Header with icon and title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600/20 p-1.5 rounded-md">
              <Settings className="h-4 w-4 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Control Panel</h3>
          </div>

          <button
            onClick={resetPlayground}
            className="p-2 rounded-lg bg-background/50 hover:bg-background transition-colors border border-white/10"
            aria-label="Reset"
          >
            <RotateCcw className="h-4 w-4 text-white/70" />
          </button>
        </div>

        {/* Current Sample Info */}
        <div className="mb-6 p-4 bg-background/30 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-white mb-1">Current Sample</h4>
          <p className="text-sm text-white/70">{selectedSample.name}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">Progress</span>
            <span className="text-sm text-white/70">
              {currentStep}/{maxSteps}
            </span>
          </div>
          <div className="w-full bg-background/50 rounded-full h-2 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Glowing overlay */}
            <div
              className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none"
              style={{
                width: `${progressPercentage}%`,
                background:
                  'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
                animation: isPlaying ? 'moveGlow 2s linear infinite' : 'none'
              }}
            />
            {/* Particle markers */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`
                  absolute top-0 w-1 h-full bg-white/70 rounded-full pointer-events-none
                  transition-all duration-300
                  ${isPlaying ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                  left: `${progressPercentage * Math.random()}%`,
                  animation: isPlaying ? `particleFlow 2s linear infinite ${i * 0.2}s` : 'none'
                }}
              />
            ))}
            {/* Step markers */}
            {Array.from({ length: maxSteps }).map((_, i) => {
              const position = ((i + 1) / maxSteps) * 100;
              const isCompleted = currentStep > i + 1;
              const isCurrent = currentStep === i + 1;
              return (
                <div
                  key={i}
                  className={`
                    absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full
                    transition-all duration-300
                    ${isCompleted ? 'bg-white' : 'bg-white/30'}
                    ${isCurrent ? 'w-1.5 h-1.5' : ''}
                    ${isCurrent && isPlaying ? 'animate-pulse' : ''}
                  `}
                  style={{ left: `${position}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-6 flex-shrink-0">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center justify-center p-3 rounded-lg bg-background/50 hover:bg-background transition-colors border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous"
          >
            <SkipBack className="h-4 w-4 text-white/70" />
          </button>
          <button
            onClick={() => setPlaying(!isPlaying)}
            disabled={currentStep >= maxSteps}
            className="flex items-center justify-center p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep >= maxSteps}
            className="flex items-center justify-center p-3 rounded-lg bg-background/50 hover:bg-background transition-colors border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next"
          >
            <SkipForward className="h-4 w-4 text-white/70" />
          </button>
        </div>

        {/* View Mode */}
        <div className="mb-6 flex-shrink-0">
          <label className="text-sm text-white/70 mb-2 block">View Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setViewMode('free')}
              className={`p-2 rounded-lg text-sm transition-colors border ${
                viewMode === 'free'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-background/50 border-white/10 text-white/70 hover:bg-background'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setViewMode('guided')}
              className={`p-2 rounded-lg text-sm transition-colors border ${
                viewMode === 'guided'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-background/50 border-white/10 text-white/70 hover:bg-background'
              }`}
            >
              Guided
            </button>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="space-y-3 flex-shrink-0">
          <label className="text-sm text-white/70">Camera Controls</label>
          <button
            onClick={toggleAutoRotate}
            className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors border ${
              autoRotate
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-background/50 border-white/10 text-white/70 hover:bg-background'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span className="text-sm">Auto Rotate</span>
          </button>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0.3; transform: scale(1); }
        }
        @keyframes moveGlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes particleFlow {
          0% { opacity: 0; transform: translateX(-5px); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};
