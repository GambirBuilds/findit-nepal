import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Trash2,
  Check,
  ChevronRight
} from 'lucide-react';
import { dataService } from '../lib/supabase';
import { Report, ReportStatus } from '../types/database';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';
import confetti from 'canvas-confetti';

const LOST_STAGES: { status: ReportStatus; label: string }[] = [
  { status: 'active', label: 'Reported / Searching' },
  { status: 'matched', label: 'Possible Match' },
  { status: 'returned', label: 'Returned' },
  { status: 'closed', label: 'Closed' },
];

const FOUND_STAGES: { status: ReportStatus; label: string }[] = [
  { status: 'active', label: 'Logged / Searching Owner' },
  { status: 'matched', label: 'Possible Match' },
  { status: 'returned', label: 'Returned' },
  { status: 'closed', label: 'Closed' },
];

export const TrackItems: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUserReports = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const items = await dataService.getUserReports(user.id);
      setReports(items);
    } catch (err) {
      console.error('Error fetching user reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReports();
  }, [user]);

  const handleUpdateStatus = async (reportId: string, newStatus: ReportStatus) => {
    try {
      const updated = await dataService.updateReportStatus(reportId, newStatus);
      setReports(prev => prev.map(r => r.id === reportId ? updated : r));
      if (newStatus === 'returned') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        showToast('Item marked as successfully returned!', 'success');
      } else {
        showToast(`Status updated to ${newStatus}`, 'info');
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dataService.deleteReport(deleteId);
      setReports(prev => prev.filter(r => r.id !== deleteId));
      showToast('Report deleted successfully');
      setDeleteId(null);
    } catch (err) {
      showToast('Failed to delete report', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const getStageIndex = (status: ReportStatus, stages: typeof LOST_STAGES) => {
    if (status === 'pending_review') return 0;
    const idx = stages.findIndex(s => s.status === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Track My Items
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time status tracking for your lost declarations and found notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report/lost"
            className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors"
          >
            + Report Lost
          </Link>
          <Link
            to="/report/found"
            className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-900 transition-colors"
          >
            + Report Found
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving your reports..." />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={Package}
          title="You haven't reported any items yet"
          description="Submit a report for an item you mislaid, or log something you found on campus or in town."
          actionText="Report a Lost Item"
          onAction={() => window.location.href = '/report/lost'}
        />
      ) : (
        <div className="space-y-6">
          {reports.map((report) => {
            const stages = report.type === 'lost' ? LOST_STAGES : FOUND_STAGES;
            const currentStageIdx = getStageIndex(report.status, stages);

            return (
              <div
                key={report.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
              >
                {/* Top Report Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                      {report.image_url ? (
                        <img
                          src={report.image_url}
                          alt={report.item_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-neutral-400 m-auto mt-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TypeBadge type={report.type} size="sm" />
                        <span className="text-xs text-neutral-400 capitalize">
                          {report.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                        {report.item_name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {report.location} · {new Date(report.date_occurred).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <StatusBadge status={report.status} />
                    <Link
                      to={`/item/${report.id}`}
                      className="p-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-orange-600 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="View public page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(report.id)}
                      className="p-2 text-xs font-semibold text-neutral-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Tracker Bar */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4">
                    Reunification Progress Tracker
                  </h4>
                  <div className="relative">
                    {/* Connecting background line */}
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-neutral-200 dark:bg-neutral-800 -z-0" />
                    {/* Active completed line */}
                    <div
                      className="absolute top-4 left-4 h-0.5 bg-orange-600 transition-all duration-500 -z-0"
                      style={{
                        width: `${(currentStageIdx / (stages.length - 1)) * 95}%`,
                      }}
                    />

                    {/* Stage Steps */}
                    <div className="grid grid-cols-4 relative z-10">
                      {stages.map((stage, idx) => {
                        const isCompleted = idx < currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div key={stage.status} className="flex flex-col items-center text-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                isCurrent
                                  ? 'bg-orange-600 text-white ring-4 ring-orange-100 dark:ring-orange-950/60'
                                  : isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                              }`}
                            >
                              {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[11px] mt-2 font-medium max-w-[90px] leading-tight ${
                                isCurrent
                                  ? 'font-bold text-orange-600 dark:text-orange-400'
                                  : isCompleted
                                  ? 'text-neutral-700 dark:text-neutral-300'
                                  : 'text-neutral-400 dark:text-neutral-500'
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Status Controls for the Reporter */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-neutral-500">
                    Change status as progress occurs:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {report.status !== 'returned' && (
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'returned')}
                        className="px-3.5 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Returned</span>
                      </button>
                    )}
                    {report.status !== 'matched' && report.status !== 'returned' && (
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'matched')}
                        className="px-3 py-1.5 font-semibold text-purple-700 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors"
                      >
                        Mark Possible Match
                      </button>
                    )}
                    {report.status !== 'closed' && (
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'closed')}
                        className="px-3 py-1.5 font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors border border-neutral-200 dark:border-neutral-700"
                      >
                        Close Listing
                      </button>
                    )}
                    {report.status === 'closed' && (
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'active')}
                        className="px-3 py-1.5 font-semibold text-orange-600 hover:underline"
                      >
                        Re-open as Active
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Report"
        message="Are you sure you want to permanently delete this report? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
