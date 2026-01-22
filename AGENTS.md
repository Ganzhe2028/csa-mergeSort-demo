# AGENTS.md - AI Coding Assistant Guidelines

This file provides guidelines for AI coding agents working in this repository.

## Project Overview

A React + TypeScript + Vite interactive merge sort visualization demo. Uses Tailwind CSS for styling and Framer Motion for animations.

## Tech Stack

- **Framework**: React 18.3 with TypeScript 5.6
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3.4 with class-based dark mode
- **Animation**: Framer Motion 11
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge

---

## Build, Lint, and Test Commands

### Development
```bash
npm run dev          # Start development server with HMR
```

### Build
```bash
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally
```

### Linting
```bash
npm run lint         # Run ESLint on all TypeScript/TSX files
```

### Testing
No test framework is currently configured. If adding tests:
- Consider Vitest (Vite-native) or Jest
- Place test files in `__tests__/` or use `.test.ts(x)` suffix

---

## Project Structure

```
src/
  components/       # React components (PascalCase)
  hooks/            # Custom React hooks (camelCase with use prefix)
  utils/            # Utility functions
  types.ts          # Shared TypeScript types
  App.tsx           # Root component
  main.tsx          # Entry point
  index.css         # Tailwind directives and base styles
```

---

## Code Style Guidelines

### Imports

Order imports as follows:
1. React imports
2. External packages
3. Internal components/hooks
4. Types (use `type` keyword)
5. Styles

```typescript
// Correct
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumberBlock from './NumberBlock';
import type { SortNode } from '../types';
```

Use `type` imports for type-only imports:
```typescript
import type { SortNode } from '../types';
```

### TypeScript

- **Strict mode is enabled** - do not use `any`, `@ts-ignore`, or `@ts-expect-error`
- Define interfaces for component props
- Use `React.FC<Props>` for function components
- Export types from `src/types.ts` for shared types

```typescript
interface DashboardProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  disabled?: boolean;  // Optional props use ?
}

const Dashboard: React.FC<DashboardProps> = ({ isPlaying, onPlay, ... }) => {
  // ...
};
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `NumberBlock.tsx` |
| Hooks | camelCase with `use` prefix | `useMergeSort.ts` |
| Utilities | camelCase | `sleep.ts` |
| Types/Interfaces | PascalCase | `SortNode`, `SortColor` |
| Files | Match export name | `Dashboard.tsx` exports `Dashboard` |

### Components

- Use function components with arrow functions
- Use default exports for components
- Props interface defined above component

```typescript
interface Props {
  node: SortNode;
}

const NumberBlock: React.FC<Props> = ({ node }) => {
  return (
    <motion.div layoutId={node.id}>
      {node.value}
    </motion.div>
  );
};

export default NumberBlock;
```

### Styling with Tailwind

- Use Tailwind utility classes directly
- Use `clsx` for conditional classes
- Dark mode uses class-based strategy (`darkMode: 'class'`)

```typescript
import { clsx } from 'clsx';

className={clsx(
  'w-12 h-12 flex items-center justify-center rounded-lg',
  isActive && 'bg-blue-600',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}
```

### Hooks

- Custom hooks go in `src/hooks/`
- Return interface should be explicitly typed
- Use refs for mutable values that shouldn't trigger re-renders

```typescript
interface UseMergeSortReturn {
  nodes: SortNode[];
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
}

export const useMergeSort = (): UseMergeSortReturn => {
  // Implementation
};
```

### Error Handling

- Use try/catch for async operations
- Log errors with meaningful context
- Handle abort signals for cancelable operations

```typescript
try {
  await someAsyncOperation();
} catch (e) {
  if ((e as Error).message === 'Aborted') {
    console.log('Operation aborted');
  } else {
    console.error('Operation failed:', e);
  }
}
```

### Documentation

- Use JSDoc for utility functions
- Comments for complex logic only

```typescript
/**
 * Pauses execution for a specified number of milliseconds.
 * @param ms Duration to sleep in milliseconds
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
```

---

## ESLint Configuration

The project uses:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` (enforces Rules of Hooks)
- `eslint-plugin-react-refresh` (HMR compatibility)

Run `npm run lint` before committing changes.

---

## Important Patterns in This Codebase

### Animation with Framer Motion
- Use `layoutId` for shared element transitions
- Wrap animated lists with `AnimatePresence`
- Configure spring animations for smooth transitions

### State Management Pattern
- Use refs (`useRef`) alongside state for async logic control
- Refs provide synchronous access during async operations
- Update both ref and state when values change

```typescript
const [isPlaying, setIsPlaying] = useState(false);
const isPlayingRef = useRef(false);

const play = () => {
  setIsPlaying(true);
  isPlayingRef.current = true;  // Sync ref for async checks
};
```

---

## DO NOT

- Suppress TypeScript errors with `as any`, `@ts-ignore`, or `@ts-expect-error`
- Use empty catch blocks
- Commit `node_modules/` or `dist/`
- Mix styling approaches (stick to Tailwind)
