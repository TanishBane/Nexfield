import { create } from 'zustand';

interface FarmState {
  selectedFarmId: string;
  selectedFieldId: string | null;
  isSidebarOpen: boolean;
  isFarmProfileOpen: boolean;
  lastRefreshedAt: string;
  activeFieldFilter: string | null;
  activeSeasonFilter: string | null;
  dismissedAlertIds: string[];

  setSelectedFarmId: (farmId: string) => void;
  setSelectedFieldId: (fieldId: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsFarmProfileOpen: (open: boolean) => void;
  setLastRefreshedAt: (timestamp: string) => void;
  setActiveFieldFilter: (fieldId: string | null) => void;
  setActiveSeasonFilter: (season: string | null) => void;
  dismissAlert: (alertId: string) => void;
}

export const useFarmStore = create<FarmState>((set) => ({
  selectedFarmId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // GreenValley Bio-Research Agrohub default
  selectedFieldId: 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c', // North Sector Alpha default
  isSidebarOpen: true,
  isFarmProfileOpen: false,
  lastRefreshedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  activeFieldFilter: null,
  activeSeasonFilter: null,
  dismissedAlertIds: [],

  setSelectedFarmId: (farmId: string) => set({ selectedFarmId: farmId }),
  setSelectedFieldId: (fieldId: string | null) => set({ selectedFieldId: fieldId }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  setIsFarmProfileOpen: (isFarmProfileOpen) => set({ isFarmProfileOpen }),
  setLastRefreshedAt: (lastRefreshedAt) => set({ lastRefreshedAt }),
  setActiveFieldFilter: (activeFieldFilter) => set({ activeFieldFilter }),
  setActiveSeasonFilter: (activeSeasonFilter) => set({ activeSeasonFilter }),
  dismissAlert: (alertId: string) =>
    set((state) => ({ dismissedAlertIds: [...state.dismissedAlertIds, alertId] })),
}));
