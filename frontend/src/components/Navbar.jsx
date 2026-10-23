import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Menu, 
  X, 
  ArrowRight,
  Activity,
  AlertCircle
} from 'lucide-react';

import { fetchHealth } from '../services/api';

export default function Navbar({ currentView, setCurrentView, onOpenDemo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
    { label: 'Product', href: '#product' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Interactive Demo', href: '#demo' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Trust & Evidence', href: '#trust' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (currentView === 'analyze') {
      setCurrentView('marketing');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-[#17243A]/95 backdrop-blur-md border-b border-[#273852] py-3.5 shadow-md' 
        : 'bg-[#17243A] border-b border-[#273852] py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('marketing')}>
            <div className="w-9 h-9 rounded-lg bg-[#167D78] flex items-center justify-center shadow-inner relative group">
              {/* Evidence trail mark */}
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span className="w-2.5 h-0.5 bg-white/70"></span>
                <span className="w-2 h-2 rounded-full bg-[#E5A34B]"></span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                whyrus
                <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#273852] text-[#64748B] font-semibold border border-[#334155]">
                  rca
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors duration-150 relative py-1 focus:outline-none focus:text-white"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action & Engine Health */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Live Backend Badge */}
            <div className="flex items-center space-x-2 text-xs font-mono px-2.5 py-1 rounded bg-[#0F172A] border border-[#273852] text-[#94A3B8]">
              <span className={`w-2 h-2 rounded-full ${backendHealth?.status === 'healthy' ? 'bg-[#167D78] animate-pulse' : 'bg-amber-500'}`}></span>
              <span>
                {backendHealth?.status === 'healthy' 
                  ? (backendHealth.ai_engine_configured ? 'Engine: Gemini + Rules' : 'Engine: Deterministic Active')
                  : 'Backend Ready'}
              </span>
            </div>

            {/* Primary Action Button */}
            {currentView === 'marketing' ? (
              <button
                onClick={() => {
                  setCurrentView('analyze');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded text-sm font-medium bg-[#167D78] hover:bg-[#126863] text-white transition-all duration-150 shadow-sm shadow-[#167D78]/20 focus:ring-2 focus:ring-offset-2 focus:ring-[#167D78] focus:ring-offset-[#17243A]"
              >
                <span>Analyze an incident</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('marketing')}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded text-sm font-medium bg-[#273852] hover:bg-[#334155] text-white transition-colors"
              >
                <span>Back to Overview</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => {
                setCurrentView(currentView === 'marketing' ? 'analyze' : 'marketing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs px-2.5 py-1.5 rounded bg-[#167D78] text-white font-medium"
            >
              {currentView === 'marketing' ? 'Analyze' : 'Home'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-[#94A3B8] hover:text-white hover:bg-[#273852] focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#273852] bg-[#17243A] px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left py-2 text-base font-medium text-[#94A3B8] hover:text-white"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#273852]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView('analyze');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded bg-[#167D78] text-white font-medium text-sm"
            >
              <span>Analyze an incident</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
