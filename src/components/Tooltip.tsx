import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  key?: React.Key;
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div 
        className={`absolute ${positionClasses[position]} hidden group-hover:block z-50 px-3 py-2 text-xs font-medium text-white bg-surface-container-highest border border-outline-variant/30 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none glass-panel`}
      >
        {content}
      </div>
    </div>
  );
}
