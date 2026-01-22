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
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden font-sans">
      {/* Left Sidebar: Controls */}
      <div className="flex-none h-full z-20">
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

      {/* Center: Stage */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-gradient-to-br from-gray-900 to-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <SortingStage nodes={nodes} activeGroup={activeGroup} />
      </main>

      {/* Right Sidebar: Code Execution */}
      <div className="flex-none h-full z-20 hidden lg:block">
        <CodeViewer activeLine={activeLine} />
      </div>
    </div>
  );
}

export default App;
