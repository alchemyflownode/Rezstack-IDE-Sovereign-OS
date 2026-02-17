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
    try {
      const response = await fetch('/api/workspace/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace: path })
      });
      const data = await response.json();
      setTree(data.tree || []);
    } catch (error) {
      console.error('Failed to load file tree:', error);
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
            color: '#ccc',
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
    return <div style={{ padding: '12px', color: '#666' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '8px', overflowY: 'auto', height: '100%' }}>
      {tree.map(node => renderNode(node))}
    </div>
  );
};
