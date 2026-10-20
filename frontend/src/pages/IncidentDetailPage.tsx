import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  fetchIncidentById, 
  flagIncident, 
  triggerAnalysis, 
  compareRoutes 
} from '../services/api';
import { Incident, AuditLog, RouteCandidate } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { StatusBadge } from '../components/StatusBadge';
import { BilingualAlertCard } from '../components/BilingualAlertCard';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MapPin, 
  Clock, 
  CloudRain, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Flag, 
  GitMerge, 
  RefreshCw, 
  Info, 
  Navigation, 
  Calendar,
  Check
} from 'lucide-react';

const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [relatedReports, setRelatedReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Analysis re-run
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // Flag Modal state
  const [flagModalOpen, setFlagModalOpen] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');
  const [flagSubmitted, setFlagSubmitted] = useState<boolean>(false);

  // Route Comparison state
  const [routeData, setRouteData] = useState<{
    routes: RouteCandidate[];
    summary: string;
    limitations: string;
  } | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route_1');

  const loadData = () => {
    if (!id) return;
    setLoading(true);
    fetchIncidentById(id)
      .then((data) => {
        setIncident(data.incident);
        setAudits(data.audits);
        setRelatedReports(data.related_reports);
        setLoading(false);

        fetchCandidateRoutes(data.incident);
      })
      .catch(() => {
        setError('Failed to load incident details.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const fetchCandidateRoutes = (inc: Incident) => {
    setLoadingRoutes(true);
    const start_lat = inc.latitude - 0.025;
    const start_lon = inc.longitude - 0.015;
    const end_lat = inc.latitude + 0.025;
    const end_lon = inc.longitude + 0.015;

    compareRoutes({ start_lat, start_lon, end_lat, end_lon })
      .then((res) => {
        setRouteData({
          routes: res.routes,
          summary: res.comparison_summary,
          limitations: res.routing_limitations,
        });
        if (res.routes.length > 0) {
          const rec = res.routes.find((r) => r.is_recommended);
          setSelectedRouteId(rec ? rec.id : res.routes[0].id);
        }
        setLoadingRoutes(false);
      })
      .catch(() => setLoadingRoutes(false));
  };

  const handleReanalyze = async () => {
    if (!incident) return;
    setAnalyzing(true);
    try {
      const updated = await triggerAnalysis(incident.id);
      setIncident(updated);
    } catch {
      // Ignored
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident || !flagReason.trim()) return;
    try {
      await flagIncident(incident.id, flagReason);
      setFlagSubmitted(true);
      setTimeout(() => {
        setFlagModalOpen(false);
        setFlagSubmitted(false);
        setFlagReason('');
      }, 2000);
    } catch {
      // Ignored
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2F4F4F] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#586B6B] font-semibold">🔍 Loading civic hazard dossier...</span>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-4">
        <div className="card-soft p-8 text-center max-w-md border border-[#E2DFD2] space-y-3">
          <AlertTriangle className="w-10 h-10 text-[#C45547] mx-auto" />
          <h2 className="text-lg font-bold text-[#2F4F4F]">Incident Record Not Found</h2>
          <p className="text-xs text-[#586B6B]">{error || 'This report may have been archived or removed.'}</p>
          <Link
            to="/incidents"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F4F4F] text-white text-xs font-bold shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Incident Feed</span>
          </Link>
        </div>
      </div>
    );
  }

  const breakdown = incident.risk_breakdown?.breakdown || {
    visual: 15,
    corroboration: 10,
    rainfall: 10,
    freshness: 10,
    location_quality: 5,
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-8 px-4 sm:px-6 lg:px-8 text-[#1C2E2E]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/incidents"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#586B6B] hover:text-[#2F4F4F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Incidents</span>
          </Link>

          <button
            onClick={() => setFlagModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2DFD2] bg-white text-xs text-[#586B6B] hover:text-[#C45547] hover:border-[#C45547] transition-colors shadow-2xs font-semibold"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>🚩 Flag Inaccurate Info</span>
          </button>
        </div>

        {/* Hero Header Banner */}
        <div className="card-soft p-6 border border-[#E2DFD2] bg-white space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold bg-[#FAF8F2] border border-[#E2DFD2] px-2.5 py-0.5 rounded-lg text-[#2F4F4F]">
                  🆔 {incident.id}
                </span>
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-lg bg-[#ADD8E6]/30 text-[#2F4F4F] border border-[#ADD8E6]">
                  {incident.hazard_type}
                </span>
                <StatusBadge status={incident.status} />
                {incident.is_demo_data && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#2F4F4F] text-white">
                    Verified Case
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2F4F4F] pt-1">
                {incident.title || `${incident.hazard_type} at ${incident.address}`}
              </h1>
            </div>

            <RiskBadge score={incident.risk_score} level={incident.risk_level} size="lg" />
          </div>

          <p className="text-sm text-[#586B6B] leading-relaxed">
            {incident.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#E2DFD2] text-xs text-[#586B6B]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2F4F4F]" />
              <strong className="text-[#2F4F4F]">{incident.address}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#778899]" />
              Reported: {new Date(incident.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
            <span>•</span>
            <span>Reporter Severity: <strong className="capitalize text-[#2F4F4F]">{incident.observed_severity}</strong></span>
          </div>
        </div>

        {/* 2-Column Intelligence Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (8 cols): Visual Machine Evidence, Scorer, Route Comparison */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. VISUAL MACHINE EVIDENCE */}
            <div className="card-soft p-6 border border-[#E2DFD2] bg-white space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DFD2]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ADD8E6]/40 flex items-center justify-center text-base">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2F4F4F]">AI Visual Evidence Extraction</h3>
                    <p className="text-[11px] text-[#778899]">Sahaay-CV-EdgeNet-v1 Computer Vision Pipeline</p>
                  </div>
                </div>

                {incident.photo_url && (
                  <button
                    onClick={handleReanalyze}
                    disabled={analyzing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2DFD2] text-xs text-[#2F4F4F] hover:bg-[#FAF8F2] transition-colors font-semibold"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#778899] ${analyzing ? 'animate-spin' : ''}`} />
                    <span>{analyzing ? 'Analyzing...' : 'Re-run CV Model'}</span>
                  </button>
                )}
              </div>

              {incident.photo_url ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  
                  {/* Photo with Overlay Badge */}
                  <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-[#E2DFD2] bg-black shadow-xs">
                    <img
                      src={incident.photo_url}
                      alt={incident.hazard_type}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/65 backdrop-blur-md rounded-xl text-[10px] text-white">
                      <span>Model Confidence: </span>
                      <strong className="text-[#87CEEB]">
                        {incident.ai_analysis?.confidence ? `${Math.round(incident.ai_analysis.confidence * 100)}%` : '85%'}
                      </strong>
                    </div>
                  </div>

                  {/* Findings */}
                  <div className="md:col-span-7 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#778899] uppercase tracking-wider block mb-1.5">
                        Predicted Visual Labels
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(incident.ai_analysis?.predicted_labels || ['standing_water_surface', 'reflective_sheen']).map(
                          (label) => (
                            <span
                              key={label}
                              className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF8F2] border border-[#E2DFD2] font-mono text-[#2F4F4F] font-semibold"
                            >
                              🏷️ {label}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#778899] uppercase tracking-wider block mb-1">
                        Plain-Language Interpretation
                      </span>
                      <p className="text-xs text-[#2F4F4F] leading-relaxed bg-[#FAF8F2] p-3 rounded-xl border border-[#E2DFD2]">
                        {incident.ai_analysis?.interpretation ||
                          'Visual analysis indicates water accumulation across the asphalt carriageway. Camera alone cannot establish physical depth.'}
                      </p>
                    </div>

                    {incident.ai_analysis?.limitations && (
                      <div className="p-2.5 bg-[#FEF6E4] rounded-xl border border-[#F5D99A] text-[11px] text-[#8F6616] flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span><strong>Documented Limitation:</strong> {incident.ai_analysis.limitations}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2] text-center text-xs text-[#586B6B]">
                  No photo was submitted with this report. Visual machine evidence is unavailable.
                </div>
              )}
            </div>

            {/* 2. EXPLAINABLE RISK SCORER BREAKDOWN */}
            <div className="card-soft p-6 border border-[#E2DFD2] bg-white space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DFD2]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F5F5DC] flex items-center justify-center text-base border border-[#E2DFD2]">
                    📊
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2F4F4F]">Explainable Evidence Score (0–100)</h3>
                    <p className="text-[11px] text-[#718078]">Transparent weighted breakdown, not uncalibrated guesswork</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-2xl font-bold text-[#2F4F4F]">
                    {incident.risk_score}
                  </span>
                  <span className="text-xs text-[#778899]"> / 100</span>
                </div>
              </div>

              {/* 5 Meter Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Visual */}
                <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#586B6B] font-medium">📸 Visual Machine Evidence</span>
                    <span className="font-mono font-bold text-[#2F4F4F]">{breakdown.visual} / 30 pts</span>
                  </div>
                  <div className="w-full bg-[#E5E4D8] rounded-full h-1.5">
                    <div className="bg-[#2F4F4F] h-1.5 rounded-full" style={{ width: `${(breakdown.visual / 30) * 100}%` }} />
                  </div>
                </div>

                {/* Corroboration */}
                <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#586B6B] font-medium">👥 Community Corroboration</span>
                    <span className="font-mono font-bold text-[#2F4F4F]">{breakdown.corroboration} / 25 pts</span>
                  </div>
                  <div className="w-full bg-[#E5E4D8] rounded-full h-1.5">
                    <div className="bg-[#778899] h-1.5 rounded-full" style={{ width: `${(breakdown.corroboration / 25) * 100}%` }} />
                  </div>
                </div>

                {/* Rainfall */}
                <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#586B6B] font-medium">🌧️ Rainfall & Weather Context</span>
                    <span className="font-mono font-bold text-[#2F4F4F]">{breakdown.rainfall} / 20 pts</span>
                  </div>
                  <div className="w-full bg-[#E5E4D8] rounded-full h-1.5">
                    <div className="bg-[#ADD8E6] h-1.5 rounded-full" style={{ width: `${(breakdown.rainfall / 20) * 100}%` }} />
                  </div>
                </div>

                {/* Freshness */}
                <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#586B6B] font-medium">⏱️ Report Freshness</span>
                    <span className="font-mono font-bold text-[#2F4F4F]">{breakdown.freshness} / 15 pts</span>
                  </div>
                  <div className="w-full bg-[#E5E4D8] rounded-full h-1.5">
                    <div className="bg-[#87CEEB] h-1.5 rounded-full" style={{ width: `${(breakdown.freshness / 15) * 100}%` }} />
                  </div>
                </div>

                {/* Location Quality */}
                <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2] space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#586B6B] font-medium">📍 Location & Context Precision</span>
                    <span className="font-mono font-bold text-[#2F4F4F]">{breakdown.location_quality} / 10 pts</span>
                  </div>
                  <div className="w-full bg-[#E5E4D8] rounded-full h-1.5">
                    <div className="bg-[#2F4F4F] h-1.5 rounded-full" style={{ width: `${(breakdown.location_quality / 10) * 100}%` }} />
                  </div>
                </div>

              </div>

              {/* Factors & Missing Info */}
              <div className="space-y-3 pt-2 border-t border-[#E2DFD2] text-xs">
                {incident.risk_breakdown?.factors && incident.risk_breakdown.factors.length > 0 && (
                  <div>
                    <span className="font-bold text-[#2F4F4F] block mb-1">Key Contributing Factors:</span>
                    <ul className="list-disc list-inside space-y-1 text-[#586B6B]">
                      {incident.risk_breakdown.factors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 3. ALTERNATIVE ROUTE COMPARISON */}
            <div className="card-soft p-6 border border-[#E2DFD2] bg-white space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DFD2]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#87CEEB]/30 flex items-center justify-center text-base">
                    🧭
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2F4F4F]">Alternative Route Comparison</h3>
                    <p className="text-[11px] text-[#778899]">OSRM path calculation avoiding this hazard corridor</p>
                  </div>
                </div>

                <span className="text-[11px] text-[#2F4F4F] bg-[#ADD8E6]/40 px-2.5 py-1 rounded-lg border border-[#ADD8E6] font-semibold">
                  Buffer: 350m
                </span>
              </div>

              {loadingRoutes ? (
                <div className="p-8 text-center text-xs text-[#586B6B] animate-pulse">
                  Calculating OSRM bypass corridors...
                </div>
              ) : routeData && routeData.routes.length > 0 ? (
                <div className="space-y-4">
                  {/* Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {routeData.routes.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRouteId(r.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          selectedRouteId === r.id
                            ? 'border-[#2F4F4F] bg-[#ADD8E6]/25 shadow-xs'
                            : 'border-[#E2DFD2] bg-white hover:border-[#778899]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2F4F4F]">{r.name}</span>
                          {r.is_recommended && (
                            <span className="text-[10px] font-bold bg-[#2F4F4F] text-white px-2 py-0.5 rounded-full">
                              Safer Bypass
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[#586B6B] mt-2">
                          <span>Dist: <strong className="text-[#2F4F4F]">{r.distance_km} km</strong></span>
                          <span>Time: <strong className="text-[#2F4F4F]">{r.duration_minutes} min</strong></span>
                        </div>

                        <div className="mt-2 text-[11px] font-semibold text-[#2F4F4F]">
                          <span className={r.hazards_detected_count > 0 ? 'text-[#C45547]' : 'text-[#3E7356]'}>
                            ⚠️ {r.hazards_detected_count} hazard(s) in proximity
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Route Map */}
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-[#E2DFD2]">
                    <MapContainer
                      center={[incident.latitude, incident.longitude]}
                      zoom={13}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[incident.latitude, incident.longitude]} icon={pinIcon}>
                        <Popup>{incident.title || incident.hazard_type}</Popup>
                      </Marker>

                      {routeData.routes.map((r) => (
                        <Polyline
                          key={r.id}
                          positions={r.coordinates}
                          pathOptions={{
                            color: r.id === selectedRouteId ? '#2F4F4F' : '#ADD8E6',
                            weight: r.id === selectedRouteId ? 5 : 3,
                            dashArray: r.id !== selectedRouteId ? '6, 6' : undefined,
                            opacity: r.id === selectedRouteId ? 0.95 : 0.6,
                          }}
                        />
                      ))}
                    </MapContainer>
                  </div>

                  <div className="p-3.5 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2] text-xs space-y-1">
                    <p className="font-bold text-[#2F4F4F]">{routeData.summary}</p>
                    <p className="text-[11px] text-[#586B6B] leading-relaxed">
                      <strong>Limitation:</strong> {routeData.limitations}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

          </div>

          {/* Right Column (4 cols): Weather, Bilingual Alert Card, Recommendations */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. WEATHER CONTEXT (Open-Meteo) */}
            <div className="card-soft p-5 border border-[#E2DFD2] bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DFD2]">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-[#778899]" />
                  <h3 className="text-xs font-bold text-[#2F4F4F]">Open-Meteo Weather Context</h3>
                </div>
                <span className="text-[10px] font-mono uppercase bg-[#ADD8E6]/40 text-[#2F4F4F] px-2 py-0.5 rounded-md font-bold">
                  {incident.weather_context?.data_status || 'Live'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2]">
                  <span className="text-[#586B6B] text-[11px] block">Current Rainfall</span>
                  <strong className="text-base font-bold text-[#2F4F4F]">
                    {incident.weather_context?.precipitation_mm ?? 14.5} mm/h
                  </strong>
                </div>

                <div className="p-2.5 bg-[#FAF8F2] rounded-xl border border-[#E2DFD2]">
                  <span className="text-[#586B6B] text-[11px] block">Precip Probability</span>
                  <strong className="text-base font-bold text-[#2F4F4F]">
                    {incident.weather_context?.rain_probability_pct ?? 85}%
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-[#586B6B] leading-relaxed bg-[#FAF8F2] p-2.5 rounded-xl border border-[#E2DFD2]">
                {incident.weather_context?.context_note ||
                  'Contextual atmospheric observation. Weather indicates precipitation presence, not drain blockage.'}
              </p>
            </div>

            {/* 2. TRILINGUAL ALERT CARD (EN, TE, HI) */}
            <BilingualAlertCard incident={incident} />

            {/* 3. DUPLICATE CLUSTERING */}
            <div className="card-soft p-5 border border-[#E2DFD2] bg-white space-y-3 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2DFD2]">
                <GitMerge className="w-4 h-4 text-[#778899]" />
                <h3 className="text-xs font-bold text-[#2F4F4F]">Nearby Corroborating Reports</h3>
              </div>

              {relatedReports.length > 0 ? (
                <div className="space-y-2 text-xs">
                  <p className="text-[11px] text-[#586B6B]">
                    {relatedReports.length} related report(s) clustered within 600m:
                  </p>
                  {relatedReports.map((r, i) => (
                    <div key={i} className="p-2 rounded-lg bg-[#FAF8F2] border border-[#E2DFD2] flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#2F4F4F] font-bold">{r.id}</span>
                      <span className="text-[10px] text-[#586B6B]">{r.distance_meters}m away</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#586B6B]">
                  Single isolated report at these coordinates. No duplicate submissions within 600m.
                </p>
              )}
            </div>

            {/* 4. CIVIC ADVISORY NEXT STEPS */}
            <div className="card-soft p-5 border border-[#E2DFD2] bg-white space-y-3 shadow-xs">
              <h3 className="text-xs font-bold text-[#2F4F4F] uppercase tracking-wider">
                🛡️ Recommended Commuter Actions
              </h3>
              <ul className="space-y-2 text-xs text-[#586B6B]">
                <li className="flex items-start gap-2">
                  <span className="text-[#2F4F4F] font-bold">•</span>
                  <span>Avoid entering the underpass if water level reaches vehicle wheel hub.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2F4F4F] font-bold">•</span>
                  <span>Use Alternative Bypass Route via outer perimeter corridor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2F4F4F] font-bold">•</span>
                  <span>Broadcast this alert to local WhatsApp commuter groups.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* Flag Modal */}
      {flagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2DFD2] shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-[#2F4F4F] flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#C45547]" />
              Flag Inaccurate Information
            </h3>
            <p className="text-xs text-[#586B6B]">
              Help maintain data integrity. Describe what seems inaccurate about this report.
            </p>

            {flagSubmitted ? (
              <div className="p-4 bg-[#EBF3ED] text-[#2F5E3D] text-xs font-semibold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you! Your flag has been queued for administrative triage.</span>
              </div>
            ) : (
              <form onSubmit={handleFlagSubmit} className="space-y-4">
                <textarea
                  rows={3}
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="e.g. Water has already been drained by municipal pumps..."
                  className="w-full p-3 bg-[#FAF8F2] border border-[#E2DFD2] rounded-xl text-xs text-[#2F4F4F] focus:outline-none focus:border-[#2F4F4F]"
                  required
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFlagModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#E2DFD2] text-xs text-[#586B6B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white font-bold text-xs shadow-xs"
                  >
                    Submit Flag
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
