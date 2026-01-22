import React from 'react';
import { motion } from 'framer-motion';
import type { SortNode } from '../types';
import { clsx } from 'clsx';

interface NumberBlockProps {
  node: SortNode;
}

const NumberBlock: React.FC<NumberBlockProps> = ({ node }) => {
  const getColorClass = (color: SortNode['color']) => {
    switch (color) {
      case 'comparing':
        return 'bg-yellow-500 border-yellow-300 shadow-yellow-500/50';
      case 'sorted':
        return 'bg-green-600 border-green-400 shadow-green-600/50';
      case 'pivot':
        return 'bg-purple-600 border-purple-400 shadow-purple-600/50';
      default:
        return 'bg-blue-600 border-blue-400 shadow-blue-600/50';
    }
  };

  return (
    <motion.div
      layoutId={node.id}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }}
      className={clsx(
        'w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-lg border-2 shadow-lg text-white font-bold text-lg md:text-xl',
        getColorClass(node.color)
      )}
    >
      {node.value}
    </motion.div>
  );
};

export default NumberBlock;
