import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ShieldAlert, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Camera
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Clean public navigation links with emojis (No admin links visible to public!)
  const navLinks = [
    { to: '/', label: `🏠 ${t('nav_home')}` },
    { to: '/map', label: `🗺️ ${t('nav_map')}` },
    { to: '/incidents', label: `⚠️ ${t('nav_incidents')}` },
    { to: '/report', label: `📸 ${t('nav_report')}`, highlight: true },
    { to: '/about', label: `ℹ️ ${t('nav_about')}` },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E2DFD2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#2F4F4F] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 border border-[#778899]/30">
              <ShieldAlert className="w-5 h-5 text-[#87CEEB]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#2F4F4F] leading-none">
                Sahaay <span className="text-[#778899] font-medium">AI</span>
              </span>
              <span className="text-[10px] text-[#778899] tracking-wider font-semibold uppercase mt-0.5">
                Predict • Prevent • Protect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive(link.to)
                    ? 'bg-[#ADD8E6]/40 text-[#2F4F4F] border border-[#ADD8E6]'
                    : 'text-[#586B6B] hover:text-[#2F4F4F] hover:bg-white/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Trilingual Selector: EN, తెలుగు, हिंदी */}
            <div className="flex items-center bg-white border border-[#E2DFD2] rounded-xl p-0.5 text-xs shadow-2xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${
                  language === 'en'
                    ? 'bg-[#2F4F4F] text-white shadow-xs'
                    : 'text-[#586B6B] hover:text-[#2F4F4F]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${
                  language === 'te'
                    ? 'bg-[#2F4F4F] text-white shadow-xs'
                    : 'text-[#586B6B] hover:text-[#2F4F4F]'
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${
                  language === 'hi'
                    ? 'bg-[#2F4F4F] text-white shadow-xs'
                    : 'text-[#586B6B] hover:text-[#2F4F4F]'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Commuter Account Profile Menu (No admin options exposed) */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2DFD2] bg-white text-xs text-[#2F4F4F] hover:border-[#778899] transition-colors shadow-2xs"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#778899]" />
                <span className="font-semibold max-w-[100px] truncate">
                  {isLoggedIn ? user?.full_name?.split(' ')[0] : t('nav_login')}
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 card-soft py-2 shadow-xl z-50 border border-[#E2DFD2] bg-white"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {isLoggedIn ? (
                    <>
                      <div className="px-3 py-2 border-b border-[#E2DFD2]">
                        <p className="text-xs font-bold text-[#2F4F4F]">{user?.full_name}</p>
                        <p className="text-[11px] text-[#778899] truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/my-reports"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 text-xs text-[#2F4F4F] hover:bg-[#FAF8F2] font-medium"
                      >
                        📋 {t('nav_my_reports')}
                      </Link>
                      {isAdmin && (
                        /* Only shown if already logged in as admin */
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-3 py-2 text-xs text-[#2F4F4F] hover:bg-[#FAF8F2] font-semibold border-t border-[#E2DFD2]"
                        >
                          🛡️ Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#C45547] hover:bg-[#FAF8F2] flex items-center gap-1.5 font-medium border-t border-[#E2DFD2]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav_logout')}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 text-xs text-[#2F4F4F] font-semibold hover:bg-[#FAF8F2]"
                      >
                        🔑 {t('nav_login')}
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 text-xs text-[#586B6B] hover:bg-[#FAF8F2]"
                      >
                        ✨ {t('nav_signup')}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Primary Report CTA Button */}
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2F4F4F] hover:bg-[#233B3B] text-white shadow-xs transition-all hover:shadow"
            >
              <Camera className="w-3.5 h-3.5 text-[#87CEEB]" />
              <span>{t('cta_report')}</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => {
                if (language === 'en') setLanguage('te');
                else if (language === 'te') setLanguage('hi');
                else setLanguage('en');
              }}
              className="px-2 py-1 rounded-lg border border-[#E2DFD2] bg-white text-xs font-bold text-[#2F4F4F]"
            >
              {language === 'en' ? 'తెలుగు' : language === 'te' ? 'हिंदी' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#2F4F4F] hover:bg-white border border-[#E2DFD2]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2DFD2] bg-white/98 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#2F4F4F] hover:bg-[#FAF8F2]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E2DFD2] flex gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs text-[#C45547] font-semibold border border-[#E2DFD2] rounded-xl"
              >
                Sign Out ({user?.email})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs border border-[#E2DFD2] rounded-xl font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs bg-[#2F4F4F] text-white font-bold rounded-xl"
                >
                  Report Hazard
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
