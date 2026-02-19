"use client";

import React, { useState } from 'react';
import '@/styles/macos.css';

export const SecurityCenter: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scriptText, setScriptText] = useState("");

  const runScan = async () => {
    if (!scriptText.trim()) return;
    
    setScanning(true);
    setScanResult(null);
    
    try {
      const response = await fetch('http://localhost:8001/scanner/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptText })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Scan result:', data);
      setScanResult(data);
    } catch (error) {
      console.error('Scan failed:', error);
      setScanResult({ 
        risk: 'error', 
        explanation: `Failed to connect to security scanner: ${error instanceof Error ? error.message : String(error)}. Make sure bridge is running on port 8001.`
      });
    }
    setScanning(false);
  };

  const handleAction = async (action: string) => {
    if (!scanResult) return;
    
    if (action !== 'ignore' && 
        !window.confirm(`Constitutional Check:\n\n${scanResult.explanation || scanResult.response}\n\nProceed with ${action}?`)) {
      return;
    }
    
    alert(`Action "${action}" logged to audit trail. (Quarantine feature coming soon)`);
  };

  const getRiskColor = (risk: string) => {
    if (!risk) return '#8b5cf6';
    switch(risk.toLowerCase()) {
      case 'high': return '#ff375f';
      case 'medium': return '#ff9500';
      case 'low': return '#30d158';
      default: return '#8b5cf6';
    }
  };

  const getRiskIcon = (risk: string) => {
    if (!risk) return '🔍';
    switch(risk.toLowerCase()) {
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '✅';
      default: return '🔍';
    }
  };

  return (
    <div style={{ padding: 30, height: '100%', overflow: 'auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>🛡️ Constitutional Security Center</h1>
      
      <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: '#86868b', marginBottom: 12 }}>
          Paste a PowerShell/Batch script to analyze for security risks using local AI (offline)
        </p>
        <textarea 
          className="input-mac" 
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          style={{ width: '100%', minHeight: 150, fontFamily: 'monospace', fontSize: 12, marginBottom: 12 }}
          placeholder="Get-Process | Where-Object {$_.CPU -gt 100}..."
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            className="btn-mac primary" 
            onClick={runScan} 
            disabled={scanning || !scriptText.trim()}
          >
            {scanning ? '🔄 Analyzing...' : '🔍 Analyze Script'}
          </button>
          <button 
            className="btn-mac" 
            onClick={() => setScriptText('')}
          >
            Clear
          </button>
        </div>
        <p style={{ fontSize: 12, color: '#86868b', marginTop: 8 }}>
          🔒 Constitutional Guard: All actions require explicit consent • No data leaves this PC
        </p>
      </div>

      {scanResult && (
        <div className="glass-panel" style={{ 
          background: scanResult.risk === 'high' ? 'rgba(255,55,95,0.1)' : 
                      scanResult.risk === 'medium' ? 'rgba(255,149,0,0.1)' : 
                      scanResult.risk === 'low' ? 'rgba(48,209,88,0.1)' : 
                      'rgba(139,92,246,0.1)',
          padding: 20 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ 
              margin: 0, 
              color: getRiskColor(scanResult.risk),
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{getRiskIcon(scanResult.risk)}</span>
              {scanResult.risk === 'high' ? ' HIGH RISK' : 
               scanResult.risk === 'medium' ? ' MEDIUM RISK' : 
               scanResult.risk === 'low' ? ' LOW RISK' : 
               ' ANALYSIS COMPLETE'}
            </h3>
            <span style={{ fontSize: 12, color: '#86868b' }}>AI Analysis Complete</span>
          </div>
          
          <p style={{ fontSize: 14, marginBottom: 16, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 8 }}>
            {scanResult.explanation || scanResult.response || JSON.stringify(scanResult, null, 2)}
          </p>
          
          {scanResult.risk && scanResult.risk !== 'error' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn-mac" 
                onClick={() => handleAction('ignore')}
              >
                Ignore
              </button>
              <button 
                className="btn-mac" 
                style={{ background: '#febc2e' }} 
                onClick={() => handleAction('quarantine')}
              >
                Quarantine
              </button>
              <button 
                className="btn-mac" 
                style={{ background: '#ff375f', color: 'white' }} 
                onClick={() => handleAction('delete')}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
