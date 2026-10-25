import React from 'react';

export default function Logo({ variant = 'full', className = '', animated = true }) {
  if (variant === 'symbol' || variant === 'compact') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg
          viewBox="0 0 40 40"
          className="w-9 h-9 transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="8" fill="#18181B" />
          {/* Signal path */}
          <path
            d="M 8 12 L 14 28 L 20 15 L 26 28 L 32 12"
            stroke="#FAFAFA"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? 'path-trace' : ''}
          />
          {/* Diagnostic nodes */}
          <circle cx="8" cy="12" r="2" fill="#E4E4E7" />
          <circle cx="14" cy="28" r="2" fill="#E4E4E7" />
          <circle cx="26" cy="28" r="2" fill="#E4E4E7" />
          <circle cx="32" cy="12" r="2" fill="#E4E4E7" />
          {/* Vivid lime green discovery node */}
          <circle
            cx="20"
            cy="15"
            r="3.5"
            fill="#8CE800"
            stroke="#18181B"
            strokeWidth="1.5"
            className={animated ? 'pulse-lime' : ''}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-3 group cursor-pointer select-none ${className}`}>
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 40 40"
          className="w-9 h-9 transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="8" fill="#18181B" />
          {/* Signal path */}
          <path
            d="M 8 12 L 14 28 L 20 15 L 26 28 L 32 12"
            stroke="#FAFAFA"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? 'path-trace' : ''}
          />
          {/* Diagnostic nodes */}
          <circle cx="8" cy="12" r="2" fill="#E4E4E7" />
          <circle cx="14" cy="28" r="2" fill="#E4E4E7" />
          <circle cx="26" cy="28" r="2" fill="#E4E4E7" />
          <circle cx="32" cy="12" r="2" fill="#E4E4E7" />
          {/* Vivid lime green discovery node */}
          <circle
            cx="20"
            cy="15"
            r="3.5"
            fill="#8CE800"
            stroke="#18181B"
            strokeWidth="1.5"
            className={animated ? 'pulse-lime' : ''}
          />
        </svg>
      </div>

      <div className="flex items-baseline font-heading tracking-tight text-xl font-extrabold text-[#111827]">
        <span>whyrus</span>
        <span className="w-2 h-2 ml-1 rounded-full bg-[#8CE800] inline-block shrink-0 shadow-sm shadow-[#8CE800]/50"></span>
      </div>
    </div>
  );
}
