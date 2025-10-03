import React, { useState, useRef } from 'react';
import type { Page, Theme, Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
}

// Custom hook for the 3D tilt effect
const useTiltEffect = () => {
  const elementRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg) scale(1)');

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const x = (mouseX / width) - 0.5;
    const y = (mouseY / height) - 0.5;
    const maxRotate = 12;
    const rotateY = x * maxRotate * 2;
    const rotateX = -y * maxRotate * 2;
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`);
  };

  const handleMouseLeave = () => {
    setTransform('rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return { elementRef, transform, handleMouseMove, handleMouseLeave };
};


const NavButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  label: string;
}> = ({ onClick, isActive, label }) => {
  const { elementRef, transform, handleMouseMove, handleMouseLeave } = useTiltEffect();

  return (
    <div className="[perspective:800px]">
      <button
        ref={elementRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ transform, transformStyle: 'preserve-3d' }}
        className={`font-semibold text-sm uppercase tracking-wider transition-transform transition-colors duration-200 ease-out relative px-4 py-2 rounded-full button-inset-shadow ${
          isActive
            ? 'text-action-blue dark:text-vibrant-magenta'
            : 'text-raisin-black/70 hover:text-raisin-black dark:text-eggshell-white/70 dark:hover:text-eggshell-white'
        }`}
      >
        <span className="[transform:translateZ(15px)] block">{label}</span>
        {isActive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-action-blue dark:bg-vibrant-magenta rounded-full"></span>
        )}
      </button>
    </div>
  );
};

const ThemeSwitcher: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const { elementRef, transform, handleMouseMove, handleMouseLeave } = useTiltEffect();
    const isDark = theme === 'dark';

    return (
        <div className="[perspective:800px]">
            <button
                ref={elementRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={toggleTheme}
                style={{ transform, transformStyle: 'preserve-3d' }}
                className="relative w-12 h-12 flex items-center justify-center bg-raisin-black/5 dark:bg-eggshell-white/5 rounded-full transition-transform duration-200 ease-out button-inset-shadow"
                aria-label="Toggle theme"
            >
                <div className="[transform:translateZ(10px)] w-6 h-6">
                    {/* Sun Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`absolute inset-0 h-6 w-6 text-yellow-500 transition-all duration-300 transform ${isDark ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    {/* Moon Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`absolute inset-0 h-6 w-6 text-blue-300 transition-all duration-300 transform ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                </div>
            </button>
        </div>
    );
};

const LanguageSwitcher: React.FC<{ language: Language; toggleLanguage: () => void }> = ({ language, toggleLanguage }) => {
    const { elementRef, transform, handleMouseMove, handleMouseLeave } = useTiltEffect();
    const isArabic = language === 'ar';

    return (
        <div className="[perspective:800px]">
            <button
                ref={elementRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={toggleLanguage}
                style={{ transform, transformStyle: 'preserve-3d' }}
                className="relative w-12 h-12 flex items-center justify-center bg-raisin-black/5 dark:bg-eggshell-white/5 rounded-full transition-transform duration-200 ease-out button-inset-shadow"
                aria-label="Toggle language"
            >
                <div className="[transform:translateZ(10px)] w-6 h-6 flex items-center justify-center font-bold text-sm text-raisin-black dark:text-eggshell-white [transform-style:preserve-3d]">
                    <span className={`absolute transition-all duration-300 [backface-visibility:hidden] ${!isArabic ? 'opacity-100 [transform:rotateX(0deg)]' : 'opacity-0 [transform:rotateX(180deg)]'}`}>EN</span>
                    <span className={`absolute transition-all duration-300 [backface-visibility:hidden] ${isArabic ? 'opacity-100 [transform:rotateX(0deg)]' : 'opacity-0 [transform:rotateX(-180deg)]'}`}>AR</span>
                </div>
            </button>
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, theme, toggleTheme, language, toggleLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation(language);

  const navLinks: { page: Page; label: string }[] = [
    { page: 'mind', label: t('header.nav.mind') },
    { page: 'work', label: t('header.nav.work') },
    { page: 'pricing', label: t('header.nav.pricing') },
    { page: 'connect', label: t('header.nav.connect') },
  ];

  const partnerHubLink = { page: 'clienthub' as Page, label: t('header.nav.partnerHub') };


  const handleMobileNav = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="py-6 px-6 container mx-auto sticky top-0 z-50">
      <div className="relative flex justify-between items-center bg-eggshell-white/80 dark:bg-deep-ocean-surface/80 backdrop-blur-md p-4 rounded-full border border-raisin-black/10 dark:border-eggshell-white/10 shadow-lg h-20">
        <div onClick={() => onNavigate('home')} className="cursor-pointer h-12 overflow-hidden">
           <img src="./2.png" alt="STUDIOO Logo" className="h-24 w-auto -mt-6" />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-x-2">
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            <LanguageSwitcher language={language} toggleLanguage={toggleLanguage} />

            <div className="w-px h-8 bg-raisin-black/10 dark:bg-eggshell-white/10 mx-2"></div>

            <nav className="flex items-center space-x-2">
              {navLinks.map(({ page, label }) => (
                <NavButton
                  key={page}
                  onClick={() => onNavigate(page)}
                  isActive={currentPage === page}
                  label={label}
                />
              ))}
            </nav>
            <button
                onClick={() => onNavigate(partnerHubLink.page)}
                className={`font-semibold text-sm uppercase tracking-wider transition-all duration-300 ease-out px-4 py-2 rounded-full border-2 hover:bg-action-blue hover:text-eggshell-white dark:hover:bg-vibrant-magenta dark:hover:text-raisin-black relative overflow-hidden shine-effect button-inset-shadow ${currentPage === partnerHubLink.page ? 'bg-action-blue text-eggshell-white border-action-blue dark:bg-vibrant-magenta dark:text-raisin-black dark:border-vibrant-magenta' : 'border-action-blue text-action-blue dark:border-vibrant-magenta dark:text-vibrant-magenta'}`}
            >
                <span className="relative z-10">{partnerHubLink.label}</span>
            </button>
        </div>

        {/* Mobile Menu Button & Switchers */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          <LanguageSwitcher language={language} toggleLanguage={toggleLanguage} />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-raisin-black dark:text-eggshell-white focus:outline-none z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 bg-eggshell-white/95 dark:bg-deep-ocean-surface/95 backdrop-blur-md p-6 rounded-lg border border-raisin-black/10 dark:border-eggshell-white/10 shadow-xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map(({ page, label }) => (
              <button
                key={page}
                onClick={() => handleMobileNav(page)}
                className={`font-semibold text-lg text-center py-2 rounded-md transition-colors duration-300 button-inset-shadow ${
                  currentPage === page 
                    ? 'text-eggshell-white bg-action-blue dark:text-raisin-black dark:bg-vibrant-magenta' 
                    : 'text-raisin-black/80 dark:text-eggshell-white/80 hover:bg-action-blue/10 dark:hover:bg-vibrant-magenta/10'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="pt-2 border-t border-raisin-black/10 dark:border-eggshell-white/10"></div>
            <button
                key={partnerHubLink.page}
                onClick={() => handleMobileNav(partnerHubLink.page)}
                className={`font-semibold text-lg text-center py-2 rounded-md transition-colors duration-300 border-2 button-inset-shadow ${
                  currentPage === partnerHubLink.page 
                    ? 'bg-action-blue text-eggshell-white border-action-blue dark:bg-vibrant-magenta dark:text-raisin-black dark:border-vibrant-magenta' 
                    : 'border-action-blue text-action-blue dark:border-vibrant-magenta dark:text-vibrant-magenta hover:bg-action-blue hover:text-eggshell-white dark:hover:bg-vibrant-magenta dark:hover:text-raisin-black'
                }`}
            >
                {partnerHubLink.label}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};