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

// Sample undirected graph
const nodes: Node[] = [
  { id: 'A', x: 100, y: 100 },
  { id: 'B', x: 300, y: 80 },
  { id: 'C', x: 500, y: 120 },
  { id: 'D', x: 200, y: 300 },
  { id: 'E', x: 400, y: 320 },
];

const edges: Edge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'D' },
  { from: 'B', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'C', to: 'E' },
  { from: 'D', to: 'E' },
];

export default function GraphPage() {
  const [visited, setVisited] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const reset = () => {
    setVisited([]);
    setRunning(false);
  };

  const getNeighbors = (nodeId: string): string[] => {
    return edges
      .filter((e) => e.from === nodeId || e.to === nodeId)
      .map((e) => (e.from === nodeId ? e.to : e.from));
  };

  const bfs = async (start: string) => {
    setRunning(true);
    const visitedSet = new Set<string>();
    const queue = [start];
    const visitOrder: string[] = [];

    while (queue.length) {
      const current = queue.shift()!;
      if (!visitedSet.has(current)) {
        visitedSet.add(current);
        visitOrder.push(current);
        setVisited([...visitOrder]);
        await delay(500);
        queue.push(...getNeighbors(current).filter((n) => !visitedSet.has(n)));
      }
    }

    setRunning(false);
  };

  const dfs = async (start: string) => {
    setRunning(true);
    const visitedSet = new Set<string>();
    const visitOrder: string[] = [];

    async function dfsVisit(nodeId: string) {
      if (visitedSet.has(nodeId)) return;
      visitedSet.add(nodeId);
      visitOrder.push(nodeId);
      setVisited([...visitOrder]);
      await delay(500);
      for (const neighbor of getNeighbors(nodeId)) {
        await dfsVisit(neighbor);
      }
    }

    await dfsVisit(start);
    setRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center text-zinc-800 dark:text-zinc-100">
        🕸️ Graph Explorer (BFS & DFS)
      </h1>

      {/* Controls */}
      <div className="flex justify-center gap-4 flex-wrap mb-4">
        {nodes.map((node) => (
          <button
            key={node.id}
            onClick={() => bfs(node.id)}
            disabled={running}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            BFS from {node.id}
          </button>
        ))}
        {nodes.map((node) => (
          <button
            key={node.id}
            onClick={() => dfs(node.id)}
            disabled={running}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            DFS from {node.id}
          </button>
        ))}
        <button
          onClick={reset}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* Visual Graph */}
      <div className="relative w-full h-[400px] bg-white dark:bg-zinc-900 border rounded overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full">
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
                stroke="#60a5fa"
                strokeWidth={2}
              />
            );
          })}
        </svg>

        {nodes.map((node) => {
          const isVisited = visited.includes(node.id);
          return (
            <div
              key={node.id}
              className={`absolute flex items-center justify-center w-12 h-12 rounded-full font-semibold border-2 transition-all duration-300 ${
                isVisited
                  ? 'bg-yellow-400 border-yellow-600 scale-110'
                  : 'bg-white dark:bg-zinc-800 border-blue-500'
              }`}
              style={{
                left: node.x,
                top: node.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {node.id}
            </div>
          );
        })}
      </div>

      {/* Visit Order */}
      {visited.length > 0 && (
        <div className="text-center text-zinc-700 dark:text-zinc-300">
          <strong>Visited:</strong>{' '}
          {visited.map((id, i) => (
            <span key={i}>
              {id}
              {i !== visited.length - 1 && ' → '}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
