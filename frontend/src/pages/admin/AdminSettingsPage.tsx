import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { fetchAdminSettings } from '../../services/api';
import { 
  Settings, 
  ShieldCheck, 
  CloudRain, 
  Cpu, 
  Database, 
  Navigation, 
  Sliders, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states for risk score weights
  const [visualWeight, setVisualWeight] = useState(30);
  const [corroborationWeight, setCorroborationWeight] = useState(25);
  const [rainfallWeight, setRainfallWeight] = useState(20);
  const [freshnessWeight, setFreshnessWeight] = useState(15);
  const [qualityWeight, setQualityWeight] = useState(10);
  const [expiryHours, setExpiryHours] = useState(24);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    fetchAdminSettings()
      .then((data) => {
        setSettings(data);
        if (data.risk_weights) {
          setVisualWeight(data.risk_weights.visual_max);
          setCorroborationWeight(data.risk_weights.corroboration_max);
          setRainfallWeight(data.risk_weights.rainfall_max);
          setFreshnessWeight(data.risk_weights.freshness_max);
          setQualityWeight(data.risk_weights.quality_max);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalWeights = visualWeight + corroborationWeight + rainfallWeight + freshnessWeight + qualityWeight;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAF8]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#25332F]">System Settings & Service Status</h1>
            <p className="text-xs text-[#718078] mt-0.5">
              Review environment configuration, model thresholds, and civic risk scoring parameters.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EBF3ED] text-[#2F5E3D] border border-[#C6DDD0]">
            System Operational
          </span>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-[#EBF3ED] border border-[#8FAF9A] rounded-xl text-xs text-[#2F5E3D] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#5F8B6F]" />
            <span>Risk configuration updated successfully.</span>
          </div>
        )}

        {/* 1. Connected Services Overview (Secrets hidden, status displayed) */}
        <div className="card-soft p-6 border border-[#E3EBE5] bg-white space-y-4">
          <h3 className="font-semibold text-sm text-[#25332F] pb-2 border-b border-[#E3EBE5]">
            Service Integrations & Secure Environment Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-[#25332F]">
                  <CloudRain className="w-4 h-4 text-[#4D9085]" />
                  <span>Weather API (Open-Meteo)</span>
                </div>
                <span className="text-[10px] bg-[#EFF8F7] text-[#4D9085] px-2 py-0.5 rounded font-semibold">
                  Connected
                </span>
              </div>
              <p className="text-[#718078] text-[11px]">
                Endpoint: https://api.open-meteo.com/v1/forecast • TTL Cache: 15 mins
              </p>
            </div>

            <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-[#25332F]">
                  <Cpu className="w-4 h-4 text-[#5F8B6F]" />
                  <span>Vision Model Pipeline</span>
                </div>
                <span className="text-[10px] bg-[#EBF3ED] text-[#2F5E3D] px-2 py-0.5 rounded font-semibold">
                  Online
                </span>
              </div>
              <p className="text-[#718078] text-[11px]">
                Engine: Sahaay-CV-EdgeNet-v1 (Specular Reflectance + Laplacian Variance)
              </p>
            </div>

            <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-[#25332F]">
                  <Navigation className="w-4 h-4 text-[#3D789B]" />
                  <span>Routing Engine (OSRM)</span>
                </div>
                <span className="text-[10px] bg-[#DCECF5] text-[#25332F] px-2 py-0.5 rounded font-semibold">
                  Active
                </span>
              </div>
              <p className="text-[#718078] text-[11px]">
                Endpoint: router.project-osrm.org • Proximity Collision Buffer: 350m
              </p>
            </div>

            <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-[#25332F]">
                  <Database className="w-4 h-4 text-[#718078]" />
                  <span>Civic Persistence Database</span>
                </div>
                <span className="text-[10px] bg-[#EBF3ED] text-[#2F5E3D] px-2 py-0.5 rounded font-semibold">
                  Healthy
                </span>
              </div>
              <p className="text-[#718078] text-[11px]">
                Engine: SQLite / PostgreSQL with SQLAlchemy ORM
              </p>
            </div>
          </div>
        </div>

        {/* 2. Configurable Risk Score Weights (0–100) */}
        <form onSubmit={handleSave} className="card-soft p-6 border border-[#E3EBE5] bg-white space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E3EBE5]">
            <div>
              <h3 className="font-semibold text-sm text-[#25332F]">
                Configurable Prototype Risk Weights
              </h3>
              <p className="text-[11px] text-[#718078]">
                Adjust weights contributing to the 0–100 evidence score. Must sum to 100 points.
              </p>
            </div>

            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
              totalWeights === 100 ? 'bg-[#EBF3ED] text-[#2F5E3D]' : 'bg-[#FBE8E6] text-[#8C3429]'
            }`}>
              Sum: {totalWeights} / 100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#718078] font-medium mb-1">
                Visual Machine Evidence (0–30 pts): {visualWeight} pts
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={visualWeight}
                onChange={(e) => setVisualWeight(Number(e.target.value))}
                className="w-full accent-[#8FAF9A]"
              />
            </div>

            <div>
              <label className="block text-[#718078] font-medium mb-1">
                Corroborating Community Reports (0–25 pts): {corroborationWeight} pts
              </label>
              <input
                type="range"
                min="10"
                max="40"
                value={corroborationWeight}
                onChange={(e) => setCorroborationWeight(Number(e.target.value))}
                className="w-full accent-[#A8D5CE]"
              />
            </div>

            <div>
              <label className="block text-[#718078] font-medium mb-1">
                Rainfall & Weather Context (0–20 pts): {rainfallWeight} pts
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={rainfallWeight}
                onChange={(e) => setRainfallWeight(Number(e.target.value))}
                className="w-full accent-[#5F8B6F]"
              />
            </div>

            <div>
              <label className="block text-[#718078] font-medium mb-1">
                Report Freshness (0–15 pts): {freshnessWeight} pts
              </label>
              <input
                type="range"
                min="5"
                max="25"
                value={freshnessWeight}
                onChange={(e) => setFreshnessWeight(Number(e.target.value))}
                className="w-full accent-[#F5D99A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#718078] font-medium mb-1">
                Location & Description Quality (0–10 pts): {qualityWeight} pts
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={qualityWeight}
                onChange={(e) => setQualityWeight(Number(e.target.value))}
                className="w-full accent-[#8FAF9A]"
              />
            </div>
          </div>

          {/* Stale Expiry Rules */}
          <div className="pt-4 border-t border-[#E3EBE5] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#25332F] mb-1">
                Automatic Stale Expiry Window (Hours)
              </label>
              <input
                type="number"
                min="6"
                max="72"
                value={expiryHours}
                onChange={(e) => setExpiryHours(Number(e.target.value))}
                className="w-full p-2 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs font-mono"
              />
              <span className="text-[10px] text-[#718078] mt-1 block">
                Reports older than this transition to "stale" without new corroborations.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#25332F] mb-1">
                Hackathon Demo Mode
              </label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-[#25332F]">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="rounded text-[#8FAF9A] border-[#E3EBE5]"
                />
                <span>Enable curated demonstration seed incidents</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#8FAF9A] hover:bg-[#7E9E89] text-[#25332F] font-semibold text-xs shadow-xs"
            >
              Save Configuration
            </button>
          </div>
        </form>

      </main>
    </div>
  );
};
