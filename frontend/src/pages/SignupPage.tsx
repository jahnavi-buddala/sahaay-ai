import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup({
        full_name: fullName,
        email,
        password,
        role: 'user',
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8FAF9A] to-[#A8D5CE] text-[#25332F] flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#25332F]">Join Sahaay AI</h1>
          <p className="text-xs text-[#718078]">
            Create an account to report hazards and track civic safety updates.
          </p>
        </div>

        {/* Card */}
        <div className="card-soft p-6 sm:p-8 border border-[#E3EBE5] bg-white space-y-6 shadow-sm">
          
          {error && (
            <div className="p-3 bg-[#FBE8E6] border border-[#E9A49A] rounded-xl text-xs text-[#8C3429] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#25332F] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#718078] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Rao"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F] focus:outline-none focus:border-[#8FAF9A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25332F] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#718078] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F] focus:outline-none focus:border-[#8FAF9A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25332F] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#718078] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2 bg-[#F8FAF8] border border-[#E3EBE5] rounded-xl text-xs text-[#25332F] focus:outline-none focus:border-[#8FAF9A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#8FAF9A] hover:bg-[#7E9E89] text-[#25332F] font-semibold text-xs shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[#718078]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#5F8B6F] font-semibold hover:underline">
              Sign in instead
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
