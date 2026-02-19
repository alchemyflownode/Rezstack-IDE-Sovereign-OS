// src/components/WebResearchPanel.tsx
import React, { useState } from 'react';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface ResearchResult {
  query: string;
  summary: string;
  sources: Array<{
    title: string;
    url: string;
    key_points: string[];
  }>;
  suggested_actions: string[];
}

export const WebResearchPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [research, setResearch] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'quick' | 'deep'>('quick');
  const [activeTab, setActiveTab] = useState<'search' | 'research'>('search');

  const handleQuickSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setMode('quick');
    setActiveTab('search');
    
    try {
      // Call our MCP server through the backend
      const response = await fetch('http://localhost:8006/browser/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          engine: 'duckduckgo'
        })
      });
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data.results || []);
      setResearch(null);
    } catch (error) {
      console.error('Search failed:', error);
      // Show mock results for demo
      setResults([
        {
          title: `Results for "${query}" - Example 1`,
          url: 'https://example.com/1',
          snippet: 'This is an example search result. In production, this would be real data from DuckDuckGo.'
        },
        {
          title: `Results for "${query}" - Example 2`,
          url: 'https://example.com/2',
          snippet: 'Another example result showing how the UI looks with content.'
        }
      ]);
    }
    
    setLoading(false);
  };

  const handleDeepResearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setMode('deep');
    setActiveTab('research');
    
    try {
      // Call deep research endpoint (would connect to MCP)
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate research
      
      setResearch({
        query,
        summary: `Research on "${query}" found 3 sources with key insights about privacy, implementation, and best practices.`,
        sources: [
          {
            title: `Understanding ${query} - Source 1`,
            url: 'https://example.com/1',
            key_points: [
              'Key point one about the topic',
              'Important consideration for implementation',
              'Best practice recommendation'
            ]
          },
          {
            title: `${query} Best Practices - Source 2`,
            url: 'https://example.com/2',
            key_points: [
              'Privacy-first approach is essential',
              'Local processing ensures data security',
              'Constitutional governance adds trust layer'
            ]
          }
        ],
        suggested_actions: [
          'Save research to memory',
          'Create crystal from insights',
          'Monitor related websites',
          'Generate report'
        ]
      });
      
      setResults([]);
    } catch (error) {
      console.error('Research failed:', error);
    }
    
    setLoading(false);
  };

  const saveToMemory = async (item: any) => {
    // Call memory API to save
    try {
      await fetch('http://localhost:8003/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: typeof item === 'string' ? item : JSON.stringify(item),
          type: mode === 'quick' ? 'search_result' : 'research',
          metadata: { query, timestamp: new Date().toISOString() }
        })
      });
      alert('✅ Saved to memory');
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg border border-purple-500/30 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-purple-400 font-bold flex items-center gap-2">
          <span>🌐</span> Web Research
        </h2>
        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-2 py-1 rounded ${
              activeTab === 'search' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            🔍 Search
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-2 py-1 rounded ${
              activeTab === 'research' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            🧠 Research
          </button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter research topic..."
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
        />
        <button
          onClick={handleQuickSearch}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50 flex items-center gap-1"
        >
          <span>🔍</span> Quick
        </button>
        <button
          onClick={handleDeepResearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50 flex items-center gap-1"
        >
          <span>🧠</span> Deep
        </button>
      </div>

      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <div className="animate-spin text-4xl mb-4">🌐</div>
          <div className="text-sm">
            {mode === 'quick' ? 'Searching...' : 'Deep researching... This may take a minute'}
          </div>
        </div>
      )}

      {!loading && activeTab === 'search' && results.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-3">
          {results.map((result, i) => (
            <div key={i} className="bg-gray-800/50 p-3 rounded border border-gray-700 hover:border-purple-500/50 transition-colors">
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 font-medium text-sm block mb-1"
              >
                {result.title}
              </a>
              <div className="text-xs text-gray-500 mb-2 truncate">{result.url}</div>
              <p className="text-xs text-gray-400 mb-3">{result.snippet}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => saveToMemory(result)}
                  className="text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-2 py-1 rounded flex items-center gap-1"
                >
                  <span>💾</span> Save
                </button>
                <button className="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2 py-1 rounded flex items-center gap-1">
                  <span>🔗</span> Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === 'research' && research && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-purple-900/20 p-4 rounded border border-purple-500/30">
            <h3 className="text-purple-400 font-bold text-sm mb-2">📊 Research Summary</h3>
            <p className="text-sm text-gray-300">{research.summary}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-purple-400 font-bold text-sm">📚 Sources Analyzed</h3>
            {research.sources.map((source, i) => (
              <div key={i} className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <div className="font-medium text-sm text-white mb-2">{source.title}</div>
                <div className="text-xs text-gray-500 mb-2">{source.url}</div>
                <div className="space-y-1 mb-3">
                  {source.key_points.map((point, j) => (
                    <div key={j} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => saveToMemory(source)}
                  className="text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-2 py-1 rounded"
                >
                  💾 Save Source
                </button>
              </div>
            ))}
          </div>

          <div className="bg-blue-900/20 p-4 rounded border border-blue-500/30">
            <h3 className="text-blue-400 font-bold text-sm mb-2">🎯 Suggested Actions</h3>
            <div className="space-y-2">
              {research.suggested_actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => saveToMemory(action)}
                  className="block w-full text-left text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && ((activeTab === 'search' && results.length === 0) || 
                   (activeTab === 'research' && !research)) && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <span className="text-6xl mb-4">🌐</span>
          <p className="text-sm">Enter a query to start {activeTab === 'search' ? 'searching' : 'researching'}</p>
        </div>
      )}
    </div>
  );
};
