import React, { useState } from 'react';

export const SCECreator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [chaos, setChaos] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:8008/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt,
          chaos_level: chaos
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setResult(`❌ Error: ${data.error}`);
      } else if (data.prompt_id) {
        setResult(`✅ Generation queued! Job ID: ${data.prompt_id}\nCheck ComfyUI at http://localhost:8188`);
        
        // Open ComfyUI in new tab
        window.open('http://localhost:8188', '_blank');
      } else {
        setResult(`✅ Response: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      setResult(`❌ Connection error: ${error.message}\nMake sure ComfyUI and bridge are running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe what you want to create..."
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '16px',
          background: 'var(--bg-surface-hover)',
          border: '1px solid var(--border-regular)',
          borderRadius: 'var(--radius-element)',
          color: 'var(--text-primary)',
          fontSize: 'var(--text-body)',
          fontFamily: 'inherit',
          resize: 'vertical',
          marginBottom: '16px'
        }}
      />
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
          Chaos Level: {chaos.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={chaos}
          onChange={(e) => setChaos(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        style={{
          width: '100%',
          padding: '12px',
          background: loading ? '#666' : 'var(--accent-primary)',
          border: 'none',
          borderRadius: 'var(--radius-element)',
          color: 'white',
          fontSize: 'var(--text-body)',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-default)',
          marginBottom: '16px'
        }}
      >
        {loading ? '🎨 Generating...' : '🚀 Generate with ComfyUI'}
      </button>
      
      {result && (
        <div style={{
          padding: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-element)',
          whiteSpace: 'pre-wrap',
          fontSize: 'var(--text-caption)',
          color: 'var(--text-secondary)'
        }}>
          {result}
        </div>
      )}
    </div>
  );
};
