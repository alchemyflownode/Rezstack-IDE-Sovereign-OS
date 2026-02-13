'use client';

import React, { useState } from 'react';
import Splitter from './Splitter';

interface ResizableLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  left,
  right,
  defaultLeftWidth = 25,
  minLeftWidth = 20,
  maxLeftWidth = 40,
  className = '',
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (delta: number) => {
    setLeftWidth(prev => {
      const newWidth = prev + (delta / window.innerWidth) * 100;
      return Math.min(Math.max(newWidth, minLeftWidth), maxLeftWidth);
    });
  };

  return (
    <div className={`flex h-full w-full relative ${className}`}>
      {/* Left Panel */}
      <div 
        className="h-full overflow-auto"
        style={{ width: `${leftWidth}%` }}
      >
        {left}
      </div>

      {/* Splitter */}
      <Splitter 
        axis="vertical"
        onDrag={handleDrag}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />

      {/* Right Panel */}
      <div 
        className="flex-1 h-full overflow-auto"
      >
        {right}
      </div>

      {/* Dragging overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
};

export default ResizableLayout;