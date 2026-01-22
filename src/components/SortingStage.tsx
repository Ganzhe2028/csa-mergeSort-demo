import React from 'react';
import type { SortNode } from '../types';
import NumberBlock from './NumberBlock';
import { motion, AnimatePresence } from 'framer-motion';

interface SortingStageProps {
  nodes: SortNode[];
}

const SortingStage: React.FC<SortingStageProps> = ({ nodes }) => {
  // 1. Group nodes by depth
  const nodesByDepth = nodes.reduce((acc, node) => {
    if (!acc[node.depth]) acc[node.depth] = [];
    acc[node.depth].push(node);
    return acc;
  }, {} as Record<number, SortNode[]>);

  // Get sorted depths
  const depths = Object.keys(nodesByDepth)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center gap-8 bg-gray-900 rounded-xl border border-gray-800 shadow-inner">
      <AnimatePresence>
        {depths.map((depth) => {
          // 2. Inside each depth, group by 'group' ID
          const nodesInDepth = nodesByDepth[depth];

          // Sort logic ensures they appear in correct visual order if needed
          // Usually group ID should correlate with position, but merge sort splits left/right.
          // We can sort by 'group' index to ensure consistent order.
          nodesInDepth.sort((a, b) => a.group - b.group);

          // Group nodes by their group ID for visual separation
          const groups = nodesInDepth.reduce((acc, node) => {
            if (!acc[node.group]) acc[node.group] = [];
            acc[node.group].push(node);
            return acc;
          }, {} as Record<number, SortNode[]>);

          const groupIds = Object.keys(groups).map(Number).sort((a,b) => a - b);

          return (
            <motion.div
              key={depth}
              className="flex gap-8 justify-center w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {groupIds.map((groupId) => (
                <div key={groupId} className="flex gap-2 p-2 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  {groups[groupId]
                    .sort((a, b) => a.position - b.position)
                    .map((node) => (
                    <NumberBlock key={node.id} node={node} />
                  ))}
                </div>
              ))}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default SortingStage;
