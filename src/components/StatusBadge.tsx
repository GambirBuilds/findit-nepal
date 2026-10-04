import React from 'react';
import { ReportStatus, ReportType } from '../types/database';
import { CheckCircle2, Clock, Sparkles, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<ReportStatus, { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
    active: {
      label: 'Searching',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      text: 'text-blue-700 dark:text-blue-300',
      icon: Clock,
    },
    matched: {
      label: 'Possible Match',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900',
      text: 'text-purple-700 dark:text-purple-300',
      icon: Sparkles,
    },
    returned: {
      label: 'Reunited & Returned',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: CheckCircle2,
    },
    closed: {
      label: 'Closed',
      bg: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
      text: 'text-neutral-600 dark:text-neutral-400',
      icon: XCircle,
    },
    pending_review: {
      label: 'Pending Review',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      text: 'text-amber-700 dark:text-amber-300',
      icon: AlertCircle,
    },
  };

  const config = configs[status] || configs.active;
  const Icon = config.icon;
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${config.bg} ${config.text} ${pad}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

interface TypeBadgeProps {
  type: ReportType;
  size?: 'sm' | 'md';
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'md' }) => {
  const isLost = type === 'lost';
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center uppercase tracking-wider rounded-md border ${
        isLost
          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
      } ${pad}`}
    >
      {isLost ? 'Lost Item' : 'Found Item'}
    </span>
  );
};
