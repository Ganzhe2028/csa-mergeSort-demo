export type SortColor = 'default' | 'comparing' | 'sorted' | 'pivot';

export interface SortNode {
  id: string;      // Unique ID for layoutId
  value: number;   // The numeric value
  depth: number;   // Visual depth (row)
  group: number;   // Visual group index
  color: SortColor; // Visual state
  position: number; // Position within group (for sorted ordering)
}

export type RecursionPath = string[]; // e.g. ["root", "left", "right"]
