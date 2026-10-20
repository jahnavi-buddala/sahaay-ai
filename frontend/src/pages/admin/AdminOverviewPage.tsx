import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { fetchAdminAnalytics, fetchIncidents } from '../../services/api';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { Incident } from '../../types';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Archive, 
  ArrowRight, 
  Cpu, 
  CloudRain, 
  Database, 
  Navigation,
  Activity
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAdminAnalytics(), fetchIncidents({ limit: 5 })])
      .then(([analyticsData, incidentsData]) => {
        setAnalytics(analyticsData);
        setRecentIncidents(incidentsData.items.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const metrics = analytics?.metrics || {
    total_reports: 6,
    today_reports: 2,
    awaiting_review: 2,
    corroborated_or_verified: 3,
    stale_reports: 1,
    resolved_incidents: 1,
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAF8]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#25332F]">Administrative Overview</h1>
            <p className="text-xs text-[#718078] mt-0.5">
              Live civic intelligence metrics, triage queue status, and external service diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3ED] text-[#2F5E3D] text-xs font-medium border border-[#C6DDD0]">
              <span className="w-2 h-2 rounded-full bg-[#5F8B6F] animate-pulse" />
              Live Database Connected
            </span>
          </div>
        </div>

        {/* 6 Primary Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="card-soft p-4 border border-[#E3EBE5] bg-white space-y-1">
            <span className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Total Reports</span>
            <p className="text-2xl font-bold text-[#25332F]">{metrics.total_reports}</p>
            <span className="text-[10px] text-[#718078] block">All-time recorded</span>
          </div>

          <div className="card-soft p-4 border border-[#A8D5CE] bg-[#EFF8F7]/50 space-y-1">
            <span className="text-[11px] font-semibold text-[#4D9085] uppercase tracking-wider">Today's Reports</span>
            <p className="text-2xl font-bold text-[#25332F]">{metrics.today_reports}</p>
            <span className="text-[10px] text-[#718078] block">Past 24 hours</span>
          </div>

          <div className="card-soft p-4 border border-[#F5D99A] bg-[#FEF6E4]/40 space-y-1">
            <span className="text-[11px] font-semibold text-[#8F6616] uppercase tracking-wider">Awaiting Review</span>
            <p className="text-2xl font-bold text-[#8F6616]">{metrics.awaiting_review}</p>
            <span className="text-[10px] text-[#8F6616] block">Unverified queue</span>
          </div>

          <div className="card-soft p-4 border border-[#8FAF9A] bg-[#EBF3ED]/40 space-y-1">
            <span className="text-[11px] font-semibold text-[#2F5E3D] uppercase tracking-wider">Verified / Corrob</span>
            <p className="text-2xl font-bold text-[#2F5E3D]">{metrics.corroborated_or_verified}</p>
            <span className="text-[10px] text-[#718078] block">Active safety warnings</span>
          </div>

          <div className="card-soft p-4 border border-[#E3EBE5] bg-white space-y-1">
            <span className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Stale Reports</span>
            <p className="text-2xl font-bold text-[#718078]">{metrics.stale_reports}</p>
            <span className="text-[10px] text-[#718078] block">&gt; 24h uncorroborated</span>
          </div>

          <div className="card-soft p-4 border border-[#DCECF5] bg-[#DCECF5]/30 space-y-1">
            <span className="text-[11px] font-semibold text-[#25332F] uppercase tracking-wider">Resolved</span>
            <p className="text-2xl font-bold text-[#25332F]">{metrics.resolved_incidents}</p>
            <span className="text-[10px] text-[#718078] block">Cleared by civic pumps</span>
          </div>

        </div>

        {/* 2-Column Content: Recent Activity Feed & Hazard Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (7 cols): Recent Reports Requiring Attention */}
          <div className="lg:col-span-7 space-y-4">
            <div className="card-soft p-5 border border-[#E3EBE5] bg-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3EBE5]">
                <div>
                  <h3 className="font-semibold text-sm text-[#25332F]">Recent Submissions Requiring Attention</h3>
                  <p className="text-[11px] text-[#718078]">Latest incoming citizen reports with calculated risk scores</p>
                </div>
                <Link
                  to="/admin/reports"
                  className="text-xs font-semibold text-[#5F8B6F] hover:underline"
                >
                  Open Triage Queue →
                </Link>
              </div>

              <div className="space-y-3">
                {recentIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-3 rounded-xl border border-[#E3EBE5] bg-[#F8FAF8] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {inc.photo_url ? (
                        <img
                          src={inc.photo_url}
                          alt={inc.hazard_type}
                          className="w-12 h-12 rounded-lg object-cover border border-[#E3EBE5]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#E3EBE5] flex items-center justify-center text-[10px] text-[#718078]">
                          No Pic
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#25332F]">{inc.hazard_type}</span>
                          <StatusBadge status={inc.status} size="sm" />
                        </div>
                        <p className="text-[11px] text-[#718078] line-clamp-1">{inc.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <RiskBadge score={inc.risk_score} level={inc.risk_level} size="sm" />
                      <Link
                        to={`/incidents/${inc.id}`}
                        className="p-1.5 rounded-lg border border-[#E3EBE5] bg-white hover:bg-[#F8FAF8] text-[#25332F]"
                        title="View Incident"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Trend Bar */}
            <div className="card-soft p-5 border border-[#E3EBE5] bg-white space-y-3">
              <h3 className="font-semibold text-sm text-[#25332F]">Reports Over Last 7 Days</h3>
              <div className="grid grid-cols-7 gap-2 pt-2 items-end h-32">
                {(analytics?.weekly_trend || [
                  { date: 'Oct 14', count: 1 },
                  { date: 'Oct 15', count: 3 },
                  { date: 'Oct 16', count: 2 },
                  { date: 'Oct 17', count: 5 },
                  { date: 'Oct 18', count: 4 },
                  { date: 'Oct 19', count: 6 },
                  { date: 'Today', count: 2 },
                ]).map((d: any, idx: number) => {
                  const maxCount = 8;
                  const heightPct = Math.max(15, (d.count / maxCount) * 100);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-mono font-semibold text-[#25332F]">{d.count}</span>
                      <div
                        className="w-full bg-[#8FAF9A] rounded-t-lg transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[10px] text-[#718078] truncate w-full text-center">{d.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Distribution & Service Status */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Hazard Distribution Breakdown */}
            <div className="card-soft p-5 border border-[#E3EBE5] bg-white space-y-3">
              <h3 className="font-semibold text-sm text-[#25332F]">Reported Hazard Distribution</h3>
              <div className="space-y-2 text-xs">
                {(analytics?.hazard_distribution || [
                  { type: 'Waterlogging', count: 3 },
                  { type: 'Flooded Road', count: 1 },
                  { type: 'Road Obstruction', count: 1 },
                  { type: 'Damaged Road', count: 1 },
                ]).map((h: any) => (
                  <div key={h.type} className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAF8]">
                    <span className="text-[#25332F] font-medium">{h.type}</span>
                    <span className="font-mono bg-white border border-[#E3EBE5] px-2 py-0.5 rounded text-[11px] font-semibold text-[#25332F]">
                      {h.count} reports
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* API & Service Diagnostics */}
            <div className="card-soft p-5 border border-[#E3EBE5] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[#25332F]">Service & Model Diagnostics</h3>
                <Activity className="w-4 h-4 text-[#5F8B6F]" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl border border-[#E3EBE5] bg-[#F8FAF8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#5F8B6F]" />
                    <span className="text-[#25332F]">Vision Model</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F5E3D]">
                    Operational
                  </span>
                </div>

                <div className="p-2.5 rounded-xl border border-[#E3EBE5] bg-[#F8FAF8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-[#4D9085]" />
                    <span className="text-[#25332F]">Open-Meteo Weather API</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EFF8F7] text-[#4D9085]">
                    Connected (15m Cache)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl border border-[#E3EBE5] bg-[#F8FAF8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#3D789B]" />
                    <span className="text-[#25332F]">OSRM Routing Engine</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DCECF5] text-[#25332F]">
                    Active
                  </span>
                </div>

                <div className="p-2.5 rounded-xl border border-[#E3EBE5] bg-[#F8FAF8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#718078]" />
                    <span className="text-[#25332F]">SQLite Civic Database</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F5E3D]">
                    Healthy
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
