import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Lock, Mail, ArrowRight, AlertCircle, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCommuter = async () => {
    setError(null);
    setLoading(true);
    try {
      await switchDemoUser('commuter');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Commuter sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#2F4F4F] text-[#87CEEB] flex items-center justify-center mx-auto shadow-xs border border-[#778899]/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#2F4F4F]">Commuter Sign In</h1>
          <p className="text-xs text-[#586B6B]">
            Sign in to submit road hazard reports and track your civic updates.
          </p>
        </div>

        {/* Card */}
        <div className="card-soft p-6 sm:p-8 border border-[#E2DFD2] bg-white space-y-6 shadow-sm">
          
          {error && (
            <div className="p-3 bg-[#FBE8E6] border border-[#E9A49A] rounded-xl text-xs text-[#8C3429] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2F4F4F] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#778899] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commuter@sahaay.org"
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
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-[#87CEEB]" />
            </button>
          </form>

          {/* Quick Commuter Demo Persona (No admin controls) */}
          <div className="pt-4 border-t border-[#E2DFD2] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#778899] tracking-wider block text-center">
              Quick Commuter Demo Access
            </span>
            <button
              type="button"
              onClick={handleDemoCommuter}
              className="w-full p-2.5 rounded-xl border border-[#ADD8E6] bg-[#ADD8E6]/25 hover:bg-[#ADD8E6]/40 text-[#2F4F4F] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <User className="w-4 h-4 text-[#2F4F4F]" />
              <span>Sign In as Demo Commuter (Rajesh Varma)</span>
            </button>
          </div>

          <div className="text-center text-xs text-[#586B6B]">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-[#2F4F4F] font-bold hover:underline">
              Create an account
            </Link>
          </div>

          <div className="pt-2 text-center border-t border-[#E2DFD2]/60">
            <Link to="/admin/login" className="text-[11px] font-semibold text-[#778899] hover:text-[#2F4F4F] transition-colors inline-flex items-center gap-1">
              <span>🏛️ Authorized Civic Personnel? Access Admin Portal →</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
