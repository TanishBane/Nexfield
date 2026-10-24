'use client';

import React from 'react';

export interface StoryTabItem {
  id: string;
  label: string;
  chapter: string;
  badge?: string;
}

interface InteractiveStoryTabsProps {
  tabs: StoryTabItem[];
  activeTab: string;
  onSelect: (tabId: string) => void;
  className?: string;
}

export function InteractiveStoryTabs({
  tabs,
  activeTab,
  onSelect,
  className = '',
}: InteractiveStoryTabsProps) {
  return (
    <nav
      role="tablist"
      aria-label="Story Chapters"
      className={`flex items-center gap-2 p-1.5 rounded-2xl bg-[#090D0B] border border-[#1E2E25] overflow-x-auto select-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 ${
              isActive
                ? 'bg-[#16231C] text-[#FAF8F2] border border-emerald-500/40 shadow-lg shadow-black/40'
                : 'text-[#9BB1A4] hover:text-[#FAF8F2] hover:bg-[#111714]'
            }`}
          >
            <span className="font-mono text-xs text-[#C2A06A]">{tab.chapter}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#101713] text-emerald-300 border border-emerald-500/30">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
