import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchMyReports } from '../services/api';
import { Incident } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { StatusBadge } from '../components/StatusBadge';
import { 
  PlusCircle, 
  Clock, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const { user, isLoggedIn, switchDemoUser } = useAuth();
  const [reports, setReports] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMyReports()
        .then((res) => {
          setReports(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-4">
        <div className="card-soft p-8 text-center max-w-md border border-[#E2DFD2] bg-white space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ADD8E6]/40 text-[#2F4F4F] flex items-center justify-center mx-auto text-xl">
            📋
          </div>
          <h2 className="text-xl font-bold text-[#2F4F4F]">Sign In to View Your Reports</h2>
          <p className="text-xs text-[#586B6B]">
            Sign in to track verification progress, AI analysis findings, and civic resolution of your submitted hazards.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => switchDemoUser('commuter')}
              className="w-full py-2.5 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white text-xs font-bold shadow-xs"
            >
              Sign In as Demo Commuter (Rajesh Varma)
            </button>
            <Link
              to="/login"
              className="w-full py-2.5 rounded-xl border border-[#E2DFD2] hover:bg-[#FAF8F2] text-xs font-semibold text-[#2F4F4F]"
            >
              Go to Standard Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-8 px-4 sm:px-6 lg:px-8 text-[#1C2E2E]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ADD8E6]/30 border border-[#ADD8E6] text-xs font-bold text-[#2F4F4F] mb-1.5">
              <span>📋 Commuter Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-[#2F4F4F]">My Submitted Reports</h1>
            <p className="text-xs text-[#586B6B] mt-0.5">
              Logged in as <strong className="text-[#2F4F4F]">{user?.full_name}</strong> ({user?.email})
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white text-xs font-bold shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#87CEEB]" />
            <span>📸 Submit New Hazard</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card-soft p-5 border border-[#E2DFD2] animate-pulse h-24" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="card-soft p-12 text-center border border-[#E2DFD2] bg-white space-y-3">
            <AlertCircle className="w-8 h-8 text-[#778899] mx-auto" />
            <h3 className="font-bold text-sm text-[#2F4F4F]">No reports submitted yet</h3>
            <p className="text-xs text-[#586B6B]">
              You haven't submitted any road hazards under this account yet.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F4F4F] text-white text-xs font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report First Hazard</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="card-soft p-5 border border-[#E2DFD2] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start gap-4">
                  {report.photo_url ? (
                    <img
                      src={report.photo_url}
                      alt={report.hazard_type}
                      className="w-16 h-16 rounded-xl object-cover border border-[#E2DFD2] shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#FAF8F2] border border-[#E2DFD2] flex items-center justify-center text-[10px] text-[#778899] shrink-0 font-bold">
                      No Photo
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#2F4F4F]">
                        {report.id}
                      </span>
                      <span className="text-xs font-bold text-[#2F4F4F]">
                        {report.hazard_type}
                      </span>
                      <StatusBadge status={report.status} size="sm" />
                    </div>

                    <p className="text-xs text-[#586B6B] line-clamp-1">{report.address}</p>

                    <div className="flex items-center gap-3 text-[11px] text-[#586B6B] pt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#778899]" />
                        {new Date(report.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                        {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>•</span>
                      <span>Evidence Score: <strong>{report.risk_score}/100</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <RiskBadge score={report.risk_score} level={report.risk_level} size="sm" />
                  <Link
                    to={`/incidents/${report.id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#FAF8F2] hover:bg-[#ADD8E6]/40 text-[#2F4F4F] text-xs font-bold transition-colors border border-[#E2DFD2]"
                  >
                    <span>Inspect</span>
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
