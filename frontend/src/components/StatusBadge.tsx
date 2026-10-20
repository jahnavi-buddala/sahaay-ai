import React from 'react';
import { IncidentStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface StatusBadgeProps {
  status: IncidentStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useLanguage();

  const configs: Record<
    IncidentStatus,
    { labelKey: string; bg: string; text: string; border: string; emoji: string }
  > = {
    verified: {
      labelKey: 'status_verified',
      bg: 'bg-[#ADD8E6]/30',
      text: 'text-[#2F4F4F]',
      border: 'border-[#87CEEB]',
      emoji: '🛡️',
    },
    corroborated: {
      labelKey: 'status_corroborated',
      bg: 'bg-[#F5F5DC]',
      text: 'text-[#2F4F4F]',
      border: 'border-[#778899]',
      emoji: '👥',
    },
    unverified: {
      labelKey: 'status_unverified',
      bg: 'bg-white',
      text: 'text-[#778899]',
      border: 'border-[#E2DFD2]',
      emoji: '⏳',
    },
    resolved: {
      labelKey: 'status_resolved',
      bg: 'bg-[#87CEEB]/25',
      text: 'text-[#2F4F4F]',
      border: 'border-[#87CEEB]',
      emoji: '✅',
    },
    stale: {
      labelKey: 'status_stale',
      bg: 'bg-[#F0EEE6]',
      text: 'text-[#778899]',
      border: 'border-[#D9D6C7]',
      emoji: '📁',
    },
  };

  const current = configs[status] || configs.unverified;
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold border rounded-full ${current.bg} ${current.text} ${current.border} ${sizeClass} shadow-2xs`}
    >
      <span>{current.emoji}</span>
      <span>{t(current.labelKey)}</span>
    </span>
  );
};
