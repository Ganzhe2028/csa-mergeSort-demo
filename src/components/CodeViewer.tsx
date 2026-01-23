import React from 'react';
import { MERGE_SORT_PSEUDO_CODE } from '../constants';

interface CodeViewerProps {
  activeLine: number;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ activeLine }) => {
  return (
    <div className="flex w-full h-full bg-gray-900 p-6 flex-col gap-4 overflow-hidden z-10">
      <h2 className="text-lg font-semibold text-gray-200">Code Execution</h2>
      <div className="flex-1 font-mono text-xs text-gray-400 whitespace-pre overflow-auto">
        {MERGE_SORT_PSEUDO_CODE.map((line, index) => (
          <div
            key={index}
            className={`px-2 py-0.5 rounded transition-colors duration-200 ${
              activeLine === index
                ? 'bg-yellow-500 text-gray-900 font-bold'
                : ''
            }`}
          >
            {(() => {
              const parts = line.split('//');
              const codePart = parts[0];
              const commentPart = parts.length > 1 ? '//' + parts.slice(1).join('//') : '';

              return (
                <>
                  <span>{codePart}</span>
                  {commentPart && (
                    <span
                      className={`${
                        activeLine === index
                          ? 'text-gray-700 font-normal italic opacity-75' // Darker style on active yellow bg
                          : 'text-green-500 italic' // Distinct green for comments on dark bg
                      }`}
                    >
                      {commentPart}
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeViewer;
