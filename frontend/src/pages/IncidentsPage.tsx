import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchIncidents } from '../services/api';
import { Incident } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Search, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  PlusCircle,
  Map as MapIcon
} from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const { t } = useLanguage();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState<string>('');
  const [selectedHazard, setSelectedHazard] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'risk'>('newest');

  const loadIncidents = () => {
    setLoading(true);
    fetchIncidents({
      hazard_type: selectedHazard !== 'All' ? selectedHazard : undefined,
      status: selectedStatus !== 'All' ? selectedStatus : undefined,
      search: search.trim() || undefined,
    })
      .then((res) => {
        let items = res.items;
        if (sortBy === 'risk') {
          items.sort((a, b) => b.risk_score - a.risk_score);
        }
        setIncidents(items);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadIncidents();
  }, [selectedHazard, selectedStatus, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadIncidents();
  };

  const getHazardEmoji = (type: string) => {
    switch (type) {
      case 'Waterlogging': return '🌊';
      case 'Flooded Road': return '🚣';
      case 'Road Obstruction': return '🚧';
      case 'Damaged Road': return '🕳️';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-8 px-4 sm:px-6 lg:px-8 text-[#1C2E2E]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ADD8E6]/30 border border-[#ADD8E6] text-xs font-bold text-[#2F4F4F] mb-1.5">
              <span>⚠️ Live Civic Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2F4F4F]">
              Reported Road Hazards
            </h1>
            <p className="text-xs text-[#586B6B] mt-0.5">
              Browse community observations, computer vision evidence, and civic verification statuses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E2DFD2] bg-white text-xs font-bold text-[#2F4F4F] hover:bg-[#FAF8F2] shadow-2xs"
            >
              <MapIcon className="w-3.5 h-3.5 text-[#778899]" />
              <span>🗺️ Open Map</span>
            </Link>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white text-xs font-bold shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#87CEEB]" />
              <span>📸 Report Hazard</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="card-soft p-4 border border-[#E2DFD2] bg-white flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-[#778899] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by area, landmark or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F2] border border-[#E2DFD2] rounded-xl text-xs text-[#2F4F4F] focus:outline-none focus:border-[#2F4F4F]"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            <select
              value={selectedHazard}
              onChange={(e) => setSelectedHazard(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF8F2] border border-[#E2DFD2] rounded-xl text-xs font-medium text-[#2F4F4F] focus:outline-none focus:border-[#2F4F4F]"
            >
              <option value="All">All Hazard Types</option>
              <option value="Waterlogging">🌊 Waterlogging</option>
              <option value="Flooded Road">🚣 Flooded Road</option>
              <option value="Road Obstruction">🚧 Road Obstruction</option>
              <option value="Damaged Road">🕳️ Damaged Road</option>
              <option value="Other">⚠️ Other</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF8F2] border border-[#E2DFD2] rounded-xl text-xs font-medium text-[#2F4F4F] focus:outline-none focus:border-[#2F4F4F]"
            >
              <option value="All">All Statuses</option>
              <option value="verified">🛡️ Verified</option>
              <option value="corroborated">👥 Corroborated</option>
              <option value="unverified">⏳ Unverified</option>
              <option value="resolved">✅ Resolved</option>
              <option value="stale">📁 Stale</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-[#FAF8F2] border border-[#E2DFD2] rounded-xl text-xs font-medium text-[#2F4F4F] focus:outline-none focus:border-[#2F4F4F]"
            >
              <option value="newest">⏱️ Sort: Newest First</option>
              <option value="risk">📊 Sort: Highest Risk Score</option>
            </select>

          </div>
        </div>

        {/* Incidents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="card-soft p-5 border border-[#E2DFD2] animate-pulse space-y-4">
                <div className="h-44 bg-[#E2DFD2] rounded-xl" />
                <div className="h-4 bg-[#E2DFD2] rounded-md w-3/4" />
                <div className="h-3 bg-[#E2DFD2] rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <div className="card-soft p-12 text-center border border-[#E2DFD2] bg-white space-y-2">
            <AlertCircle className="w-8 h-8 text-[#778899] mx-auto" />
            <h3 className="font-bold text-sm text-[#2F4F4F]">No incidents found</h3>
            <p className="text-xs text-[#586B6B]">
              Try adjusting your search criteria or clear status filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="card-soft card-soft-hover border border-[#E2DFD2] bg-white flex flex-col justify-between overflow-hidden shadow-2xs"
              >
                <div>
                  {/* Photo Banner with Real Photography */}
                  <div className="h-44 bg-[#2F4F4F] relative overflow-hidden">
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
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-white/95 text-[#2F4F4F] backdrop-blur-md border border-[#E2DFD2] shadow-xs">
                        {getHazardEmoji(incident.hazard_type)} {incident.hazard_type}
                      </span>
                    </div>

                    {incident.is_demo_data && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#2F4F4F]/85 text-white backdrop-blur-md">
                          Verified Case
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={incident.status} size="sm" />
                      <span className="text-[11px] text-[#586B6B] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[#778899]" />
                        {new Date(incident.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                        {new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-[#2F4F4F] line-clamp-1">
                        {incident.title || incident.address}
                      </h3>
                      <p className="text-xs text-[#586B6B] line-clamp-2 mt-1 leading-relaxed">
                        {incident.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E2DFD2]">
                      <RiskBadge score={incident.risk_score} level={incident.risk_level} size="sm" showBar={true} />
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/incidents/${incident.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FAF8F2] hover:bg-[#ADD8E6]/40 text-[#2F4F4F] text-xs font-bold transition-colors border border-[#E2DFD2]"
                  >
                    <span>🔍 Inspect Evidence & Bypass Routes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
