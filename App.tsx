import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { MindPage } from './components/MindPage';
import { QuoteCalculator } from './components/QuoteCalculator';
import { ConnectPage } from './components/ConnectPage';
import { WorkPage } from './components/WorkPage';
import { PartnerHubSignIn } from './components/DashboardSignIn';
import { PartnerHubDashboard } from './components/ClientHubDashboard';
import { ArticlePage } from './components/ArticlePage';
import { supabaseClient as supabase } from './services/supabaseClient';
import type { User, Article, Page, Theme, Language } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageContainerClass, setPageContainerClass] = useState('animate-fade-in-up');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Effect to initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  // Effect to apply theme changes to the DOM and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Effect to apply language changes to the DOM
  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.remove('font-sans', 'font-amiri');
    document.body.classList.add(language === 'ar' ? 'font-amiri' : 'font-sans');
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };


  // Effect to track mouse position for the background glow
  useEffect(() => {
    let mouseX = -1000;
    let mouseY = -1000;
    let animationFrameId: number | null = null;

    const updateGlowPosition = () => {
      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
      animationFrameId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(updateGlowPosition);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  // Effect for handling Supabase auth state
  useEffect(() => {
    // onAuthStateChange handles all auth events, including the initial session check.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            // User is signed in, fetch their profile from the 'clients' table
            const { data: clientData, error } = await supabase
                .from('clients')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
            
            if (clientData) {
                const userProfile: User = {
                    name: clientData.name,
                    company: clientData.company,
                    email: clientData.email,
                    phone: clientData.phone,
                };
                setUser(userProfile);
                setIsAuthenticated(true);
            } else {
                // Handle case where profile doesn't exist but user is logged in
                console.error("Auth user exists but no client profile found:", error);
                setUser(null);
                setIsAuthenticated(false);
                // In a production app, you might want to sign the user out here.
                // await supabase.auth.signOut();
            }
        } else {
            // User is signed out
            setUser(null);
            setIsAuthenticated(false);
        }
        // This will be called on initial load and any subsequent auth change.
        setAuthLoading(false);
    });

    return () => {
        subscription.unsubscribe();
    };
  }, []);


  const handleLogin = (userData: User) => {
    // This function is still useful for instantly updating the UI after manual sign-in,
    // even though onAuthStateChange will also fire to confirm.
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleNavigate('home');
  };

  const handleNavigate = (page: Page) => {
    if (page === currentPage || isNavigating) return;

    setIsNavigating(true);
    setPageContainerClass('animate-fade-out-up');

    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo(0, 0);
      setPageContainerClass('animate-fade-in-up');
      setIsNavigating(false);
    }, 400); // Corresponds to the fade-out animation duration
  };

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    handleNavigate('article');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} language={language} />;
      case 'mind':
        return <MindPage onNavigate={handleNavigate} onViewArticle={handleViewArticle} language={language} />;
      case 'pricing':
        return <QuoteCalculator language={language} />;
      case 'connect':
        return <ConnectPage language={language} />;
      case 'work':
        return <WorkPage language={language} />;
      case 'clienthub':
        return isAuthenticated && user ? <PartnerHubDashboard user={user} onLogout={handleLogout} language={language} /> : <PartnerHubSignIn onLogin={handleLogin} language={language} />;
      case 'article':
        return selectedArticle ? <ArticlePage article={selectedArticle} onNavigate={handleNavigate} language={language} /> : <MindPage onNavigate={handleNavigate} onViewArticle={handleViewArticle} language={language} />;
      default:
        return <HomePage onNavigate={handleNavigate} language={language} />;
    }
  };
  
  const fontClass = language === 'ar' ? 'font-amiri' : 'font-sans';
  
  // Display a loading spinner while checking for an active session
  if (authLoading) {
    return (
        <div className={`bg-eggshell-white dark:bg-midnight-blue min-h-screen flex items-center justify-center ${fontClass}`}>
             <div className="w-12 h-12 border-4 border-action-blue dark:border-vibrant-magenta border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className={`bg-eggshell-white dark:bg-midnight-blue text-raisin-black dark:text-eggshell-white min-h-screen transition-colors duration-300 ${fontClass}`}>
      <Header onNavigate={handleNavigate} currentPage={currentPage} theme={theme} toggleTheme={toggleTheme} language={language} toggleLanguage={toggleLanguage} />
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div key={currentPage} className={pageContainerClass}>
          {renderPage()}
        </div>
      </main>
      <Footer onNavigate={handleNavigate} language={language} />
    </div>
  );
};

export default App;