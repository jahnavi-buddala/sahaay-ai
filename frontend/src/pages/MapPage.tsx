import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { fetchIncidents, compareRoutes } from '../services/api';
import { Incident, IncidentStatus, RouteCandidate } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MapPin, 
  Search, 
  Layers, 
  Clock, 
  AlertCircle, 
  Navigation, 
  Compass, 
  X, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';

// Custom SVG-based Leaflet markers for clean design system
const createCustomIcon = (status: IncidentStatus, riskScore: number) => {
  let color = '#8FAF9A'; // Sage default
  if (riskScore >= 60) color = '#E9A49A'; // Elevated coral
  else if (riskScore >= 30) color = '#F5D99A'; // Caution amber
  else if (status === 'resolved') color = '#A8D5CE'; // Soft teal

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#25332F" stroke-width="1.5" />
      <circle cx="12" cy="11" r="4.5" fill="#FFFFFF" />
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
};

const routeWaypointIcon = (label: string, color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; color: #25332F; font-weight: bold; font-size: 11px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${label}</div>`,
    className: 'waypoint-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);
  return null;
}

export const MapPage: React.FC = () => {
  const { t } = useLanguage();

  // Mode: "hazards" or "routing"
  const [activeTab, setActiveTab] = useState<'hazards' | 'routing'>('hazards');

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHazard, setSelectedHazard] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showDemoOnly, setShowDemoOnly] = useState<boolean>(false);

  // Map viewport & selection
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([17.43, 78.44]);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Route Planning State
  const routePresets = [
    {
      name: 'Begumpet to Hitec City (Cyber Towers)',
      start: { name: 'Begumpet', lat: 17.4448, lon: 78.4682 },
      end: { name: 'Hitec City', lat: 17.4504, lon: 78.3808 }
    },
    {
      name: 'Tolichowki to Somajiguda Circle',
      start: { name: 'Tolichowki', lat: 17.4011, lon: 78.4116 },
      end: { name: 'Somajiguda', lat: 17.4262, lon: 78.4578 }
    },
    {
      name: 'Dadar to Bandra (Mumbai Corridor)',
      start: { name: 'Dadar', lat: 19.0178, lon: 72.8478 },
      end: { name: 'Bandra', lat: 19.0596, lon: 72.8295 }
    },
    {
      name: 'Silk Board to Koramangala (Bengaluru)',
      start: { name: 'Silk Board', lat: 12.9172, lon: 77.6228 },
      end: { name: 'Koramangala', lat: 12.9352, lon: 77.6245 }
    }
  ];

  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [candidateRoutes, setCandidateRoutes] = useState<RouteCandidate[]>([]);
  const [routeSummary, setRouteSummary] = useState<string>('');
  const [routingLimitations, setRoutingLimitations] = useState<string>('');
  const [isRoutingLoading, setIsRoutingLoading] = useState<boolean>(false);
  const [activeRouteId, setActiveRouteId] = useState<string>('route_1');

  const loadData = () => {
    setLoading(true);
    fetchIncidents({
      hazard_type: selectedHazard !== 'All' ? selectedHazard : undefined,
      status: selectedStatus !== 'All' ? selectedStatus : undefined,
      search: searchQuery.trim() || undefined,
      demo_only: showDemoOnly || undefined,
    })
      .then((res: { total: number; items: Incident[] }) => {
        setIncidents(res.items);
        setLoading(false);
        if (res.items.length > 0 && !selectedIncident) {
          setMapCenter([res.items[0].latitude, res.items[0].longitude]);
        }
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedHazard, selectedStatus, showDemoOnly]);

  // Execute Route Planning
  const runRoutePlanning = (index: number) => {
    const preset = routePresets[index];
    setSelectedPresetIndex(index);
    setIsRoutingLoading(true);

    compareRoutes({
      start_lat: preset.start.lat,
      start_lon: preset.start.lon,
      end_lat: preset.end.lat,
      end_lon: preset.end.lon
    })
      .then((res: any) => {
        setCandidateRoutes(res.routes || []);
        setRouteSummary(res.comparison_summary || '');
        setRoutingLimitations(res.routing_limitations || '');
        if (res.routes && res.routes.length > 0) {
          const rec = res.routes.find((r: RouteCandidate) => r.is_recommended);
          setActiveRouteId(rec ? rec.id : res.routes[0].id);
        }
        // Center map between start and end
        setMapCenter([(preset.start.lat + preset.end.lat) / 2, (preset.start.lon + preset.end.lon) / 2]);
        setMapZoom(12);
        setIsRoutingLoading(false);
      })
      .catch(() => setIsRoutingLoading(false));
  };

  useEffect(() => {
    if (activeTab === 'routing' && candidateRoutes.length === 0) {
      runRoutePlanning(0);
    }
  }, [activeTab]);

  const selectIncident = (inc: Incident) => {
    setSelectedIncident(inc);
    setMapCenter([inc.latitude, inc.longitude]);
    setMapZoom(15);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#F8FAF8]">
      
      {/* Top Controls & Mode Switcher Bar */}
      <div className="bg-white border-b border-[#E3EBE5] px-4 py-3 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* View Mode Toggle */}
          <div className="inline-flex items-center bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setActiveTab('hazards')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'hazards'
                  ? 'bg-[#8FAF9A] text-[#25332F] shadow-2xs'
                  : 'text-[#718078] hover:text-[#25332F]'
              }`}
            >
              🗺️ Live Hazard Map
            </button>
            <button
              onClick={() => setActiveTab('routing')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'routing'
                  ? 'bg-[#8FAF9A] text-[#25332F] shadow-2xs'
                  : 'text-[#718078] hover:text-[#25332F]'
              }`}
            >
              🧭 Route Bypass Planner
            </button>
          </div>

          {activeTab === 'hazards' ? (
            /* Hazard Filtering Controls */
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <form onSubmit={(e) => { e.preventDefault(); loadData(); }} className="relative min-w-[180px] max-w-xs">
                <Search className="w-3.5 h-3.5 text-[#718078] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter landmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F] focus:outline-none focus:border-[#8FAF9A]"
                />
              </form>

              <select
                value={selectedHazard}
                onChange={(e) => setSelectedHazard(e.target.value)}
                className="px-2.5 py-1.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F]"
              >
                <option value="All">All Hazards</option>
                <option value="Waterlogging">Waterlogging</option>
                <option value="Flooded Road">Flooded Road</option>
                <option value="Road Obstruction">Road Obstruction</option>
                <option value="Damaged Road">Damaged Road</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F]"
              >
                <option value="All">All Statuses</option>
                <option value="verified">Verified</option>
                <option value="corroborated">Corroborated</option>
                <option value="unverified">Unverified</option>
                <option value="resolved">Resolved</option>
              </select>

              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="md:hidden px-3 py-1.5 rounded-xl border border-[#E3EBE5] text-xs font-medium text-[#25332F] bg-white"
              >
                List ({incidents.length})
              </button>
            </div>
          ) : (
            /* Route Planning Preset Selector */
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[#718078] font-semibold text-[11px] shrink-0">Preset Corridor:</span>
              <select
                value={selectedPresetIndex}
                onChange={(e) => runRoutePlanning(Number(e.target.value))}
                className="px-3 py-1.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs font-medium text-[#25332F] focus:outline-none focus:border-[#8FAF9A]"
              >
                {routePresets.map((p, idx) => (
                  <option key={p.name} value={idx}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Desktop Sidebar: Hazards List OR Route Intelligence */}
        <div className="hidden md:flex flex-col w-96 border-r border-[#E3EBE5] bg-white z-10 overflow-hidden">
          {activeTab === 'hazards' ? (
            <>
              <div className="p-3 border-b border-[#E3EBE5] bg-[#F8FAF8] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#25332F]">
                  Active Incidents ({incidents.length})
                </span>
                <span className="text-[11px] text-[#718078]">Click to center pin</span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {loading ? (
                  <div className="space-y-3 p-2">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E3EBE5] animate-pulse h-24" />
                    ))}
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#718078]">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-[#718078]" />
                    No hazards match current filters.
                  </div>
                ) : (
                  incidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => selectIncident(inc)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedIncident?.id === inc.id
                          ? 'border-[#8FAF9A] bg-[#EBF3ED]/40 shadow-xs'
                          : 'border-[#E3EBE5] hover:border-[#A8D5CE] bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-[#25332F] line-clamp-1">
                          {inc.title || inc.hazard_type}
                        </span>
                        <StatusBadge status={inc.status} size="sm" />
                      </div>

                      <p className="text-[11px] text-[#718078] line-clamp-1 mt-1">
                        {inc.address}
                      </p>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#E3EBE5]/60 text-[11px]">
                        <RiskBadge score={inc.risk_score} level={inc.risk_level} size="sm" />
                        <span className="text-[#718078] flex items-center gap-1 text-[10px]">
                          <Clock className="w-3 h-3" />
                          {new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Route Planning Sidebar Details */
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#5F8B6F] tracking-wider block">
                  OSRM Route Evaluation
                </span>
                <h3 className="text-sm font-bold text-[#25332F]">
                  {routePresets[selectedPresetIndex].name}
                </h3>
              </div>

              {isRoutingLoading ? (
                <div className="p-8 text-center text-xs text-[#718078] animate-pulse">
                  Calculating OSRM driving paths and cross-referencing hazard buffers...
                </div>
              ) : (
                <div className="space-y-3">
                  {candidateRoutes.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setActiveRouteId(r.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        activeRouteId === r.id
                          ? 'border-[#8FAF9A] bg-[#EBF3ED]/50 shadow-xs'
                          : 'border-[#E3EBE5] bg-white hover:border-[#A8D5CE]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#25332F]">{r.name}</span>
                        {r.is_recommended && (
                          <span className="text-[10px] font-semibold bg-[#8FAF9A] text-[#25332F] px-2 py-0.5 rounded-full">
                            Safer Bypass
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-[#718078]">
                        <div>Dist: <strong className="text-[#25332F]">{r.distance_km} km</strong></div>
                        <div>Duration: <strong className="text-[#25332F]">{r.duration_minutes} min</strong></div>
                      </div>

                      <div className="mt-2 text-[11px] font-medium flex items-center gap-1">
                        <span className={r.hazards_detected_count > 0 ? 'text-[#E9A49A]' : 'text-[#5F8B6F]'}>
                          ⚠️ {r.hazards_detected_count} hazard(s) in corridor
                        </span>
                      </div>
                    </div>
                  ))}

                  {routeSummary && (
                    <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5] text-xs space-y-1">
                      <span className="font-semibold text-[#25332F] block">Comparison Summary:</span>
                      <p className="text-[#718078] leading-relaxed">{routeSummary}</p>
                    </div>
                  )}

                  {routingLimitations && (
                    <div className="p-3 bg-[#FEF6E4]/40 rounded-xl border border-[#F5D99A] text-[11px] text-[#8F6616] space-y-1">
                      <span className="font-semibold block">Civic Limitations:</span>
                      <p>{routingLimitations}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="flex-1 relative h-full w-full bg-[#E3EBE5]">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeMapView center={mapCenter} zoom={mapZoom} />

            {/* In Routing Mode: Draw Start / End Waypoints & Route Polylines */}
            {activeTab === 'routing' && (
              <>
                {/* Start Marker */}
                <Marker
                  position={[routePresets[selectedPresetIndex].start.lat, routePresets[selectedPresetIndex].start.lon]}
                  icon={routeWaypointIcon('A', '#8FAF9A')}
                >
                  <Popup>Start: {routePresets[selectedPresetIndex].start.name}</Popup>
                </Marker>

                {/* End Marker */}
                <Marker
                  position={[routePresets[selectedPresetIndex].end.lat, routePresets[selectedPresetIndex].end.lon]}
                  icon={routeWaypointIcon('B', '#A8D5CE')}
                >
                  <Popup>Destination: {routePresets[selectedPresetIndex].end.name}</Popup>
                </Marker>

                {/* Polylines */}
                {candidateRoutes.map((r) => (
                  <Polyline
                    key={r.id}
                    positions={r.coordinates}
                    pathOptions={{
                      color: r.id === activeRouteId ? '#5F8B6F' : '#A8D5CE',
                      weight: r.id === activeRouteId ? 5 : 3,
                      dashArray: r.id !== activeRouteId ? '6, 6' : undefined,
                      opacity: r.id === activeRouteId ? 0.9 : 0.6,
                    }}
                  />
                ))}
              </>
            )}

            {/* Incident Markers */}
            {incidents.map((inc) => (
              <Marker
                key={inc.id}
                position={[inc.latitude, inc.longitude]}
                icon={createCustomIcon(inc.status, inc.risk_score)}
                eventHandlers={{
                  click: () => setSelectedIncident(inc),
                }}
              >
                <Popup className="sahaay-leaflet-popup">
                  <div className="w-56 p-1 space-y-2 text-xs">
                    {inc.photo_url && (
                      <img
                        src={inc.photo_url}
                        alt={inc.hazard_type}
                        className="w-full h-24 object-cover rounded-lg border border-[#E3EBE5]"
                      />
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#25332F]">{inc.hazard_type}</span>
                        <StatusBadge status={inc.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-[#718078] line-clamp-2 mt-1">
                        {inc.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E3EBE5] flex items-center justify-between">
                      <RiskBadge score={inc.risk_score} level={inc.risk_level} size="sm" />
                      <Link
                        to={`/incidents/${inc.id}`}
                        className="text-[11px] font-semibold text-[#5F8B6F] hover:underline"
                      >
                        Inspect Details →
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Map Legend */}
          <div className="absolute bottom-6 right-6 z-20 card-soft p-3.5 border border-[#E3EBE5] bg-white/95 text-xs shadow-md max-w-xs space-y-2">
            <span className="font-semibold text-[11px] uppercase tracking-wider text-[#25332F] block">
              Marker Legend
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E9A49A] border border-[#25332F]" />
                <span>Elevated Concern (60+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F5D99A] border border-[#25332F]" />
                <span>Caution (30-59)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8FAF9A] border border-[#25332F]" />
                <span>Standard / Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#A8D5CE] border border-[#25332F]" />
                <span>Resolved / Cleared</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
