'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../../store/toastStore';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const registerSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters long'),
  email: zod.string().email('Please provide a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters long'),
});

type RegisterFormInput = zod.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  
  const { useRegisterMutation } = useAuth();
  const registerMutation = useRegisterMutation();
  const addToast = useToastStore((state) => state.addToast);

  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      await registerMutation.mutateAsync({ name: data.name, email: data.email, password: data.password });
      addToast('Registration successful! Welcome to the platform.', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      addToast(err.message || 'Registration failed. Email might already be taken.', 'error');
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
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create your account</h2>
          <p className="text-xs text-slate-400">
            Join thousands of developers sharing DevOps pipeline guides.
          </p>
        </div>

        {/* Input Forms */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Name input field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-355 block">Full Name</label>
            <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-indigo-500/60 rounded-xl px-3 text-slate-400">
              <User className="w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Jane DevOps"
                {...register('name')}
                className="w-full bg-transparent text-sm py-3 px-2 text-white focus:outline-none placeholder-slate-655"
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email input field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-355 block">Email Address</label>
            <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-indigo-500/60 rounded-xl px-3 text-slate-400">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <input
                type="email"
                placeholder="jane@company.com"
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
            <label className="text-xs font-semibold text-slate-355 block">Password</label>
            <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-indigo-500/60 rounded-xl px-3 text-slate-400">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Redirect sign in footer */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-900 pt-4 flex justify-between">
          <span>Already have an account?</span>
          <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
