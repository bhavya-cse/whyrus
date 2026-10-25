import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import Logo from './Logo';
import { fetchHealth } from '../services/api';

export default function Navbar({ currentView, setCurrentView, onOpenDemo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchHealth()
      .then(data => setBackendHealth(data))
      .catch(() => setBackendHealth({ status: 'offline' }));
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Sample Incident', href: '#sample' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Evidence & Trust', href: '#trust' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (currentView === 'analyze') {
      setCurrentView('marketing');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] py-3.5 shadow-xs' 
        : 'bg-[#FAFAF9] border-b border-[#E5E7EB] py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <div onClick={() => setCurrentView('marketing')} className="cursor-pointer">
            <Logo variant="full" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-xs font-medium tracking-wide uppercase text-[#4B5563] hover:text-[#111827] transition-colors duration-150 py-1 focus:outline-hidden focus:text-[#111827] relative group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8CE800] transition-all duration-200 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Right Action & Engine Health */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Live Backend Badge */}
            <div className="flex items-center space-x-2 text-[11px] font-mono px-3 py-1 rounded-sm bg-white border border-[#E5E7EB] text-[#4B5563]">
              <span className={`w-2 h-2 rounded-full ${
                backendHealth?.status === 'healthy' 
                  ? 'bg-[#8CE800] shadow-xs shadow-[#8CE800]' 
                  : 'bg-amber-500'
              }`}></span>
              <span>
                {backendHealth?.status === 'healthy' 
                  ? (backendHealth.ai_engine_configured ? 'Engine: Gemini + Rules' : 'Deterministic Engine')
                  : 'Engine: Ready'}
              </span>
            </div>

            {/* Primary Action Button */}
            {currentView === 'marketing' ? (
              <button
                onClick={() => {
                  setCurrentView('analyze');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-sm text-xs font-semibold tracking-wide uppercase bg-[#111827] text-white hover:bg-[#8CE800] hover:text-[#111827] transition-all duration-150 shadow-xs focus:ring-2 focus:ring-offset-2 focus:ring-[#8CE800]"
              >
                <span>Analyse an incident</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('marketing')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-sm text-xs font-semibold tracking-wide uppercase bg-white hover:bg-[#F4F4F2] text-[#111827] border border-[#E5E7EB] transition-colors"
              >
                <span>Back to Overview</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => {
                setCurrentView(currentView === 'marketing' ? 'analyze' : 'marketing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs px-3 py-1.5 rounded-sm bg-[#111827] text-white font-medium uppercase tracking-wider"
            >
              {currentView === 'marketing' ? 'Analyse' : 'Overview'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F4F2] focus:outline-hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white px-4 pt-4 pb-6 space-y-3 animate-fade-in-up">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left py-2 text-sm font-medium tracking-wide uppercase text-[#4B5563] hover:text-[#111827]"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#E5E7EB]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView('analyze');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-sm bg-[#111827] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#8CE800] hover:text-[#111827] transition-colors"
            >
              <span>Analyse an incident</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
