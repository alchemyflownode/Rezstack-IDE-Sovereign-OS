// src/lib/searchConfig.ts
export const SEARCH_CONFIG = {
  endpoint: 'http://localhost:8080/search',
  formats: ['json'],
  defaultEngines: ['google', 'duckduckgo', 'brave', 'wikipedia'],
  timeout: 10000
};

export async function privateSearch(query: string, engines?: string[]) {
  const url = new URL(SEARCH_CONFIG.endpoint);
  url.searchParams.append('q', query);
  url.searchParams.append('format', 'json');
  
  if (engines) {
    url.searchParams.append('engines', engines.join(','));
  }
  
  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}
