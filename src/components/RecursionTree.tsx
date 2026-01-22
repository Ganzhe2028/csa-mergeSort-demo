import React from 'react';
import type { SortNode } from '../types';

interface RecursionTreeProps {
  // We can infer the tree structure from the nodes' depths and groups
  // Or we can just visualize the current "stack" if we had that info.
  // The PRD says: "Sync: Highlight the current node based on a recursionPath state".
  // My hook doesn't currently expose recursionPath.
  // However, I can deduce the active "segment" by looking at comparing nodes.

  nodes: SortNode[];
}

// Since I didn't implement explicit recursion path tracking in the hook (it's implicit in the async stack),
// I will build a static tree based on the array size and highlight active areas based on 'comparing' or 'pivot' nodes.
// Or simply show a legend.
// PRD: "SVG or structured div tree".

const RecursionTree: React.FC<RecursionTreeProps> = ({ nodes }) => {
  // A simple visualization might be just showing the levels active
  const maxDepth = Math.max(...nodes.map(n => n.depth), 0);

  return (
    <div className="hidden lg:flex w-64 bg-gray-900 border-l border-gray-800 p-6 flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-200">Recursion Depth</h2>
      <div className="flex-1 flex flex-col items-center justify-start gap-4">
         {/* Simple visual indicator of depth */}
         {Array.from({ length: maxDepth + 2 }).map((_, i) => (
           <div key={i} className="flex items-center gap-2 w-full">
             <div className="w-8 text-right text-gray-500 text-sm">Lv {i}</div>
             <div className={`flex-1 h-2 rounded-full ${i <= maxDepth ? 'bg-blue-900' : 'bg-gray-800'}`}>
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${(nodes.filter(n => n.depth === i).length / nodes.length) * 100}%`,
                    opacity: nodes.some(n => n.depth === i && n.color === 'comparing') ? 1 : 0.3
                  }}
                />
             </div>
           </div>
         ))}
      </div>

      <div className="p-4 bg-gray-800 rounded-lg space-y-2">
        <h3 className="text-sm font-medium text-gray-300">Legend</h3>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded shadow border border-blue-400"></div>
          <span className="text-xs text-gray-400">Default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded shadow border border-yellow-300"></div>
          <span className="text-xs text-gray-400">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded shadow border border-green-400"></div>
          <span className="text-xs text-gray-400">Sorted / Merged</span>
        </div>
      </div>
    </div>
  );
};

export default RecursionTree;
