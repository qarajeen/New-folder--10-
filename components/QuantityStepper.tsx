import React from 'react';

interface QuantityStepperProps {
  label: string;
  value: number;
  onValueChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  label,
  value,
  onValueChange,
  min = 1,
  max = 100,
  step = 1,
}) => {
  const handleDecrement = () => onValueChange(Math.max(min, value - step));
  const handleIncrement = () => onValueChange(Math.min(max, value + step));
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => onValueChange(Number(e.target.value));

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-raisin-black/80 dark:text-eggshell-white/80">{label}</span>
        <div className="flex items-center gap-2">
          <div className="interactive-shadow-container-round">
            <button type="button" onClick={handleDecrement} disabled={value <= min} className="w-10 h-10 rounded-full bg-raisin-black/10 text-raisin-black dark:bg-eggshell-white/10 dark:text-eggshell-white font-bold text-xl flex items-center justify-center hover:bg-raisin-black/20 dark:hover:bg-eggshell-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition" aria-label={`Decrease ${label}`}>-</button>
          </div>
          <span className="w-12 text-center text-lg font-bold text-raisin-black dark:text-eggshell-white font-serif">{value}</span>
          <div className="interactive-shadow-container-round">
            <button type="button" onClick={handleIncrement} disabled={value >= max} className="w-10 h-10 rounded-full bg-raisin-black/10 text-raisin-black dark:bg-eggshell-white/10 dark:text-eggshell-white font-bold text-xl flex items-center justify-center hover:bg-raisin-black/20 dark:hover:bg-eggshell-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition" aria-label={`Increase ${label}`}>+</button>
          </div>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={handleSliderChange} className="w-full h-2 bg-raisin-black/10 dark:bg-eggshell-white/10 rounded-lg appearance-none cursor-pointer range-slider" />
    </div>
  );
};