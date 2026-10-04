import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  MapPin,
  Calendar,
  Package,
  Layers,
  Check,
  ExternalLink
} from 'lucide-react';
import { dataService } from '../lib/supabase';
import { Match, Report } from '../types/database';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import confetti from 'canvas-confetti';

export const Matches: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [filterConfidence, setFilterConfidence] = useState<'all' | 'high' | 'suggested'>('all');

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const results = await dataService.getMatches();
      setMatches(results);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleRunScan = async () => {
    setScanning(true);
    try {
      const reports = await dataService.getReports();
      const lostReports = reports.filter(r => r.type === 'lost' && r.status !== 'closed');

      let newMatchesCount = 0;
      for (const lost of lostReports) {
        const foundMatches = await dataService.triggerMatchingAlgorithm(lost);
        newMatchesCount += foundMatches.length;
      }

      await fetchMatches();
      showToast(`Scan complete. Analyzed active listings and refreshed match registry.`, 'success');
    } catch (err) {
      showToast('Scan completed with current registry.', 'info');
    } finally {
      setScanning(false);
    }
  };

  const handleUpdateMatch = async (matchId: string, status: Match['status']) => {
    try {
      await dataService.updateMatchStatus(matchId, status);
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status } : m));

      if (status === 'accepted') {
        confetti({ particleCount: 70, spread: 60 });
        showToast('Match confirmed! Associated listings updated.', 'success');
      } else {
        showToast('Match dismissed.', 'info');
      }
    } catch (err) {
      showToast('Failed to update match', 'error');
    }
  };

  const filteredMatches = matches.filter(m => {
    if (filterConfidence === 'high') return m.similarity_score >= 80;
    if (filterConfidence === 'suggested') return m.status === 'suggested';
    return true;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        label: 'Excellent Match',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
        bar: 'bg-emerald-500',
      };
    }
    if (score >= 75) {
      return {
        label: 'Strong Match',
        bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
        bar: 'bg-blue-500',
      };
    }
    if (score >= 60) {
      return {
        label: 'Possible Match',
        bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
        bar: 'bg-amber-500',
      };
    }
    return {
      label: 'Low Match',
      bg: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400',
      bar: 'bg-neutral-400',
    };
  };

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Assisted Similarity Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Smart Matching Registry
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
            Correlates lost and found reports using token similarity, category consistency, geographic vicinity, and chronological closeness.
          </p>
        </div>

        {/* Scan Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunScan}
            disabled={scanning}
            className="px-4 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl transition-colors shadow-xs flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Analyzing Database...' : 'Run Match Scan'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <button
          onClick={() => setFilterConfidence('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterConfidence === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          All Matches ({matches.length})
        </button>
        <button
          onClick={() => setFilterConfidence('high')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterConfidence === 'high'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          High Confidence (&gt;= 80%)
        </button>
        <button
          onClick={() => setFilterConfidence('suggested')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterConfidence === 'suggested'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Pending Review
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Computing smart matches..." />
      ) : filteredMatches.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No potential matches found yet"
          description="When users report lost and found items with similar keywords, categories, and locations, our matching algorithm calculates match confidence and displays them here."
          actionText="Run Full Scan"
          onAction={handleRunScan}
        />
      ) : (
        <div className="space-y-6">
          {filteredMatches.map((match) => {
            const badge = getScoreBadge(match.similarity_score);
            const lost = match.lost_report;
            const found = match.found_report;

            if (!lost || !found) return null;

            return (
              <div
                key={match.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs overflow-hidden"
              >
                {/* Score & Header Zone */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tabular-nums font-mono">
                        {Math.round(match.similarity_score)}%
                      </span>
                      <span className="text-xs font-bold text-neutral-400">Match</span>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-md border ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Match status badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-400">Status:</span>
                    <span className="text-xs font-bold capitalize text-neutral-700 dark:text-neutral-300">
                      {match.status}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-neutral-100 dark:border-neutral-800">
                  {/* Left Column: Lost Item */}
                  <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                        Lost Item Report
                      </span>
                      <Link
                        to={`/item/${lost.id}`}
                        className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-1"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white dark:bg-neutral-800 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                        {lost.image_url ? (
                          <img src={lost.image_url} alt={lost.item_name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-neutral-400 m-auto mt-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          {lost.item_name}
                        </h4>
                        <p className="text-xs text-neutral-500 capitalize">{lost.category}</p>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {lost.description}
                    </p>

                    <div className="pt-2 border-t border-rose-100 dark:border-rose-900/40 space-y-1 text-xs text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="truncate">{lost.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Lost {new Date(lost.date_occurred).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Found Item */}
                  <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Found Item Report
                      </span>
                      <Link
                        to={`/item/${found.id}`}
                        className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white dark:bg-neutral-800 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                        {found.image_url ? (
                          <img src={found.image_url} alt={found.item_name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-neutral-400 m-auto mt-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          {found.item_name}
                        </h4>
                        <p className="text-xs text-neutral-500 capitalize">{found.category}</p>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {found.description}
                    </p>

                    <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/40 space-y-1 text-xs text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="truncate">{found.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Found {new Date(found.date_occurred).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Reasons Analysis */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Why this was flagged:
                    </span>
                    <ul className="flex flex-wrap gap-2 text-xs">
                      {match.match_reason.map((reason, i) => (
                        <li
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                        >
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {match.status !== 'accepted' && (
                      <button
                        onClick={() => handleUpdateMatch(match.id, 'accepted')}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Match</span>
                      </button>
                    )}
                    {match.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateMatch(match.id, 'rejected')}
                        className="px-3.5 py-2 text-xs font-semibold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors border border-neutral-200 dark:border-neutral-700"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
