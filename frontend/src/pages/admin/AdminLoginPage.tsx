import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Check, Home, Sparkles } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@sahaay.org');
  const [password, setPassword] = useState('SahaayAdmin@2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Administrative credentials verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setError(null);
    setLoading(true);
    try {
      await switchDemoUser('admin');
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#2F4F4F] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Civic Administration Seal */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#87CEEB] text-[#2F4F4F] flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#ADD8E6] block">
            Authorized Civic Personnel Only 🛡️
          </span>
          <h1 className="text-2xl font-bold text-white">Disaster Response Admin Portal</h1>
          <p className="text-xs text-[#ADD8E6]/85">
            Internal civic console for hazard verification, pump dispatch, and municipal reports.
          </p>
        </div>

        {/* Credentials Helper Card */}
        <div className="bg-[#FAF8F2] border border-[#ADD8E6] rounded-2xl p-4 shadow-md text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#2F4F4F] flex items-center gap-1.5 text-xs">
              <KeyRound className="w-4 h-4 text-[#778899]" />
              Official Admin Credentials
            </span>
            <span className="text-[10px] font-semibold text-[#2F4F4F] bg-[#ADD8E6]/50 px-2 py-0.5 rounded-full">
              Demo Access
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-[#E2DFD2]">
              <span className="text-[#778899] font-medium text-[11px]">Email:</span>
              <div className="flex items-center gap-2">
                <code className="font-mono font-bold text-[#2F4F4F]">admin@sahaay.org</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard('admin@sahaay.org', 'email')}
                  className="text-[10px] text-[#778899] hover:text-[#2F4F4F] font-semibold underline ml-1"
                >
                  {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-green-600 inline" /> : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-[#E2DFD2]">
              <span className="text-[#778899] font-medium text-[11px]">Password:</span>
              <div className="flex items-center gap-2">
                <code className="font-mono font-bold text-[#2F4F4F]">SahaayAdmin@2026</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard('SahaayAdmin@2026', 'pw')}
                  className="text-[10px] text-[#778899] hover:text-[#2F4F4F] font-semibold underline ml-1"
                >
                  {copiedKey === 'pw' ? <Check className="w-3.5 h-3.5 text-green-600 inline" /> : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[#778899] italic">
            💡 Using <code>SahaayAdmin@2026</code> bypasses Chrome's password breach warnings. Legacy password <code>admin123</code> is also accepted.
          </p>
        </div>

        {/* Card */}
        <div className="card-soft p-6 sm:p-8 border border-white/20 bg-white/95 space-y-5 shadow-2xl rounded-3xl">
          
          {error && (
            <div className="p-3 bg-[#FBE8E6] border border-[#E9A49A] rounded-xl text-xs text-[#8C3429] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Instant 1-Click Button */}
          <button
            type="button"
            onClick={handleDemoAdmin}
            disabled={loading}
            className="w-full p-3 rounded-2xl bg-[#87CEEB] hover:bg-[#72bcd6] text-[#2F4F4F] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-[#778899]/30 group"
          >
            <Sparkles className="w-4 h-4 text-[#2F4F4F] group-hover:rotate-12 transition-transform" />
            <span>⚡ Instant 1-Click Admin Sign In</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E2DFD2]"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#778899] tracking-wider">
              Or Sign In with Form
            </span>
            <div className="flex-grow border-t border-[#E2DFD2]"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2F4F4F] mb-1">
                Administrative Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#778899] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sahaay.org"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F2] border border-[#E2DFD2] rounded-xl text-xs text-[#2F4F4F] focus:outline-none focus:border-[#2F4F4F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2F4F4F] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#778899] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F2] border border-[#E2DFD2] rounded-xl text-xs text-[#2F4F4F] focus:outline-none focus:border-[#2F4F4F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Console'}</span>
              <ArrowRight className="w-4 h-4 text-[#87CEEB]" />
            </button>
          </form>

          {/* Return link */}
          <div className="pt-3 border-t border-[#E2DFD2] text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-[#586B6B] hover:text-[#2F4F4F] inline-flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>← Return to Public Sahaay AI Website</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
