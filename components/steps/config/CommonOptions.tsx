import React from 'react';
import { Tooltip } from '../../Tooltip';
import type { QuoteFormData } from '../../../types';

export const OptionGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-bold text-raisin-black/80 dark:text-eggshell-white/80 mb-3">{label}</label>
    <div className="space-y-2">{children}</div>
  </div>
);

interface RadioOption { label: string; tooltip?: string; }
export const Radio: React.FC<{ name: string; options: (string | RadioOption)[]; value: string; onChange: (name: string, value: string) => void }> = ({ name, options, value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {options.map(option => {
      const label = typeof option === 'string' ? option : option.label;
      const tooltipText = typeof option === 'string' ? null : option.tooltip;
      const content = (
          <label key={label} className={`flex items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${value === label ? 'border-action-blue bg-action-blue/10 dark:border-vibrant-magenta dark:bg-vibrant-magenta/10 shadow-lg' : 'border-raisin-black/20 dark:border-eggshell-white/20 hover:border-action-blue/50 dark:hover:border-vibrant-magenta/50'}`}>
            <input type="radio" name={name} value={label} checked={value === label} onChange={e => onChange(name, e.target.value)} className="sr-only" />
            <span className="font-semibold text-raisin-black dark:text-eggshell-white">{label}</span>
          </label>
      );
      return tooltipText ? <Tooltip key={label} text={tooltipText}>{content}</Tooltip> : content;
    })}
  </div>
);

interface CheckboxOption { label: string; tooltip?: string; }
export const Checkbox: React.FC<{ options: (string | CheckboxOption)[]; values: string[]; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ options, values = [], onChange }) => (
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {options.map(option => {
      const label = typeof option === 'string' ? option : option.label;
      const tooltipText = typeof option === 'string' ? null : option.tooltip;
      const isChecked = (values || []).includes(label);
      const content = (
         <label key={label} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 w-full ${isChecked ? 'border-action-blue bg-action-blue/10 dark:border-vibrant-magenta dark:bg-vibrant-magenta/10 shadow-lg' : 'border-raisin-black/20 dark:border-eggshell-white/20 hover:border-action-blue/50 dark:hover:border-vibrant-magenta/50'}`}>
          <input type="checkbox" value={label} checked={isChecked} onChange={onChange} className="h-5 w-5 rounded border-raisin-black/30 bg-eggshell-white dark:border-eggshell-white/30 dark:bg-deep-ocean-surface text-action-blue dark:text-vibrant-magenta focus:ring-action-blue dark:focus:ring-vibrant-magenta focus:ring-offset-transparent" />
          <span className="ml-3 font-semibold text-raisin-black dark:text-eggshell-white">{label}</span>
        </label>
      );
      return tooltipText ? <Tooltip key={label} text={tooltipText}>{content}</Tooltip> : content;
    })}
  </div>
);

export const CommonOptions: React.FC<{ formData: QuoteFormData; updateFormData: (data: Partial<QuoteFormData>) => void; }> = ({ formData, updateFormData }) => {
    const { config } = formData;
    const handleConfigChange = (key: string, value: any) => updateFormData({ config: { ...config, [key]: value } });
    const logisticsOptions = ['Dubai', 'Sharjah', 'Abu Dhabi / Other Emirates'];
    const deliveryOptions = ['Standard Delivery', { label: 'Rush Delivery (24h)', tooltip: '+50% of the combined Base Price and Add-ons cost.' }];
    return (
        <div className="space-y-6 pt-6 mt-6 border-t border-raisin-black/10 dark:border-eggshell-white/20">
            <OptionGroup label="Logistics & Travel">
                <Radio name="logistics" options={logisticsOptions} value={config.logistics} onChange={handleConfigChange} />
            </OptionGroup>
            <OptionGroup label="Delivery Timeline">
                <Radio name="delivery" options={deliveryOptions} value={config.delivery} onChange={handleConfigChange} />
            </OptionGroup>
        </div>
    );
};