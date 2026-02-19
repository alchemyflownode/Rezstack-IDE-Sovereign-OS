import React from 'react';
import { agents } from '@/lib/agentSwarm';
const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ background: 'var(--bg-surface-hover)', padding: '12px', borderRadius: 'var(--radius-element)', border: '1px solid var(--border-subtle)' }}>
    <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: 'var(--text-body)', fontWeight: 600 }}>{value}</div>
  </div>
);
export const ConstitutionalCouncil: React.FC = () => {
  return (
    <div className="sovereign-card" style={{ height: 'fit-content' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'var(--text-title)', fontWeight: 600, margin: 0 }}>Constitutional Council</h2>
        <span style={{ background: 'var(--bg-surface-hover)', padding: '4px 12px', borderRadius: 'var(--radius-element)', fontSize: 'var(--text-caption)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}>6/6 ACTIVE</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        {agents.map(agent => (
          <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-element)', border: '1px solid var(--border-subtle)', transition: 'all 200ms ease-out', cursor: 'pointer' }}
            onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = agent.color; e.currentTarget.style.boxShadow = `0 0 20px ${agent.color}20`; }}
            onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <span style={{ fontSize: '1.5rem' }}>{agent.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, color: agent.color }}>{agent.name}</div>
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>{agent.role}</div>
            </div>
            <div style={{ width: '8px', height: '8px', background: 'var(--accent-success)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-success)' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Metric label="Memory Crystals" value="47" />
        <Metric label="Uptime" value="99.9%" />
        <Metric label="Queue" value="0" />
        <Metric label="Active Rules" value="16" />
      </div>
    </div>
  );
};
