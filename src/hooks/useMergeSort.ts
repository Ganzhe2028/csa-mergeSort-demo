import { useState, useRef, useEffect } from 'react';
import type { SortNode } from '../types';
import { sleep } from '../utils/sleep';

const generateInitialNodes = (count: number): SortNode[] => {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    value: Math.floor(Math.random() * 99) + 1,
    depth: 0,
    group: 0,
    color: 'default',
  }));
};

interface UseMergeSortReturn {
  nodes: SortNode[];
  activeLine: number;
  isPlaying: boolean;
  isSorted: boolean;
  speed: number;
  setSpeed: (val: number) => void;
  size: number;
  setSize: (val: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
}

export const useMergeSort = (): UseMergeSortReturn => {
  const [size, setSize] = useState(8);
  const [speed, setSpeed] = useState(500);
  const [nodes, setNodes] = useState<SortNode[]>(() => generateInitialNodes(size));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);

  // Refs for logic control
  const nodesRef = useRef<SortNode[]>(nodes);
  const isPlayingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Keep refs in sync with state for initialization, but logic will diverge
  useEffect(() => {
    // When size changes, reset everything
    const newNodes = generateInitialNodes(size);
    setNodes(newNodes);
    nodesRef.current = newNodes;
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsSorted(false);
    setActiveLine(-1);
    if (abortControllerRef.current) abortControllerRef.current.abort();
  }, [size]);

  const updateNodes = (newNodes: SortNode[]) => {
    nodesRef.current = newNodes;
    setNodes([...newNodes]);
  };

  const checkPause = async () => {
    while (!isPlayingRef.current) {
      // Check if aborted
      if (abortControllerRef.current?.signal.aborted) throw new Error('Aborted');
      await sleep(100);
    }
  };

  const wait = async (line?: number) => {
    if (line !== undefined) setActiveLine(line);
    await checkPause();
    // Speed conversion: speed state IS the delay in ms.
    await sleep(speed);
    if (abortControllerRef.current?.signal.aborted) throw new Error('Aborted');
  };

  const mergeSort = async (subsetNodes: SortNode[], depth: number, groupBase: number): Promise<SortNode[]> => {
    await wait(0); // function mergeSort

    await wait(1); // if len <= 1
    if (subsetNodes.length <= 1) {
      await wait(2); // return arr
      return subsetNodes;
    }

    await wait(3); // mid = ...

    const mid = Math.floor(subsetNodes.length / 2);
    const leftPart = subsetNodes.slice(0, mid);
    const rightPart = subsetNodes.slice(mid);

    // DIVIDE STEP: Move down to next depth
    const currentGlobalNodes = [...nodesRef.current];

    // Update left part
    leftPart.forEach(node => {
      const idx = currentGlobalNodes.findIndex(n => n.id === node.id);
      if (idx !== -1) {
        currentGlobalNodes[idx] = {
          ...currentGlobalNodes[idx],
          depth: depth + 1,
          group: groupBase * 2
        };
      }
    });

    // Update right part
    rightPart.forEach(node => {
        const idx = currentGlobalNodes.findIndex(n => n.id === node.id);
        if (idx !== -1) {
          currentGlobalNodes[idx] = {
            ...currentGlobalNodes[idx],
            depth: depth + 1,
            group: groupBase * 2 + 1
          };
        }
    });

    updateNodes(currentGlobalNodes);
    await wait(); // Wait for visual split (keep previous line 3 active?)

    await wait(4); // left = mergeSort(...)
    const sortedLeft = await mergeSort(leftPart, depth + 1, groupBase * 2);

    await wait(5); // right = mergeSort(...)
    const sortedRight = await mergeSort(rightPart, depth + 1, groupBase * 2 + 1);

    await wait(6); // return merge(...)
    return await merge(sortedLeft, sortedRight, depth, groupBase);
  };

  const merge = async (left: SortNode[], right: SortNode[], targetDepth: number, targetGroup: number): Promise<SortNode[]> => {
    await wait(8); // function merge
    await wait(9); // result = []

    const sorted: SortNode[] = [];
    // Work with a local copy that tracks updates, initialized from latest ref
    const globalNodes = [...nodesRef.current];

    // Helper to update specific node in global state copy
    const updateNodeState = (id: string, updates: Partial<SortNode>) => {
       const idx = globalNodes.findIndex(n => n.id === id);
       if (idx !== -1) {
         globalNodes[idx] = { ...globalNodes[idx], ...updates };
       }
       return globalNodes[idx];
    };

    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      await wait(10); // while

      const leftNode = left[i];
      const rightNode = right[j];

      // Highlight comparing
      updateNodeState(leftNode.id, { color: 'comparing' });
      updateNodeState(rightNode.id, { color: 'comparing' });
      updateNodes([...globalNodes]);
      await wait(11); // if left <= right

      if (leftNode.value <= rightNode.value) {
        const updated = updateNodeState(leftNode.id, {
            color: 'sorted',
            depth: targetDepth,
            group: targetGroup
        });
        sorted.push(updated);
        i++;
        updateNodes([...globalNodes]);
        await wait(12); // append left
      } else {
        const updated = updateNodeState(rightNode.id, {
            color: 'sorted',
            depth: targetDepth,
            group: targetGroup
        });
        sorted.push(updated);
        j++;
        updateNodes([...globalNodes]);
        await wait(14); // append right
      }
    }

    await wait(15); // append remaining

    // Handle remaining
    while (i < left.length) {
       const node = left[i];
       const updated = updateNodeState(node.id, {
         color: 'sorted',
         depth: targetDepth,
         group: targetGroup
       });
       sorted.push(updated);
       i++;
    }

    while (j < right.length) {
        const node = right[j];
        const updated = updateNodeState(node.id, {
          color: 'sorted',
          depth: targetDepth,
          group: targetGroup
        });
        sorted.push(updated);
        j++;
    }

    // VISUAL REORDERING
    const allIds = new Set([...left, ...right].map(n => n.id));
    const indicesToUpdate = globalNodes
        .map((n, idx) => allIds.has(n.id) ? idx : -1)
        .filter(idx => idx !== -1)
        // Sort indices to fill them in order with the sorted nodes
        .sort((a, b) => a - b);

    if (indicesToUpdate.length !== sorted.length) {
        console.error('Mismatch in indices vs sorted length', indicesToUpdate.length, sorted.length);
    } else {
        indicesToUpdate.forEach((globalIdx, sortedIdx) => {
            // sorted[sortedIdx] has the correct value order and updated metadata
            globalNodes[globalIdx] = sorted[sortedIdx];
        });
    }

    updateNodes([...globalNodes]);
    await wait(); // Wait for visual reorder

    await wait(16); // return result
    return sorted;
  };

  const startSort = async () => {
    if (isPlaying || isSorted) return;

    setIsPlaying(true);
    isPlayingRef.current = true;
    abortControllerRef.current = new AbortController();

    try {
      await mergeSort(nodesRef.current, 0, 0);
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsSorted(true);
      setActiveLine(-1);
    } catch (e) {
      if ((e as Error).message === 'Aborted') {
        console.log('Sorting aborted');
      } else {
        console.error(e);
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  const play = () => {
    if (isSorted) {
      reset();
      setTimeout(() => {
          startSort();
      }, 0);
      return;
    }

    if (!isPlaying) {
        if (nodesRef.current.some(n => n.depth > 0) && !isSorted) {
            // It is in middle of sorting
            setIsPlaying(true);
            isPlayingRef.current = true;
        } else {
            startSort();
        }
    }
  };

  const pause = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
  };

  const reset = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const newNodes = generateInitialNodes(size);
    setNodes(newNodes);
    nodesRef.current = newNodes;
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsSorted(false);
    setActiveLine(-1);
  };

  return {
    nodes,
    activeLine,
    isPlaying,
    isSorted,
    speed,
    setSpeed,
    size,
    setSize,
    play,
    pause,
    reset,
  };
};
