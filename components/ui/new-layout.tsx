'use client';

import React, { useState } from 'react';
import { Header } from './header';

interface LayoutProps {
  children: React.ReactNode;
}

export function NewLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile, visible on larger screens */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r border-zinc-200 dark:border-zinc-800">
          <div className="p-4">
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
                <span>Markets</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md">
                <span>Portfolio</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md">
                <span>Activity</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md">
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <aside className="md:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-zinc-200 dark:border-zinc-800">
            <div className="p-4">
              <nav className="space-y-1">
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
                  <span>Markets</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md">
                  <span>Portfolio</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md">
                  <span>Activity</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md">
                  <span>Settings</span>
                </a>
              </nav>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}