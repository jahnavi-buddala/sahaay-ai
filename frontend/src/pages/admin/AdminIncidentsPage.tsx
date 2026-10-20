import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { 
  fetchIncidents, 
  verifyIncident, 
  resolveIncident, 
  markIncidentStale, 
  mergeIncident 
} from '../../services/api';
import { Incident } from '../../types';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  Search, 
  Filter, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  Archive, 
  GitMerge, 
  X, 
  Check, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  RefreshCw 
} from 'lucide-react';

export const AdminIncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hazardFilter, setHazardFilter] = useState('All');

  // Selected incident for detail drawer
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Merge modal
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [mergeTargetId, setMergeTargetId] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchIncidents({
      search: search.trim() || undefined,
      status: statusFilter !== 'All' ? statusFilter : undefined,
      hazard_type: hazardFilter !== 'All' ? hazardFilter : undefined,
    })
      .then((res) => {
        setIncidents(res.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, hazardFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedIncident) return;
    try {
      if (status === 'resolved') {
        const updated = await resolveIncident(selectedIncident.id, reviewNotes);
        setSelectedIncident(updated);
        setActionSuccess(`Incident ${updated.id} marked as resolved/cleared.`);
      } else if (status === 'stale') {
        const updated = await markIncidentStale(selectedIncident.id);
        setSelectedIncident(updated);
        setActionSuccess(`Incident ${updated.id} marked as stale.`);
      } else {
        const updated = await verifyIncident(selectedIncident.id, status, reviewNotes);
        setSelectedIncident(updated);
        setActionSuccess(`Incident ${updated.id} status updated to ${status}.`);
      }
      loadData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleMerge = async () => {
    if (!selectedIncident || !mergeTargetId.trim()) return;
    try {
      await mergeIncident(selectedIncident.id, mergeTargetId.trim(), reviewNotes);
      setActionSuccess(`Successfully merged ${selectedIncident.id} into ${mergeTargetId}`);
      setMergeModalOpen(false);
      loadData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Merge failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAF8]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#25332F]">Incident Management</h1>
            <p className="text-xs text-[#718078] mt-0.5">
              Verify community reports, merge spatial duplicates, mark clearance, and record audit rationales.
            </p>
          </div>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E3EBE5] bg-white text-xs text-[#25332F] hover:bg-[#F8FAF8]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#5F8B6F]" />
            <span>Refresh Table</span>
          </button>
        </div>

        {actionSuccess && (
          <div className="p-3 bg-[#EBF3ED] border border-[#8FAF9A] rounded-xl text-xs text-[#2F5E3D] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#5F8B6F]" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="card-soft p-4 border border-[#E3EBE5] bg-white flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-[#718078] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, landmark, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F] focus:outline-none focus:border-[#8FAF9A]"
            />
          </form>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={hazardFilter}
              onChange={(e) => setHazardFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F]"
            >
              <option value="All">All Hazards</option>
              <option value="Waterlogging">Waterlogging</option>
              <option value="Flooded Road">Flooded Road</option>
              <option value="Road Obstruction">Road Obstruction</option>
              <option value="Damaged Road">Damaged Road</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F]"
            >
              <option value="All">All Statuses</option>
              <option value="unverified">Unverified</option>
              <option value="corroborated">Corroborated</option>
              <option value="verified">Verified</option>
              <option value="resolved">Resolved</option>
              <option value="stale">Stale</option>
            </select>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="card-soft border border-[#E3EBE5] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E3EBE5] bg-[#F8FAF8] text-[#718078] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Hazard Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reported</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EBE5]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#718078]">
                      Loading database records...
                    </td>
                  </tr>
                ) : incidents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#718078]">
                      No incidents match current filter criteria.
                    </td>
                  </tr>
                ) : (
                  incidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-[#F8FAF8] transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#25332F]">
                        {inc.id}
                      </td>
                      <td className="py-3 px-4">
                        {inc.photo_url ? (
                          <img
                            src={inc.photo_url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-[#E3EBE5]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#F8FAF8] border border-[#E3EBE5] flex items-center justify-center text-[9px] text-[#718078]">
                            None
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#25332F]">
                        {inc.hazard_type}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[#718078]">
                        {inc.address}
                      </td>
                      <td className="py-3 px-4">
                        <RiskBadge score={inc.risk_score} level={inc.risk_level} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={inc.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-[#718078] text-[11px]">
                        {new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedIncident(inc);
                            setReviewNotes(inc.review_notes || '');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E3EBE5] bg-white hover:bg-[#F8FAF8] text-[#25332F] font-semibold text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#5F8B6F]" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Review & Triage Drawer */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between border-l border-[#E3EBE5]">
            
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E3EBE5]">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-[#F8FAF8] border border-[#E3EBE5] px-2 py-0.5 rounded text-[#25332F]">
                    {selectedIncident.id}
                  </span>
                  <h3 className="font-bold text-base text-[#25332F] mt-1">
                    {selectedIncident.hazard_type}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-1 rounded-lg hover:bg-[#F8FAF8] text-[#718078]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo & Coordinates */}
              {selectedIncident.photo_url && (
                <div className="rounded-xl overflow-hidden border border-[#E3EBE5]">
                  <img
                    src={selectedIncident.photo_url}
                    alt=""
                    className="w-full h-44 object-cover"
                  />
                </div>
              )}

              <div className="space-y-1 text-xs">
                <span className="text-[#718078]">Address & Pin:</span>
                <p className="font-medium text-[#25332F]">{selectedIncident.address}</p>
                <p className="font-mono text-[11px] text-[#718078]">
                  {selectedIncident.latitude.toFixed(5)}, {selectedIncident.longitude.toFixed(5)}
                </p>
              </div>

              {/* Description */}
              <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E3EBE5] text-xs space-y-1">
                <span className="font-semibold text-[#25332F]">Citizen Observation:</span>
                <p className="text-[#718078] leading-relaxed">{selectedIncident.description}</p>
              </div>

              {/* AI Visual Interpretation */}
              {selectedIncident.ai_analysis && (
                <div className="p-3 bg-[#EFF8F7] rounded-xl border border-[#A8D5CE] text-xs space-y-1">
                  <span className="font-semibold text-[#4D9085]">
                    AI Vision Extraction ({Math.round(selectedIncident.ai_analysis.confidence * 100)}% conf):
                  </span>
                  <p className="text-[#25332F] text-[11px]">{selectedIncident.ai_analysis.interpretation}</p>
                </div>
              )}

              {/* Review notes input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#25332F]">
                  Civic Administrative Notes / Rationale
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Record reason for verification, pump dispatch or clearing decision..."
                  className="w-full p-2.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F] focus:outline-none focus:border-[#8FAF9A]"
                />
              </div>

              {/* Status Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#E3EBE5]">
                <span className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider block">
                  Update Civic Status
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange('verified')}
                    className="p-2 rounded-xl bg-[#EBF3ED] hover:bg-[#D4E8DA] border border-[#8FAF9A] text-xs font-semibold text-[#25332F] flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5F8B6F]" />
                    <span>Mark Verified</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange('corroborated')}
                    className="p-2 rounded-xl bg-[#EFF8F7] hover:bg-[#D4EFEB] border border-[#A8D5CE] text-xs font-semibold text-[#25332F] flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4D9085]" />
                    <span>Corroborate</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="p-2 rounded-xl bg-[#DCECF5] hover:bg-[#C5E1F0] border border-[#B8D7E8] text-xs font-semibold text-[#25332F] flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3D789B]" />
                    <span>Mark Resolved</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange('stale')}
                    className="p-2 rounded-xl bg-[#F8FAF8] hover:bg-[#E3EBE5] border border-[#E3EBE5] text-xs font-medium text-[#718078] flex items-center justify-center gap-1.5"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Mark Stale</span>
                  </button>
                </div>

                <button
                  onClick={() => setMergeModalOpen(true)}
                  className="w-full mt-2 py-2 rounded-xl border border-[#E3EBE5] bg-white hover:bg-[#F8FAF8] text-xs font-medium text-[#25332F] flex items-center justify-center gap-1.5"
                >
                  <GitMerge className="w-3.5 h-3.5 text-[#8FAF9A]" />
                  <span>Merge as Duplicate into Another Incident</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E3EBE5]">
              <button
                onClick={() => setSelectedIncident(null)}
                className="w-full py-2 rounded-xl bg-[#F8FAF8] hover:bg-[#E3EBE5] text-xs text-[#25332F] font-semibold"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Merge Modal */}
      {mergeModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E3EBE5] shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-[#25332F] flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-[#8FAF9A]" />
              Merge Duplicate Incident
            </h3>
            <p className="text-xs text-[#718078]">
              Merge <strong>{selectedIncident.id}</strong> into a master incident ID.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-[#718078] mb-1">
                Master Incident ID (Target)
              </label>
              <input
                type="text"
                placeholder="e.g. SHY-HYD-001"
                value={mergeTargetId}
                onChange={(e) => setMergeTargetId(e.target.value)}
                className="w-full p-2.5 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs font-mono uppercase focus:outline-none focus:border-[#8FAF9A]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMergeModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E3EBE5] text-xs text-[#718078]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMerge}
                className="px-4 py-1.5 rounded-lg bg-[#8FAF9A] text-[#25332F] font-semibold text-xs"
              >
                Confirm Merge
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
