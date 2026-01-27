import React from 'react';

interface GridViewProps {
  children: React.ReactNode;
}

export function GridView({ children }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {children}
    </div>
  );
}
