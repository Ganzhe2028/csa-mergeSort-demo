import { useMergeSort } from './hooks/useMergeSort';
import SortingStage from './components/SortingStage';
import Dashboard from './components/Dashboard';
import RecursionTree from './components/RecursionTree';

function App() {
  const {
    nodes,
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
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden font-sans">
      {/* Left Sidebar: Controls */}
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

      {/* Center: Stage */}
      <main className="flex-1 flex flex-col relative bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <SortingStage nodes={nodes} />
      </main>

      {/* Right Sidebar: Visualization Stats/Tree */}
      <RecursionTree nodes={nodes} />
    </div>
  );
}

export default App;
