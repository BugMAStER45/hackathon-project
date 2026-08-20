import React from 'react';

function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function MetricBannerSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <SkeletonBlock className="h-3 w-24 mb-2" />
          <SkeletonBlock className="h-5 w-32 mb-1" />
          <SkeletonBlock className="h-2.5 w-20" />
        </div>
      ))}
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="w-full h-[600px] lg:h-[680px] rounded-2xl skeleton" />
  );
}

export function CardSkeleton({ rows = 3 }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <SkeletonBlock className="h-6 w-48" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-slide">
      <MetricBannerSkeleton />
      <MapSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CardSkeleton rows={4} />
        <CardSkeleton rows={4} />
      </div>
    </div>
  );
}
