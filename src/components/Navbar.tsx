import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Sparkles,
  BarChart3,
  ShieldCheck,
  PlusCircle,
  Sun,
  Moon,
  User,
  LogOut,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Languages
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setReportDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (reportRef.current && !reportRef.current.contains(e.target as Node)) {
        setReportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: t.home, path: '/' },
    { label: t.browse, path: '/browse' },
    { label: t.track, path: '/track' },
    { label: t.matches, path: '/matches' },
    { label: t.analytics, path: '/analytics' },
    ...(isAdmin ? [{ label: t.admin, path: '/admin' }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Wordmark with subtle orange accent logo & Nepal Badge */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm group-hover:bg-orange-700 transition-colors">
            <MapPin className="w-5 h-5 fill-white stroke-orange-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 font-sans">
              Find<span className="text-orange-600">It</span>
            </span>
            <span className="text-[11px] font-bold tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-900">
              Nepal
            </span>
          </div>
        </Link>

        {/* Zone 2: Desktop Navigation Links (Clean text with subtle underline/active state) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors whitespace-nowrap relative py-1 ${
                  isActive
                    ? 'text-orange-600 dark:text-orange-500 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:border-orange-500 transition-colors"
            title="भाषा परिवर्तन गर्नुहोस् (Switch English / नेपाली)"
          >
            <Languages className="w-3.5 h-3.5 text-orange-600" />
            <span>{language === 'en' ? 'नेपाली' : 'EN'}</span>
          </button>

          {/* Quick Report Dropdown */}
          <div className="relative hidden sm:block" ref={reportRef}>
            <button
              onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.reportItem}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {reportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <Link
                  to="/report/lost"
                  className="block px-4 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {language === 'ne' ? 'हराएको सामान' : 'Lost Something'}
                  </span>
                  <p className="text-[10px] text-neutral-500 mt-0.5">नागरिकता, ब्लुबुक, सामान दर्ता</p>
                </Link>
                <Link
                  to="/report/found"
                  className="block px-4 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border-t border-neutral-100 dark:border-neutral-800"
                >
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {language === 'ne' ? 'भेटिएको सामान' : 'Found Something'}
                  </span>
                  <p className="text-[10px] text-neutral-500 mt-0.5">फेला पारेको सामान धनीलाई बुझाउनुहोस्</p>
                </Link>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Icon (Only for logged in users) */}
          {user && <NotificationDropdown />}

          {/* User Account / Profile */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-700 dark:text-neutral-200 uppercase ring-1 ring-neutral-300 dark:ring-neutral-600">
                  {user.full_name?.charAt(0) || user.email.charAt(0)}
                </div>
                <span className="hidden lg:inline text-xs font-medium text-neutral-800 dark:text-neutral-200 max-w-[100px] truncate">
                  {user.full_name || user.email.split('@')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {user.full_name}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {user.email}
                    </p>
                    {user.role === 'admin' && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 rounded">
                        Administrator
                      </span>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>{t.myProfile}</span>
                  </Link>

                  <Link
                    to="/track"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-neutral-400" />
                    <span>{t.track}</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t.admin} Console</span>
                    </Link>
                  )}

                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.signOut}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
              >
                {t.signIn}
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
              >
                {t.signUp}
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Link
              to="/report/lost"
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900"
            >
              <PlusCircle className="w-4 h-4" /> {language === 'ne' ? 'हराएको दर्ता' : 'Report Lost'}
            </Link>
            <Link
              to="/report/found"
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900"
            >
              <PlusCircle className="w-4 h-4" /> {language === 'ne' ? 'भेटिएको दर्ता' : 'Report Found'}
            </Link>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 font-bold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-xs text-neutral-500">भाषा / Language:</span>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/60 rounded-lg border border-orange-200 dark:border-orange-800"
            >
              {language === 'en' ? 'नेपालीमा हेर्नुहोस्' : 'Switch to English'}
            </button>
          </div>

          {!user && (
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
              <Link
                to="/login"
                className="flex-1 text-center py-2 text-xs font-semibold border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-800 dark:text-neutral-200"
              >
                {t.signIn}
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2 text-xs font-semibold bg-orange-600 text-white rounded-xl shadow-xs"
              >
                {t.signUp}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

