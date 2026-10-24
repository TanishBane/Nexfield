'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  ScanEye,
  Layers,
  Sparkles,
  ClipboardList,
  TrendingUp,
  UploadCloud,
  Settings,
  MapPin,
  ExternalLink,
  Command,
  ArrowRight,
  X,
} from 'lucide-react';
import { cn } from '@nexfield/ui';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Farms' | 'Help';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  shortcut?: string;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    // Navigation
    {
      id: 'nav-control',
      category: 'Navigation',
      title: 'Farm Overview & Command Center',
      subtitle: 'Primary telemetry HUD, today priorities and weather',
      icon: LayoutDashboard,
      href: '/control',
      shortcut: 'G O',
    },
    {
      id: 'nav-fieldsight',
      category: 'Navigation',
      title: 'FieldSight AI Crop Inspection',
      subtitle: 'Foliar pathology, lesion Grad-CAM and disease diagnosis',
      icon: ScanEye,
      href: '/fieldsight',
      shortcut: 'G C',
    },
    {
      id: 'nav-twin',
      category: 'Navigation',
      title: 'Digital Twin 3D Simulator',
      subtitle: 'Biophysical rootzone moisture & scenario comparisons',
      icon: Layers,
      href: '/twin',
      shortcut: 'G T',
    },
    {
      id: 'nav-intelligence',
      category: 'Navigation',
      title: 'Agronomic Copilot & Insights',
      subtitle: 'Contextual AI assistance and agronomic advice',
      icon: Sparkles,
      href: '/intelligence',
      shortcut: 'G I',
    },
    {
      id: 'nav-ops',
      category: 'Navigation',
      title: 'Operations & Food Quality',
      subtitle: 'Field work orders, input ledger and harvest inspection',
      icon: ClipboardList,
      href: '/ops',
      shortcut: 'G W',
    },
    {
      id: 'nav-markets',
      category: 'Navigation',
      title: 'APMC Market Intelligence & Arbitrage',
      subtitle: 'Mandi price spreads, freight deduction and net realization',
      icon: TrendingUp,
      href: '/markets',
      shortcut: 'G M',
    },
    {
      id: 'nav-data',
      category: 'Navigation',
      title: 'Data Center & Upload',
      subtitle: 'Import soil tests, IoT sensor logs and field boundaries',
      icon: UploadCloud,
      href: '/data-center',
    },
    // Farms
    {
      id: 'farm-nashik',
      category: 'Farms',
      title: 'Nashik Tomato Precision Estate',
      subtitle: '2.4 ha · Hybrid Indeterminate Tomato · Sector 2-B',
      icon: MapPin,
      href: '/demo/control',
    },
    {
      id: 'farm-punjab',
      category: 'Farms',
      title: 'Ludhiana Wheat Agro-Hub',
      subtitle: '4.8 ha · PBW-550 Wheat · Sown Nov 2025',
      icon: MapPin,
      href: '/demo/control',
    },
    // Actions
    {
      id: 'action-demo',
      category: 'Actions',
      title: 'Launch Guided Interactive Demo Tour',
      subtitle: '8-step curated walkthrough for evaluators and judges',
      icon: ExternalLink,
      href: '/demo',
      shortcut: 'D T',
    },
    {
      id: 'action-upload',
      category: 'Actions',
      title: 'Upload Foliar Scan for AI Analysis',
      subtitle: 'Quickly analyze leaf image for fungal pathogens',
      icon: ScanEye,
      href: '/fieldsight',
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // open will be handled by parent
        }
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          if (selected.href) {
            router.push(selected.href);
          } else if (selected.action) {
            selected.action();
          }
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredItems, selectedIndex, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette Modal */}
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#111714] border border-[#273C30] shadow-2xl overflow-hidden ring-1 ring-emerald-500/20 z-10"
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1F2E25] bg-[#0E1411]">
          <Search className="w-5 h-5 text-[#9BB1A4] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, farm, or screen name..."
            className="w-full bg-transparent text-[#F0F5F2] placeholder-[#63796E] text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#63796E] hover:text-[#F0F5F2] hover:bg-[#1B2620] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[#16201B]">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#63796E]">
              <p className="text-sm">No matches found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1 text-[#4E6157]">Try searching for &ldquo;control&rdquo;, &ldquo;fieldsight&rdquo;, or &ldquo;demo&rdquo;</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.href) router.push(item.href);
                    else if (item.action) item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors',
                    isSelected
                      ? 'bg-[#18261F] text-[#F0F5F2] border border-emerald-500/30'
                      : 'text-[#9BB1A4] hover:bg-[#141E19] border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                        isSelected ? 'bg-emerald-950/80 text-emerald-400' : 'bg-[#16201B] text-[#63796E]'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-[#F0F5F2] truncate">{item.title}</span>
                        <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-[#1B2620] text-[#63796E]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#63796E] truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#16201B] text-[#63796E] border border-[#273C30]">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={cn('w-3.5 h-3.5', isSelected ? 'text-emerald-400' : 'opacity-0')} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#1F2E25] bg-[#0B100E] text-[11px] text-[#63796E] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Command className="w-3 h-3" />
            <span>NEXFIELD FastNav</span>
          </div>
        </div>
      </div>
    </div>
  );
}
