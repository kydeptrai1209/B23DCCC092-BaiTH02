import React from 'react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div data-testid="loading-state" className="space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-3 w-full sm:w-2/3">
            <div className="h-4 w-28 bg-white/10 rounded-full" />
            <div className="h-10 w-48 bg-white/15 rounded-xl" />
            <div className="h-4 w-36 bg-white/10 rounded-full" />
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white/15" />
        </div>

        <div className="mt-8 flex items-baseline gap-4">
          <div className="h-16 w-32 bg-white/20 rounded-2xl" />
          <div className="h-6 w-24 bg-white/10 rounded-full" />
        </div>

        {/* Detailed Metrics Grid Skeleton */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-3 rounded-2xl bg-white/5 space-y-2">
              <div className="h-3 w-16 bg-white/10 rounded-full" />
              <div className="h-6 w-20 bg-white/15 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* 7-day Forecast Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-44 bg-white/15 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-white/10 rounded-full" />
                <div className="h-4 w-10 bg-white/10 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-white/15" />
                <div className="h-5 w-16 bg-white/20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
