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
            {line || ' '}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeViewer;
