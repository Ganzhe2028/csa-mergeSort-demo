import React, { useRef, useLayoutEffect, useState, useMemo, useEffect } from 'react';
import type { SortNode, ActiveGroup } from '../types';
import NumberBlock from './NumberBlock';
import { motion, AnimatePresence } from 'framer-motion';

interface SortingStageProps {
  nodes: SortNode[];
  activeGroup: ActiveGroup | null;
}

const SortingStage: React.FC<SortingStageProps> = ({ nodes, activeGroup }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const activeRowRef = useRef<HTMLDivElement>(null);
  const [viewState, setViewState] = useState({ x: 0, y: 0, scale: 1 });

  useLayoutEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    // If no active group, reset to center/top default
    if (!activeGroup) {
      setViewState({ x: 0, y: 0, scale: 1 });
      return;
    }

    const { depth, group } = activeGroup;
    const targetId = `group-${depth}-${group}`;
    const targetEl = document.getElementById(targetId);

    if (!targetEl) return;

    const contRect = containerRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // Calculate current rendered scale to derive local coordinates
    const currentRenderedScale = targetRect.width / targetEl.offsetWidth;

    // Helper: Get local center relative to content wrapper
    // Since contentWrapper is the motion.div, we need its rect too, but it might be transformed.
    // However, we know targetEl is inside contentRef.
    // The relative offset in UN-SCALED pixels:
    // We can use offsetLeft/offsetTop if they are direct children, but they are nested.
    // Better to use the difference in clientRects divided by scale.
    const contentRect = contentRef.current.getBoundingClientRect();

    const localLeft = (targetRect.left - contentRect.left) / currentRenderedScale;
    const localTop = (targetRect.top - contentRect.top) / currentRenderedScale;
    const localWidth = targetEl.offsetWidth;
    const localHeight = targetEl.offsetHeight;

    const localCenterX = localLeft + localWidth / 2;
    const localCenterY = localTop + localHeight / 2;

    // Calculate Fit Scale
    // We want to fit the group width within the container with some padding
    const padding = 80;
    const availableW = contRect.width - padding;
    // We don't strictly constrain height, but good to check
    // const availableH = contRect.height - padding;

    let nextScale = availableW / localWidth;

    // Clamping logic:
    // Max 1.0: Don't zoom in crazy amount on small groups
    // Min 0.5: Don't shrink text to unreadable
    nextScale = Math.min(nextScale, 1.0);
    nextScale = Math.max(nextScale, 0.5);

    // Calculate Center Position
    // We want: ContentOrigin + (LocalCenter * Scale) = ContainerCenter
    // ContentOrigin (x,y) = ContainerCenter - (LocalCenter * Scale)

    const nextX = (contRect.width / 2) - (localCenterX * nextScale);
    const nextY = (contRect.height / 2) - (localCenterY * nextScale);

    setViewState({ x: nextX, y: nextY, scale: nextScale });

  }, [activeGroup, nodes]); // Recalculate when active group changes or nodes move

  // 1. Group nodes by depth
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
    <div
      ref={containerRef}
      className="flex-1 w-full h-full relative overflow-hidden bg-gray-900 rounded-xl border border-gray-800 shadow-inner"
    >
      <motion.div
        ref={contentRef}
        className="absolute top-0 left-0 min-w-full min-h-full flex flex-col items-center gap-8 p-8 origin-top-left"
        animate={{
          x: viewState.x,
          y: viewState.y,
          scale: viewState.scale
        }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
      >
        <AnimatePresence>
          {depths.map((depth) => {
            // 2. Inside each depth, group by 'group' ID
          const nodesInDepth = nodesByDepth[depth];

          // Sort logic ensures they appear in correct visual order if needed
          // Usually group ID should correlate with position, but merge sort splits left/right.
          // We can sort by 'group' index to ensure consistent order.
          const sortedNodesInDepth = [...nodesInDepth].sort((a, b) => a.group - b.group);

          // Group nodes by their group ID for visual separation
          const groups = sortedNodesInDepth.reduce((acc, node) => {
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
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {groupIds.map((groupId) => (
                <div
                  key={groupId}
                  id={`group-${depth}-${groupId}`}
                  className="flex gap-2 p-2 bg-gray-800/30 rounded-lg border border-gray-700/30 transition-colors duration-300"
                  // Optional: Highlight active group slightly
                  style={{
                     borderColor: (activeGroup?.depth === depth && activeGroup?.group === groupId)
                       ? 'rgba(59, 130, 246, 0.5)'
                       : undefined
                  }}
                >
                  {[...groups[groupId]]
                    .sort((a, b) => a.sortIndex - b.sortIndex)
                    .map((node) => (
                      <NumberBlock key={node.id} node={node} />
                    ))}
                </div>
              ))}
            </motion.div>
          );
        })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SortingStage;
