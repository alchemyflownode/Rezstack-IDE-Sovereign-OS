import React, { useEffect, useState } from 'react';
import { useFileSystemStore } from '@/stores/fileSystemStore';
import memoryBridge from '@/services/memoryBridge';

export function MemoryDashboard() {
  const { 
    memoryStats, 
    healthReport, 
    shards, 
    loadingMemory, 
    loadMemoryStats,
    consolidateCrystals 
  } = useFileSystemStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'shards' | 'crystals' | 'health'>('overview');

  useEffect(() => {
    loadMemoryStats();
    const interval = setInterval(loadMemoryStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loadingMemory && !memoryStats) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-800 rounded"></div>
            <div className="h-24 bg-gray-800 rounded"></div>
            <div className="h-24 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🧠 Memory Dashboard
        </h2>
        <button
          onClick={loadMemoryStats}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Memories</div>
          <div className="text-2xl font-bold text-purple-400">{memoryStats?.memories || 0}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Crystals</div>
          <div className="text-2xl font-bold text-pink-400">{memoryStats?.crystals || 0}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Shards</div>
          <div className="text-2xl font-bold text-cyan-400">{memoryStats?.shards || 0}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Health Score</div>
          <div className="text-2xl font-bold text-green-400">{healthReport?.integrityScore || 100}%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'overview' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('shards')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'shards' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Shards
        </button>
        <button
          onClick={() => setActiveTab('crystals')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'crystals' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Crystals
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'health' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Health
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h3 className="text-sm font-medium text-purple-400 mb-3">Memory Distribution</h3>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ 
                    width: `${((memoryStats?.memories || 0) / 100) * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Active: {memoryStats?.memories || 0}</span>
                <span>Capacity: 1000</span>
              </div>
            </div>

            {healthReport?.recommendations?.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-400 mb-2">Recommendations</h3>
                <ul className="space-y-1">
                  {healthReport.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-xs text-gray-300">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shards' && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {shards.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No shards found</p>
            ) : (
              shards.slice(0, 20).map((shard: any, i: number) => (
                <div key={i} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-purple-400">{shard.type}</span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(shard.context?.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    {typeof shard.content === 'string' 
                      ? shard.content.substring(0, 200) 
                      : JSON.stringify(shard.content).substring(0, 200)}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {shard.tags?.map((tag: string, j: number) => (
                      <span key={j} className="px-2 py-0.5 bg-gray-700 rounded text-[10px] text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'crystals' && (
          <div className="space-y-4">
            <button
              onClick={consolidateCrystals}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              🔮 Consolidate Crystals
            </button>
            {/* Crystal visualization here */}
          </div>
        )}

        {activeTab === 'health' && healthReport && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/30 rounded p-3">
                <div className="text-xs text-gray-500">Duplicate Clusters</div>
                <div className="text-lg font-bold text-purple-400">{healthReport.duplicateClusters || 0}</div>
              </div>
              <div className="bg-gray-800/30 rounded p-3">
                <div className="text-xs text-gray-500">Prune Candidates</div>
                <div className="text-lg font-bold text-orange-400">{healthReport.pruneCandidates || 0}</div>
              </div>
              <div className="bg-gray-800/30 rounded p-3">
                <div className="text-xs text-gray-500">Cold Memories</div>
                <div className="text-lg font-bold text-blue-400">{healthReport.coldMemories || 0}</div>
              </div>
              <div className="bg-gray-800/30 rounded p-3">
                <div className="text-xs text-gray-500">Avg Confidence</div>
                <div className="text-lg font-bold text-green-400">
                  {(healthReport.averageConfidence * 100 || 0).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
