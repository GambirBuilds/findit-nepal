import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Eye,
  Search,
  Filter,
  Package,
  Sparkles,
  RefreshCw,
  MoreVertical,
  Check
} from 'lucide-react';
import { dataService } from '../lib/supabase';
import { Report, Profile, ReportStatus } from '../types/database';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

export const Admin: React.FC = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    pendingReviews: 0,
    returnedItems: 0,
    possibleMatches: 0,
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab & search
  const [activeTab, setActiveTab] = useState<'reports' | 'users'>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Confirmation dialog state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [adminStats, allReports, allUsers] = await Promise.all([
        dataService.getAdminStats(),
        dataService.getReports(),
        dataService.getAllUsers(),
      ]);
      setStats(adminStats);
      setReports(allReports);
      setUsers(allUsers);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
    try {
      const updated = await dataService.updateReportStatus(reportId, status);
      setReports(prev => prev.map(r => r.id === reportId ? updated : r));
      showToast(`Listing status updated to ${status}`);
      // Refresh stats
      const newStats = await dataService.getAdminStats();
      setStats(newStats);
    } catch (err) {
      showToast('Failed to update report status', 'error');
    }
  };

  const confirmDeleteReport = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await dataService.deleteReport(deleteTargetId);
      setReports(prev => prev.filter(r => r.id !== deleteTargetId));
      showToast('Listing removed permanently', 'info');
      setDeleteTargetId(null);
      const newStats = await dataService.getAdminStats();
      setStats(newStats);
    } catch (err) {
      showToast('Failed to delete report', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch =
      r.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contact_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[85vh]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrative Governance
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Admin Console
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Monitor community safety, moderate flagged listings, and manage system users.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-2 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1 tabular-nums font-mono">
            {stats.totalUsers}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Reports</p>
          <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1 tabular-nums font-mono">
            {stats.totalReports}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending Reviews</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 tabular-nums font-mono">
            {stats.pendingReviews}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Returns Reconciled</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums font-mono">
            {stats.returnedItems}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Possible Matches</p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 tabular-nums font-mono">
            {stats.possibleMatches}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'reports'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          All Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'users'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Registered Users ({users.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving administrative registries..." />
      ) : activeTab === 'reports' ? (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title, email, location..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl"
            >
              <option value="all">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="active">Active</option>
              <option value="matched">Matched</option>
              <option value="returned">Returned</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Item</th>
                    <th className="py-3.5 px-3">Type</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">Contact</th>
                    <th className="py-3.5 px-3">Location</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredReports.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900 dark:text-white line-clamp-1 max-w-[200px]">
                          {r.item_name}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <TypeBadge type={r.type} size="sm" />
                      </td>
                      <td className="py-3.5 px-3 capitalize text-neutral-600 dark:text-neutral-400">
                        {r.category}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-neutral-500 truncate max-w-[140px]">
                        {r.contact_email}
                      </td>
                      <td className="py-3.5 px-3 text-neutral-600 dark:text-neutral-400 truncate max-w-[140px]">
                        {r.location}
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={r.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-3 tabular-nums text-neutral-500">
                        {new Date(r.date_occurred).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/item/${r.id}`}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="View public page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {r.status === 'pending_review' && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'active')}
                              className="px-2 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                              title="Approve Listing"
                            >
                              Approve
                            </button>
                          )}

                          {r.status !== 'returned' && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'returned')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                              title="Mark Returned"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteTargetId(r.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Users List */
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850">
                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-xs uppercase">
                      {u.full_name?.charAt(0) || u.email.charAt(0)}
                    </div>
                    <span>{u.full_name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-neutral-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog for Admin Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Permanently Delete Listing"
        message="Are you sure you want to remove this listing from the database? This action is immediate and non-reversible."
        confirmLabel="Confirm Deletion"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDeleteReport}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
