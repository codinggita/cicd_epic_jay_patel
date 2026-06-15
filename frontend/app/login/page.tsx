'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../../store/toastStore';
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().email('Please provide a valid email address'),
  password: zod.string().min(1, 'Password is required'),
});

type LoginFormInput = zod.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  const { useLoginMutation } = useAuth();
  const loginMutation = useLoginMutation();
  const addToast = useToastStore((state) => state.addToast);

  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      await loginMutation.mutateAsync({ email: data.email, password: data.password });
      addToast('Login successful! Welcome back.', 'success');
      router.push(redirectPath);
    } catch (err: any) {
      addToast(err.message || 'Invalid email or password credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10 glass p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20">
            AG
          </Link>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign in to your account</h2>
          <p className="text-xs text-slate-400">
            Access templates repositories, execute dry runs, and write reviews.
          </p>
        </div>

        {/* Input Forms */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email input field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-350 block">Email Address</label>
            <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-indigo-500/60 rounded-xl px-3 text-slate-400">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <input
                type="email"
                placeholder="developer@company.com"
                {...register('email')}
                className="w-full bg-transparent text-sm py-3 px-2 text-white focus:outline-none placeholder-slate-655"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password input field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-350 block">Password</label>
            </div>
            <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-indigo-500/60 rounded-xl px-3 text-slate-400">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className="w-full bg-transparent text-sm py-3 px-2 text-white focus:outline-none placeholder-slate-655"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-500 hover:text-slate-300 pointer-events-auto cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
          >
            {loginMutation.isPending ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Redirect sign up footer */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-900 pt-4 flex justify-between">
          <span>New to the platform?</span>
          <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading authentication modules...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
