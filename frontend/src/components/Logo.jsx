
import React from 'react';
import whyrusLogo from '../logo.jpg';

export default function Logo({
  variant = 'full',
  className = '',
  animated = true,
}) {
  const compact = variant === 'symbol' || variant === 'compact';

  return (
    <div
      className={`inline-flex items-center gap-2 shrink-0 min-w-0 ${
        compact ? '' : 'group cursor-pointer select-none'
      } ${className}`}
    >
      <img
        src={whyrusLogo}
        alt="Whyrus logo"
        className={`h-12 w-auto max-w-[160px] object-contain shrink-0 ${
          animated
            ? 'transition-transform duration-300 group-hover:scale-[1.02]'
            : ''
        }`}
      />

      {!compact && (
        <span
          className="shrink-0 whitespace-nowrap text-[25px] font-bold tracking-[-1px] leading-none lowercase transition-colors duration-200"
          style={{
            fontFamily: "'Figtree', Arial, sans-serif",
            color: 'var(--text-primary)',
          }}
        >
          whyrus<span className="text-[#713F75]">.</span>
        </span>
      )}
    </div>
  );
}
