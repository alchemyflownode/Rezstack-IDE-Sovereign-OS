'use client';
import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FileTree } from "@/features/files/FileTree";
import { SovereignHeader } from '@/components/SovereignHeader';
import { ConstitutionalCouncil } from "@/features/security/ConstitutionalCouncil";
import { ActiveGeneration } from '@/components/ActiveGeneration';

const STORAGE_KEY = 'rezstack-layout';

export const ResizableLayout: React.FC = () => {
  // Initialize with default sizes (same as server)
  const [sizes, setSizes] = useState<number[]>([20, 55, 25]);
  const [isClient, setIsClient] = useState(false);

  // Load saved layout only on client after mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSizes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved layout', e);
      }
    }
  }, []);

  const onLayout = (newSizes: number[]) => {
    setSizes(newSizes);
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSizes));
    }
  };

  // Server render uses default sizes
  // Client render uses saved sizes after mount
  const panelSizes = isClient ? sizes : [20, 55, 25];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SovereignHeader />
      <div style={{ flex: 1, minHeight: 0 }}>
        <PanelGroup direction="horizontal" onLayout={onLayout}>
          {/* Left Panel - File Tree */}
          <Panel defaultSize={panelSizes[0]} minSize={15} maxSize={30} collapsible>
            <div style={{ height: '100%', overflow: 'auto', background: 'var(--bg-surface)' }}>
              <FileTree />
            </div>
          </Panel>
          
          <PanelResizeHandle className="resize-handle" style={{
            width: '4px',
            background: 'var(--border-regular)',
            transition: 'background 0.2s',
            cursor: 'col-resize'
          }} />
          
          {/* Center Panel - Active Generation */}
          <Panel defaultSize={panelSizes[1]} minSize={40}>
            <div style={{ height: '100%', overflow: 'auto', padding: '16px' }}>
              <ActiveGeneration />
            </div>
          </Panel>
          
          <PanelResizeHandle className="resize-handle" style={{
            width: '4px',
            background: 'var(--border-regular)',
            transition: 'background 0.2s',
            cursor: 'col-resize'
          }} />
          
          {/* Right Panel - Constitutional Council */}
          <Panel defaultSize={panelSizes[2]} minSize={20} maxSize={40} collapsible>
            <div style={{ height: '100%', overflow: 'auto', background: 'var(--bg-surface)' }}>
              <ConstitutionalCouncil />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};
