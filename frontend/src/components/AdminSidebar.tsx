import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  ListFilter, 
  Inbox, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  ArrowLeft,
  LogOut
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = [
    { to: '/admin', label: '📊 Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/incidents', label: '📋 Incident Management', icon: ListFilter },
    { to: '/admin/reports', label: '📥 Review Queue', icon: Inbox },
    { to: '/admin/analytics', label: '📈 Analytics & Models', icon: BarChart3 },
    { to: '/admin/settings', label: '⚙️ System Settings', icon: Settings },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-[#2F4F4F] text-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] border-r border-[#778899]/30">
      <div className="p-4 space-y-6">
        
        {/* Admin Header Chip */}
        <div className="p-3 bg-white/10 rounded-2xl border border-white/15 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#87CEEB] text-[#2F4F4F] flex items-center justify-center shrink-0 shadow-xs font-bold text-base">
            🛡️
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-[#ADD8E6] tracking-wider block">
              Municipal Portal
            </span>
            <span className="text-xs font-bold text-white truncate block">
              {user?.full_name || 'Civic Admin'}
            </span>
            <span className="text-[10px] text-[#ADD8E6]/70 truncate block">
              {user?.email || 'admin@sahaay.org'}
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const active = isActive(link.to, link.exact);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#87CEEB] text-[#2F4F4F] shadow-sm'
                    : 'text-[#ADD8E6]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-[#ADD8E6]/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Exit to Public Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-xs font-semibold text-rose-300 hover:text-rose-100 p-2 rounded-xl hover:bg-rose-500/20 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Admin</span>
        </button>
      </div>
    </aside>
  );
};
