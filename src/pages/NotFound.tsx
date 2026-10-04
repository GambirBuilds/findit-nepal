import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
        <MapPinOff className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight font-mono mb-2">
        404
      </h1>
      <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-2">
        Page Not Found
      </h2>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-6 leading-relaxed">
        The page you are searching for might have been moved, removed, or has an invalid URL.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
};
