import React, { useState, useEffect } from 'react';
import type { QuoteFormData } from '../../types';

interface Step3Props {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Icon: React.FC<{ path: string }> = ({ path }) => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d={path} clipRule="evenodd"></path></svg>
);

export const Step3_ContactInfo: React.FC<Step3Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const { contact } = formData;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!contact.name.trim()) newErrors.name = 'Full name is required.';
    if (!contact.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!contact.phone.trim()) newErrors.phone = 'Phone number is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Re-validate whenever the form data changes
  useEffect(() => {
    validate();
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ contact: { ...contact, [name]: value } });
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, company: true });
    if (validate()) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-raisin-black dark:text-eggshell-white mb-2 uppercase tracking-wider font-serif">Just a Few Details to Get Started</h2>
      <p className="text-center text-raisin-black/70 dark:text-eggshell-white/70 mb-8">This helps us prepare a personalized quote and get in touch with you.</p>
      
      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Name Field */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                <Icon path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
             </div>
             <input id="name" name="name" type="text" className={`w-full bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 pl-10 p-3 rounded-md border-2 text-raisin-black dark:text-eggshell-white ${touched.name && errors.name ? 'border-red-500/70' : 'border-raisin-black/20 dark:border-eggshell-white/20'} focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue dark:focus:border-vibrant-magenta dark:focus:ring-vibrant-magenta transition-colors`} placeholder="Full Name" value={contact.name} onChange={handleChange} onBlur={handleBlur} required />
             {touched.name && errors.name && <p className="text-red-400 text-xs mt-1 absolute">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                <Icon path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
             </div>
             <input id="email" name="email" type="email" className={`w-full bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 pl-10 p-3 rounded-md border-2 text-raisin-black dark:text-eggshell-white ${touched.email && errors.email ? 'border-red-500/70' : 'border-raisin-black/20 dark:border-eggshell-white/20'} focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue dark:focus:border-vibrant-magenta dark:focus:ring-vibrant-magenta transition-colors`} placeholder="Email Address" value={contact.email} onChange={handleChange} onBlur={handleBlur} required />
             {touched.email && errors.email && <p className="text-red-400 text-xs mt-1 absolute">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                <Icon path="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
             </div>
             <input id="phone" name="phone" type="tel" className={`w-full bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 pl-10 p-3 rounded-md border-2 text-raisin-black dark:text-eggshell-white ${touched.phone && errors.phone ? 'border-red-500/70' : 'border-raisin-black/20 dark:border-eggshell-white/20'} focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue dark:focus:border-vibrant-magenta dark:focus:ring-vibrant-magenta transition-colors`} placeholder="Phone Number" value={contact.phone} onChange={handleChange} onBlur={handleBlur} required />
             {touched.phone && errors.phone && <p className="text-red-400 text-xs mt-1 absolute">{errors.phone}</p>}
          </div>

          {/* Company Field */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                <Icon path="M10 2a2 2 0 11-4 0 2 2 0 014 0zM4 6a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2-2H6a2 2 0 01-2-2V6z" />
             </div>
             <input id="company" name="company" type="text" className="w-full bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 pl-10 p-3 rounded-md border-2 border-raisin-black/20 dark:border-eggshell-white/20 text-raisin-black dark:text-eggshell-white focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue dark:focus:border-vibrant-magenta dark:focus:ring-vibrant-magenta transition-colors" placeholder="Company (Optional)" value={contact.company} onChange={handleChange} />
          </div>

        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 mt-12 border-t border-raisin-black/10 dark:border-eggshell-white/20">
          <div className="interactive-shadow-container w-full sm:w-auto">
            <button type="button" onClick={onBack} className="bg-raisin-black/10 text-raisin-black dark:bg-eggshell-white/10 dark:text-eggshell-white font-bold py-3 px-8 rounded-full hover:bg-raisin-black/20 dark:hover:bg-eggshell-white/20 transition w-full button-inset-shadow">Back</button>
          </div>
          <div className="interactive-shadow-container w-full sm:w-auto">
            <button type="submit" disabled={Object.keys(errors).length > 0} className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-not-allowed w-full relative overflow-hidden shine-effect button-inset-shadow">
              <span className="relative z-10">Generate Quote</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};