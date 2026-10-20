import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  MapPin, 
  Cpu, 
  CloudRain, 
  Navigation, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  AlertTriangle 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF8] py-12 px-4 sm:px-6 lg:px-8 text-[#25332F]">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF3ED] text-[#5F8B6F] text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-[#5F8B6F]" />
            <span>Civic Resilience & Monsoon Safety</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#25332F]">
            About Sahaay AI
          </h1>
          <p className="text-base text-[#718078] max-w-2xl mx-auto">
            "Predict. Prevent. Protect." — An open civic-tech intelligence initiative empowering Indian commuters and municipal response teams.
          </p>
        </div>

        {/* 1. The Challenge */}
        <div className="card-soft p-8 border border-[#E3EBE5] bg-white space-y-4">
          <h2 className="text-xl font-bold text-[#25332F]">The Urban Inundation Challenge</h2>
          <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
            During the Indian monsoon, rapid cloudbursts and intense rainfall can turn underpasses, service corridors, and arterial junctions into hazardous waterlogged zones within minutes. Commuters often lack ground-level visibility into road conditions until they are already stuck in stalled traffic or submerged underpasses.
          </p>
          <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
            Existing navigation platforms optimize solely for traffic delays, lacking explainable ground truth about surface water depth, drain overflows, or fallen trees. Sahaay AI bridges this gap by fusing citizen photo reports, computer vision analysis, and live Open-Meteo precipitation data.
          </p>
        </div>

        {/* 2. Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-soft p-6 border border-[#E3EBE5] bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3ED] text-[#5F8B6F] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-bold text-base text-[#25332F]">Predict</h3>
            <p className="text-xs text-[#718078] leading-relaxed">
              Live meteorological feeds and historical waterlogging hotspots provide early warning indicators before commuters begin their trips.
            </p>
          </div>

          <div className="card-soft p-6 border border-[#E3EBE5] bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF8F7] text-[#4D9085] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-bold text-base text-[#25332F]">Prevent</h3>
            <p className="text-xs text-[#718078] leading-relaxed">
              OpenStreetMap and OSRM routing comparison highlights verified hazard points and routes commuters safely around dangerous flooded corridors.
            </p>
          </div>

          <div className="card-soft p-6 border border-[#E3EBE5] bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCECF5] text-[#25332F] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-bold text-base text-[#25332F]">Protect</h3>
            <p className="text-xs text-[#718078] leading-relaxed">
              Bilingual broadcast alerts in English, Telugu, and Hindi enable rapid neighborhood communication across local WhatsApp groups and ward offices.
            </p>
          </div>
        </div>

        {/* 3. Methodology & AI Transparency */}
        <div className="card-soft p-8 border border-[#E3EBE5] bg-white space-y-5">
          <h2 className="text-xl font-bold text-[#25332F]">Explainable 0–100 Evidence Scoring</h2>
          <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
            Rather than producing uncalibrated black-box probabilities, Sahaay AI uses transparent, documented empirical weights:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5]">
              <span className="font-semibold text-[#25332F] block">Visual Machine Evidence (0–30 pts)</span>
              <span className="text-[#718078] text-[11px]">Evaluates specular sheen, smoothness, and turbid water pooling.</span>
            </div>
            <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5]">
              <span className="font-semibold text-[#25332F] block">Community Corroboration (0–25 pts)</span>
              <span className="text-[#718078] text-[11px]">Rewards multiple independent submissions within a 600m radius.</span>
            </div>
            <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5]">
              <span className="font-semibold text-[#25332F] block">Rainfall Context (0–20 pts)</span>
              <span className="text-[#718078] text-[11px]">Queries Open-Meteo precipitation rates and hourly rain probability.</span>
            </div>
            <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5]">
              <span className="font-semibold text-[#25332F] block">Report Freshness (0–15 pts)</span>
              <span className="text-[#718078] text-[11px]">Decays older observations (&gt;24h) to avoid false persistent alarms.</span>
            </div>
            <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5] sm:col-span-2">
              <span className="font-semibold text-[#25332F] block">Location & Description Quality (0–10 pts)</span>
              <span className="text-[#718078] text-[11px]">GPS coordinate accuracy and detailed observer descriptions.</span>
            </div>
          </div>
        </div>

        {/* 4. Open Standards & Datasets */}
        <div className="card-soft p-8 border border-[#E3EBE5] bg-white space-y-4">
          <h2 className="text-xl font-bold text-[#25332F]">Open Standards & Community Data</h2>
          <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
            Sahaay AI is built on open technologies without proprietary vendor lock-in:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#718078]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5F8B6F]" />
              <span><strong>OpenStreetMap:</strong> Global open cartography</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5F8B6F]" />
              <span><strong>Open-Meteo:</strong> Open meteorological forecast APIs</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5F8B6F]" />
              <span><strong>OSRM:</strong> Open source routing machine</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5F8B6F]" />
              <span><strong>FastAPI + SQLite:</strong> Lightweight open civic backend</span>
            </li>
          </ul>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#8FAF9A]/30 via-[#A8D5CE]/30 to-[#DCECF5]/40 border border-[#A8D5CE] text-center space-y-4">
          <h3 className="text-2xl font-bold text-[#25332F]">Join the Sahaay AI Civic Network</h3>
          <p className="text-xs sm:text-sm text-[#718078] max-w-md mx-auto">
            Report hazards in your neighborhood, review community submissions, and help keep fellow commuters safe.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/report"
              className="px-6 py-3 rounded-2xl bg-[#8FAF9A] hover:bg-[#7E9E89] text-[#25332F] text-xs font-semibold shadow-xs"
            >
              Report a Road Hazard
            </Link>
            <Link
              to="/map"
              className="px-6 py-3 rounded-2xl bg-white border border-[#E3EBE5] hover:bg-[#F8FAF8] text-[#25332F] text-xs font-semibold"
            >
              Explore Live Hazard Map
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
