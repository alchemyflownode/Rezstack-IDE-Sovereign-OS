"use client";
import React, { useState } from 'react';
import { WelcomeBanner } from './WelcomeBanner';
import { AgentInspector } from '../agents/AgentInspector';
import { MemoryCrystals } from '@/components/MemoryCrystals';

// Quick Action Button Component
const ActionCard = ({ icon, title, desc, onClick, color }: any) => (
  <div 
    onClick={onClick}
    style={{
      background: 'linear-gradient(145deg, #1e1e1e, #252526)',
      border: '1px solid #333',
      borderRadius: '16px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.boxShadow = `0 8px 24px ${color}33`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = '#333';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '4px',
      height: '100%',
      background: color
    }} />
    <div style={{ fontSize: '32px' }}>{icon}</div>
    <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>{title}</h3>
    <p style={{ margin: 0, color: '#888', fontSize: '13px', lineHeight: 1.5 }}>{desc}</p>
  </div>
);

export const VisualHome = ({ onAction }: any) => {
  const [query, setQuery] = useState('');
  
  return (
    <div style={{ 
      padding: '32px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* WELCOME BANNER */}
      <WelcomeBanner />
      
      {/* HEADER */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 700, 
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px'
        }}>
          Sovereign Studio
        </h1>
        <p style={{ color: '#888', fontSize: '18px' }}>
          Your creative partner. No code required.
        </p>
      </div>

      {/* UNIVERSAL INPUT */}
      <div style={{ 
        marginBottom: '48px', 
        position: 'relative',
        maxWidth: '800px',
        margin: '0 auto 48px auto'
      }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAction('chat', query)}
          placeholder="Tell me what you need... (e.g., 'Make a cyberpunk poster')"
          style={{
            width: '100%',
            padding: '20px 24px 20px 56px',
            fontSize: '16px',
            background: '#1e1e1e',
            border: '2px solid #333',
            borderRadius: '16px',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
          onBlur={(e) => e.target.style.borderColor = '#333'}
        />
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '20px',
          fontSize: '24px',
          color: '#8b5cf6'
        }}>
          ðŸ¦Š
        </div>
      </div>

      {/* ACTION GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        <ActionCard 
          icon="ðŸŽ¨" 
          title="Create" 
          desc="Generate images, videos, or stories. Just describe your vision."
          color="#ec4899"
          onClick={() => onAction('create')}
        />
        <ActionCard 
          icon="ðŸ”" 
          title="Research" 
          desc="Search the web privately. No tracking, no data leaving your PC."
          color="#3b82f6"
          onClick={() => onAction('search')}
        />
        <ActionCard 
          icon="ðŸ“" 
          title="Notes & Tasks" 
          desc="Remember ideas or plan your project. 'Remind me to call mom.'"
          color="#10b981"
          onClick={() => onAction('notes')}
        />
        <ActionCard 
          icon="âš¡" 
          title="System" 
          desc="Optimize your PC, check health, or manage running apps."
          color="#f59e0b"
          onClick={() => onAction('system')}
        />
      </div>

      {/* INSIGHT PANELS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '24px'
      }}>
        <div style={{ background: '#111', borderRadius: '16px', padding: '20px', border: '1px solid #222' }}>
          <AgentInspector />
        </div>
        <div style={{ background: '#111', borderRadius: '16px', padding: '20px', border: '1px solid #222' }}>
          <MemoryCrystals />
        </div>
      </div>
    </div>
  );
};

