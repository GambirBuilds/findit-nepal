import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, PackageSearch, MapPin } from 'lucide-react';
import { dataService } from '../lib/supabase';
import { Report, ReportFilters, CATEGORIES_LIST } from '../types/database';
import { NEPAL_PROVINCES } from '../lib/nepalData';
import { useLanguage } from '../hooks/useLanguage';
import { ItemCard } from '../components/ItemCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const Browse: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>(
    (searchParams.get('type') as any) || 'all'
  );
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'relevant'>('newest');

  // Load reports
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const filters: ReportFilters = {
          searchQuery,
          type: typeFilter,
          category: categoryFilter,
          location: locationQuery,
          status: statusFilter,
          sortBy,
        };
        const results = await dataService.getReports(filters);
        setReports(results);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [searchQuery, typeFilter, categoryFilter, statusFilter, locationQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
    setLocationQuery('');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all' ||
    locationQuery;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[80vh]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Browse Lost &amp; Found Items
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
            Search active notices, filter by category or proximity, and locate missing belongings.
          </p>
        </div>

        {/* Live Counter */}
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl w-max tabular-nums">
          Showing <span className="text-neutral-900 dark:text-white font-bold">{reports.length}</span> items
        </div>
      </div>

      {/* Control Panel: Search & Segmented Filter Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        {/* Top Row: Search Input + Type Selector Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-7 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by name, description, brand, or location..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Interactive Filter Tabs (Button segmented control per constitution) */}
          <div className="lg:col-span-5 flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              All Items
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('lost')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'lost'
                  ? 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-rose-600'
              }`}
            >
              Lost Only
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('found')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'found'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-emerald-600'
              }`}
            >
              Found Only
            </button>
          </div>
        </div>

        {/* Bottom Row: Detailed Dropdowns & Reset */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Searching / Active</option>
              <option value="matched">Possible Match</option>
              <option value="returned">Reunited / Returned</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Location / Province Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              {t.provinceFilter}
            </label>
            <select
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">{t.allProvinces}</option>
              {NEPAL_PROVINCES.map((p) => (
                <option key={p.id} value={p.nameEn}>
                  {language === 'ne' ? p.nameNe : p.nameEn}
                </option>
              ))}
              <option value="Kathmandu">Kathmandu (काठमाडौँ)</option>
              <option value="Lalitpur">Lalitpur / Patan (ललितपुर)</option>
              <option value="Pokhara">Pokhara (पोखरा)</option>
              <option value="Chitwan">Chitwan (चितवन)</option>
              <option value="Biratnagar">Biratnagar (विराटनगर)</option>
              <option value="Butwal">Butwal (बुटवल)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-neutral-500">Filters applied</span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Grid of Results */}
      {loading ? (
        <LoadingSpinner text="Searching listings..." />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No items match your search"
          description="Try broadening your keywords, changing categories, or clearing active filters to see all available reports."
          actionText="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.map((report) => (
            <ItemCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
};
