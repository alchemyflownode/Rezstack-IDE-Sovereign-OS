export function formatSearchResults(results: any): string {
  if (!results?.results?.length) {
    return '🔍 **No search results found**\n\nTry a different query or check if SearXNG is running.';
  }
  
  let output = `## 🔍 Search Results (${results.results.length})\n\n`;
  
  results.results.slice(0, 5).forEach((r: any, i: number) => {
    output += `### ${i+1}. [${r.title || 'Untitled'}](${r.url || '#'})\n`;
    if (r.snippet) {
      output += `${r.snippet}\n\n`;
    }
  });
  
  if (results.results.length > 5) {
    output += `\n*... and ${results.results.length - 5} more results*`;
  }
  
  return output;
}

export function formatResearch(research: any): string {
  if (!research) return '🧠 **Research failed**\n\nCheck if Browser API is running.';
  
  let output = `## 🧠 Deep Research: "${research.topic}"\n\n`;
  
  if (research.summary) {
    output += `${research.summary}\n\n`;
  }
  
  if (research.sources?.length) {
    output += '### 📚 Sources Analyzed\n\n';
    research.sources.forEach((source: any, i: number) => {
      output += `${i+1}. [${source.title}](${source.url})\n`;
    });
    output += '\n';
  }
  
  if (research.deepDive) {
    output += `### 🔍 Deep Dive: ${research.deepDive.title}\n\n`;
    output += `${research.deepDive.content}\n\n`;
    output += `[Read more](${research.deepDive.url})\n`;
  }
  
  return output;
}

export function formatAgents(agents: any): string {
  if (!agents?.justices?.length) {
    return '🤖 **No agents available**\n\nCheck if Bridge API is running.';
  }
  
  let output = '# 🤖 Constitutional Council\n\n';
  output += '| Agent | Type | Status |\n';
  output += '|-------|------|--------|\n';
  
  agents.justices.forEach((agent: any) => {
    const statusEmoji = agent.status === 'active' ? '✅' : '⭕';
    output += `| ${agent.emoji} ${agent.name} | ${agent.type} | ${statusEmoji} ${agent.status} |\n`;
  });
  
  return output;
}

export function formatStatus(status: Record<string, boolean>): string {
  let output = '# 🦊 System Status\n\n';
  
  const services = [
    { name: 'Bridge API', key: 'bridge', port: 8001 },
    { name: 'Memory API', key: 'memory', port: 8003 },
    { name: 'SearXNG', key: 'search', port: 8080 },
    { name: 'Browser API', key: 'browser', port: 8006 },
    { name: 'Swarm API', key: 'swarm', port: 8000 }
  ];
  
  output += '## 📡 Services\n\n';
  services.forEach(svc => {
    const isOnline = status[svc.key] || false;
    const statusEmoji = isOnline ? '✅' : '❌';
    output += `${statusEmoji} **${svc.name}** (port ${svc.port}): ${isOnline ? 'Online' : 'Offline'}\n`;
  });
  
  return output;
}
