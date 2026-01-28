'use client';

import React, { useState } from 'react';
import { TeamStats } from '@/types';
import { Modal } from '@/components/ui/modal';
import { MatchHistoryTable } from './match-history-table';
import { TeamHistoryChart } from './team-history-chart';
import { normalizeToDisplay } from '@/lib/team-name-normalizer';

interface TeamHistoryModalProps {
  team: TeamStats | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TeamHistoryModal({ team, isOpen, onClose }: TeamHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'matches'>('overview');

  if (!team) return null;

  const displayName = normalizeToDisplay(team.teamName);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${displayName} - Match History`}>
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-150 border-b-2 ${
              activeTab === 'overview' ? '' : 'border-transparent'
            }`}
            style={{
              borderColor: activeTab === 'overview' ? 'var(--brand-primary)' : 'transparent',
              color: activeTab === 'overview' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-150 border-b-2 ${
              activeTab === 'matches' ? '' : 'border-transparent'
            }`}
            style={{
              borderColor: activeTab === 'matches' ? 'var(--brand-primary)' : 'transparent',
              color: activeTab === 'matches' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            }}
          >
            All Matches ({team.matchesPlayed})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <TeamHistoryChart matches={team.allMatches} />
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Recent Matches (Last 10)
              </h4>
              <MatchHistoryTable matches={team.allMatches.slice(0, 10)} teamName={team.teamName} />
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
            <MatchHistoryTable matches={team.allMatches} teamName={team.teamName} />
          </div>
        )}
      </div>
    </Modal>
  );
}
