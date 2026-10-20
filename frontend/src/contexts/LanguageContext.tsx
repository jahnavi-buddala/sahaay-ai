import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident } from '../types';

export type Language = 'en' | 'te' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    te: string;
    hi: string;
  };
}

const translations: Translations = {
  // Navigation
  nav_home: { en: 'Home', te: 'హోమ్', hi: 'होम' },
  nav_map: { en: 'Live Map', te: 'లైవ్ మ్యాప్', hi: 'लाइव मैप' },
  nav_report: { en: 'Report Hazard', te: 'సమస్యను నివేదించండి', hi: 'खतरे की रिपोर्ट करें' },
  nav_incidents: { en: 'Incidents', te: 'సంఘటనలు', hi: 'घटनाएं' },
  nav_my_reports: { en: 'My Reports', te: 'నా నివేదికలు', hi: 'मेरी रिपोर्ट्स' },
  nav_about: { en: 'About', te: 'గురించి', hi: 'हमारे बारे में' },
  nav_admin: { en: 'Admin Portal', te: 'అడ్మిన్ పోర్టల్', hi: 'एडमिन पोर्टल' },
  nav_login: { en: 'Sign In', te: 'లాగిన్', hi: 'लॉग इन' },
  nav_signup: { en: 'Sign Up', te: 'ఖాతా తెరవండి', hi: 'साइन अप' },
  nav_logout: { en: 'Sign Out', te: 'లాగౌట్', hi: 'लॉग आउट' },

  // Hero
  hero_title: { 
    en: 'Know the road before you take it.', 
    te: 'మీరు ప్రయాణించే రహదారిని ముందుగానే తెలుసుకోండి.',
    hi: 'सड़क पर निकलने से पहले उसका हाल जानें।'
  },
  hero_subtitle: {
    en: 'Community reports, AI-powered image analysis and weather context to help you understand possible road hazards.',
    te: 'రహదారి ప్రమాదాలను గుర్తించడానికి కమ్యూనిటీ నివేదికలు, కృత్రిమ మేధస్సు (AI) చిత్ర విశ్లేషణ మరియు వాతావరణ సమాచారం.',
    hi: 'संभावित सड़क खतरों को समझने के लिए नागरिक रिपोर्ट, एआई इमेज विश्लेषण और मौसम संदर्भ।'
  },
  cta_report: { en: 'Report a Hazard', te: 'సమస్యను నివేదించండి', hi: 'खतरे की रिपोर्ट करें' },
  cta_explore_map: { en: 'Explore Hazard Map', te: 'మ్యాప్‌ను చూడండి', hi: 'खतरा मैप देखें' },

  // Feature pills
  pill_community: { en: 'Community-powered reports', te: 'కమ్యూనిటీ ఆధారిత నివేదికలు', hi: 'समुदाय-संचालित रिपोर्ट' },
  pill_ai: { en: 'AI-assisted image analysis', te: 'AI ఆధారిత చిత్ర విశ్లేషణ', hi: 'एआई-सहायता प्राप्त छवि विश्लेषण' },
  pill_risk: { en: 'Explainable risk indicators', te: 'వివరణాత్మక ప్రమాద సూచికలు', hi: 'स्पष्ट जोखिम संकेतक' },

  // Hazard types
  hazard_waterlogging: { en: 'Waterlogging', te: 'నీరు నిలవడం (Waterlogging)', hi: 'जलभराव (Waterlogging)' },
  hazard_flooded_road: { en: 'Flooded Road', te: 'వరద ముంపు రహదారి', hi: 'बाढ़ग्रस्त सड़क' },
  hazard_obstruction: { en: 'Road Obstruction', te: 'రహదారి అడ్డంకి', hi: 'सड़क रुकावट' },
  hazard_damaged_road: { en: 'Damaged Road', te: 'దెబ్బతిన్న రోడ్డు', hi: 'क्षतिग्रस्त सड़क' },
  hazard_other: { en: 'Other Hazard', te: 'ఇతర సమస్య', hi: 'अन्य खतरा' },

  // Statuses
  status_unverified: { en: 'Unverified', te: 'ధృవీకరించబడలేదు', hi: 'सत्यापित नहीं' },
  status_corroborated: { en: 'Corroborated', te: 'ధృవీకరించే నివేదికలు ఉన్నాయి', hi: 'पुष्टीकृत (Corroborated)' },
  status_verified: { en: 'Verified', te: 'అధికారికంగా ధృవీకరించబడింది', hi: 'सत्यापित (Verified)' },
  status_resolved: { en: 'Resolved / Cleared', te: 'పరిష్కరించబడింది', hi: 'हल किया गया / साफ़' },
  status_stale: { en: 'Stale Report', te: 'పాత నివేదిక', hi: 'पुरानी रिपोर्ट' },

  // Risk levels
  risk_limited: { en: 'Limited evidence', te: 'పరిమిత ఆధారాలు', hi: 'सीमित साक्ष्य' },
  risk_caution: { en: 'Use caution', te: 'జాగ్రత్త వహించండి', hi: 'सावधानी बरतें' },
  risk_elevated: { en: 'Elevated concern', te: 'తీవ్ర ఆందోళన / ప్రమాదం', hi: 'गंभीर चिंता / उच्च जोखिम' },

  // Alerts
  alert_title: { en: 'Civic Road Hazard Alert', te: 'పౌర రహదారి ప్రమాద హెచ్చరిక', hi: 'नागरिक सड़क सुरक्षा चेतावनी' },
  copy_alert: { en: 'Copy Alert Message', te: 'హెచ్చరికను కాపీ చేయండి', hi: 'अलर्ट संदेश कॉपी करें' },
  copied: { en: 'Copied to Clipboard!', te: 'కాపీ చేయబడింది!', hi: 'कॉपी हो गया!' },
  view_details: { en: 'View Details', te: 'వివరాలు చూడండి', hi: 'विवरण देखें' },
  back_to_map: { en: 'Back to Map', te: 'తిరిగి మ్యాప్‌కు వెళ్ళండి', hi: 'वापस मैप पर जाएं' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  generateAlertText: (incident: Incident) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('sahaay_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('sahaay_lang', language);
  }, [language]);

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  const generateAlertText = (incident: Incident): string => {
    const timeStr = new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const location = incident.address || `${incident.latitude}, ${incident.longitude}`;

    if (language === 'te') {
      return `⚠️ [సహాయ్ AI హెచ్చరిక]: ${incident.hazard_type} నివేదించబడింది!\n📍 స్థలం: ${location}\n⏱️ సమయం: ${timeStr}\n📊 ప్రమాద సూచిక: ${incident.risk_score}/100 (${incident.risk_level})\n📝 వివరాలు: ${incident.description}\nదయచేసి జాగ్రత్తగా ప్రయాణించండి లేదా ప్రత్యామ్నాయ మార్గాన్ని ఎంచుకోండి.`;
    }

    if (language === 'hi') {
      return `⚠️ [सहाय AI सड़क चेतावनी]: ${incident.hazard_type} की सूचना मिली है!\n📍 स्थान: ${location}\n⏱️ समय: ${timeStr}\n📊 साक्ष्य स्कोर: ${incident.risk_score}/100 (${incident.risk_level})\n📝 विवरण: ${incident.description}\nकृपया सावधानी से वाहन चलाएं या वैकल्पिक मार्ग चुनें।`;
    }

    return `⚠️ [Sahaay AI Hazard Alert]: ${incident.hazard_type} reported!\n📍 Location: ${location}\n⏱️ Reported: ${timeStr}\n📊 Evidence Score: ${incident.risk_score}/100 (${incident.risk_level})\n📝 Summary: ${incident.description}\nDrive with caution or consider an alternative route.`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, generateAlertText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
