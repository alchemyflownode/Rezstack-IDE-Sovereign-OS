import React, { useState, useEffect } from 'react';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface FileTreeProps {
  workspace?: string;
}

export const FileTree: React.FC<FileTreeProps> = ({ workspace = '.' }) => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFileTree(workspace);
  }, [workspace]);

  useEffect(() => {
    const handleWorkspaceChange = (event: CustomEvent) => {
      loadFileTree(event.detail);
    };
    window.addEventListener('workspace-changed', handleWorkspaceChange as EventListener);
    return () => window.removeEventListener('workspace-changed', handleWorkspaceChange as EventListener);
  }, []);

  const loadFileTree = async (path: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`📁 Loading files for: ${path}`);
      
      // Try memory API first
      let response;
      try {
        response = await fetch('http://localhost:8003/memories');
      } catch (e) {
        console.warn('Memory API not available, using fallback');
        // Use fallback data
        setTree([{
          name: 'Memory API Offline',
          path: '/offline',
          type: 'directory',
          children: [
            { name: 'Start Memory API on port 8003', path: '/offline/start', type: 'file' }
          ]
        }]);
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform memories into file tree format
      const memories = data.memories || [];
      const fileTree: FileNode[] = memories.map((memory: any, index: number) => ({
        name: memory.content?.substring(0, 30) + (memory.content?.length > 30 ? '...' : '') || `Memory ${index + 1}`,
        path: `/memories/${memory.id || index}`,
        type: 'file',
        children: []
      }));

      // Add a root directory for the workspace
      const rootNode: FileNode = {
        name: path === '.' ? 'workspace' : path,
        path: '/workspace',
        type: 'directory',
        children: fileTree.length > 0 ? fileTree : [{ 
          name: 'No memories yet', 
          path: '/empty', 
          type: 'file',
          children: []
        }]
      };

      setTree([rootNode]);
    } catch (error) {
      console.error('Failed to load file tree:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      // Show error state
      setTree([{
        name: 'Error loading',
        path: '/error',
        type: 'directory',
        children: [{
          name: error instanceof Error ? error.message : 'Connection failed',
          path: '/error/details',
          type: 'file'
        }]
      }]);
    }
    setLoading(false);
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const paddingLeft = level * 20;

    return (
      <div key={node.path}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 4px 4px ' + paddingLeft + 'px',
            cursor: 'pointer',
            color: node.path.includes('Error') ? '#ef4444' : '#ccc',
            fontSize: '13px'
          }}
          onClick={() => node.type === 'directory' && toggleFolder(node.path)}
        >
          <span>{node.type === 'directory' ? (isExpanded ? '📂' : '📁') : '📄'}</span>
          <span>{node.name}</span>
        </div>
        {isExpanded && node.children?.map(child => renderNode(child, level + 1))}
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: '12px', color: '#666' }}>Loading files...</div>;
  }

  return (
    <div style={{ padding: '8px', overflowY: 'auto', height: '100%' }}>
      {tree.map(node => renderNode(node))}
    </div>
  );
};
