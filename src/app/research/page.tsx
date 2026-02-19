"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { WebResearchPanel } from '@/features/research/WebResearchPanel';
import { useState } from 'react';

export default function ResearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Try SearXNG first
      const response = await fetch(`http://localhost:8080/search?q=${encodeURIComponent(query)}&format=json`)
        .catch(() => null);
      
      if (response && response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      } else {
        // Use mock data if SearXNG is not available
        setSearchResults([
          {
            title: `Results for "${query}" - Example 1`,
            url: 'https://example.com/1',
            content: 'This is an example search result. In production, this would be real data from SearXNG.'
          },
          {
            title: `Results for "${query}" - Example 2`,
            url: 'https://example.com/2',
            content: 'Another example result showing how the UI looks with content.'
          }
        ]);
        setError('SearXNG offline - showing example results');
      }
    } catch (err) {
      setError('Search failed - using example data');
      setSearchResults([
        {
          title: `Results for "${query}" - Example 1`,
          url: 'https://example.com/1',
          content: 'Example search result while offline.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeepSearch = async (query: string) => {
    // Deep search could use different parameters or multiple sources
    await handleQuickSearch(query + ' deep research');
  };

  return (
    <SovereignLayout pageTitle="Research">
      <div className="space-y-4">
        <WebResearchPanel 
          onQuickSearch={handleQuickSearch}
          onDeepSearch={handleDeepSearch}
          loading={loading}
        />
        
        {error && (
          <div className="glass-panel p-2 border-yellow-500/30">
            <p className="text-[10px] text-yellow-400">{error}</p>
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className="glass-panel p-4">
            <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
              <span>🔍 Results</span>
              <span className="text-[9px] text-[#888]">({searchResults.length})</span>
            </h3>
            <div className="space-y-3">
              {searchResults.map((result, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs text-[#8b5cf6] font-medium mb-1">{result.title}</div>
                      <div className="text-[9px] text-[#888] line-clamp-2 mb-2">{result.content}</div>
                      <div className="text-[8px] text-[#555] truncate">{result.url}</div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button className="px-2 py-1 text-[8px] bg-[#252525] rounded hover:bg-[#333]">
                        💾 Save
                      </button>
                      <a 
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[8px] bg-[#8b5cf6] rounded hover:bg-[#7c4dff]"
                      >
                        🔗 Visit
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SovereignLayout>
  );
}
