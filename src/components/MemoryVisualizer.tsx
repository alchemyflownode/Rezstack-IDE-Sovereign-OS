import React, { useEffect, useState } from 'react';
import memoryBridge from '@/services/memoryBridge';

interface Crystal {
  id: string;
  content: string;
  type: string;
  created: number;
}

export function MemoryVisualizer() {
  const [crystals, setCrystals] = useState<Crystal[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const crystalData = await memoryBridge.getCrystals();
      setCrystals(crystalData.crystals || []);
      
      const memoryData = await memoryBridge.getRemoteMemories();
      setMemories(memoryData.memories || []);
    } catch (error) {
      console.error('Failed to load memory data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading memory crystals...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Memory Crystals ({crystals.length})</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {crystals.slice(0, 9).map((crystal, i) => (
          <div
            key={crystal.id || i}
            className="aspect-square rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 
                     animate-pulse shadow-lg hover:scale-105 transition-transform cursor-pointer
                     flex items-center justify-center text-white text-2xl"
            style={{ animationDelay: `${i * 0.1}s` }}
            title={crystal.content}
          >
            💎
          </div>
        ))}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Recent Memories ({memories.length})</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {memories.slice(0, 10).map((mem, i) => (
          <div key={i} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            {mem.content}
          </div>
        ))}
      </div>
    </div>
  );
}
