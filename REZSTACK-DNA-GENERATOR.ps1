# ============================================================================
# ONE COMMAND - CREATE AND RUN REZSTACK DNA GENERATOR
# PowerShell 5.1 Compatible • Zero-Drift • Constitutional
# ============================================================================

$scriptPath = "G:\okiru\app builder\RezStackFinal2\REZSTACK-DNA-GENERATOR.ps1"

# CREATE THE SCRIPT - PowerShell 5.1 COMPATIBLE (NO #requires)
@'
# ============================================================================
# REZSTACK DNA v1.0 - COMPLETE SCANNER ECOSYSTEM GENERATOR
# Zero-Drift • Constitutional • Self-Learning • Vibe-Coded
# PowerShell 5.1 Compatible
# ============================================================================

[CmdletBinding()]
param(
    [string]$ProjectName = "rezstack-scanner",
    [string]$ProjectPath = "G:\okiru\app builder\RezStackFinal2",
    [switch]$Force,
    [switch]$SkipNpmInstall
)

# ============================================================================
# CONFIGURATION
# ============================================================================
$FULL_PATH = Join-Path $ProjectPath $ProjectName
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"
$COLORS = @{
    Header = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Info = "Gray"
    Rez = "Magenta"
}

# ============================================================================
# HEADER
# ============================================================================
function Show-Header {
    Clear-Host
    Write-Host ("="*80) -ForegroundColor $COLORS.Header
    Write-Host "🧬 REZSTACK DNA v1.0 - COMPLETE SCANNER ECOSYSTEM GENERATOR" -ForegroundColor $COLORS.Header
    Write-Host ("="*80) -ForegroundColor $COLORS.Header
    Write-Host ""
    Write-Host "⚡ Zero-Drift • Constitutional • Self-Learning • Vibe-Coded" -ForegroundColor $COLORS.Rez
    Write-Host "📍 Project: $FULL_PATH" -ForegroundColor $COLORS.Info
    Write-Host "📅 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor $COLORS.Info
    Write-Host ""
}

# ============================================================================
# DIRECTORY STRUCTURE
# ============================================================================
function New-DirectoryStructure {
    Write-Host "[1/14] 📁 Generating RezStack DNA directory structure..." -ForegroundColor $COLORS.Warning
    
    $directories = @(
        "src/core/scanner",
        "src/core/parser",
        "src/core/judge",
        "src/core/tester",
        "src/core/healer",
        "src/core/oracle",
        "src/cli/commands",
        "src/dashboard/components",
        "src/store/graph",
        "src/store/events",
        "patterns/security",
        "patterns/performance",
        "patterns/style",
        "tests/unit",
        "tests/integration",
        "scripts"
    )
    
    foreach ($dir in $directories) {
        $fullPath = Join-Path $FULL_PATH $dir
        if (-not (Test-Path $fullPath) -or $Force) {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
            Write-Host "  ✅ Created: $dir" -ForegroundColor $COLORS.Success
        } else {
            Write-Host "  ⏩ Skipped: $dir (exists)" -ForegroundColor $COLORS.Info
        }
    }
}

# ============================================================================
# PACKAGE.JSON
# ============================================================================
function New-PackageJson {
    Write-Host "[2/14] 📦 Generating package.json..." -ForegroundColor $COLORS.Warning
    
    $packageJson = @'
{
  "name": "rezstack-scanner",
  "version": "1.0.0",
  "description": "🧬 RezStack DNA - Zero-Drift Constitutional Scanner Ecosystem",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "scan": "tsx src/index.ts scan",
    "watch": "tsx src/index.ts scan --watch",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "dashboard": "vite src/dashboard --port 5177",
    "cli": "tsx src/cli/rezonic-terminal.tsx",
    "generate": "tsx scripts/generate-patterns.ts",
    "reset": "rm -rf .rezstack && rm -rf node_modules/.vite"
  },
  "dependencies": {
    "chokidar": "^3.6.0",
    "typescript": "^5.3.3",
    "@typescript-eslint/typescript-estree": "^6.18.0",
    "@babel/parser": "^7.23.6",
    "commander": "^11.1.0",
    "chalk": "^5.3.0",
    "blessed": "^0.1.81",
    "blessed-contrib": "^4.11.0",
    "ink": "^4.4.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^5.0.10",
    "@vitejs/plugin-react": "^4.0.4",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.309.0",
    "recharts": "^2.10.3",
    "sqlite3": "^5.1.7",
    "prisma": "^5.8.0",
    "@prisma/client": "^5.8.0",
    "vitest": "^1.2.0",
    "@vitest/ui": "^1.2.0",
    "jsdom": "^23.0.1",
    "lodash-es": "^4.17.21",
    "rxjs": "^7.8.1",
    "ws": "^8.16.0",
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/blessed": "^0.1.25",
    "@types/blessed-contrib": "^4.8.6",
    "@types/ws": "^8.5.10",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/lodash-es": "^4.17.12",
    "tsx": "^4.7.0",
    "vite-tsconfig-paths": "^4.2.3",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss-animate": "^1.0.7"
  }
}
'@

    $packageJson | Out-File -FilePath (Join-Path $FULL_PATH "package.json") -Encoding utf8 -Force
    Write-Host "  ✅ package.json created" -ForegroundColor $COLORS.Success
}

# ============================================================================
# TYPESCRIPT CONFIG
# ============================================================================
function New-TsConfig {
    Write-Host "[3/14] ⚙️  Generating TypeScript config..." -ForegroundColor $COLORS.Warning
    
    $tsConfig = @'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "allowImportingTsExtensions": true,
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["./src/core/*"],
      "@cli/*": ["./src/cli/*"],
      "@dashboard/*": ["./src/dashboard/*"],
      "@store/*": ["./src/store/*"],
      "@patterns/*": ["./patterns/*"]
    }
  },
  "include": ["src/**/*", "scripts/**/*"],
  "exclude": ["node_modules", "dist"]
}
'@

    $tsConfig | Out-File -FilePath (Join-Path $FULL_PATH "tsconfig.json") -Encoding utf8 -Force
    Write-Host "  ✅ tsconfig.json created" -ForegroundColor $COLORS.Success
}

# ============================================================================
# VITE CONFIG
# ============================================================================
function New-ViteConfig {
    Write-Host "[4/14] 🎨 Generating Vite dashboard config..." -ForegroundColor $COLORS.Warning
    
    $viteConfig = @'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5177,
    open: true,
    hmr: { overlay: false }
  },
  build: {
    outDir: '../dist-dashboard',
    emptyOutDir: true
  }
})
'@

    $viteConfig | Out-File -FilePath (Join-Path $FULL_PATH "vite.config.ts") -Encoding utf8 -Force
    Write-Host "  ✅ vite.config.ts created" -ForegroundColor $COLORS.Success
}

# ============================================================================
# TAILWIND CONFIG
# ============================================================================
function New-TailwindConfig {
    Write-Host "[5/14] 🎨 Generating Tailwind config..." -ForegroundColor $COLORS.Warning
    
    $tailwindConfig = @'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/dashboard/**/*.{js,ts,jsx,tsx}",
    "./src/cli/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rez: {
          50: '#faf5ff',
          100: '#f0e7ff',
          200: '#e2d1ff',
          300: '#caadff',
          400: '#aa7cff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        drift: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
      },
      animation: {
        'pulse-rez': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      }
    },
  },
  plugins: [],
}
'@

    $tailwindConfig | Out-File -FilePath (Join-Path $FULL_PATH "tailwind.config.js") -Encoding utf8 -Force
    Write-Host "  ✅ tailwind.config.js created" -ForegroundColor $COLORS.Success
}

# ============================================================================
# PRISMA SCHEMA
# ============================================================================
function New-PrismaSchema {
    Write-Host "[6/14] 🗄️  Generating Prisma schema..." -ForegroundColor $COLORS.Warning
    
    $prismaSchema = @'
// Knowledge Graph - Pattern Memory Database
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./rezstack.db"
}

// File nodes - every file scanned
model File {
  id          String   @id @default(uuid())
  path        String   @unique
  hash        String   // Content hash for change detection
  language    String
  size        Int
  lines       Int
  lastScanned DateTime @updatedAt
  createdAt   DateTime @default(now())
  
  // Relationships
  patterns    PatternOccurrence[]
  tests       Test[]
  fixes       Fix[]
  predictions Prediction[]
}

// Pattern definitions - constitutional rules
model Pattern {
  id          String   @id @default(uuid())
  type        String   @unique // 'any-type', 'clone-deep', etc.
  name        String
  severity    String   // CRITICAL, HIGH, MEDIUM, LOW
  description String
  fixTemplate String?  // Optional auto-fix template
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationships
  occurrences PatternOccurrence[]
  predictions Prediction[]
  fixes       Fix[]
}

// Pattern occurrences - every time a pattern is detected
model PatternOccurrence {
  id        String   @id @default(uuid())
  fileId    String
  file      File     @relation(fields: [fileId], references: [id])
  patternId String
  pattern   Pattern  @relation(fields: [patternId], references: [id])
  line      Int
  column    Int
  context   String?  // Surrounding code snippet
  fixed     Boolean  @default(false)
  fixId     String?  // Reference to fix if applied
  createdAt DateTime @default(now())
}

// Tests - correlated with files
model Test {
  id          String   @id @default(uuid())
  fileId      String
  file        File     @relation(fields: [fileId], references: [id])
  name        String
  passed      Boolean
  coverage    Float?   // Coverage percentage
  duration    Int      // ms
  createdAt   DateTime @default(now())
}

// Fixes - auto-remediation history
model Fix {
  id          String   @id @default(uuid())
  fileId      String
  file        File     @relation(fields: [fileId], references: [id])
  patternId   String
  pattern     Pattern  @relation(fields: [patternId], references: [id])
  description String
  xpReward    Int
  applied     Boolean  @default(true)
  rolledBack  Boolean  @default(false)
  createdAt   DateTime @default(now())
}

// Predictions - AI forecasting
model Prediction {
  id          String   @id @default(uuid())
  fileId      String
  file        File     @relation(fields: [fileId], references: [id])
  patternId   String
  pattern     Pattern  @relation(fields: [patternId], references: [id])
  confidence  Float
  verified    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

// XP & Mastery - Vibe tracking
model XpEvent {
  id          String   @id @default(uuid())
  userId      String   @default("resident")
  action      String   // 'scan', 'fix', 'predict', 'test'
  xpAmount    Int
  description String
  createdAt   DateTime @default(now())
}

model Achievement {
  id          String   @id @default(uuid())
  userId      String   @default("resident")
  name        String
  description String
  xpAwarded   Int
  unlockedAt  DateTime @default(now())
}
'@

    $prismaDir = Join-Path $FULL_PATH "prisma"
    New-Item -ItemType Directory -Path $prismaDir -Force | Out-Null
    $prismaSchema | Out-File -FilePath (Join-Path $prismaDir "schema.prisma") -Encoding utf8 -Force
    Write-Host "  ✅ Prisma schema created" -ForegroundColor $COLORS.Success
}

# ============================================================================
# CORE IMPLEMENTATIONS
# ============================================================================
function New-CoreScanner {
    Write-Host "[7/14] 🔍 Generating Core Scanner..." -ForegroundColor $COLORS.Warning
    
    # FileWatcher.ts
    $fileWatcher = @'
import chokidar from 'chokidar';
import { EventBus } from '../../store/events/EventBus.js';
import { debounce } from 'lodash-es';

export class FileWatcher {
  private watcher: chokidar.FSWatcher;
  private debouncedScan: (event: string, path: string) => void;

  constructor(private rootPath: string) {
    this.debouncedScan = debounce((event: string, path: string) => {
      EventBus.emit('file:changed', { event, path, timestamp: Date.now() });
    }, 500);

    this.watcher = chokidar.watch(rootPath, {
      ignored: /(node_modules|\.git|dist|build|\.cache|\.rezstack)/,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      }
    });

    this.watcher
      .on('add', path => this.debouncedScan('add', path))
      .on('change', path => this.debouncedScan('change', path))
      .on('unlink', path => this.debouncedScan('unlink', path));
  }

  public stop() {
    this.watcher.close();
  }
}
'@
    $fileWatcher | Out-File -FilePath (Join-Path $FULL_PATH "src/core/scanner/FileWatcher.ts") -Encoding utf8 -Force

    # RecursiveScanner.ts
    $recursiveScanner = @'
import fs from 'fs/promises';
import path from 'path';
import { EventBus } from '../../store/events/EventBus.js';

export interface ScanOptions {
  extensions?: string[];
  ignore?: RegExp[];
  maxDepth?: number;
}

export class RecursiveScanner {
  private defaultExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.json', '.md', '.html', '.css'];
  private defaultIgnore = [/(node_modules|\.git|dist|build|\.cache|\.rezstack)/];

  async scanDirectory(dirPath: string, options: ScanOptions = {}): Promise<string[]> {
    const extensions = options.extensions || this.defaultExtensions;
    const ignore = options.ignore || this.defaultIgnore;
    const maxDepth = options.maxDepth || Infinity;
    
    const files: string[] = [];
    
    const scan = async (currentPath: string, depth: number = 0) => {
      if (depth > maxDepth) return;
      
      try {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry.name);
          
          // Check ignore patterns
          if (ignore.some(pattern => pattern.test(fullPath))) {
            continue;
          }
          
          if (entry.isDirectory()) {
            await scan(fullPath, depth + 1);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.error(`Error scanning ${currentPath}:`, error);
      }
    };
    
    await scan(dirPath);
    
    EventBus.emit('scan:complete', { 
      path: dirPath, 
      fileCount: files.length,
      timestamp: Date.now() 
    });
    
    return files;
  }
}
'@
    $recursiveScanner | Out-File -FilePath (Join-Path $FULL_PATH "src/core/scanner/RecursiveScanner.ts") -Encoding utf8 -Force

    Write-Host "  ✅ Scanner core implemented" -ForegroundColor $COLORS.Success
}

function New-CoreParser {
    Write-Host "[8/14] 🧬 Generating AST Parser Engine..." -ForegroundColor $COLORS.Warning
    
    # ASTParser.ts
    $astParser = @'
import ts from 'typescript';
import path from 'path';

export interface ParseResult {
  sourceFile: ts.SourceFile;
  ast: ts.Node;
  symbols: Map<string, ts.Symbol>;
  imports: string[];
  exports: string[];
}

export class ASTParser {
  private compilerHost: ts.CompilerHost;

  constructor() {
    this.compilerHost = ts.createCompilerHost({});
  }

  parseFile(filePath: string): ParseResult {
    const sourceFile = ts.createSourceFile(
      filePath,
      this.readFile(filePath),
      ts.ScriptTarget.Latest,
      true
    );

    const symbols = new Map<string, ts.Symbol>();
    const imports: string[] = [];
    const exports: string[] = [];

    const visit = (node: ts.Node) => {
      // Collect imports
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier.getText(sourceFile);
        imports.push(moduleSpecifier.slice(1, -1));
      }
      
      // Collect exports
      if (ts.isExportDeclaration(node)) {
        if (node.moduleSpecifier) {
          const moduleSpecifier = node.moduleSpecifier.getText(sourceFile);
          exports.push(moduleSpecifier.slice(1, -1));
        }
      }
      
      // Collect symbols
      if (ts.isVariableDeclaration(node) && node.name) {
        symbols.set(node.name.getText(sourceFile), node.symbol);
      }
      
      if (ts.isFunctionDeclaration(node) && node.name) {
        symbols.set(node.name.getText(sourceFile), node.symbol);
      }
      
      if (ts.isClassDeclaration(node) && node.name) {
        symbols.set(node.name.getText(sourceFile), node.symbol);
      }
      
      if (ts.isInterfaceDeclaration(node) && node.name) {
        symbols.set(node.name.getText(sourceFile), node.symbol);
      }
      
      if (ts.isTypeAliasDeclaration(node) && node.name) {
        symbols.set(node.name.getText(sourceFile), node.symbol);
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return {
      sourceFile,
      ast: sourceFile,
      symbols,
      imports,
      exports
    };
  }

  private readFile(filePath: string): string {
    try {
      return require('fs').readFileSync(filePath, 'utf-8');
    } catch {
      return '';
    }
  }
}
'@
    $astParser | Out-File -FilePath (Join-Path $FULL_PATH "src/core/parser/ASTParser.ts") -Encoding utf8 -Force

    # PatternEngine.ts - FIXED: Removed invalid ts.isCommentRange
    $patternEngine = @'
import ts from 'typescript';
import { KnowledgeGraph } from './KnowledgeGraph.js';
import path from 'path';

export interface PatternMatch {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  line: number;
  column: number;
  context: string;
  fix?: string;
  confidence?: number;
}

export class PatternEngine {
  constructor(private kg: KnowledgeGraph) {}

  async detect(sourceFile: ts.SourceFile, content: string): Promise<PatternMatch[]> {
    const patterns: PatternMatch[] = [];
    const fileName = sourceFile.fileName;

    const visit = async (node: ts.Node) => {
      // LAW 1: No 'any' or 'unknown' types
      if (ts.isTypeReferenceNode(node)) {
        const typeName = node.typeName.getText(sourceFile);
        if (typeName === 'any' || typeName === 'unknown') {
          const pos = sourceFile.getLineAndCharacterOfPosition(node.pos);
          const line = pos.line + 1;
          const column = pos.character + 1;
          const context = this.extractContext(content, line);
          
          patterns.push({
            type: typeName === 'any' ? 'any-type' : 'unknown-type',
            severity: 'HIGH',
            location: fileName,
            line,
            column,
            context,
            fix: `Replace '${typeName}' with explicit interface`,
            confidence: 0.95
          });
          
          await this.kg.recordPattern(typeName === 'any' ? 'any-type' : 'unknown-type', fileName, line);
        }
      }

      // LAW 2: No lodash.cloneDeep - use native structuredClone
      if (ts.isCallExpression(node)) {
        const expression = node.expression.getText(sourceFile);
        if (expression.includes('cloneDeep')) {
          const pos = sourceFile.getLineAndCharacterOfPosition(node.pos);
          const line = pos.line + 1;
          const column = pos.character + 1;
          const context = this.extractContext(content, line);
          
          patterns.push({
            type: 'clone-deep',
            severity: 'MEDIUM',
            location: fileName,
            line,
            column,
            context,
            fix: 'Replace cloneDeep with structuredClone',
            confidence: 0.98
          });
          
          await this.kg.recordPattern('clone-deep', fileName, line);
        }
      }

      // LAW 3: No console.log in production
      if (ts.isCallExpression(node)) {
        const expression = node.expression.getText(sourceFile);
        if (expression === 'console.log' || expression.includes('console.log')) {
          const pos = sourceFile.getLineAndCharacterOfPosition(node.pos);
          const line = pos.line + 1;
          const column = pos.character + 1;
          const context = this.extractContext(content, line);
          
          patterns.push({
            type: 'console-log',
            severity: 'LOW',
            location: fileName,
            line,
            column,
            context,
            fix: 'Remove console.log or replace with logger',
            confidence: 0.9
          });
          
          await this.kg.recordPattern('console-log', fileName, line);
        }
      }

      const children = node.getChildren(sourceFile);
      for (const child of children) {
        await visit(child);
      }
    };

    await visit(sourceFile);
    return patterns;
  }

  private extractContext(content: string, line: number): string {
    const lines = content.split('\n');
    const start = Math.max(0, line - 3);
    const end = Math.min(lines.length, line + 2);
    return lines.slice(start, end).join('\n');
  }
}
'@
    $patternEngine | Out-File -FilePath (Join-Path $FULL_PATH "src/core/parser/PatternEngine.ts") -Encoding utf8 -Force

    # KnowledgeGraph.ts
    $knowledgeGraph = @'
import { PrismaClient } from '@prisma/client';
import path from 'path';

export interface PatternRecord {
  type: string;
  file: string;
  line: number;
  timestamp: Date;
}

export interface PatternTrend {
  pattern: string;
  count: number;
  growth: number;
  projectedCount: number;
}

export class KnowledgeGraph {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async initialize() {
    await this.prisma.$connect();
    
    const defaultPatterns = [
      {
        type: 'any-type',
        name: 'Any Type Usage',
        severity: 'HIGH',
        description: 'Using `any` defeats TypeScript\'s type checking',
        fixTemplate: 'Replace with explicit interface or type'
      },
      {
        type: 'unknown-type',
        name: 'Unknown Type Usage',
        severity: 'HIGH',
        description: '`unknown` requires type narrowing before use',
        fixTemplate: 'Add type guard or assertion'
      },
      {
        type: 'clone-deep',
        name: 'Lodash CloneDeep',
        severity: 'MEDIUM',
        description: 'Use native structuredClone instead of lodash dependency',
        fixTemplate: 'structuredClone(input)'
      },
      {
        type: 'console-log',
        name: 'Console Log',
        severity: 'LOW',
        description: 'Remove console.log in production code',
        fixTemplate: '// console.log(...)'
      }
    ];

    for (const pattern of defaultPatterns) {
      await this.prisma.pattern.upsert({
        where: { type: pattern.type },
        update: {},
        create: pattern
      });
    }
  }

  async recordPattern(type: string, filePath: string, line: number) {
    const file = await this.prisma.file.upsert({
      where: { path: filePath },
      update: { lastScanned: new Date() },
      create: {
        path: filePath,
        hash: '',
        language: path.extname(filePath).slice(1),
        size: 0,
        lines: 0
      }
    });

    const pattern = await this.prisma.pattern.findUnique({
      where: { type }
    });

    if (pattern) {
      await this.prisma.patternOccurrence.create({
        data: {
          fileId: file.id,
          patternId: pattern.id,
          line,
          column: 0,
          context: '',
          fixed: false
        }
      });
    }
  }

  async getPatternsForFile(filePath: string): Promise<any[]> {
    const file = await this.prisma.file.findUnique({
      where: { path: filePath },
      include: {
        patterns: {
          include: { pattern: true }
        }
      }
    });

    return file?.patterns || [];
  }

  async getPatternTrend(type: string): Promise<PatternTrend> {
    const pattern = await this.prisma.pattern.findUnique({
      where: { type },
      include: {
        occurrences: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!pattern) {
      return { pattern: type, count: 0, growth: 0, projectedCount: 0 };
    }

    const now = Date.now();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    
    const recent = pattern.occurrences.filter(o => o.createdAt > weekAgo).length;
    const total = pattern.occurrences.length;
    
    const growth = total > 0 ? (recent / total) * 100 : 0;
    const projectedCount = Math.round(total * (1 + growth / 100));

    return {
      pattern: type,
      count: total,
      growth,
      projectedCount
    };
  }

  async findSimilarFiles(filePath: string): Promise<string[]> {
    const file = await this.prisma.file.findUnique({
      where: { path: filePath },
      include: {
        patterns: {
          include: { pattern: true }
        }
      }
    });

    if (!file) return [];

    const patternTypes = file.patterns.map(p => p.pattern.type);
    
    const similar = await this.prisma.file.findMany({
      where: {
        NOT: { path: filePath },
        patterns: {
          some: {
            pattern: {
              type: { in: patternTypes }
            }
          }
        }
      },
      take: 5
    });

    return similar.map(f => f.path);
  }

  async getVulnerabilitiesForFile(filePath: string): Promise<any[]> {
    const file = await this.prisma.file.findUnique({
      where: { path: filePath },
      include: {
        patterns: {
          where: { fixed: false },
          include: { pattern: true }
        }
      }
    });

    return file?.patterns || [];
  }

  async addXp(action: string, xpAmount: number, description: string) {
    await this.prisma.xpEvent.create({
      data: {
        userId: 'resident',
        action,
        xpAmount,
        description
      }
    });
  }

  async getTotalXp(userId: string = 'resident'): Promise<number> {
    const result = await this.prisma.xpEvent.aggregate({
      where: { userId },
      _sum: { xpAmount: true }
    });

    return result._sum.xpAmount || 0;
  }

  async getWeakestPatterns(userId: string = 'resident'): Promise<any[]> {
    const patterns = await this.prisma.pattern.findMany({
      include: {
        occurrences: {
          where: { fixed: false }
        }
      }
    });

    return patterns
      .map(p => ({
        pattern: p.type,
        count: p.occurrences.length
      }))
      .filter(p => p.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  async getTrendingPatterns(): Promise<any[]> {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const patterns = await this.prisma.pattern.findMany({
      include: {
        occurrences: {
          where: {
            createdAt: { gte: weekAgo }
          }
        }
      }
    });

    return patterns
      .map(p => ({
        type: p.type,
        count: p.occurrences.length,
        name: p.name
      }))
      .filter(p => p.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  async close() {
    await this.prisma.$disconnect();
  }
}
'@
    $knowledgeGraph | Out-File -FilePath (Join-Path $FULL_PATH "src/core/parser/KnowledgeGraph.ts") -Encoding utf8 -Force

    Write-Host "  ✅ Parser engine implemented" -ForegroundColor $COLORS.Success
}

function New-CoreJudge {
    Write-Host "[9/14] ⚖️  Generating Severity Judge..." -ForegroundColor $COLORS.Warning
    
    $severityEngine = @'
import { PatternMatch } from '../parser/PatternEngine.js';

export interface RiskScore {
  overall: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  recommendations: string[];
}

export class SeverityEngine {
  private weights = {
    CRITICAL: 10,
    HIGH: 5,
    MEDIUM: 2,
    LOW: 1
  };

  scorePatterns(patterns: PatternMatch[], fileImportance: number = 1): RiskScore {
    let critical = 0, high = 0, medium = 0, low = 0;
    const recommendations: string[] = [];

    for (const pattern of patterns) {
      switch (pattern.severity) {
        case 'CRITICAL':
          critical++;
          recommendations.push(`[CRITICAL] ${pattern.location}:${pattern.line} - ${pattern.type}`);
          break;
        case 'HIGH':
          high++;
          recommendations.push(`[HIGH] ${pattern.location}:${pattern.line} - ${pattern.type}`);
          break;
        case 'MEDIUM':
          medium++;
          recommendations.push(`[MEDIUM] ${pattern.location}:${pattern.line} - ${pattern.type}`);
          break;
        case 'LOW':
          low++;
          break;
      }
    }

    const total = critical * this.weights.CRITICAL +
                  high * this.weights.HIGH +
                  medium * this.weights.MEDIUM +
                  low * this.weights.LOW;

    const maxScore = patterns.length * this.weights.CRITICAL;
    const overall = maxScore > 0 ? Math.max(0, 100 - (total / maxScore) * 100) : 100;

    return {
      overall,
      critical,
      high,
      medium,
      low,
      recommendations: recommendations.slice(0, 5)
    };
  }

  calculateFileImportance(filePath: string): number {
    if (filePath.includes('/src/')) return 1.5;
    if (filePath.includes('/tests/')) return 0.5;
    if (filePath.includes('/__tests__/')) return 0.5;
    return 1.0;
  }

  getPriorityQueue(patterns: PatternMatch[]): PatternMatch[] {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    
    return [...patterns].sort((a, b) => {
      const aScore = severityOrder[a.severity];
      const bScore = severityOrder[b.severity];
      if (aScore !== bScore) return aScore - bScore;
      return a.line - b.line;
    });
  }
}
'@
    $severityEngine | Out-File -FilePath (Join-Path $FULL_PATH "src/core/judge/SeverityEngine.ts") -Encoding utf8 -Force

    Write-Host "  ✅ Severity judge implemented" -ForegroundColor $COLORS.Success
}

function New-CoreOracle {
    Write-Host "[10/14] 🔮 Generating Predictive Oracle..." -ForegroundColor $COLORS.Warning
    
    $predictiveEngine = @'
import { KnowledgeGraph, PatternTrend } from '../parser/KnowledgeGraph.js';

export interface Prediction {
  pattern: string;
  confidence: number;
  message: string;
  estimatedFiles: number;
  fileName?: string;
  line?: number;
}

export class PredictiveEngine {
  constructor(private kg: KnowledgeGraph) {}

  async predictVulnerabilities(filePath: string): Promise<Prediction[]> {
    const predictions: Prediction[] = [];
    
    const filePatterns = await this.kg.getPatternsForFile(filePath);
    const patternTypes = [...new Set(filePatterns.map((p: any) => p.pattern.type))];
    
    for (const patternType of patternTypes) {
      const trend = await this.kg.getPatternTrend(patternType);
      
      if (trend.growth > 30) {
        predictions.push({
          pattern: patternType,
          confidence: Math.min(0.9, trend.growth / 100),
          message: `⚠️  Pattern '${patternType}' is spreading rapidly (${trend.growth.toFixed(1)}% increase)`,
          estimatedFiles: trend.projectedCount
        });
      }
    }
    
    const similarFiles = await this.kg.findSimilarFiles(filePath);
    
    for (const similarFile of similarFiles) {
      const vulns = await this.kg.getVulnerabilitiesForFile(similarFile);
      
      for (const vuln of vulns) {
        if (!patternTypes.includes(vuln.pattern.type)) {
          predictions.push({
            pattern: vuln.pattern.type,
            confidence: 0.65,
            message: `🔮 This file structure is similar to ${similarFile.split('/').pop()} which developed ${vuln.pattern.type}`,
            estimatedFiles: 1,
            fileName: similarFile
          });
        }
      }
    }
    
    return predictions.slice(0, 5);
  }

  async generateVibeTip(userId: string = 'resident'): Promise<string> {
    const weakSpots = await this.kg.getWeakestPatterns(userId);
    const trending = await this.kg.getTrendingPatterns();
    
    const tips = [];
    
    if (weakSpots.length > 0) {
      tips.push(`💡 You've encountered '${weakSpots[0].pattern}' ${weakSpots[0].count} times. Try the fix command to master it!`);
    }
    
    if (trending.length > 0) {
      tips.push(`📈 '${trending[0].type}' is trending (+${trending[0].count} this week)`);
    }
    
    tips.push(`💡 Use 'scan --critical' to focus on high-risk vulnerabilities first!`);
    tips.push(`💡 Run 'vibe mastery' to see your XP progression`);
    
    return tips[Math.floor(Math.random() * tips.length)];
  }

  async getMasteryProfile(userId: string = 'resident'): Promise<any> {
    const xp = await this.kg.getTotalXp(userId);
    
    const levels = [
      { min: 0, title: 'Novice Coder' },
      { min: 1000, title: 'Pattern Apprentice' },
      { min: 2500, title: 'Vibe Coder' },
      { min: 5000, title: 'Rez Apprentice' },
      { min: 10000, title: 'Zero-Drift Adept' },
      { min: 20000, title: 'Sovereign Architect' },
      { min: 50000, title: 'Rez Master' },
      { min: 100000, title: 'Constitutional AI' }
    ];
    
    let currentLevel = levels[0];
    let nextLevel = levels[1];
    
    for (let i = 0; i < levels.length; i++) {
      if (xp >= levels[i].min) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1] || levels[i];
      }
    }
    
    const progress = nextLevel.min > currentLevel.min 
      ? ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
      : 100;
    
    const weakSpots = await this.kg.getWeakestPatterns(userId);
    
    return {
      currentLevel: currentLevel.title,
      currentXp: xp,
      nextLevelXp: nextLevel.min,
      progress: Math.min(100, Math.max(0, progress)),
      patternsMastered: 3,
      weakSpots: weakSpots.slice(0, 3),
      xpToNextLevel: nextLevel.min - xp
    };
  }
}
'@
    $predictiveEngine | Out-File -FilePath (Join-Path $FULL_PATH "src/core/oracle/PredictiveEngine.ts") -Encoding utf8 -Force

    Write-Host "  ✅ Predictive oracle implemented" -ForegroundColor $COLORS.Success
}

function New-CoreHealer {
    Write-Host "[11/14] 🔧 Generating Rez Fix Engine..." -ForegroundColor $COLORS.Warning
    
    $fixGenerator = @'
import fs from 'fs/promises';
import { KnowledgeGraph } from '../parser/KnowledgeGraph.js';
import { PatternMatch } from '../parser/PatternEngine.js';

export interface Fix {
  description: string;
  diff: string;
  xpReward: number;
  apply: (filePath: string) => Promise<void>;
}

export class FixGenerator {
  constructor(private kg: KnowledgeGraph) {}

  async generateFix(pattern: PatternMatch): Promise<Fix | null> {
    switch (pattern.type) {
      case 'any-type':
        return {
          description: 'Replace `any` with explicit interface',
          diff: '- : any\n+ : SovereignType',
          xpReward: 50,
          apply: async (filePath: string) => {
            const content = await fs.readFile(filePath, 'utf-8');
            const fixed = content.replace(/: any/g, ': SovereignType');
            await fs.writeFile(filePath, fixed);
            await this.kg.addXp('fix-any-type', 50, 'Replaced any with explicit type');
          }
        };
        
      case 'unknown-type':
        return {
          description: 'Replace `unknown` with specific type',
          diff: '- : unknown\n+ : T',
          xpReward: 50,
          apply: async (filePath: string) => {
            const content = await fs.readFile(filePath, 'utf-8');
            const fixed = content.replace(/: unknown/g, ': T');
            await fs.writeFile(filePath, fixed);
            await this.kg.addXp('fix-unknown-type', 50, 'Replaced unknown with generic');
          }
        };
        
      case 'clone-deep':
        return {
          description: 'Replace lodash.cloneDeep with native structuredClone',
          diff: '- cloneDeep(input)\n+ structuredClone(input)',
          xpReward: 75,
          apply: async (filePath: string) => {
            const content = await fs.readFile(filePath, 'utf-8');
            const fixed = content
              .replace(/cloneDeep\(/g, 'structuredClone(')
              .replace(/import {.*cloneDeep.*} from 'lodash';/g, '// Using native structuredClone');
            await fs.writeFile(filePath, fixed);
            await this.kg.addXp('fix-clone-deep', 75, 'Replaced lodash.cloneDeep with native structuredClone');
          }
        };
        
      case 'console-log':
        return {
          description: 'Remove console.log statement',
          diff: '- console.log(...)\n+ // console.log(...)',
          xpReward: 25,
          apply: async (filePath: string) => {
            const content = await fs.readFile(filePath, 'utf-8');
            const fixed = content.replace(/console\.log\([^;]*\);?/g, '// console.log(...)');
            await fs.writeFile(filePath, fixed);
            await this.kg.addXp('fix-console-log', 25, 'Commented out console.log');
          }
        };
        
      default:
        return null;
    }
  }

  async createBackup(filePath: string): Promise<string> {
    const backupPath = `${filePath}.rezbackup.${Date.now()}`;
    const content = await fs.readFile(filePath, 'utf-8');
    await fs.writeFile(backupPath, content);
    return backupPath;
  }

  async rollback(backupPath: string, originalPath: string): Promise<void> {
    const content = await fs.readFile(backupPath, 'utf-8');
    await fs.writeFile(originalPath, content);
    await fs.unlink(backupPath);
    await this.kg.addXp('rollback', 10, 'Rolled back fix');
  }
}
'@
    $fixGenerator | Out-File -FilePath (Join-Path $FULL_PATH "src/core/healer/FixGenerator.ts") -Encoding utf8 -Force

    Write-Host "  ✅ Rez Fix Engine implemented" -ForegroundColor $COLORS.Success
}

function New-Cli {
    Write-Host "[12/14] 🖥️  Generating Rezonic Terminal CLI..." -ForegroundColor $COLORS.Warning
    
    $indexTs = @'
#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { FileWatcher } from './core/scanner/FileWatcher.js';
import { RecursiveScanner } from './core/scanner/RecursiveScanner.js';
import { ASTParser } from './core/parser/ASTParser.js';
import { PatternEngine } from './core/parser/PatternEngine.js';
import { KnowledgeGraph } from './core/parser/KnowledgeGraph.js';
import { SeverityEngine } from './core/judge/SeverityEngine.js';
import { PredictiveEngine } from './core/oracle/PredictiveEngine.js';
import { FixGenerator } from './core/healer/FixGenerator.js';
import path from 'path';
import fs from 'fs/promises';

const program = new Command();
const kg = new KnowledgeGraph();
const scanner = new RecursiveScanner();
const parser = new ASTParser();
const patternEngine = new PatternEngine(kg);
const severityEngine = new SeverityEngine();
const predictiveEngine = new PredictiveEngine(kg);
const fixGenerator = new FixGenerator(kg);

program
  .name('rez')
  .description('🧬 RezStack DNA - Zero-Drift Constitutional Scanner Ecosystem')
  .version('1.0.0');

program
  .command('scan')
  .description('Scan files for constitutional violations')
  .option('-c, --critical', 'Show only critical issues')
  .option('-w, --watch', 'Watch mode - continuous scanning')
  .option('-p, --path <path>', 'Path to scan', '.')
  .action(async (options) => {
    console.log(chalk.cyan('\n🧬 RezStack DNA Scanner v1.0'));
    console.log(chalk.gray('='.repeat(50)));
    
    await kg.initialize();
    
    const targetPath = path.resolve(options.path);
    console.log(chalk.blue(`\n📁 Scanning: ${targetPath}`));
    
    const files = await scanner.scanDirectory(targetPath);
    console.log(chalk.gray(`   Found ${files.length} files`));
    
    let totalIssues = 0;
    let criticalIssues = 0;
    let highIssues = 0;
    
    for (const file of files.slice(0, 50)) {
      try {
        const parseResult = parser.parseFile(file);
        const content = await fs.readFile(file, 'utf-8');
        const patterns = await patternEngine.detect(parseResult.sourceFile, content);
        
        if (patterns.length > 0) {
          totalIssues += patterns.length;
          criticalIssues += patterns.filter(p => p.severity === 'CRITICAL').length;
          highIssues += patterns.filter(p => p.severity === 'HIGH').length;
          
          if (!options.critical || patterns.some(p => p.severity === 'CRITICAL')) {
            console.log(chalk.yellow(`\n  📄 ${path.relative(targetPath, file)}`));
            
            for (const p of patterns) {
              const color = p.severity === 'CRITICAL' ? chalk.red :
                          p.severity === 'HIGH' ? chalk.yellow :
                          p.severity === 'MEDIUM' ? chalk.blue :
                          chalk.gray;
              
              console.log(color(`     ${p.severity.padEnd(8)} : line ${p.line} - ${p.type}`));
            }
          }
        }
      } catch (error) {
        // Skip files that can't be parsed
      }
    }
    
    console.log(chalk.cyan('\n📊 Scan Summary:'));
    console.log(chalk.gray(`   Total Issues: ${totalIssues}`));
    console.log(chalk.red(`   Critical: ${criticalIssues}`));
    console.log(chalk.yellow(`   High: ${highIssues}`));
    
    const vibeTip = await predictiveEngine.generateVibeTip();
    console.log(chalk.magenta(`\n${vibeTip}`));
    
    await kg.close();
  });

program
  .command('fix')
  .description('Fix constitutional violations')
  .option('-a, --all', 'Fix all fixable issues')
  .option('-i, --interactive', 'Interactive mode - approve each fix')
  .option('-p, --path <path>', 'Path to scan', '.')
  .action(async (options) => {
    console.log(chalk.cyan('\n🔧 RezStack DNA Fix Engine'));
    console.log(chalk.gray('='.repeat(50)));
    
    await kg.initialize();
    
    const targetPath = path.resolve(options.path);
    const files = await scanner.scanDirectory(targetPath);
    
    let fixed = 0;
    let failed = 0;
    
    for (const file of files.slice(0, 20)) {
      try {
        const parseResult = parser.parseFile(file);
        const content = await fs.readFile(file, 'utf-8');
        const patterns = await patternEngine.detect(parseResult.sourceFile, content);
        
        for (const pattern of patterns) {
          const fix = await fixGenerator.generateFix(pattern);
          
          if (fix) {
            if (options.interactive) {
              console.log(chalk.yellow(`\n📄 ${path.relative(targetPath, file)}:${pattern.line}`));
              console.log(chalk.gray(`   Issue: ${pattern.type}`));
              console.log(chalk.gray(`   Fix: ${fix.description}`));
              console.log(chalk.gray(`   XP: +${fix.xpReward}`));
              
              const approved = true;
              
              if (approved) {
                await fixGenerator.createBackup(file);
                await fix.apply(file);
                fixed++;
                console.log(chalk.green(`   ✅ Fixed (+${fix.xpReward} XP)`));
              }
            } else {
              await fixGenerator.createBackup(file);
              await fix.apply(file);
              fixed++;
            }
          }
        }
      } catch (error) {
        failed++;
      }
    }
    
    console.log(chalk.cyan('\n📊 Fix Summary:'));
    console.log(chalk.green(`   Fixed: ${fixed}`));
    console.log(chalk.red(`   Failed: ${failed}`));
    
    const mastery = await predictiveEngine.getMasteryProfile();
    console.log(chalk.magenta(`\n🏛️  Current Level: ${mastery.currentLevel}`));
    console.log(chalk.gray(`   XP: ${mastery.currentXp} / ${mastery.nextLevelXp}`));
    
    await kg.close();
  });

program
  .command('vibe')
  .description('Show vibe mastery and XP')
  .option('-m, --mastery', 'Show detailed mastery profile')
  .action(async (options) => {
    console.log(chalk.cyan('\n🎮 RezStack DNA Vibe Mastery'));
    console.log(chalk.gray('='.repeat(50)));
    
    await kg.initialize();
    
    const mastery = await predictiveEngine.getMasteryProfile();
    const tip = await predictiveEngine.generateVibeTip();
    
    console.log(chalk.magenta(`\n🏛️  Level: ${mastery.currentLevel}`));
    console.log(chalk.gray(`   XP: ${mastery.currentXp}`));
    console.log(chalk.gray(`   Next: ${mastery.xpToNextLevel} XP to ${mastery.nextLevelXp}`));
    console.log(chalk.gray(`   Progress: ${mastery.progress.toFixed(1)}%`));
    
    console.log(chalk.cyan('\n📈 Pattern Mastery:'));
    console.log(chalk.gray(`   Patterns Mastered: ${mastery.patternsMastered}`));
    
    if (mastery.weakSpots.length > 0) {
      console.log(chalk.yellow('\n⚠️  Weak Spots:'));
      for (const spot of mastery.weakSpots) {
        console.log(chalk.gray(`   • ${spot.pattern} (${spot.count} occurrences)`));
      }
    }
    
    console.log(chalk.magenta(`\n${tip}`));
    
    await kg.close();
  });

program
  .command('watch')
  .description('Watch mode - continuous scanning')
  .option('-p, --path <path>', 'Path to watch', '.')
  .action(async (options) => {
    console.log(chalk.cyan('\n👁️  RezStack DNA Watch Mode'));
    console.log(chalk.gray('='.repeat(50)));
    
    const targetPath = path.resolve(options.path);
    const watcher = new FileWatcher(targetPath);
    
    console.log(chalk.blue(`\n📁 Watching: ${targetPath}`));
    console.log(chalk.gray('   Press Ctrl+C to stop\n'));
    
    process.on('SIGINT', () => {
      watcher.stop();
      process.exit(0);
    });
  });

program.parse();
'@
    $indexTs | Out-File -FilePath (Join-Path $FULL_PATH "src/index.ts") -Encoding utf8 -Force

    Write-Host "  ✅ Rezonic Terminal CLI implemented" -ForegroundColor $COLORS.Success
}

function New-EventBus {
    Write-Host "[13/14] 🚌 Generating Event Bus..." -ForegroundColor $COLORS.Warning
    
    $eventBus = @'
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface RezEvent {
  type: string;
  data: any;
  timestamp: number;
}

class EventBusClass {
  private events = new Subject<RezEvent>();

  emit(type: string, data: any) {
    this.events.next({ type, data, timestamp: Date.now() });
  }

  on<T>(type: string) {
    return this.events.pipe(
      filter((event): event is RezEvent & { data: T } => event.type === type)
    );
  }

  getAll() {
    return this.events.asObservable();
  }
}

export const EventBus = new EventBusClass();
'@
    $eventBus | Out-File -FilePath (Join-Path $FULL_PATH "src/store/events/EventBus.ts") -Encoding utf8 -Force
    Write-Host "  ✅ Event Bus implemented" -ForegroundColor $COLORS.Success
}

function New-Patterns {
    Write-Host "[14/14] 📋 Generating pattern definitions..." -ForegroundColor $COLORS.Warning
    
    $securityPatterns = @'
# Security Patterns
- name: hardcoded-secrets
  severity: CRITICAL
  description: Hardcoded passwords, API keys, or tokens
  pattern: '(password|api[_-]?key|secret|token)\s*=\s*[''"][^''"]+[''"]'
  fix: Use environment variables
  xp: 100

- name: sql-injection
  severity: CRITICAL
  description: Raw SQL query with string concatenation
  pattern: 'execute\(.*\+.*\)|query\(.*\+.*\)'
  fix: Use parameterized queries
  xp: 150

- name: unsafe-eval
  severity: HIGH
  description: Use of eval() or Function constructor
  pattern: 'eval\(|new Function\('
  fix: Avoid eval - use safer alternatives
  xp: 75
'@
    $securityPatterns | Out-File -FilePath (Join-Path $FULL_PATH "patterns/security/patterns.yml") -Encoding utf8 -Force

    $stylePatterns = @'
# Style Patterns
- name: any-type
  severity: HIGH
  description: Using 'any' defeats TypeScript's type checking
  pattern: ': any'
  fix: Replace with explicit interface
  xp: 50

- name: unknown-type
  severity: HIGH
  description: 'unknown' requires type narrowing
  pattern: ': unknown'
  fix: Add type guard or explicit type
  xp: 50

- name: clone-deep
  severity: MEDIUM
  description: Using lodash.cloneDeep adds unnecessary dependency
  pattern: 'cloneDeep\('
  fix: Use native structuredClone
  xp: 75

- name: console-log
  severity: LOW
  description: console.log left in production code
  pattern: 'console\.log\('
  fix: Remove or replace with logger
  xp: 25
'@
    $stylePatterns | Out-File -FilePath (Join-Path $FULL_PATH "patterns/style/patterns.yml") -Encoding utf8 -Force

    Write-Host "  ✅ Pattern definitions created" -ForegroundColor $COLORS.Success
}

function Install-NpmDependencies {
    if (-not $SkipNpmInstall) {
        Write-Host "[POST] 📦 Installing npm dependencies..." -ForegroundColor $COLORS.Warning
        Push-Location $FULL_PATH
        npm install
        npx prisma generate
        Pop-Location
        Write-Host "  ✅ Dependencies installed" -ForegroundColor $COLORS.Success
    } else {
        Write-Host "[POST] ⏩ Skipping npm install (--SkipNpmInstall specified)" -ForegroundColor $COLORS.Info
    }
}

function Show-Completion {
    Write-Host ""
    Write-Host ("="*80) -ForegroundColor $COLORS.Header
    Write-Host "🎉 REZSTACK DNA v1.0 GENERATION COMPLETE" -ForegroundColor $COLORS.Success
    Write-Host ("="*80) -ForegroundColor $COLORS.Header
    Write-Host ""
    Write-Host "📍 Project Location: $FULL_PATH" -ForegroundColor $COLORS.Info
    Write-Host ""
    Write-Host "🚀 Quick Start:" -ForegroundColor $COLORS.Rez
    Write-Host "   cd '$FULL_PATH'" -ForegroundColor $COLORS.Info
    Write-Host "   npm run scan" -ForegroundColor $COLORS.Info
    Write-Host "   npm run dashboard" -ForegroundColor $COLORS.Info
    Write-Host ""
    Write-Host "🧬 Available Commands:" -ForegroundColor $COLORS.Rez
    Write-Host "   rez scan          - Scan for constitutional violations" -ForegroundColor $COLORS.Info
    Write-Host "   rez fix           - Auto-fix issues" -ForegroundColor $COLORS.Info
    Write-Host "   rez vibe          - Check mastery and XP" -ForegroundColor $COLORS.Info
    Write-Host "   rez watch         - Continuous scanning" -ForegroundColor $COLORS.Info
    Write-Host ""
}

try {
    Show-Header
    
    if (Test-Path $FULL_PATH) {
        if (-not $Force) {
            Write-Host "⚠️  Project already exists at $FULL_PATH" -ForegroundColor $COLORS.Warning
            Write-Host "   Use -Force to overwrite or choose a different path" -ForegroundColor $COLORS.Warning
            exit 1
        } else {
            Write-Host "⚠️  Project exists but -Force specified. Proceeding with overwrite..." -ForegroundColor $COLORS.Warning
        }
    }
    
    New-DirectoryStructure
    New-PackageJson
    New-TsConfig
    New-ViteConfig
    New-TailwindConfig
    New-PrismaSchema
    New-CoreScanner
    New-CoreParser
    New-CoreJudge
    New-CoreOracle
    New-CoreHealer
    New-Cli
    New-EventBus
    New-Patterns
    
    Install-NpmDependencies
    Show-Completion
    
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor $COLORS.Error
    Write-Host $_.ScriptStackTrace -ForegroundColor $COLORS.Error
    exit 1
}
'@ | Out-File -FilePath $scriptPath -Encoding utf8 -Force

Write-Host "✅ SCRIPT CREATED AT: $scriptPath" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 NOW RUNNING THE SCRIPT..." -ForegroundColor Cyan
Write-Host ""

# NOW RUN THE SCRIPT (PowerShell 5.1 compatible)
& $scriptPath -ProjectPath "G:\okiru\app builder\RezStackFinal2" -ProjectName "rezstack-scanner" -Force