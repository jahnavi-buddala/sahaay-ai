import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchIncidents } from '../services/api';
import { Incident } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Camera, 
  MapPin, 
  ArrowRight, 
  CloudRain, 
  ChevronRight, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents()
      .then((data) => {
        setRecentIncidents(data.items.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1C2E2E]">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#E2DFD2] bg-gradient-to-b from-[#FAF8F2] via-[#F5F5DC]/40 to-[#FAF8F2]">
        {/* Subtle decorative glow with new light blue & cream swatches */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-[#ADD8E6]/25 to-[#87CEEB]/20 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Civic Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2DFD2] text-xs font-semibold text-[#2F4F4F] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#87CEEB] animate-pulse" />
                <span>🚨 Sahaay AI • Predict • Prevent • Protect</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2F4F4F] leading-[1.15]">
                {t('hero_title')}
              </h1>

              <p className="text-base sm:text-lg text-[#586B6B] leading-relaxed max-w-2xl">
                {t('hero_subtitle')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white font-bold text-sm shadow-xs transition-all hover:shadow hover:-translate-y-0.5 border border-[#2F4F4F]"
                >
                  <Camera className="w-4 h-4 text-[#87CEEB]" />
                  <span>📸 {t('cta_report')}</span>
                </Link>

                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FAF8F2] text-[#2F4F4F] border border-[#E2DFD2] font-bold text-sm shadow-2xs transition-all hover:border-[#778899] hover:-translate-y-0.5"
                >
                  <MapPin className="w-4 h-4 text-[#778899]" />
                  <span>🗺️ {t('cta_explore_map')}</span>
                </Link>
              </div>

              {/* Three Compact Feature Indicators with Emojis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E2DFD2]">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-[#E2DFD2] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-[#ADD8E6]/40 flex items-center justify-center text-base shrink-0">
                    👥
                  </div>
                  <span className="text-xs font-semibold text-[#2F4F4F]">
                    {t('pill_community')}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-[#E2DFD2] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-[#87CEEB]/30 flex items-center justify-center text-base shrink-0">
                    🤖
                  </div>
                  <span className="text-xs font-semibold text-[#2F4F4F]">
                    {t('pill_ai')}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-[#E2DFD2] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-[#F5F5DC] flex items-center justify-center text-base shrink-0">
                    📊
                  </div>
                  <span className="text-xs font-semibold text-[#2F4F4F]">
                    {t('pill_risk')}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Floating Real Road Hazard Photo & Evidence Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-[#E2DFD2] shadow-xl bg-white">
                
                {/* Real Urban Road Rain Photograph */}
                <div className="relative h-64 overflow-hidden bg-[#2F4F4F]">
                  <img
                    src="/uploads/demo_begumpet_waterlogging.jpg"
                    alt="Begumpet Waterlogging"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-semibold bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1.5 font-mono">
                      🌧️ Precip: 18.5 mm/h
                    </span>
                    <span className="text-[11px] bg-[#87CEEB] text-[#2F4F4F] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      🔴 Elevated Hazard
                    </span>
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ADD8E6] block">
                      📍 Begumpet Underpass, Hyderabad
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      Submerged Roadbed with Stagnant Floodwater
                    </h3>
                  </div>
                </div>

                {/* Floating Detail Preview Card */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <RiskBadge score={85} level="Elevated concern" />
                    <StatusBadge status="verified" size="sm" />
                  </div>

                  <div className="p-3.5 bg-[#FAF8F2] rounded-2xl border border-[#E2DFD2] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#586B6B]">🤖 AI Visual Model:</span>
                      <strong className="text-[#2F4F4F]">Continuous water sheet (88%)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#586B6B]">🌧️ Open-Meteo Rain:</span>
                      <strong className="text-[#2F4F4F]">Heavy active storm (90% prob)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#586B6B]">👥 Corroboration:</span>
                      <strong className="text-[#2F4F4F]">3 nearby motorist reports</strong>
                    </div>
                  </div>

                  <Link
                    to="/incidents/SHY-HYD-001"
                    className="block text-center py-2.5 rounded-xl bg-[#ADD8E6]/40 hover:bg-[#87CEEB]/40 text-[#2F4F4F] text-xs font-bold transition-colors border border-[#ADD8E6]"
                  >
                    🔍 Inspect Live Evidence & Alternative Route →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3 Simple Steps with Emojis) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#778899] uppercase tracking-wider">⚡ Simple Process</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#2F4F4F] mt-1">
            How Sahaay AI Works
          </h2>
          <p className="text-xs sm:text-sm text-[#586B6B] mt-2">
            A three-step civic intelligence loop turning everyday observations into explainable travel safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="card-soft p-6 border border-[#E2DFD2] hover:border-[#778899] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F5DC] text-[#2F4F4F] flex items-center justify-center font-bold text-xl mb-4 border border-[#E2DFD2]">
              📸
            </div>
            <h3 className="text-base font-bold text-[#2F4F4F] mb-2">1. 📸 Report</h3>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Snap a photo, place a pin on the interactive Leaflet map, and describe what you see — whether it's submerged curbs, deep potholes, or fallen tree limbs.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-soft p-6 border border-[#E2DFD2] hover:border-[#ADD8E6] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#ADD8E6]/40 text-[#2F4F4F] flex items-center justify-center font-bold text-xl mb-4 border border-[#ADD8E6]">
              🤖
            </div>
            <h3 className="text-base font-bold text-[#2F4F4F] mb-2">2. 🤖 Analyze</h3>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Sahaay AI extracts visual evidence, checks live Open-Meteo precipitation, clusters nearby duplicate submissions, and calculates a 0–100 evidence score.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-soft p-6 border border-[#E2DFD2] hover:border-[#87CEEB] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#87CEEB]/30 text-[#2F4F4F] flex items-center justify-center font-bold text-xl mb-4 border border-[#87CEEB]">
              🧭
            </div>
            <h3 className="text-base font-bold text-[#2F4F4F] mb-2">3. 🧭 Protect</h3>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Explore reported hazards on a live map, review contributing factors, generate bilingual alerts, and compare candidate bypass routes to travel safely.
            </p>
          </div>

        </div>
      </section>

      {/* 3. RECENT INCIDENTS WITH AUTHENTIC NEWS / ROAD PHOTOS */}
      <section className="py-16 bg-[#F5F5DC]/30 border-y border-[#E2DFD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-[#778899] uppercase tracking-wider">📢 Live & Verified Feed</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4F4F] mt-1">
                Recent Road Hazards & Flood Reports
              </h2>
              <p className="text-xs text-[#586B6B] mt-1">
                Authentic street-level observations and municipal response alerts.
              </p>
            </div>

            <Link
              to="/incidents"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F4F4F] hover:text-[#778899]"
            >
              <span>View all reported hazards</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="card-soft p-5 animate-pulse space-y-4">
                  <div className="h-40 bg-[#E2DFD2] rounded-xl" />
                  <div className="h-4 bg-[#E2DFD2] rounded-md w-3/4" />
                  <div className="h-3 bg-[#E2DFD2] rounded-md w-1/2" />
                </div>
              ))}
            </div>
          ) : recentIncidents.length === 0 ? (
            <div className="card-soft p-12 text-center border border-[#E2DFD2]">
              <AlertCircle className="w-8 h-8 text-[#778899] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#2F4F4F]">No active road hazards reported</p>
              <p className="text-xs text-[#586B6B] mt-1">All roads are currently clear or reports have expired.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="card-soft card-soft-hover border border-[#E2DFD2] flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Realistic Photo Thumbnail */}
                    <div className="h-40 bg-[#2F4F4F] relative overflow-hidden">
                      {incident.photo_url ? (
                        <img
                          src={incident.photo_url}
                          alt={incident.hazard_type}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#FAF8F2] text-[#586B6B] text-xs">
                          No Photo Provided
                        </div>
                      )}
                      
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-white/95 text-[#2F4F4F] backdrop-blur-md border border-[#E2DFD2]">
                          {incident.hazard_type === 'Waterlogging' ? '🌊 Waterlogging' : 
                           incident.hazard_type === 'Flooded Road' ? '🚣 Flooded Road' :
                           incident.hazard_type === 'Road Obstruction' ? '🚧 Obstruction' :
                           incident.hazard_type === 'Damaged Road' ? '🕳️ Damaged Road' : '⚠️ Hazard'}
                        </span>
                      </div>

                      {incident.is_demo_data && (
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#2F4F4F]/80 text-white backdrop-blur-md">
                            Verified Case
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-[#2F4F4F] line-clamp-1">
                          {incident.title || incident.address}
                        </h4>
                        <p className="text-[11px] text-[#586B6B] line-clamp-2 mt-1 leading-relaxed">
                          {incident.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <RiskBadge score={incident.risk_score} level={incident.risk_level} size="sm" />
                        <StatusBadge status={incident.status} size="sm" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      to={`/incidents/${incident.id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-[#FAF8F2] hover:bg-[#ADD8E6]/40 text-[#2F4F4F] transition-colors border border-[#E2DFD2]"
                    >
                      <span>🔍 Inspect Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. KEY CIVIC FEATURES (With Emojis & New Palette) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#778899] uppercase tracking-wider">🛡️ Engineered for Urban Safety</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#2F4F4F] mt-1">
            Built for Transparency and Resilience
          </h2>
          <p className="text-xs sm:text-sm text-[#586B6B] mt-2">
            Combining computer vision, live weather radar, and open geospatial standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="card-soft p-5 border border-[#E2DFD2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5DC] flex items-center justify-center text-xl">
              📸
            </div>
            <h4 className="font-bold text-sm text-[#2F4F4F]">AI-Assisted Photo Analysis</h4>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Examines surface reflectance, texture smoothness, and water pooling with explicit confidence bounds and documented limitations.
            </p>
          </div>

          <div className="card-soft p-5 border border-[#E2DFD2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#ADD8E6]/40 flex items-center justify-center text-xl">
              🗺️
            </div>
            <h4 className="font-bold text-sm text-[#2F4F4F]">Interactive Leaflet Map</h4>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Fast, lightweight OpenStreetMap cartography with status-coded pins, spatial search, and responsive sidebar listing.
            </p>
          </div>

          <div className="card-soft p-5 border border-[#E2DFD2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#87CEEB]/30 flex items-center justify-center text-xl">
              🌧️
            </div>
            <h4 className="font-bold text-sm text-[#2F4F4F]">Live Weather Context</h4>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Direct Open-Meteo precipitation and 6-hour rainfall forecasts provide atmospheric ground truth for every coordinate.
            </p>
          </div>

          <div className="card-soft p-5 border border-[#E2DFD2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5DC] flex items-center justify-center text-xl">
              👥
            </div>
            <h4 className="font-bold text-sm text-[#2F4F4F]">Duplicate Grouping</h4>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Spatial proximity (&lt;600m) and temporal clustering automatically merge related reports into corroborating evidence.
            </p>
          </div>

          <div className="card-soft p-5 border border-[#E2DFD2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#ADD8E6]/40 flex items-center justify-center text-xl">
              📊
            </div>
            <h4 className="font-bold text-sm text-[#2F4F4F]">Explainable 0–100 Risk Score</h4>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Transparent, weighted breakdown: visual (30), corroboration (25), rainfall (20), freshness (15), and location quality (10).
            </p>
          </div>

          <div className="card-soft p-5 border border-[#E2DFD2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#87CEEB]/30 flex items-center justify-center text-xl">
              🗣️
            </div>
            <h4 className="font-bold text-sm text-[#2F4F4F]">Trilingual Alerts</h4>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Localized emergency alerts in English, Telugu, and Hindi for WhatsApp and SMS broadcast during monsoon emergencies.
            </p>
          </div>

          <div className="card-soft p-5 border border-[#E2DFD2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5DC] flex items-center justify-center text-xl">
              🧭
            </div>
            <h4 className="font-bold text-sm text-[#2F4F4F]">Alternative Route Comparison</h4>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              OSRM-driven routing engine evaluates proximity to active hazard clusters and recommends safer bypass corridors.
            </p>
          </div>

          <div className="card-soft p-5 border border-[#E2DFD2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#ADD8E6]/40 flex items-center justify-center text-xl">
              🛡️
            </div>
            <h4 className="font-bold text-sm text-[#2F4F4F]">Municipal Response Support</h4>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Equips disaster management authorities with verified community data to dispatch pumps and place police barricades.
            </p>
          </div>

        </div>
      </section>

      {/* 5. TRUST AND LIMITATIONS SECTION */}
      <section className="py-14 bg-white border-t border-[#E2DFD2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-3xl bg-[#FAF8F2] border border-[#E2DFD2] space-y-4">
            <div className="flex items-center gap-2.5 text-[#2F4F4F]">
              <span className="text-xl">⚠️</span>
              <h3 className="font-bold text-base">Civic Trust, Model Scope & Critical Limitations</h3>
            </div>
            <p className="text-xs text-[#586B6B] leading-relaxed">
              Sahaay AI is an open decision-support platform designed to assist commuters during monsoon disturbances.
              Please remember:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#586B6B] list-disc list-inside">
              <li>Reports originate from community observations and may be unverified until inspected.</li>
              <li>Computer vision cannot measure submerged pothole depth or water current velocity.</li>
              <li>Weather context indicates atmospheric precipitation, not physical drainage blockages.</li>
              <li>Never attempt to drive through flooded underpasses regardless of suggested routes.</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};
