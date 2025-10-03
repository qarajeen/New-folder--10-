import React, { useState } from 'react';
import type { QuoteFormData } from '../../types';
import { PhotographyConfig } from './config/PhotographyConfig';
import { VideographyConfig } from './config/VideographyConfig';
import { PostProductionConfig } from './config/PostProductionConfig';
import { ToursConfig } from './config/ToursConfig';
import { TimeLapseConfig } from './config/TimeLapseConfig';
import { PhotogrammetryConfig } from './config/PhotogrammetryConfig';
import { TrainingConfig } from './config/TrainingConfig';
import { RetainerConfig } from './config/RetainerConfig';

interface Step2Props {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2_Configuration: React.FC<Step2Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const [isFormValid, setIsFormValid] = useState(false);
  
  const getTitle = () => {
    switch(formData.engagementType) {
        case 'Retainer': return 'Configure Your Retainer';
        case 'Training': return 'Configure Your Training';
        case 'Project': return `Configure Your ${formData.service}`;
        default: return 'Configuration';
    }
  }

  const renderConfigComponent = () => {
    switch (formData.engagementType) {
        case 'Retainer':
            return <RetainerConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
        case 'Training':
            return <TrainingConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
        case 'Project':
            switch (formData.service) {
                case 'Photography':
                    return <PhotographyConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case 'Video Production':
                    return <VideographyConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case 'Post Production':
                    return <PostProductionConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case '360 Tours':
                    return <ToursConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case 'Time Lapse':
                    return <TimeLapseConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case 'Photogrammetry':
                    return <PhotogrammetryConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                default:
                    return <p className="text-center text-raisin-black/70 dark:text-eggshell-white/70">Please go back and select a service to configure it.</p>;
            }
        default:
            return <p className="text-center text-raisin-black/70 dark:text-eggshell-white/70">Please go back and select an engagement type.</p>;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-raisin-black dark:text-eggshell-white mb-6 uppercase tracking-wider font-serif">
        {getTitle()}
      </h2>
      {renderConfigComponent()}
      <div className="flex justify-between items-center pt-8 mt-8 border-t border-raisin-black/10 dark:border-eggshell-white/20">
        <div className="interactive-shadow-container">
            <button type="button" onClick={onBack} className="bg-raisin-black/10 text-raisin-black dark:bg-eggshell-white/10 dark:text-eggshell-white font-bold py-3 px-8 rounded-full hover:bg-raisin-black/20 dark:hover:bg-eggshell-white/20 transition button-inset-shadow">Back</button>
        </div>
        <div className="interactive-shadow-container">
            <button type="button" onClick={onNext} disabled={!isFormValid} className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-not-allowed relative overflow-hidden shine-effect button-inset-shadow">
                <span className="relative z-10">Next: Contact Info</span>
            </button>
        </div>
      </div>
    </div>
  );
};