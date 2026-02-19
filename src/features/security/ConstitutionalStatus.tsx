import React from 'react';
export const ConstitutionalStatus: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface)', padding: '8px 16px', borderRadius: 'var(--radius-element)', border: '1px solid var(--border-accent)' }}>
      <span style={{ width: '10px', height: '10px', background: 'var(--accent-success)', borderRadius: '50%', boxShadow: '0 0 20px var(--accent-success)' }} />
      <span style={{ fontSize: 'var(--text-caption)' }}>16 Rules Active</span>
    </div>
  );
};
