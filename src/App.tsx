import { useMergeSort } from './hooks/useMergeSort';
import SortingStage from './components/SortingStage';
import Dashboard from './components/Dashboard';
import CodeViewer from './components/CodeViewer';

function App() {
  const {
    nodes,
    activeLine,
    activeGroup,
    isPlaying,
    play,
    pause,
    reset,
    speed,
    setSpeed,
    size,
    setSize
  } = useMergeSort();

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 text-white overflow-hidden font-sans">
      {/* Top: Stage (65vh) */}
      <main style={{ height: '65vh' }} className="w-full relative bg-gradient-to-br from-gray-900 to-gray-950 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <SortingStage nodes={nodes} activeGroup={activeGroup} />
      </main>

      {/* Bottom: Split Panel */}
      <div className="flex-1 flex flex-row w-full z-20 bg-gray-900">
        {/* Bottom Left: Controls (25%) */}
        <div className="w-[25%] h-full border-r border-gray-800">
          <Dashboard
            isPlaying={isPlaying}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            speed={speed}
            setSpeed={setSpeed}
            size={size}
            setSize={setSize}
          />
        </div>

        {/* Bottom Right: Code (75%) */}
        <div className="w-[75%] h-full">
          <CodeViewer activeLine={activeLine} />
        </div>
      </div>
    </div>
  );
}

export default App;
