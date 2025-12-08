import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className={`text-ui-gray hover:text-wave-blue transition-colors cursor-help ${className}`}
        aria-label="More information"
      >
        <Info size={14} />
      </button>

      {isVisible && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-navy-900 border border-navy-700 rounded-lg text-xs text-slate-300 leading-relaxed font-body shadow-xl z-50 pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-navy-700"></div>
          {content}
        </div>
      )}
    </div>
  );
};
