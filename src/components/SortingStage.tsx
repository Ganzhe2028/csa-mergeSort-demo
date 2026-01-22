import React, { useRef, useEffect, useMemo } from 'react';
import type { SortNode } from '../types';
import NumberBlock from './NumberBlock';
import { motion, AnimatePresence } from 'framer-motion';

interface SortingStageProps {
  nodes: SortNode[];
}

const SortingStage: React.FC<SortingStageProps> = ({ nodes }) => {
  const activeRowRef = useRef<HTMLDivElement>(null);

  const nodesByDepth = nodes.reduce((acc, node) => {
    if (!acc[node.depth]) acc[node.depth] = [];
    acc[node.depth].push(node);
    return acc;
  }, {} as Record<number, SortNode[]>);

  const depths = Object.keys(nodesByDepth)
    .map(Number)
    .sort((a, b) => a - b);

  const activeDepth = useMemo(() => {
    const comparingNode = nodes.find(n => n.color === 'comparing');
    return comparingNode?.depth ?? null;
  }, [nodes]);

  useEffect(() => {
    if (activeDepth !== null && activeRowRef.current) {
      activeRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeDepth, nodes]);

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center gap-8 bg-gray-900 rounded-xl border border-gray-800 shadow-inner">
      <AnimatePresence>
        {depths.map((depth) => {
          const nodesInDepth = nodesByDepth[depth];
          nodesInDepth.sort((a, b) => a.group - b.group);

          const groups = nodesInDepth.reduce((acc, node) => {
            if (!acc[node.group]) acc[node.group] = [];
            acc[node.group].push(node);
            return acc;
          }, {} as Record<number, SortNode[]>);

          const groupIds = Object.keys(groups).map(Number).sort((a,b) => a - b);
          const isActiveRow = depth === activeDepth;

          return (
            <motion.div
              key={depth}
              ref={isActiveRow ? activeRowRef : null}
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
