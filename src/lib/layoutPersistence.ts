// src/lib/layoutPersistence.ts
const LAYOUT_KEY = 'rezstack-layout';

export interface LayoutConfig {
  panelSizes: number[];
  collapsedPanels: Record<string, boolean>;
}

export const layoutPersistence = {
  save: (config: LayoutConfig) => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(config));
  },
  
  load: (): LayoutConfig | null => {
    const saved = localStorage.getItem(LAYOUT_KEY);
    return saved ? JSON.parse(saved) : null;
  },
  
  reset: () => {
    localStorage.removeItem(LAYOUT_KEY);
    window.location.reload();
  }
};
