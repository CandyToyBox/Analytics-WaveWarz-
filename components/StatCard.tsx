import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
  colorClass?: string;
  trend?: 'up' | 'down' | 'neutral';
  tooltip?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, colorClass = "text-white", trend, tooltip }) => {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-ui-gray text-sm font-medium font-body">{label}</span>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
        {icon && <div className={`${colorClass} opacity-80`}>{icon}</div>}
      </div>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      {subValue && (
        <div className="text-slate-500 text-xs mt-1 font-mono flex items-center gap-1">
          {subValue.startsWith('$') ? <span className="text-action-green/80">{subValue}</span> : subValue}
        </div>
      )}
    </div>
  );
};