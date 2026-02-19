export const agents = [
  { id: 'sovereign', name: 'Sovereign AI', emoji: '🦊', role: 'Constitutional Oversight', color: '#8b5cf6' },
  { id: 'guardian', name: 'Code Guardian', emoji: '🔒', role: 'Security & Safety', color: '#10b981' },
  { id: 'sage', name: 'Architecture Sage', emoji: '🏛️', role: 'Design & Structure', color: '#f59e0b' },
  { id: 'prophet', name: 'Performance Prophet', emoji: '⚡', role: 'Optimization', color: '#3b82f6' },
  { id: 'keeper', name: 'Memory Keeper', emoji: '💾', role: 'Memory & Patterns', color: '#ec4899' },
  { id: 'detective', name: 'Drift Detective', emoji: '🔍', role: 'Audit & Compliance', color: '#14b8a6' }
] as const;
export type Agent = typeof agents[number];
