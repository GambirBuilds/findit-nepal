import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, CheckCircle2, Package, Sparkles, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { dataService } from '../lib/supabase';
import { Report } from '../types/database';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [userReports, setUserReports] = useState<Report[]>([]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      dataService.getUserReports(user.id).then(setUserReports);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setSaving(true);
    try {
      await updateProfile({ full_name: fullName.trim() });
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const lostCount = userReports.filter(r => r.type === 'lost').length;
  const foundCount = userReports.filter(r => r.type === 'found').length;
  const returnedCount = userReports.filter(r => r.status === 'returned').length;

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[85vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Manage your account credentials, view personal activity, and verification status.
        </p>
      </div>

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Lost Reports</p>
          <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1 tabular-nums font-mono">
            {lostCount}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Found Reports</p>
          <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1 tabular-nums font-mono">
            {foundCount}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Successful Returns</p>
          <p className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1 tabular-nums font-mono">
            {returnedCount}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-extrabold text-2xl flex items-center justify-center uppercase">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {user?.full_name || 'User Account'}
              </h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                Role: {user?.role}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-500 cursor-not-allowed font-mono"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Email authentication is managed securely by Supabase Auth.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
