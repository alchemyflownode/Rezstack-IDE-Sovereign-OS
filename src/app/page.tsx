'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SovereignHeader, type CategoryFilter } from '@/components/SovereignHeader';
import { CommandSidebar } from '@/components/CommandSidebar';
import { VibeJourneyPanel } from '@/components/VibeJourneyPanel';
import { StatusPanel } from '@/components/StatusPanel';
import { QuickPrompts, type QuickPrompt } from '@/components/QuickPrompts';
import { ArchitecturalInput } from '@/components/ArchitecturalInput';
import { CuratedOutput } from '@/components/CuratedOutput';
import JARVISTerminal from '@/components/JARVISTerminal';
import { FileTree } from '@/components/FileTree';
import { EnhancedResizableLayout } from '@/components/EnhancedResizableLayout';

export default function RezStackPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(
    'Write Jest unit tests for a React hook that manages form state with validation and submission.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputCode, setOutputCode] = useState('');
  const [outputMetadata, setOutputMetadata] = useState({
    lines: 0,
    compliance: 100,
    generatedAt: '',
    model: 'llama3.2:latest',
  });
  const [currentModel, setCurrentModel] = useState('llama3.2:latest');
  const [mounted, setMounted] = useState(false);
  const [workspace, setWorkspace] = useState('');
  const [currentPath, setCurrentPath] = useState('.');
  const terminalRef = useRef<{ executeCommand: (cmd: string) => void }>(null);
  const [userProgress] = useState({ level: 7, xp: 2450, xpToNextLevel: 3000 });
  const [statusState] = useState({
    violationsFixed: 0,
    compliancePercent: 100,
    status: 'STABLE' as const,
    nodesDiscovered: 25,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileSelect = (path: string) => {
    const cmd = `cat ${path}`;
    setInputValue(cmd);
    if (terminalRef.current) {
      terminalRef.current.executeCommand(cmd);
    }
  };

  const handlePromptSelect = (prompt: QuickPrompt) => {
    setInputValue(prompt.prompt);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputValue, model: currentModel })
      });
      const data = await response.json();
      if (data.code) {
        setOutputCode(data.code);
        setOutputMetadata({
          lines: data.code.split('\n').length,
          compliance: 100,
          generatedAt: new Date().toLocaleTimeString(),
          model: data.model || currentModel,
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearOutput = () => {
    setOutputCode('');
    setOutputMetadata({ lines: 0, compliance: 100, generatedAt: '', model: currentModel });
  };

  const handleRun = () => console.log('Running code:', outputCode);
  
  const handleModelChange = (model: string) => {
    setCurrentModel(model);
    setOutputMetadata(prev => ({ ...prev, model }));
  };

  const handleWorkspaceChange = (path: string) => {
    setWorkspace(path);
    setCurrentPath('.');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('workspace:changed', { detail: { path } }));
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <SovereignHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        workspace={workspace}
        onWorkspaceChange={handleWorkspaceChange}
      />
      
      <div className="flex-1 overflow-hidden">
        <EnhancedResizableLayout
          left={
            <div className="h-full overflow-y-auto">
              <FileTree 
                rootPath="src"
                workspace={workspace}
                currentPath={currentPath}
                onFileSelect={handleFileSelect}
                onPathChange={setCurrentPath}
              />
              <div className="p-4 space-y-6 border-t border-purple-500/20 mt-2">
                <CommandSidebar
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  selectedDifficulty={categoryFilter}
                />
                <VibeJourneyPanel
                  level={userProgress.level}
                  xp={userProgress.xp}
                  xpToNextLevel={userProgress.xpToNextLevel}
                />
              </div>
            </div>
          }
          right={
            <div className="h-full overflow-y-auto p-4 space-y-6">
              <StatusPanel
                violationsFixed={statusState.violationsFixed}
                compliancePercent={statusState.compliancePercent}
                status={statusState.status}
                nodesDiscovered={statusState.nodesDiscovered}
                currentModel={currentModel}
                onModelChange={handleModelChange}
              />
              <QuickPrompts onPromptSelect={handlePromptSelect} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ArchitecturalInput
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSubmit={handleGenerate}
                  isGenerating={isGenerating}
                />
                <CuratedOutput
                  code={outputCode}
                  metadata={outputMetadata}
                  onClear={handleClearOutput}
                  onRun={handleRun}
                />
              </div>
              {mounted && (
                <JARVISTerminal 
                  ref={terminalRef}
                  workspace={workspace} 
                  currentPath={currentPath} 
                  onPathChange={setCurrentPath}
                />
              )}
            </div>
          }
          leftConfig={{ id: 'explorer', defaultSize: 25, minSize: 20, maxSize: 40 }}
          bottomConfig={{ id: 'terminal', defaultSize: 30, minSize: 15, maxSize: 60, collapsible: true }}
        />
      </div>
    </div>
  );
}