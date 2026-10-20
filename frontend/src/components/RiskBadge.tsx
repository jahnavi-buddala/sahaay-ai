import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, level, size = 'md', showBar = false }) => {
  // Using palette: #2F4F4F, #778899, #F5F5DC, #ADD8E6, #87CEEB
  let bgColor = 'bg-[#F5F5DC] text-[#2F4F4F] border border-[#E2DFD2]';
  let barColor = 'bg-[#778899]';
  let dotEmoji = '🟢';

  if (level === 'Resolved / Cleared') {
    bgColor = 'bg-[#ADD8E6]/40 text-[#2F4F4F] border border-[#87CEEB]';
    barColor = 'bg-[#87CEEB]';
    dotEmoji = '🔵';
  } else if (score >= 60 || level === 'Elevated concern') {
    bgColor = 'bg-[#FBE8E6] text-[#8C3429] border border-[#E9A49A]';
    barColor = 'bg-[#E9A49A]';
    dotEmoji = '🔴';
  } else if (score >= 30 || level === 'Use caution') {
    bgColor = 'bg-[#FEF6E4] text-[#8F6616] border border-[#F5D99A]';
    barColor = 'bg-[#F5D99A]';
    dotEmoji = '🟡';
  } else {
    // Limited evidence
    bgColor = 'bg-[#EBF3ED] text-[#2F5E3D] border border-[#C6DDD0]';
    barColor = 'bg-[#778899]';
    dotEmoji = '🟢';
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full',
    md: 'text-xs font-semibold px-3 py-1 rounded-full',
    lg: 'text-sm font-bold px-3.5 py-1.5 rounded-full',
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <span className={`inline-flex items-center gap-1.5 font-medium ${bgColor} ${sizeClasses[size]}`}>
        <span>{dotEmoji}</span>
        <span>{level}</span>
        <span className="opacity-80 font-mono text-[11px]">({score}/100)</span>
      </span>

      {showBar && (
        <div className="w-full bg-[#E5E4D8] rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
