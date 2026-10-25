
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import HowItWorks from './components/HowItWorks';
import CoreCapabilities from './components/CoreCapabilities';
import TargetAudience from './components/TargetAudience';
import TrustAndEthics from './components/TrustAndEthics';
import Footer from './components/Footer';
import AnalyzerWorkstation from './components/AnalyzerWorkstation';

export default function App() {
  const [currentView, setCurrentView] = useState('marketing');
  const [activePresetId, setActivePresetId] = useState(null);

  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('whyrus-theme');
      return savedTheme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem('whyrus-theme', theme);
    } catch {
      // The app still works if browser storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const handleOpenAnalyzer = (presetId = null) => {
    setActivePresetId(presetId);
    setCurrentView('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId) => {
    if (currentView === 'analyze') {
      setCurrentView('marketing');

      setTimeout(() => {
        const element = document.querySelector(sectionId);

        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const element = document.querySelector(sectionId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="app-shell min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: 'var(--page-bg)',
        color: 'var(--text-primary)',
      }}
    >
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenDemo={() => handleNavigateSection('#sample')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main
        className="flex-1"
        style={{
          backgroundColor: 'var(--page-bg)',
          color: 'var(--text-primary)',
        }}
      >
        {currentView === 'marketing' ? (
          <>
            <Hero
              onStartAnalysis={() => handleOpenAnalyzer(null)}
              onExploreWorks={() => handleNavigateSection('#workflow')}
            />

            <ProblemSolution
              onOpenAnalyzer={() => handleOpenAnalyzer(null)}
            />

            <HowItWorks
              onOpenAnalyzer={() => handleOpenAnalyzer(null)}
            />

            <CoreCapabilities
              onOpenAnalyzer={() => handleOpenAnalyzer(null)}
            />

            <TargetAudience
              onOpenAnalyzer={() => handleOpenAnalyzer(null)}
            />

            <TrustAndEthics />
          </>
        ) : (
          <AnalyzerWorkstation
            initialPresetId={activePresetId}
            onBackToMarketing={() => {
              setCurrentView('marketing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <Footer
        onOpenAnalyzer={() => handleOpenAnalyzer(null)}
        onNavigateSection={handleNavigateSection}
      />
    </div>
  );
}
