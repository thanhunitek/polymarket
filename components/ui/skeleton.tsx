import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-12">
        <div className="h-12 rounded w-3/4 mx-auto mb-4" style={{ background: 'var(--background-tertiary)' }}></div>
        <div className="h-6 rounded w-1/2 mx-auto" style={{ background: 'var(--background-tertiary)' }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-4"
            style={{
              background: 'var(--background-secondary)',
              borderColor: 'var(--border-default)'
            }}
          >
            <div className="h-6 rounded w-3/4 mb-4" style={{ background: 'var(--background-tertiary)' }}></div>
            <div className="h-4 rounded w-1/2 mb-6" style={{ background: 'var(--background-tertiary)' }}></div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                className="text-center p-3 rounded-lg border"
                style={{
                  background: 'var(--background-tertiary)',
                  borderColor: 'var(--market-over)'
                }}
              >
                <div className="h-4 rounded w-16 mb-2 mx-auto" style={{ background: 'var(--background-hover)' }}></div>
                <div className="h-6 rounded w-12 mx-auto" style={{ background: 'var(--background-hover)' }}></div>
              </div>
              <div
                className="text-center p-3 rounded-lg border"
                style={{
                  background: 'var(--background-tertiary)',
                  borderColor: 'var(--market-under)'
                }}
              >
                <div className="h-4 rounded w-16 mb-2 mx-auto" style={{ background: 'var(--background-hover)' }}></div>
                <div className="h-6 rounded w-12 mx-auto" style={{ background: 'var(--background-hover)' }}></div>
              </div>
            </div>
            <div className="h-4 rounded w-full mb-2" style={{ background: 'var(--background-tertiary)' }}></div>
            <div className="h-4 rounded w-5/6" style={{ background: 'var(--background-tertiary)' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
