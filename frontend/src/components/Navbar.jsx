
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import { fetchHealth } from '../services/api';

export default function Navbar({
  currentView,
  setCurrentView,
  onOpenDemo,
  theme,
  onToggleTheme,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchHealth()
      .then((data) => setBackendHealth(data))
      .catch(() => setBackendHealth({ status: 'offline' }));
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Workflow', href: '#workflow' },
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

  const themeToggleClass =
    'inline-flex items-center justify-center w-9 h-9 rounded-sm border text-[var(--text-primary)] hover:border-[#E4CDE6] hover:text-[#713F75] transition-colors';

  const navLinkClass =
    'text-xs font-medium tracking-wide uppercase transition-colors duration-150 py-1 relative group hover:text-[#713F75] focus:outline-none focus:text-[#713F75]';

  const secondaryButtonClass =
    'inline-flex items-center space-x-2 px-4 py-2 rounded-sm text-xs font-semibold tracking-wide uppercase border transition-colors hover:border-[#E4CDE6] hover:text-[#713F75]';

  const primaryButtonClass =
    'inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-sm text-xs font-semibold tracking-wide uppercase bg-[#713F75] text-white hover:bg-[#572F5B] transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#713F75]';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'backdrop-blur-md border-b py-3.5 shadow-xs'
          : 'border-b py-4'
      }`}
      style={{
        backgroundColor: 'var(--page-bg)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Brand */}
          <button
            type="button"
            onClick={() => {
              setCurrentView('marketing');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#713F75] rounded-sm"
            aria-label="Whyrus home"
          >
            <Logo variant="full" />
          </button>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-7"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className={navLinkClass}
                style={{ color: 'var(--text-secondary)' }}
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#713F75] transition-all duration-200 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-4">

            {/* Backend Health */}
            <div
              className="flex items-center space-x-2 text-[11px] font-mono px-3 py-1 rounded-sm border"
              style={{
                backgroundColor: 'var(--surface-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              title={
                backendHealth?.status === 'healthy'
                  ? 'Backend health check passed'
                  : 'Backend health status is not confirmed'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealth?.status === 'healthy'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
              />
              <span>
                {backendHealth?.status === 'healthy'
                  ? backendHealth.ai_engine_configured
                    ? 'Engine: Gemini + Rules'
                    : 'Deterministic Engine'
                  : 'Engine: Ready'}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className={themeToggleClass}
              style={{
                backgroundColor: 'var(--surface-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* Primary Action */}
            {currentView === 'marketing' ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentView('analyze');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={primaryButtonClass}
              >
                <span>Analyse an incident</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCurrentView('marketing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={secondaryButtonClass}
                style={{
                  backgroundColor: 'var(--surface-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <span>Back to Overview</span>
              </button>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-3">

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className={themeToggleClass}
              style={{
                backgroundColor: 'var(--surface-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* Analyse / Overview */}
            <button
              type="button"
              onClick={() => {
                setCurrentView(
                  currentView === 'marketing' ? 'analyze' : 'marketing'
                );
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs px-3 py-1.5 rounded-sm bg-[#713F75] text-white font-medium uppercase tracking-wider hover:bg-[#572F5B] transition-colors"
            >
              {currentView === 'marketing' ? 'Analyse' : 'Overview'}
            </button>

            {/* Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm transition-colors hover:bg-[#F7EFF8] hover:text-[#713F75] focus:outline-none focus:ring-2 focus:ring-[#713F75]"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t px-4 pt-4 pb-6 space-y-3 animate-fade-in-up"
          style={{
            backgroundColor: 'var(--surface-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left py-2 text-sm font-medium tracking-wide uppercase transition-colors hover:text-[#713F75]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {link.label}
            </button>
          ))}

          <div
            className="pt-3 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView('analyze');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider ${primaryButtonClass}`}
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
