"use client";
import React from 'react';

interface Crystal {
  id: string;
  title: string;
  color: string;
}

const crystals: Crystal[] = [
  { id: '1', title: 'Project Arch', color: '#8b5cf6' },
  { id: '2', title: 'Security Keys', color: '#3b82f6' },
  { id: '3', title: 'User Prefs', color: '#10b981' }
];

export const MemoryCrystals: React.FC = () => {
  return (
    <div style={{ padding: '16px', background: '#111', borderRadius: '12px', height: '100%' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#fff' }}>💎 Memory Crystals</h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {crystals.map(crystal => (
          <div key={crystal.id} style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '56px',
              background: `linear-gradient(135deg, ${crystal.color}aa, ${crystal.color}33)`,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              margin: '0 auto 8px',
              boxShadow: `0 0 12px ${crystal.color}44`
            }} />
            <span style={{ fontSize: '10px', color: '#888' }}>{crystal.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
