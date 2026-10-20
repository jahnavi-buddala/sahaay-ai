import React from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E2DFD2] mt-16 text-[#586B6B] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2F4F4F] flex items-center justify-center text-white shadow-xs">
                <ShieldAlert className="w-4 h-4 text-[#87CEEB]" />
              </div>
              <span className="font-bold text-base text-[#2F4F4F]">Sahaay AI</span>
            </div>
            <p className="text-xs leading-relaxed text-[#586B6B]">
              Open civic road hazard intelligence, flood reporting and explainable risk indicators for Indian cities.
            </p>
            <p className="text-[11px] text-[#778899]">
              Tagline: <span className="text-[#2F4F4F] font-bold">Predict • Prevent • Protect</span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-[#2F4F4F] uppercase tracking-wider text-[11px] mb-3">Navigation</h5>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-[#2F4F4F] transition-colors">🏠 Home Landing</Link></li>
              <li><Link to="/map" className="hover:text-[#2F4F4F] transition-colors">🗺️ Live Hazard Map</Link></li>
              <li><Link to="/incidents" className="hover:text-[#2F4F4F] transition-colors">⚠️ Incident Catalog</Link></li>
              <li><Link to="/report" className="hover:text-[#2F4F4F] transition-colors">📸 Submit a Hazard</Link></li>
              <li><Link to="/about" className="hover:text-[#2F4F4F] transition-colors">ℹ️ About the Project</Link></li>
            </ul>
          </div>

          {/* Open Civic Data Sources */}
          <div>
            <h5 className="font-bold text-[#2F4F4F] uppercase tracking-wider text-[11px] mb-3">Data & AI Sources</h5>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <span>🌧️ Weather: Open-Meteo API</span>
                <ExternalLink className="w-3 h-3 text-[#778899]" />
              </li>
              <li className="flex items-center gap-1.5">
                <span>🗺️ Cartography: OpenStreetMap</span>
                <ExternalLink className="w-3 h-3 text-[#778899]" />
              </li>
              <li className="flex items-center gap-1.5">
                <span>🧭 Routing: OSRM Engine</span>
                <ExternalLink className="w-3 h-3 text-[#778899]" />
              </li>
              <li><span>🤖 Vision: Sahaay-CV-EdgeNet-v1</span></li>
            </ul>
          </div>

          {/* Safety Disclaimer */}
          <div>
            <h5 className="font-bold text-[#2F4F4F] uppercase tracking-wider text-[11px] mb-3">Safety Disclaimer</h5>
            <div className="p-3.5 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2] text-[11px] leading-relaxed text-[#586B6B]">
              ⚠️ Reports are community observations and AI approximations. Road conditions change rapidly during heavy monsoon showers. Always verify with official civic authorities and avoid submerged underpasses.
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#E2DFD2] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} Sahaay AI. Built for civic safety and commuter resilience.
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Notice</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Disaster Helpline</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
