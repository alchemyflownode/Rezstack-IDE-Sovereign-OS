'use client';

import React, { useState, useEffect } from 'react';
import { SovereignHeader, type CategoryFilter } from '@/components/SovereignHeader';
import { CommandSidebar } from '@/components/CommandSidebar';
import { VibeJourneyPanel } from '@/components/VibeJourneyPanel';
import { StatusPanel } from '@/components/StatusPanel';
import { QuickPrompts, type QuickPrompt } from '@/components/QuickPrompts';
import { ArchitecturalInput } from '@/components/ArchitecturalInput';
import { CuratedOutput } from '@/components/CuratedOutput';
import { JARVISTerminal } from '@/components/JARVISTerminal';
import { ScrollArea } from '@/components/ui/scroll-area';

const sampleGeneratedCode = `import { useState, useCallback, useEffect } from 'react';

// Type definitions for form management
interface FormField<T = unknown> {
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

interface FormState<T extends Record<string, unknown>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

// Default form field factory
const createField = <T,>(value: T): FormField<T> => ({
  value,
  error: null,
  touched: false,
  dirty: false,
});

// Custom hook for form state management
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationRules?: Partial<{
    [K in keyof T]: ValidationRule<T[K]>[];
  }>
) {
  const [state, setState] = useState<FormState<T>>({
    fields: Object.fromEntries(
      Object.entries(initialValues).map(([key, value]) => [
        key,
        createField(value),
      ])
    ) as FormState<T>['fields'],
    isValid: true,
    isSubmitting: false,
    submitCount: 0,
  });

  // Validate a single field
  const validateField = useCallback(
    <K extends keyof T>(name: K, value: T[K]): string | null => {
      const rules = validationRules?.[name];
      if (!rules) return null;

      for (const rule of rules) {
        if (!rule.validate(value)) {
          return rule.message;
        }
      }
      return null;
    },
    [validationRules]
  );

  // Update field value with validation
  const setFieldValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setState((prev) => {
        const error = validateField(name, value);
        const newFields = {
          ...prev.fields,
          [name]: {
            ...prev.fields[name],
            value,
            error,
            dirty: true,
          },
        };

        const isValid = Object.values(newFields).every(
          (field) => !field.error
        );

        return { ...prev, fields: newFields, isValid };
      });
    },
    [validateField]
  );

  // Mark field as touched
  const touchField = useCallback(<K extends keyof T>(name: K) => {
    setState((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: { ...prev.fields[name], touched: true },
      },
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void>) => {
      setState((prev) => ({
        ...prev,
        isSubmitting: true,
        submitCount: prev.submitCount + 1,
      }));

      try {
        const values = Object.fromEntries(
          Object.entries(state.fields).map(([key, field]) => [
            key,
            (field as FormField).value,
          ])
        ) as T;

        await onSubmit(values);
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [state.fields]
  );

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setState({
      fields: Object.fromEntries(
        Object.entries(initialValues).map(([key, value]) => [
          key,
          createField(value),
        ])
      ) as FormState<T>['fields'],
      isValid: true,
      isSubmitting: false,
      submitCount: 0,
    });
  }, [initialValues]);

  return {
    fields: state.fields,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,
    setFieldValue,
    touchField,
    handleSubmit,
    resetForm,
  };
}`;

export default function RezStackPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(
    'Write Jest unit tests for a React hook that manages form state with validation and submission.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputCode, setOutputCode] = useState(sampleGeneratedCode);
  const [outputMetadata, setOutputMetadata] = useState({
    lines: 62,
    compliance: 100,
    generatedAt: '',
    model: 'llama3.2:latest',
  });

  // Model state for Smart Router
  const [currentModel, setCurrentModel] = useState('llama3.2:latest');
  const [mounted, setMounted] = useState(false);

  // User progress state
  const [userProgress] = useState({
    level: 7,
    xp: 2450,
    xpToNextLevel: 3000,
  });

  // Status panel state
  const [statusState] = useState({
    violationsFixed: 0,
    compliancePercent: 100,
    status: 'STABLE' as const,
    nodesDiscovered: 25,
  });

  // Set mounted state for hydration
  useEffect(() => {
    setMounted(true);
    setOutputMetadata(prev => ({
      ...prev,
      generatedAt: new Date().toLocaleTimeString(),
    }));
  }, []);

  // Handle prompt selection
  const handlePromptSelect = (prompt: QuickPrompt) => {
    setInputValue(prompt.prompt);
  };

  // Handle code generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: inputValue,
          model: currentModel // Pass selected model to API
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

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
      // Keep sample code on error
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle clear output
  const handleClearOutput = () => {
    setOutputCode('');
    setOutputMetadata({
      lines: 0,
      compliance: 100,
      generatedAt: mounted ? new Date().toLocaleTimeString() : '',
      model: currentModel,
    });
  };

  // Handle run (placeholder)
  const handleRun = () => {
    console.log('Running code:', outputCode);
  };

  // Handle model change
  const handleModelChange = (model: string) => {
    setCurrentModel(model);
    // Update output metadata with new model
    setOutputMetadata(prev => ({
      ...prev,
      model: model,
    }));
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <ScrollArea className="h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
        <div className="space-y-6">
          {/* Header */}
          <SovereignHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 space-y-6">
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

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6">
              {/* Status Panel with Model Selector */}
              <StatusPanel
                violationsFixed={statusState.violationsFixed}
                compliancePercent={statusState.compliancePercent}
                status={statusState.status}
                modelName={currentModel}
                nodesDiscovered={statusState.nodesDiscovered}
                currentModel={currentModel}
                onModelChange={handleModelChange}
              />

              {/* Quick Prompts */}
              <QuickPrompts onPromptSelect={handlePromptSelect} />

              {/* Input & Output Grid */}
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

              {/* JARVIS Terminal */}
              <JARVISTerminal />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}