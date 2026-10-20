import React, { useState } from 'react';
import { Incident } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Share2, Copy, Check, MessageSquare } from 'lucide-react';

interface BilingualAlertCardProps {
  incident: Incident;
}

export const BilingualAlertCard: React.FC<BilingualAlertCardProps> = ({ incident }) => {
  const { language, setLanguage, generateAlertText, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const alertText = generateAlertText(incident);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(alertText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
    }
  };

  return (
    <div className="card-soft p-5 border border-[#E3EBE5] bg-white/90">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E3EBE5]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#DCECF5] flex items-center justify-center text-[#25332F]">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#25332F]">{t('alert_title')}</h4>
            <p className="text-xs text-[#718078]">Community broadcast template</p>
          </div>
        </div>

        {/* Inline Language Selector (English, Telugu, Hindi) */}
        <div className="inline-flex items-center bg-[#F8FAF8] border border-[#E3EBE5] rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-md transition-colors ${
              language === 'en'
                ? 'bg-[#8FAF9A] text-white font-medium shadow-sm'
                : 'text-[#718078] hover:text-[#25332F]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('te')}
            className={`px-2 py-1 rounded-md transition-colors ${
              language === 'te'
                ? 'bg-[#8FAF9A] text-white font-medium shadow-sm'
                : 'text-[#718078] hover:text-[#25332F]'
            }`}
          >
            తెలుగు
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded-md transition-colors ${
              language === 'hi'
                ? 'bg-[#8FAF9A] text-white font-medium shadow-sm'
                : 'text-[#718078] hover:text-[#25332F]'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      <div className="bg-[#F8FAF8] rounded-xl p-3.5 border border-[#E3EBE5] font-mono text-xs text-[#25332F] whitespace-pre-wrap leading-relaxed">
        {alertText}
      </div>

      <div className="flex items-center justify-between mt-3.5">
        <span className="text-xs text-[#718078] flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Ready for WhatsApp / SMS broadcast
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#A8D5CE] hover:bg-[#96C7C0] text-[#25332F] transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? t('copied') : t('copy_alert')}</span>
        </button>
      </div>
    </div>
  );
};
