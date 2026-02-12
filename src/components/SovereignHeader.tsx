'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

export type CategoryFilter = 'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

interface SovereignHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

export function SovereignHeader({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}: SovereignHeaderProps) {
  const categories: CategoryFilter[] = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  return (
    <header className="glass-card rounded-xl p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-glow-purple text-primary tracking-wide">
            SOVEREIGN COMMANDS v3.5
          </h1>
          <Badge className="badge-cyan text-xs px-2 py-1">
            NEURAL ENGINE ACTIVE
          </Badge>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-input border-border input-glow transition-smooth"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`category-pill px-4 py-2 rounded-lg border text-sm font-medium transition-smooth ${
                categoryFilter === category
                  ? 'active border-primary bg-primary/20 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
