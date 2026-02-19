// src/store/fileSystemStore.ts - ENHANCED with logging
import { create } from 'zustand';
import { FileNode } from '@/types/files';
import { stateLogger } from './stateLogger';

interface FileSystemState {
  currentPath: string;
  tree: FileNode[];
  loading: boolean;
  error: string | null;
  expandedFolders: Set<string>;
  selectedFile: string | null;
  
  // Actions
  setPath: (path: string) => void;
  toggleFolder: (path: string) => void;
  selectFile: (path: string | null) => void;
  refresh: () => Promise<void>;
  loadPath: (path: string) => Promise<void>;
}

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  currentPath: '.',
  tree: [],
  loading: false,
  error: null,
  expandedFolders: new Set(['src']),
  selectedFile: null,

  setPath: (path) => {
    const transaction = stateLogger.begin('WORKSPACE_CHANGE', 'FileSystemStore', { newPath: path });
    
    set({ currentPath: path });
    get().loadPath(path);
    
    transaction.end(
      { currentPath: get().currentPath },
      { currentPath: path }
    );
  },

  toggleFolder: (path) => {
    const transaction = stateLogger.begin('USER_ACTION', 'FileSystemStore', { action: 'toggleFolder', path });
    
    const newExpanded = new Set(get().expandedFolders);
    const wasExpanded = newExpanded.has(path);
    
    if (wasExpanded) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    
    set({ expandedFolders: newExpanded });
    
    transaction.end(
      { expanded: wasExpanded },
      { expanded: !wasExpanded }
    );
  },

  selectFile: (path) => {
    const transaction = stateLogger.begin('USER_ACTION', 'FileSystemStore', { action: 'selectFile', path });
    
    set({ selectedFile: path });
    
    transaction.end(
      { selectedFile: get().selectedFile },
      { selectedFile: path }
    );
  },

  loadPath: async (path: string) => {
    const transaction = stateLogger.begin('FILE_UPDATE', 'FileSystemStore', { path });
    
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/workspace/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace: path })
      });
      
      const data = await response.json();
      
      if (data.success) {
        set({ 
          tree: data.tree || [], 
          loading: false,
          currentPath: path
        });
        
        transaction.end(
          { loading: true },
          { tree: data.tree, loading: false }
        );
      } else {
        const error = data.error || 'Failed to load workspace';
        set({ error, loading: false, tree: [] });
        
        transaction.end(
          { loading: true },
          { error, loading: false }
        );
        
        stateLogger.log('ERROR', 'FileSystemStore', { error, path });
      }
    } catch (error) {
      const errorMessage = 'Connection error';
      set({ error: errorMessage, loading: false, tree: [] });
      
      transaction.end(
        { loading: true },
        { error: errorMessage, loading: false }
      );
      
      stateLogger.log('ERROR', 'FileSystemStore', { error: errorMessage, path });
    }
  },

  refresh: async () => {
    const { currentPath } = get();
    await get().loadPath(currentPath);
  }
}));

// Listen for workspace changes from top bar
if (typeof window !== 'undefined') {
  window.addEventListener('workspace-changed', ((event: CustomEvent) => {
    const path = event.detail;
    stateLogger.log('WORKSPACE_CHANGE', 'FileSystemStore', { path });
    useFileSystemStore.getState().setPath(path);
  }) as EventListener);
}
