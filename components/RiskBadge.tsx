
import React from 'react';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  score: number;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score }) => {
  const getStyles = () => {
    switch (level) {
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200 shadow-[0_0_10px_rgba(249,115,22,0.3)]';
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all ${getStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
        level === 'Low' ? 'bg-emerald-500' : 
        level === 'Medium' ? 'bg-amber-500' : 
        level === 'High' ? 'bg-orange-500' : 'bg-red-500'
      }`}></span>
      {level} • {score}%
    </div>
  );
};

export default RiskBadge;
