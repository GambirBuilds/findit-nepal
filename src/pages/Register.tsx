import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '../lib/validation';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { MapPin, AlertCircle, ArrowRight, Check } from 'lucide-react';

export const Register: React.FC = () => {
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await signUp(data.full_name, data.email, data.password);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        showToast('Account created successfully! Welcome to FindIt.', 'success');
        navigate('/track');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
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
          Create an account
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Join FindIt to report items, receive match alerts, and reunite belongings.
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
              Full Name
            </label>
            <input
              type="text"
              {...register('full_name')}
              placeholder="e.g. Jordan Miller"
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.full_name ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            />
            {errors.full_name && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="jordan@example.com"
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.email ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              placeholder="Minimum 6 characters"
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.password ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            />
            {errors.password && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="Re-enter password"
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.confirmPassword ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.confirmPassword.message}</p>
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
              <span>Create Account</span>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-neutral-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-orange-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};
