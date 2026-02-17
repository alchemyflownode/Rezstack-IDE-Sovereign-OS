import React, { useState, useEffect } from 'react';

interface ModelSelectorProps {
  currentModel?: string;
  onModelChange?: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  currentModel = 'llama3.2:latest',
  onModelChange 
}) => {
  const [models] = useState([
    { name: 'llama3.2:latest', type: 'General', emoji: '🦙' },
    { name: 'llama3.2:1b', type: 'Fast', emoji: '⚡' },
    { name: 'codellama:7b', type: 'Code', emoji: '💻' },
    { name: 'deepseek-coder:latest', type: 'Code', emoji: '🤖' },
    { name: 'phi4:latest', type: 'Reasoning', emoji: '🧠' },
    { name: 'mistral:latest', type: 'General', emoji: '🌪️' }
  ]);

  return (
    <div style={{ padding: '12px', background: '#2a2a2a', borderRadius: '8px' }}>
      <h3 style={{ color: '#8b5cf6', marginBottom: '8px', fontSize: '14px' }}>Neural Engine</h3>
      <select
        value={currentModel}
        onChange={(e) => onModelChange?.(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333',
          borderRadius: '4px',
          fontSize: '13px'
        }}
      >
        <optgroup label="All Models (25)">
          {models.map(model => (
            <option key={model.name} value={model.name}>
              {model.emoji} {model.name} - {model.type}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};
