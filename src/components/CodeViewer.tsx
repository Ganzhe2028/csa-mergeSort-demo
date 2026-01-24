import React, { useEffect, useRef } from 'react';
import { MERGE_SORT_PSEUDO_CODE } from '../constants';

interface CodeViewerProps {
  activeLine: number;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ activeLine }) => {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to center active line
  useEffect(() => {
    if (activeLine >= 0 && lineRefs.current[activeLine]) {
      lineRefs.current[activeLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // This keeps the active line in the center of the viewport
      });
    }
  }, [activeLine]);

  return (
    <div className="flex w-full h-full bg-gray-900 p-6 flex-col gap-4 overflow-hidden z-10">
      <h2 className="text-lg font-semibold text-gray-200">Code Execution</h2>
      <div className="flex-1 font-mono text-xs text-gray-400 whitespace-pre overflow-auto">
        {MERGE_SORT_PSEUDO_CODE.map((line, index) => {
          const parts = line.split('//');
          const codePart = parts[0];
          const commentPart = parts.length > 1 ? '//' + parts.slice(1).join('//') : '';
          const isActive = activeLine === index;

          return (
            <div
              key={index}
              ref={(el) => (lineRefs.current[index] = el)}
              className="px-2 py-0.5 rounded transition-colors duration-200 flex"
            >
              {/* Highlight code part only */}
              <span
                className={`${
                  isActive
                    ? 'bg-yellow-500 text-gray-900 font-bold'
                    : ''
                }`}
              >
                {codePart}
              </span>

              {/* Comment part - never highlighted background */}
              {commentPart && (
                <span
                  className="text-green-500 italic ml-2" // Keep original green color
                >
                  {commentPart}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodeViewer;
