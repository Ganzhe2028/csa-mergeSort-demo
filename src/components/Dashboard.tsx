import React from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface DashboardProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (val: number) => void;
  size: number;
  setSize: (val: number) => void;
  disabled?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  speed,
  setSpeed,
  size,
  setSize,
  disabled
}) => {
  return (
    <div className="w-full h-full bg-gray-900 p-6 flex flex-col gap-6 overflow-y-auto shadow-xl z-10">
      <div>
        <h1 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-500" />
          Merge Sort
        </h1>
        <p className="text-gray-400 text-sm">
          Interactive visualization of the Merge Sort algorithm using physical separation.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-200">Controls</h2>

        <div className="flex gap-2">
          {!isPlaying ? (
            <button
              onClick={onPlay}
              disabled={disabled}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              <Pause className="w-5 h-5 fill-current" />
              Pause
            </button>
          )}

          <button
            onClick={onReset}
            className="flex-none p-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-300">Array Size</label>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">{size} items</span>
          </div>
          <input
            type="range"
            min="4"
            max="32"
            step="1"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            disabled={isPlaying || disabled} // Disable resize while playing to avoid chaos
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-300">Animation Speed</label>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">
               {speed < 150 ? 'Fast' : speed > 1500 ? 'Slow' : 'Normal'}
            </span>
          </div>
          {/* Speed: Higher value = Slower (more delay) */}
          {/* Range: 1ms (Fast) to 2500ms (Slow) */}
          {/* Slider: 0 (Slow, 2500ms) to 100 (Fast, 1ms) */}
          <input
            type="range"
            min="0"
            max="100"
            value={100 - ((speed - 1) / (2500 - 1)) * 100}
            onChange={(e) => {
              const val = Number(e.target.value);
              // val = 100 -> speed = 1
              // val = 0 -> speed = 2500
              const newSpeed = 2500 - (val / 100) * (2499);
              setSpeed(newSpeed);
            }}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      <div className="mt-auto p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-xs text-gray-400 space-y-2">
         <p><strong className="text-gray-300">How it works:</strong></p>
         <ul className="list-disc pl-4 space-y-1">
           <li>Blocks split and move down (Divide).</li>
           <li>Colors compare (Yellow).</li>
           <li>Smaller blocks move up and merge (Green).</li>
         </ul>
      </div>
    </div>
  );
};

export default Dashboard;
