import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportFormSchema, ReportFormValues } from '../lib/validation';
import { dataService } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { ImageUploader } from '../components/ImageUploader';
import { CATEGORIES_LIST } from '../types/database';
import { AlertCircle, HelpCircle, ArrowLeft } from 'lucide-react';

export const ReportFound: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      item_name: '',
      category: '',
      description: '',
      location: '',
      date_occurred: todayStr,
      contact_email: user?.email || '',
      image_url: null,
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue('contact_email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: ReportFormValues) => {
    setSubmitting(true);
    try {
      const userId = user?.id || `usr-${Date.now()}`;

      await dataService.createReport({
        user_id: userId,
        type: 'found',
        item_name: data.item_name.trim(),
        category: data.category,
        description: data.description.trim(),
        location: data.location.trim(),
        date_occurred: data.date_occurred,
        contact_email: data.contact_email.trim(),
        image_url: photoUrl || data.image_url || null,
        status: 'active',
      });

      showToast('Found item reported successfully! We are searching for matching owners.', 'success');
      navigate('/track');
    } catch (err: any) {
      console.error('Error submitting found report:', err);
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Centered Form Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-10">
        {/* Header */}
        <div className="border-b border-neutral-100 dark:border-neutral-800 pb-6 mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            Found Item Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Report a Found Item
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 max-w-xl">
            Help reunite a misplaced item with its rightful owner. Describe what you discovered.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('item_name')}
              placeholder="e.g. Found Nagarikta, Bluebook, or Vehicle Keys"
              className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 border rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                errors.item_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            />
            {errors.item_name && (
              <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.item_name.message}</span>
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('category')}
              className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 border rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                errors.category ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            >
              <option value="">Select a category...</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.category.message}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Describe the found item — colour, condition, brand, where it was discovered or handed over..."
              className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 border rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors leading-relaxed ${
                errors.description ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            />
            <div className="flex items-center justify-between mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
                Provide clear details (you can withhold one confidential detail to verify the owner).
              </span>
              <span>Min 20 characters</span>
            </div>
            {errors.description && (
              <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.description.message}</span>
              </p>
            )}
          </div>

          {/* Two-column on desktop: Found Location & Date Found */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Found Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('location')}
                placeholder="e.g. Near New Road Gate, Ratna Park, or Pulchowk Campus"
                className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 border rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  errors.location ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                }`}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Ratna Park, Kathmandu', 'New Road, Kathmandu', 'Pulchowk Campus, Lalitpur', 'TIA Domestic Airport', 'Lakeside, Pokhara'].map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setValue('location', loc)}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    + {loc}
                  </button>
                ))}
              </div>
              {errors.location && (
                <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.location.message}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Date Found <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                max={todayStr}
                {...register('date_occurred')}
                className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 border rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  errors.date_occurred ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                }`}
              />
              {errors.date_occurred && (
                <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.date_occurred.message}</span>
                </p>
              )}
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Contact Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              {...register('contact_email')}
              placeholder="name@example.com"
              className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 border rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                errors.contact_email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Your email will only be contacted when a genuine owner reaches out with verification.
            </p>
            {errors.contact_email && (
              <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.contact_email.message}</span>
              </p>
            )}
          </div>

          {/* Photo Upload (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Photo of Found Item (Optional)
            </label>
            <ImageUploader
              value={photoUrl}
              onChange={(url) => setPhotoUrl(url)}
              disabled={submitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Found Report</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
