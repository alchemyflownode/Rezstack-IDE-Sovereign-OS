"use client";
import React from 'react';

export const WelcomeBanner = () => {
  return (
    <div style={{
      padding: '24px',
      background: 'linear-gradient(135deg, #1e1e1e, #252526)',
      borderRadius: '16px',
      border: '1px solid #333',
      marginBottom: '24px'
    }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#fff' }}>
        Welcome to Sovereign Studio
      </h1>
      <p style={{ color: '#888', marginTop: '8px' }}>
        Your creative partner, locally hosted.
      </p>
    </div>
  );
};
