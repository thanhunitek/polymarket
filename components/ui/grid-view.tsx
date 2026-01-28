import React from 'react';

interface GridViewProps {
  children: React.ReactNode;
}

export function GridView({ children }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      {children}
    </div>
  );
}
