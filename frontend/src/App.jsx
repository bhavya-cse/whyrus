import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import HowItWorks from './components/HowItWorks';
import InteractiveDemo from './components/InteractiveDemo';
import CoreCapabilities from './components/CoreCapabilities';
import TargetAudience from './components/TargetAudience';
import TrustAndEthics from './components/TrustAndEthics';
import Footer from './components/Footer';
import AnalyzerWorkstation from './components/AnalyzerWorkstation';

export default function App() {
  const [currentView, setCurrentView] = useState('marketing'); // 'marketing' | 'analyze'
  const [activePresetId, setActivePresetId] = useState(null);

  const handleOpenAnalyzer = (presetId = null) => {
    setActivePresetId(presetId);
    setCurrentView('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId) => {
    if (currentView === 'analyze') {
      setCurrentView('marketing');
      setTimeout(() => {
        const el = document.querySelector(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.querySelector(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#111827]">
      {/* Universal Responsive Navbar */}
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenDemo={() => handleNavigateSection('#sample')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
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
            <InteractiveDemo 
              onLoadIntoLiveAnalyzer={(presetId) => handleOpenAnalyzer(presetId)}
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
            onBackToMarketing={() => setCurrentView('marketing')}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer 
        onOpenAnalyzer={() => handleOpenAnalyzer(null)}
        onNavigateSection={handleNavigateSection}
      />
    </div>
  );
}
