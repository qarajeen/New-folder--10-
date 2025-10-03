import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { Project } from '../types';

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  // The onSave function is async, so its return type should be a Promise.
  onSave: (data: Partial<Omit<Project, 'id' | 'status' | 'client_id'>>) => Promise<void>;
}

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        projectType: project.project_type,
        subService: project.sub_service,
        style: project.style,
        title: project.title,
        description: project.description,
        location: project.location,
        date: project.start_date,
        requirements: project.requirements,
    });
    const modalRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setLocalError(null);
        try {
            // Correctly await the async onSave operation.
            await onSave({
                project_type: formData.projectType,
                sub_service: formData.subService,
                style: formData.style,
                title: formData.title,
                description: formData.description,
                location: formData.location,
                start_date: formData.date,
                requirements: formData.requirements,
            });
            // On success, the parent component will close the modal.
        } catch (err) {
            let message = 'An unknown error occurred.';
            if (err && typeof err === 'object' && 'message' in err) {
               message = String(err.message);
            }
            setLocalError(message); // Set local error to display in the modal
        } finally {
            setIsSaving(false);
        }
    };
    
    const isFormValid = formData.title && formData.location && formData.date && formData.description;
    
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    const modalContent = (
        <div 
            className="fixed inset-0 bg-raisin-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                ref={modalRef}
                className="bg-deep-ocean-surface w-full max-w-2xl rounded-lg shadow-2xl border border-eggshell-white/10 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-eggshell-white/10">
                    <h2 className="font-serif font-bold text-2xl text-eggshell-white">Edit Project Details</h2>
                    <button onClick={onClose} aria-label="Close" className="text-eggshell-white/70 hover:text-action-blue dark:hover:text-vibrant-magenta transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="p-8 overflow-y-auto space-y-6">
                        <div>
                            <p className="text-sm font-bold text-eggshell-white/60 uppercase tracking-wider">Project Type</p>
                            <p className="text-lg text-eggshell-white/90 mt-1">{formData.projectType} &rarr; {formData.subService}</p>
                        </div>
                         <div>
                            <label htmlFor="title" className="block text-sm font-bold text-eggshell-white/80 mb-2">Project Title</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" required />
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-bold text-eggshell-white/80 mb-2">Project Description</label>
                            <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" required></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="location" className="block text-sm font-bold text-eggshell-white/80 mb-2">Location</label>
                                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" required />
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-bold text-eggshell-white/80 mb-2">Preferred Start Date</label>
                                <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" required />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="requirements" className="block text-sm font-bold text-eggshell-white/80 mb-2">Additional Requirements (Optional)</label>
                            <textarea name="requirements" id="requirements" rows={2} value={formData.requirements} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta"></textarea>
                        </div>
                    </div>
                    
                    <div className="p-6 border-t border-eggshell-white/10 mt-auto bg-deep-ocean-surface">
                        {localError && (
                            <div className="text-center text-red-400 text-sm mb-4 animate-fade-in">
                                <p><strong>Save Failed:</strong> {localError}</p>
                            </div>
                        )}
                        <div className="flex justify-end items-center">
                            <button type="button" onClick={onClose} className="font-bold py-2 px-6 rounded-full text-eggshell-white/80 hover:bg-eggshell-white/10 transition mr-4">Cancel</button>
                            <button type="submit" disabled={!isFormValid || isSaving} className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-wait button-inset-shadow">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, modalRoot);
};