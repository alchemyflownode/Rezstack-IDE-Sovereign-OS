import React, { useEffect, useState } from 'react';
import memoryBridge from '@/services/memoryBridge';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  type: string;
  status: string;
  x?: number;
  y?: number;
}

export default function RezSwarmHive() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [crystals, setCrystals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCrystals, setLoadingCrystals] = useState(true);

  useEffect(() => {
    loadAgents();
    loadCrystals();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await fetch('http://localhost:8001/justices');
      const data = await response.json();
      setAgents(data.justices || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const loadCrystals = async () => {
    setLoadingCrystals(true);
    try {
      const data = await memoryBridge.getCrystals();
      setCrystals(data.crystals || []);
    } catch (error) {
      console.error('Failed to load crystals:', error);
    } finally {
      setLoadingCrystals(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[400px] bg-gray-900 rounded-lg p-4 select-text">
      {/* Memory Crystals */}
      <div className="absolute top-4 right-4 flex gap-1 z-10">
        {!loadingCrystals && crystals.slice(0, 7).map((crystal: any, i: number) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
            title={crystal.content}
          />
        ))}
      </div>

      {/* Swarm Visualization */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span className="text-4xl mb-2">{agent.emoji}</span>
            <span className="text-sm font-medium">{agent.name}</span>
            <span className="text-xs text-gray-400">{agent.type}</span>
            <div className="flex gap-1 mt-2">
              <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-xs">{agent.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Crystal count badge */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        {crystals.length} memory crystals active
      </div>
    </div>
  );
}
