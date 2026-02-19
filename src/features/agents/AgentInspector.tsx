"use client";
import React, { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle';
  icon: string;
  color: string;
}

const agents: Agent[] = [
  { id: 'sovereign', name: 'Sovereign AI', type: 'constitutional', status: 'active', icon: '🦊', color: '#8b5cf6' },
  { id: 'guardian', name: 'Code Guardian', type: 'security', status: 'active', icon: '🔒', color: '#ef4444' },
  { id: 'sage', name: 'Architecture Sage', type: 'design', status: 'active', icon: '🏛️', color: '#3b82f6' },
  { id: 'prophet', name: 'Performance Prophet', type: 'optimization', status: 'active', icon: '⚡', color: '#f59e0b' },
];

export const AgentInspector: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ padding: '16px', background: '#111', borderRadius: '12px', height: '100%' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#fff' }}>🤖 Agent Swarm</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {agents.map(agent => (
          <div 
            key={agent.id}
            onClick={() => setSelected(agent.id)}
            style={{
              padding: '12px',
              background: selected === agent.id ? '#2d2d2d' : '#1a1a1a',
              border: `1px solid ${selected === agent.id ? agent.color : '#333'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '16px' }}>{agent.icon}</span>
            <span style={{ fontSize: '11px', color: '#ccc' }}>{agent.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
