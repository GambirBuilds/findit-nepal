import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Mail,
  Shield,
  AlertTriangle,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sparkles,
  Package,
  Send,
  Flag,
  UserCheck
} from 'lucide-react';
import { dataService } from '../lib/supabase';
import { Report, Match } from '../types/database';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { calculateSimilarity } from '../lib/matching';
import confetti from 'canvas-confetti';

export const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [possibleMatches, setPossibleMatches] = useState<Report[]>([]);

  // Contact modal state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sendingContact, setSendingContact] = useState(false);

  // Report issue modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      setLoading(true);
      try {
        const item = await dataService.getReportById(id);
        setReport(item);

        if (item) {
          // Find potential matches in opposite pool
          const oppositeType = item.type === 'lost' ? 'found' : 'lost';
          const allReports = await dataService.getReports({ type: oppositeType });
          const matches = allReports
            .map(candidate => ({
              report: candidate,
              match: calculateSimilarity(item, candidate)
            }))
            .filter(res => res.match.score >= 50)
            .sort((a, b) => b.match.score - a.match.score)
            .slice(0, 3)
            .map(res => res.report);

          setPossibleMatches(matches);
        }
      } catch (err) {
        console.error('Error loading item:', err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `FindIt: ${report?.item_name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    setSendingContact(true);
    try {
      // Create notification to report owner
      if (report) {
        await dataService.createNotification({
          user_id: report.user_id,
          title: `Inquiry regarding "${report.item_name}"`,
          message: `${user?.full_name || 'A community member'} sent: "${contactMessage.trim()}"`,
          type: 'system',
          link_url: `/item/${report.id}`
        });
      }

      showToast('Inquiry sent safely to the report owner!', 'success');
      setContactModalOpen(false);
      setContactMessage('');
    } catch (err) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSendingContact(false);
    }
  };

  const handleFlagReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    try {
      await dataService.updateReportStatus(report.id, 'pending_review');
      showToast('Report flagged for administrative review.', 'info');
      setReportModalOpen(false);
      setReport({ ...report, status: 'pending_review' });
    } catch (err) {
      showToast('Failed to flag report', 'error');
    }
  };

  const handleMarkReturned = async () => {
    if (!report) return;
    try {
      const updated = await dataService.updateReportStatus(report.id, 'returned');
      setReport(updated);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      showToast('Congratulations! Marked as safely returned.', 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading item details..." />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs">
        <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Item Not Found</h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          The listing may have been removed or marked as resolved.
        </p>
        <Link
          to="/browse"
          className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-orange-600 rounded-xl"
        >
          Return to Browse
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === report.user_id;
  const formattedOccurred = new Date(report.date_occurred).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedPosted = new Date(report.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[85vh]">
      {/* Back button & Action pills */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-orange-600 transition-colors"
            title="Share listing"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {!isOwner && (
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-rose-600 transition-colors"
              title="Report inappropriate listing"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Large Image & Badges */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-[4/3] shadow-xs flex items-center justify-center">
            {report.image_url ? (
              <img
                src={report.image_url}
                alt={report.item_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-neutral-400">
                <Package className="w-16 h-16 mb-2 opacity-40" />
                <p className="text-xs font-medium">No photograph attached by reporter</p>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <TypeBadge type={report.type} />
            </div>
            <div className="absolute top-4 right-4">
              <StatusBadge status={report.status} />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-3 text-xs text-neutral-600 dark:text-neutral-400">
            <Shield className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-800 dark:text-neutral-200">
                Privacy Protection Active:
              </span>{' '}
              Reporter email and exact contact numbers are securely masked. Inquiries are routed through FindIt's verified notification relay.
            </div>
          </div>
        </div>

        {/* Right Column: Details, Timeline, Contact CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            {/* Category / Type breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-2 uppercase tracking-wider">
              <span>{report.category.replace('_', ' ')}</span>
              <span>·</span>
              <span>{report.type === 'lost' ? 'Lost Item' : 'Found Item'}</span>
            </div>

            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
              {report.item_name}
            </h1>

            {/* Description */}
            <div className="space-y-1 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Detailed Description
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {report.description}
              </p>
            </div>

            {/* Key Metadata Table */}
            <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="text-neutral-500 flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" /> Location
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-right">
                  {report.location}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-neutral-500 flex items-center gap-1.5 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" /> Date {report.type === 'lost' ? 'Lost' : 'Found'}
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-right">
                  {formattedOccurred}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-neutral-500 flex items-center gap-1.5 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" /> Reported Date
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-right tabular-nums">
                  {formattedPosted}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
              {isOwner ? (
                <div className="space-y-2">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-xl text-xs text-orange-800 dark:text-orange-300 font-medium">
                    This is your listing. You can update its status or mark it as returned.
                  </div>
                  {report.status !== 'returned' && (
                    <button
                      onClick={handleMarkReturned}
                      className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Return / Reunited</span>
                    </button>
                  )}
                  <Link
                    to="/track"
                    className="block w-full py-2.5 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors border border-neutral-300 dark:border-neutral-700"
                  >
                    View in Track My Item
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="w-full py-3.5 px-4 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>
                      {report.type === 'found' ? 'I Think This Is My Item' : 'I Found This Item (Contact)'}
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-neutral-400">
                    Safe direct inquiry via FindIt relay
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Potential Matches Section */}
      {possibleMatches.length > 0 && (
        <div className="mt-14 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Potential Matching Reports
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {possibleMatches.map(item => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-orange-500 transition-all flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 m-auto text-neutral-400 mt-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <span className="capitalize">{item.category}</span>
                    <span>·</span>
                    <span className={item.type === 'lost' ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-orange-600 transition-colors">
                    {item.item_name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                    {item.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Safe Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden p-6 sm:p-8">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Contact Reporter Privately
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              Regarding listing: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{report.item_name}</span>
            </p>

            <form onSubmit={handleSendContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Your Message &amp; Identifying Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Provide proof of ownership, such as a serial number, distinct marks, or safe meeting point location..."
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingContact || !contactMessage.trim()}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {sendingContact ? 'Sending...' : 'Send Inquiry'} <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flag Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Flag Listing for Review
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Our moderation team reviews listings reported for suspicious or inappropriate content.
            </p>
            <form onSubmit={handleFlagReport} className="space-y-4">
              <textarea
                rows={3}
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for flag (e.g. incorrect information, spam, duplicate)..."
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700"
                >
                  Submit Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
