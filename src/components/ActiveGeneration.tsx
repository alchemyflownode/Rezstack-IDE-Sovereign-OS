import React from 'react';
import { SCECreator } from '@/app/rez-dashboard/SCECreator';
export const ActiveGeneration: React.FC = () => {
  return (
    <div className="sovereign-card" style={{ border: '1px solid var(--border-accent)', boxShadow: '0 20px 40px -10px rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-title)', fontWeight: 600, margin: 0 }}>Active Generation</h2>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>SCE v1.0 • Constitutional Runtime Active</p>
        </div>
        <div style={{ background: 'var(--bg-surface-hover)', padding: '8px 16px', borderRadius: 'var(--radius-element)', fontSize: 'var(--text-caption)', border: '1px solid var(--border-subtle)' }}>Chaos: 0.5</div>
      </div>
      <SCECreator />
    </div>
  );
};
