import React from 'react';

export const MacWindow: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div style={{
      width: '90vw',
      height: '85vh',
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      background: '#0f0f0f',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        background: '#0a0a0a',
        borderBottom: '1px solid #252525'
      }}>
        <div style={{ display: 'flex', gap: 8, marginRight: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, color: '#fff' }}>{title}</div>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};
