"use client";

import React, { useState } from 'react';

interface Generation {
  id: string;
  prompt: string;
  imageUrl?: string;
  status: 'queued' | 'generating' | 'completed' | 'failed';
  progress: number;
  style: string;
  timestamp: Date;
}

export const RezFlix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'library'>('home');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = [
    { id: 'cinematic', name: '🎬 Cinematic', icon: '🎥' },
    { id: 'cyberpunk', name: '🌃 Cyberpunk', icon: '🌆' },
    { id: 'anime', name: '🎌 Anime', icon: '🌸' },
    { id: 'photorealistic', name: '📸 Photo', icon: '📷' },
    { id: 'fantasy', name: '🧝 Fantasy', icon: '🐉' },
    { id: 'watercolor', name: '🎨 Watercolor', icon: '🖌️' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    const newGen: Generation = {
      id: Date.now().toString(),
      prompt,
      status: 'generating',
      progress: 0,
      style: selectedStyle,
      timestamp: new Date()
    };
    
    setGenerations(prev => [newGen, ...prev]);
    
    // Simulate progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 500));
      setGenerations(prev => 
        prev.map(g => 
          g.id === newGen.id 
            ? { ...g, progress: i, status: i === 100 ? 'completed' : 'generating' }
            : g
        )
      );
    }
    
    setIsGenerating(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(10,10,10,0.95)',
        borderBottom: '1px solid #8b5cf6',
        padding: '16px 32px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#8b5cf6'
          }}>
            🎬 REZFLIX
          </h1>
          
          <nav style={{ display: 'flex', gap: '24px' }}>
            {[
              { id: 'home', label: 'Home', icon: '🏠' },
              { id: 'create', label: 'Create', icon: '🎨' },
              { id: 'library', label: 'My Library', icon: '📚' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === tab.id ? '#8b5cf6' : '#888',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px' }}>
        {activeTab === 'home' && (
          <div>
            <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>🔥 Trending Now</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '24px'
            }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{
                  background: '#1e1e1e',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid #333'
                }}>
                  <div style={{
                    height: '150px',
                    background: '#2a2a2a',
                    borderRadius: '4px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    🎨
                  </div>
                  <p style={{ fontSize: '14px', color: '#888' }}>Generation #{i}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Create New</h2>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                background: '#1e1e1e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                marginBottom: '24px',
                fontFamily: 'inherit'
              }}
            />
            
            <h3 style={{ marginBottom: '16px' }}>Choose Style</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {styles.map(style => (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  style={{
                    background: selectedStyle === style.id ? '#8b5cf6' : '#1e1e1e',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: selectedStyle === style.id ? '2px solid #8b5cf6' : '1px solid #333'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{style.icon}</div>
                  <div>{style.name}</div>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              style={{
                width: '100%',
                padding: '16px',
                background: isGenerating ? '#666' : '#8b5cf6',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
            >
              {isGenerating ? '✨ Generating...' : '🚀 Generate'}
            </button>

            {/* Queue */}
            {generations.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <h3>Your Queue</h3>
                {generations.map(gen => (
                  <div key={gen.id} style={{
                    background: '#1e1e1e',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '12px',
                    border: '1px solid #333'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#8b5cf6' }}>{gen.style}</span>
                      <span>{gen.status}</span>
                    </div>
                    <p>{gen.prompt.substring(0, 60)}...</p>
                    <div style={{
                      height: '4px',
                      background: '#333',
                      borderRadius: '2px',
                      marginTop: '8px'
                    }}>
                      <div style={{
                        width: `${gen.progress}%`,
                        height: '100%',
                        background: '#8b5cf6',
                        borderRadius: '2px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div>
            <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>My Library</h2>
            <p style={{ color: '#888' }}>Your saved generations will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};
