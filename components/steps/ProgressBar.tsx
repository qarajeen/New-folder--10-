import React, { useState, useEffect, useRef } from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  customSteps: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, customSteps }) => {
  const activeLabelIndex = Math.min(currentStep - 1, totalSteps);
  const progressPercentage = activeLabelIndex > 0 ? (activeLabelIndex / (totalSteps - 1)) * 100 : 0;
  
  const [stepName, setStepName] = useState(customSteps[activeLabelIndex] || 'Done');
  const [animationClass, setAnimationClass] = useState('animate-fade-in-text');
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    const newActiveIndex = Math.min(currentStep - 1, totalSteps);
    if (prevStepRef.current !== currentStep) {
      setAnimationClass('animate-fade-out-text');
      const timer = setTimeout(() => {
        setStepName(customSteps[newActiveIndex] || 'Done');
        setAnimationClass('animate-fade-in-text');
        prevStepRef.current = currentStep;
      }, 300); // Duration of the fade-out animation

      return () => clearTimeout(timer);
    } else if (customSteps[newActiveIndex] !== stepName) {
        // Handle case where steps array changes but step number doesn't
        setAnimationClass('animate-fade-out-text');
        const timer = setTimeout(() => {
            setStepName(customSteps[newActiveIndex]);
            setAnimationClass('animate-fade-in-text');
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [currentStep, customSteps, stepName, totalSteps]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-raisin-black dark:text-eggshell-white font-serif tracking-wider uppercase">
          Step {activeLabelIndex + 1}: <span className={animationClass}>{stepName}</span>
        </span>
        <span className="text-sm font-semibold text-raisin-black/70 dark:text-eggshell-white/70 font-serif">
          {activeLabelIndex + 1}/{totalSteps}
        </span>
      </div>
      <div className="w-full bg-action-blue/20 dark:bg-vibrant-magenta/20 rounded-full h-2.5">
        <div
          className="bg-action-blue dark:bg-vibrant-magenta h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};