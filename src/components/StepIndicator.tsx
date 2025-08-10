import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-3">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-500 ${
              i < currentStep
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg'
                : i === currentStep
                ? 'bg-gradient-to-r from-orange-400 to-pink-500 shadow-lg animate-pulse'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;