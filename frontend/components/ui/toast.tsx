'use client';

import React from 'react';
import { useToastStore, Toast } from '../../store/toastStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function Toaster() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { type, message } = toast;

  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-300',
    error: 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-300',
    info: 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-800 dark:text-indigo-300',
    warning: 'bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-300',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  return (
    <div
      className={`pointer-events-auto border-l-4 p-4 rounded-r-lg shadow-lg flex items-start gap-3 justify-between animate-slide-up ${styles[type]}`}
      role="alert"
    >
      <div className="flex gap-2.5">
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <p className="text-sm font-medium leading-5">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-black/5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
