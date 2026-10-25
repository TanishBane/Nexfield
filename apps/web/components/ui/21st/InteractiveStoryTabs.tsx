"use client";

import React from "react";

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
  className = "",
}: InteractiveStoryTabsProps) {
  return (
    <nav
      role="tablist"
      aria-label="Story Chapters"
      className={`flex items-center gap-2 p-1.5 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] overflow-x-auto select-none ${className}`}
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
                ? "bg-[#F7FAF2] text-[#09251A] border border-emerald-500/40 shadow-lg shadow-black/40"
                : "text-[#46604D] hover:text-[#09251A] hover:bg-[#F7FAF2]"
            }`}
          >
            <span className="font-mono text-xs text-[#815414]">
              {tab.chapter}
            </span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#F7FAF2] text-emerald-700 border border-emerald-500/30">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
