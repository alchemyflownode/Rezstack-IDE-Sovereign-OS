"use client";
import React from 'react';

export const MemoryCrystals: React.FC = () => {
  const crystals = [1, 2, 3, 4, 5, 6];
  
  return (
    <div className="glass-panel p-4">
      <h3 className="text-[12px] font-bold mb-3">💾 Memory Crystals</h3>
      <div className="grid grid-cols-3 gap-2">
        {crystals.map(i => (
          <div key={i} className="aspect-square rounded-lg bg-[#1a1a1a] border border-[#252525] flex items-center justify-center text-[10px] text-[#555]">
            #{i}
          </div>
        ))}
      </div>
      <p className="text-[9px] text-[#555] mt-2">47 memories stored • Encrypted locally</p>
    </div>
  );
};
