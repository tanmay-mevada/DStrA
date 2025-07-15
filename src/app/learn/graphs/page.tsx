'use client';

import { useState } from 'react';
import { Play, RefreshCcw } from 'lucide-react';

// Graph node type
type Node = {
  id: string;
  x: number;
  y: number;
};

// Edge type
type Edge = {
  from: string;
  to: string;
  weight?: number;
};

// Sample undirected graph with percentage-based positioning
const nodes: Node[] = [
  { id: 'A', x: 20, y: 25 },
  { id: 'B', x: 50, y: 20 },
  { id: 'C', x: 80, y: 30 },
  { id: 'D', x: 35, y: 70 },
  { id: 'E', x: 65, y: 75 },
];

const edges: Edge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'D' },
  { from: 'B', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'C', to: 'E' },
  { from: 'D', to: 'E' },
];

export default function GraphVisualizer() {
  const [visited, setVisited] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<'BFS' | 'DFS' | null>(null);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const reset = () => {
    setVisited([]);
    setRunning(false);
    setCurrentAlgorithm(null);
  };

  const getNeighbors = (nodeId: string): string[] => {
    return edges
      .filter((e) => e.from === nodeId || e.to === nodeId)
      .map((e) => (e.from === nodeId ? e.to : e.from));
  };

  const bfs = async (start: string) => {
    setRunning(true);
    setCurrentAlgorithm('BFS');
    const visitedSet = new Set<string>();
    const queue = [start];
    const visitOrder: string[] = [];

    while (queue.length) {
      const current = queue.shift()!;
      if (!visitedSet.has(current)) {
        visitedSet.add(current);
        visitOrder.push(current);
        setVisited([...visitOrder]);
        await delay(800);
        queue.push(...getNeighbors(current).filter((n) => !visitedSet.has(n)));
      }
    }

    setRunning(false);
  };

  const dfs = async (start: string) => {
    setRunning(true);
    setCurrentAlgorithm('DFS');
    const visitedSet = new Set<string>();
    const visitOrder: string[] = [];

    async function dfsVisit(nodeId: string) {
      if (visitedSet.has(nodeId)) return;
      visitedSet.add(nodeId);
      visitOrder.push(nodeId);
      setVisited([...visitOrder]);
      await delay(800);
      for (const neighbor of getNeighbors(nodeId)) {
        await dfsVisit(neighbor);
      }
    }

    await dfsVisit(start);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-darkPrimary mb-4">
            Graph Traversal Algorithms
          </h1>
          <p className="text-base sm:text-lg text-[#64748b] dark:text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Explore Breadth-First Search (BFS) and Depth-First Search (DFS) algorithms on an undirected graph
          </p>
        </div>

        {/* Algorithm Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 lg:mb-12">
          {/* BFS Controls */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-[#e2e8f0] dark:border-[#334155] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-[#e2e8f0] mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-[#38bdf8] rounded-full"></div>
              Breadth-First Search
            </h2>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6 leading-relaxed">
              Explores all neighbors at the current depth before moving to nodes at the next depth level.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {nodes.map((node) => (
                <button
                  key={`bfs-${node.id}`}
                  onClick={() => bfs(node.id)}
                  disabled={running}
                  className="flex items-center justify-center gap-1 bg-[#38bdf8] hover:bg-[#0ea5e9] disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1e293b] hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <Play className="w-3 h-3" />
                  <span className="text-sm">Start {node.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DFS Controls */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-[#e2e8f0] dark:border-[#334155] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-[#e2e8f0] mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              Depth-First Search
            </h2>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6 leading-relaxed">
              Goes as deep as possible along each branch before backtracking to explore other branches.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {nodes.map((node) => (
                <button
                  key={`dfs-${node.id}`}
                  onClick={() => dfs(node.id)}
                  disabled={running}
                  className="flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1e293b] hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <Play className="w-3 h-3" />
                  <span className="text-sm">Start {node.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-[#64748b] hover:bg-[#475569] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0f172a] hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Reset Visualization</span>
          </button>
        </div>

        {/* Graph Visualization */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-[#e2e8f0] dark:border-[#334155] p-4 sm:p-6 lg:p-8 mb-8">
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
            {/* SVG for edges */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {edges.map((edge, i) => {
                const from = nodes.find((n) => n.id === edge.from)!;
                const to = nodes.find((n) => n.id === edge.to)!;
                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#38bdf8"
                    strokeWidth="0.3"
                    className="transition-all duration-300"
                    opacity={0.8}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const isVisited = visited.includes(node.id);
              const visitIndex = visited.indexOf(node.id);
              const isCurrentAlgorithmColor = currentAlgorithm === 'BFS' ? 'bg-[#38bdf8] border-[#0ea5e9]' : 'bg-emerald-500 border-emerald-600';

              return (
                <div
                  key={node.id}
                  className={`absolute flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full font-bold border-2 transition-all duration-500 text-sm sm:text-base lg:text-lg shadow-lg
                    ${isVisited
                      ? `${isCurrentAlgorithmColor} text-white scale-110`
                      : 'bg-[#f9fafb] dark:bg-[#1e293b] border-[#64748b] dark:border-[#334155] text-[#111827] dark:text-[#e2e8f0] hover:scale-105'
                    }
                  `}
                  style={{
                    top: `${node.y}%`,
                    left: `${node.x}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                >
                  {node.id}
                  {isVisited && visitIndex >= 0 && (
                    <span className={`absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md
                      ${currentAlgorithm === 'BFS' ? 'bg-[#0ea5e9]' : 'bg-emerald-600'}
                    `}>
                      {visitIndex + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Traversal Result */}
        {visited.length > 0 && (
          <div className={`rounded-2xl border p-6 sm:p-8 mb-8 ${
            currentAlgorithm === 'BFS' 
              ? 'bg-gradient-to-r from-[#38bdf8]/10 to-[#0ea5e9]/10 dark:from-[#38bdf8]/20 dark:to-[#0ea5e9]/20 border-[#38bdf8]/20 dark:border-[#38bdf8]/30' 
              : 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 border-emerald-500/20 dark:border-emerald-500/30'
          }`}>
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-[#e2e8f0] mb-4">
                {currentAlgorithm} Traversal Result
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
                {visited.map((id, i) => (
                  <div key={id} className="flex items-center">
                    <span className={`text-white px-3 py-1 rounded-lg font-semibold text-sm sm:text-base shadow-md
                      ${currentAlgorithm === 'BFS' ? 'bg-[#38bdf8]' : 'bg-emerald-500'}
                    `}>
                      {id}
                    </span>
                    {i !== visited.length - 1 && (
                      <span className="mx-2 text-[#64748b] dark:text-[#94a3b8] text-lg">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#e2e8f0] dark:border-[#334155] p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold text-[#111827] dark:text-[#e2e8f0] mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-[#38bdf8] rounded-full"></div>
              BFS Characteristics
            </h3>
            <ul className="text-sm text-[#64748b] dark:text-[#94a3b8] space-y-2">
              <li>• Uses a queue data structure</li>
              <li>• Explores level by level</li>
              <li>• Finds shortest path (unweighted)</li>
              <li>• Good for finding closest nodes</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#e2e8f0] dark:border-[#334155] p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold text-[#111827] dark:text-[#e2e8f0] mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              DFS Characteristics
            </h3>
            <ul className="text-sm text-[#64748b] dark:text-[#94a3b8] space-y-2">
              <li>• Uses a stack (recursion)</li>
              <li>• Explores as deep as possible</li>
              <li>• Memory efficient for deep graphs</li>
              <li>• Good for pathfinding problems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}