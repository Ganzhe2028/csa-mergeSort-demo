# AGENTS.md

This file guides AI agents (and human developers) working on the Merge Sort Visualization project.

## 1. Project Overview

This is a **React + TypeScript + Vite** application visualizing the Merge Sort algorithm.
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Linting**: ESLint (Flat Config)

## 2. Build & Test Commands

### Core Commands
- **Start Dev Server**: `npm run dev` (Runs on http://localhost:5173 by default)
- **Build for Production**: `npm run build` (Output to `dist/`)
- **Preview Production Build**: `npm run preview`
- **Lint Code**: `npm run lint` (Uses `eslint.config.js`)

### Testing
*Note: No test runner (Jest/Vitest) is currently configured in `package.json`.*
- If asked to run tests, first check if a test runner has been added.
- If adding tests, prefer **Vitest** for Vite compatibility.

## 3. Code Style & Conventions

### General
- **Indentation**: 2 spaces.
- **Semicolons**: Required.
- **Quotes**: Single quotes preferred for JS/TS string literals, Double quotes for JSX attributes.
- **Strict Mode**: TypeScript `strict: true` is enabled. Handle `null`/`undefined` explicitly.

### Naming Conventions
- **Components**: PascalCase (e.g., `SortingStage.tsx`, `NumberBlock.tsx`).
- **Hooks**: camelCase, prefix with `use` (e.g., `useMergeSort.ts`).
- **Utilities**: camelCase (e.g., `sleep.ts`).
- **Types/Interfaces**: PascalCase (e.g., `SortNode`, `ActiveGroup`).
- **Constants**: CONSTANT_CASE (e.g., `MERGE_SORT_PSEUDO_CODE`).

### Project Structure
- `src/components/`: Presentational and container components.
- `src/hooks/`: Business logic and state management (e.g., the sorting algorithm).
- `src/utils/`: Pure helper functions.
- `src/types.ts`: Shared TypeScript definitions.
- `src/constants.ts`: Static configuration data.

### Component Patterns
- **Functional Components**: Use `React.FC<Props>` or directly typed props `({ prop }: Props)`.
- **Styling**: Use Tailwind utility classes in `className`.
    - Example: `<div className="flex flex-col h-screen bg-gray-950">`
- **Animations**: Use `motion` components from `framer-motion`.
    - Prefer `layoutId` for shared element transitions.
    - Use `AnimatePresence` for mounting/unmounting lists.

### State Management Patterns
- **Async Visualization**: The sorting logic (`useMergeSort.ts`) uses a specific pattern:
    - **Refs (`useRef`)**: Used to hold the "source of truth" for nodes during the async sort execution to avoid stale closures.
    - **State (`useState`)**: Updated in parallel to trigger re-renders for the UI.
    - **AbortController**: Used to cancel ongoing sorts when resetting or unmounting.
    - **Wait/Sleep**: `await sleep(speed)` is used to pace the visualization.

## 4. Error Handling & Best Practices
- **Types**: Avoid `any`. Define interfaces in `src/types.ts` if shared.
- **Hooks**: Follow Rules of Hooks (dependency arrays). `eslint-plugin-react-hooks` is active.
- **Unused Code**: `noUnusedLocals` and `noUnusedParameters` are enabled in `tsconfig`.

## 5. Tooling Configuration
- **Vite**: Configured in `vite.config.ts`.
- **Tailwind**: Configured in `tailwind.config.js` and `postcss.config.js`.
- **TypeScript**: `tsconfig.app.json` (app logic) and `tsconfig.node.json` (build tools).

## 6. Workflow for Agents
1.  **Read**: Before editing, always read relevant files to understand context (`src/types.ts` is often useful).
2.  **Lint**: After significant edits, run `npm run lint` to catch issues.
3.  **UI Changes**: When modifying UI, prefer Tailwind classes over inline styles unless dynamic values (like coordinates/colors) are needed.
4.  **Refactoring**: If refactoring `useMergeSort`, be extremely careful with the Ref/State dual-maintenance pattern to prevent visual glitches.
