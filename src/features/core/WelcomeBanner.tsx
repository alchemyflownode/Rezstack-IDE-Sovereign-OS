"use client";
import React, { useState, useEffect } from 'react';

export const WelcomeBanner = () => {
  const [greeting, setGreeting] = useState('Initializing sovereign systems...');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    // Fetch greeting
    fetch('http://localhost:8009/greet')
      .then(res => res.json())
      .then(data => setGreeting(data.greeting || 'Systems online.'))
      .catch(() => setGreeting('Local AI standing by.'));

    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();
  const timeOfDay = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: '100px',
        height: '100px',
        background: 'rgba(139, 92, 246, 0.2)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          marginBottom: '8px', 
          color: '#fff' 
        }}>
          Good {timeOfDay}, Sovereign. 🦊
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#ccc', 
          lineHeight: '1.5',
          maxWidth: '600px'
        }}>
          {greeting}
        </p>
      </div>
    </div>
  );
};
