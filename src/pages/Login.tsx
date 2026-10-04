import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../lib/validation';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { MapPin, AlertCircle, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const Login: React.FC = () => {
  const { signIn, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/track';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await signIn(data.email, data.password);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        showToast('Signed in successfully', 'success');
        navigate(from, { replace: true });
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoUser = async () => {
    setLoading(true);
    await loginAsDemoUser();
    showToast('Signed in as standard user (Alex Rivera)');
    navigate(from, { replace: true });
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    await loginAsDemoAdmin();
    showToast('Signed in as Administrator (Sarah Chen)');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm">
            <MapPin className="w-6 h-6 fill-white stroke-orange-600" />
          </div>
          <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white font-sans">
            Find<span className="text-orange-600">It</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Sign in to track your items, view matches, and manage reports.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="alex@example.com"
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.email ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-orange-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.password ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            />
            {errors.password && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* 1-Click Demo Buttons for Reviewer Convenience */}
        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 text-center mb-2">
            Instant 1-Click Test Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoUser}
              className="py-2 px-3 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-orange-500 flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>Aayush (User)</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="py-2 px-3 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-orange-500 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>Sita (Admin)</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-neutral-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-orange-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};
