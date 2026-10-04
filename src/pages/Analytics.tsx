import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Package,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowUpRight,
  PieChart as PieIcon
} from 'lucide-react';
import { dataService } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

const PIE_COLORS = ['#E11D48', '#10B981', '#F59E0B', '#6366F1'];

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const stats = await dataService.getAnalytics();
        setData(stats);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Compiling platform metrics..." />
      </div>
    );
  }

  if (!data || data.totalReports === 0) {
    return (
      <div className="py-12 max-w-4xl mx-auto px-4 w-full">
        <EmptyState
          icon={BarChart3}
          title="No reports data available yet"
          description="Analytics will automatically calculate once users begin reporting lost and found items in the platform."
          actionText="Create First Report"
          onAction={() => window.location.href = '/report/lost'}
        />
      </div>
    );
  }

  const pieData = [
    { name: 'Lost Items', value: data.lostItems },
    { name: 'Found Items', value: data.foundItems },
    { name: 'Returned', value: data.returnedItems },
  ].filter(p => p.value > 0);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[85vh]">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          Verified Database Telemetry
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Platform Analytics
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Real-time metrics on report volume, reunification rates, and category distribution.
        </p>
      </div>

      {/* Top Stat Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Reports</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 tabular-nums font-mono">
            {data.totalReports}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Lost Items</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 tabular-nums font-mono">
            {data.lostItems}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Found Items</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums font-mono">
            {data.foundItems}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Returned</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400 mt-1 tabular-nums font-mono">
            {data.returnedItems}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Matches</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 tabular-nums font-mono">
            {data.totalMatches}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Active Users</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 tabular-nums font-mono">
            {data.activeUsers}
          </p>
        </div>
      </div>

      {/* Return Rate Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-100">
            Reunification Success Metric
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-1 tabular-nums font-mono">
            {data.returnRate}% Return Rate
          </h2>
          <p className="text-xs text-orange-100 mt-1 max-w-md">
            Percentage of total reported missing items safely reconciled with their owners.
          </p>
        </div>

        <div className="w-full sm:w-64 bg-white/20 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className="bg-white h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(5, data.returnRate))}%` }}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Timeline Chart */}
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
            Reports Activity (Past 7 Days)
          </h3>
          <p className="text-xs text-neutral-500 mb-6">Daily new lost and found filings</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timelineData}>
                <defs>
                  <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" fontSize={11} stroke="#9CA3AF" />
                <YAxis allowDecimals={false} fontSize={11} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="lost" stroke="#E11D48" fillOpacity={1} fill="url(#colorLost)" name="Lost" />
                <Area type="monotone" dataKey="found" stroke="#10B981" fillOpacity={1} fill="url(#colorFound)" name="Found" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
            Reports by Item Category
          </h3>
          <p className="text-xs text-neutral-500 mb-6">Distribution across primary categories</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" fontSize={10} stroke="#9CA3AF" interval={0} angle={-20} textAnchor="end" height={40} />
                <YAxis allowDecimals={false} fontSize={11} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#EA580C" radius={[6, 6, 0, 0]} name="Reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
