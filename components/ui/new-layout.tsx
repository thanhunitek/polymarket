'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Header } from './header';

interface LayoutProps {
  children: React.ReactNode;
}

export function NewLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--background-primary)' }}>
      <Header />
      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile, visible on larger screens */}
        <aside
          className="hidden md:block w-64 border-r"
          style={{ background: 'var(--background-secondary)', borderColor: 'var(--border-default)' }}
        >
          <div className="p-4">
            <nav className="space-y-1">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150"
                style={{
                  background: isActive('/') ? 'var(--background-tertiary)' : 'transparent',
                  color: isActive('/') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/')) {
                    e.currentTarget.style.background = 'var(--background-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span>Markets</span>
              </Link>
              <Link
                href="/teams"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150"
                style={{
                  background: isActive('/teams') ? 'var(--background-tertiary)' : 'transparent',
                  color: isActive('/teams') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/teams')) {
                    e.currentTarget.style.background = 'var(--background-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/teams')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span>Team Stats</span>
              </Link>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--background-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span>Portfolio</span>
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--background-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span>Activity</span>
              </a>
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <aside
            className="md:hidden fixed inset-y-0 left-0 z-30 w-64 border-r"
            style={{ background: 'var(--background-secondary)', borderColor: 'var(--border-default)' }}
          >
            <div className="p-4">
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  style={{
                    background: isActive('/') ? 'var(--background-tertiary)' : 'transparent',
                    color: isActive('/') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span>Markets</span>
                </Link>
                <Link
                  href="/teams"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  style={{
                    background: isActive('/teams') ? 'var(--background-tertiary)' : 'transparent',
                    color: isActive('/teams') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span>Team Stats</span>
                </Link>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span>Portfolio</span>
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span>Activity</span>
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
