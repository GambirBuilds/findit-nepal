import React from 'react';
import { Link } from 'react-router-dom';
import { Report } from '../types/database';
import { StatusBadge, TypeBadge } from './StatusBadge';
import { MapPin, Calendar, ArrowRight, Package } from 'lucide-react';

interface ItemCardProps {
  report: Report;
}

export const ItemCard: React.FC<ItemCardProps> = ({ report }) => {
  const formattedDate = new Date(report.date_occurred).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/item/${report.id}`}
      className="group flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
    >
      {/* Top Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800/80">
        {report.image_url ? (
          <img
            src={report.image_url}
            alt={report.item_name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-850">
            <Package className="w-10 h-10 mb-1.5 opacity-60" />
            <span className="text-xs font-medium">No photo provided</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <TypeBadge type={report.type} size="sm" />
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={report.status} size="sm" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
          <span className="capitalize">{report.category.replace('_', ' ')}</span>
          <span aria-hidden="true">·</span>
          <span>{report.type === 'lost' ? 'Reported Lost' : 'Reported Found'}</span>
        </div>

        {/* Item Title */}
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1 mb-2">
          {report.item_name}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {report.description}
        </p>

        {/* Location & Date Details */}
        <div className="space-y-1.5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
            <span className="truncate">{report.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              <span>{formattedDate}</span>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-orange-600 dark:text-orange-400 group-hover:translate-x-0.5 transition-transform">
              View <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
