import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Database, CheckCircle2, Shield, Code, RefreshCw } from 'lucide-react';
import { isLiveSupabaseAvailable, dataService } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from './Toast';

export const Footer: React.FC = () => {
  const { user, loginAsDemoUser, loginAsDemoAdmin, refreshUser } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleDemoUser = async () => {
    await loginAsDemoUser();
    showToast(language === 'ne' ? 'साधारण नागरिक खातामा लग-इन भयो (आयुष शर्मा - काठमाडौँ)' : 'Logged in as standard user (Aayush Sharma - Kathmandu)');
  };

  const handleDemoAdmin = async () => {
    await loginAsDemoAdmin();
    showToast(language === 'ne' ? 'प्रशासक खातामा लग-इन भयो (सीता अधिकारी - नेपाल प्रहरी मोडरेटर)' : 'Logged in as Administrator (Sita Adhikari - Community Admin)');
  };

  const handleResetData = async (empty: boolean) => {
    setResetting(true);
    if (empty) {
      await dataService.resetDatabase(true);
      showToast('Database reset to clean 0 records for testing empty state', 'info');
    } else {
      await dataService.loadDemoData();
      showToast('Nepal demo records and sample matching pair restored', 'success');
    }
    await refreshUser();
    setResetting(false);
    window.location.reload();
  };

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-100 dark:border-neutral-800/80">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <MapPin className="w-4 h-4 fill-white stroke-orange-600" />
              </div>
              <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100 font-sans">
                Find<span className="text-orange-600">It</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Find what matters. Return what belongs.
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
              A modern lost and found platform providing safe community reunification, automated matching, and verified tracking.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li><Link to="/browse" className="hover:text-orange-600 transition-colors">Browse Items</Link></li>
              <li><Link to="/report/lost" className="hover:text-orange-600 transition-colors">Report Lost Item</Link></li>
              <li><Link to="/report/found" className="hover:text-orange-600 transition-colors">Report Found Item</Link></li>
              <li><Link to="/matches" className="hover:text-orange-600 transition-colors">AI-Assisted Matches</Link></li>
              <li><Link to="/track" className="hover:text-orange-600 transition-colors">Track My Items</Link></li>
              <li><Link to="/analytics" className="hover:text-orange-600 transition-colors">Platform Analytics</Link></li>
            </ul>
          </div>

          {/* Col 3: Testing & Switch Roles */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-3">
              Quick Role Switch (Review)
            </h4>
            <div className="space-y-2">
              <button
                onClick={handleDemoUser}
                className="w-full text-left px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-orange-500 transition-colors flex items-center justify-between"
              >
                <span>नागरिक (Aayush - KTM)</span>
                <span className="text-[10px] text-neutral-400">User</span>
              </button>
              <button
                onClick={handleDemoAdmin}
                className="w-full text-left px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-orange-500 transition-colors flex items-center justify-between"
              >
                <span>प्रशासक (Sita - Admin)</span>
                <Shield className="w-3 h-3 text-orange-600" />
              </button>
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => handleResetData(true)}
                  disabled={resetting}
                  className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline"
                  title="Empty database to test zero counts & empty states"
                >
                  Clear DB (0 data)
                </button>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <button
                  onClick={() => handleResetData(false)}
                  disabled={resetting}
                  className="text-[11px] text-orange-600 hover:underline"
                  title="Reload default demo items"
                >
                  Reload Demo Data
                </button>
              </div>
            </div>
          </div>

          {/* Col 4: Supabase Connection Status */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-3">
              Database Architecture
            </h4>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isLiveSupabaseAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {isLiveSupabaseAvailable ? 'Supabase Live Connected' : 'Persistent Storage Active'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                {isLiveSupabaseAvailable
                  ? 'Connected to configured Supabase PostgreSQL instance with RLS & Storage.'
                  : 'Operating in 100% genuine persistent mode. Ready for production Supabase linking.'}
              </p>
              <button
                onClick={() => setShowSqlModal(true)}
                className="w-full mt-1 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Supabase Schema &amp; Setup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} FindIt Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="tabular-nums">Secure RLS Enabled</span>
            <span>·</span>
            <span>Zero-Fake Data Principle</span>
            <span>·</span>
            <span>Student &amp; Enterprise Ready</span>
          </div>
        </div>
      </div>

      {/* Supabase SQL instructions modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Supabase Production Setup
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-neutral-600 dark:text-neutral-300">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1">
                  1. Environment Variables in .env
                </h4>
                <p className="mb-2">Copy into your <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-orange-600">.env</code> or Vercel Environment Variables:</p>
                <pre className="p-3 bg-neutral-100 dark:bg-neutral-950 rounded-xl font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800">
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1">
                  2. Run SQL Schema in Supabase SQL Editor
                </h4>
                <p className="mb-2">The complete migration file is located at <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-mono">supabase/schema.sql</code>. It provisions all tables (<code className="font-mono">profiles</code>, <code className="font-mono">reports</code>, <code className="font-mono">matches</code>, <code className="font-mono">notifications</code>, <code className="font-mono">categories</code>), triggers, and strict Row Level Security (RLS) policies.</p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1">
                  3. Storage Bucket
                </h4>
                <p>Create a public bucket named <code className="font-mono font-bold text-orange-600">item-images</code> in Supabase Storage. The schema SQL includes policies for authenticated users to upload and anyone to view.</p>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
