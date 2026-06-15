import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 dark:bg-slate-800 ${className}`}
      {...props}
    />
  );
}

export function WorkflowCardSkeleton() {
  return (
    <div className="glass rounded-xl p-5 flex flex-col gap-4 border border-slate-100 dark:border-slate-800/80">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-16 w-full" />
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
