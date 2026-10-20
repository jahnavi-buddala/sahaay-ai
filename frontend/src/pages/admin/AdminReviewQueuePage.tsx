import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { fetchIncidents, verifyIncident, markIncidentStale, flagIncident } from '../../services/api';
import { Incident } from '../../types';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  Inbox, 
  ShieldCheck, 
  CheckCircle2, 
  Archive, 
  Flag, 
  Check, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Cpu, 
  CloudRain 
} from 'lucide-react';

export const AdminReviewQueuePage: React.FC = () => {
  const [unverifiedQueue, setUnverifiedQueue] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState('');
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const loadQueue = () => {
    setLoading(true);
    fetchIncidents({ status: 'unverified' })
      .then((res) => {
        setUnverifiedQueue(res.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleAction = async (id: string, action: 'verify' | 'corroborate' | 'stale' | 'flag') => {
    try {
      if (action === 'verify') {
        await verifyIncident(id, 'verified', reviewNote || 'Verified by Civic Triage Officer');
        setActiveMessage(`Incident ${id} verified and published.`);
      } else if (action === 'corroborate') {
        await verifyIncident(id, 'corroborated', reviewNote || 'Corroborated by Ward Officer');
        setActiveMessage(`Incident ${id} marked corroborated.`);
      } else if (action === 'stale') {
        await markIncidentStale(id);
        setActiveMessage(`Incident ${id} marked stale.`);
      } else if (action === 'flag') {
        await flagIncident(id, reviewNote || 'Flagged during administrative triage review');
        setActiveMessage(`Incident ${id} flagged as suspicious.`);
      }
      setReviewNote('');
      loadQueue();
      setTimeout(() => setActiveMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAF8]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#25332F]">Community Submissions Queue</h1>
            <p className="text-xs text-[#718078] mt-0.5">
              Rapid triage interface for incoming unverified citizen reports.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FEF6E4] text-[#8F6616] border border-[#F5D99A]">
            {unverifiedQueue.length} Pending Review
          </span>
        </div>

        {activeMessage && (
          <div className="p-3 bg-[#EBF3ED] border border-[#8FAF9A] rounded-xl text-xs text-[#2F5E3D] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#5F8B6F]" />
            <span>{activeMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="card-soft p-6 border border-[#E3EBE5] bg-white animate-pulse h-48" />
            ))}
          </div>
        ) : unverifiedQueue.length === 0 ? (
          <div className="card-soft p-12 text-center border border-[#E3EBE5] bg-white space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#5F8B6F] mx-auto" />
            <h3 className="font-bold text-base text-[#25332F]">Queue is Clear!</h3>
            <p className="text-xs text-[#718078]">
              All submitted citizen reports have been reviewed or corroborated.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {unverifiedQueue.map((item) => (
              <div
                key={item.id}
                className="card-soft p-6 border border-[#E3EBE5] bg-white space-y-5 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3EBE5]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-[#F8FAF8] border border-[#E3EBE5] px-2 py-0.5 rounded text-[#25332F]">
                      {item.id}
                    </span>
                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-[#EBF3ED] text-[#25332F]">
                      {item.hazard_type}
                    </span>
                    <span className="text-[11px] text-[#718078] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <RiskBadge score={item.risk_score} level={item.risk_level} size="sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Photo Thumbnail */}
                  <div className="md:col-span-4 rounded-xl overflow-hidden border border-[#E3EBE5] bg-black">
                    {item.photo_url ? (
                      <img
                        src={item.photo_url}
                        alt=""
                        className="w-full h-44 object-cover"
                      />
                    ) : (
                      <div className="w-full h-44 bg-[#F8FAF8] flex items-center justify-center text-xs text-[#718078]">
                        No Photo Submitted
                      </div>
                    )}
                  </div>

                  {/* Context & Description */}
                  <div className="md:col-span-8 space-y-3 text-xs">
                    <div>
                      <span className="text-[#718078] block font-semibold mb-0.5">Location:</span>
                      <p className="text-[#25332F] font-medium">{item.address}</p>
                      <p className="font-mono text-[11px] text-[#718078]">
                        {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5]">
                      <span className="font-semibold text-[#25332F] block mb-0.5">Reporter Narrative:</span>
                      <p className="text-[#718078] leading-relaxed">{item.description}</p>
                    </div>

                    {item.ai_analysis && (
                      <div className="p-3 bg-[#EFF8F7] rounded-xl border border-[#A8D5CE] text-[11px]">
                        <span className="font-semibold text-[#4D9085]">AI Vision Assessment:</span>
                        <p className="text-[#25332F] mt-0.5">{item.ai_analysis.interpretation}</p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Triage Action Bar */}
                <div className="pt-4 border-t border-[#E3EBE5] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Optional review note / dispatch directive..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="w-full sm:w-80 px-3 py-1.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F] focus:outline-none focus:border-[#8FAF9A]"
                  />

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleAction(item.id, 'flag')}
                      className="px-3 py-1.5 rounded-lg border border-[#E9A49A] text-[#8C3429] hover:bg-[#FBE8E6] text-xs font-medium"
                    >
                      Flag Suspicious
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(item.id, 'stale')}
                      className="px-3 py-1.5 rounded-lg border border-[#E3EBE5] hover:bg-[#F8FAF8] text-xs text-[#718078]"
                    >
                      Mark Stale
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(item.id, 'corroborate')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#A8D5CE] hover:bg-[#96C7C0] text-[#25332F] text-xs font-semibold"
                    >
                      Corroborate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(item.id, 'verify')}
                      className="px-4 py-1.5 rounded-lg bg-[#8FAF9A] hover:bg-[#7E9E89] text-[#25332F] text-xs font-semibold shadow-xs"
                    >
                      Approve & Verify
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};
