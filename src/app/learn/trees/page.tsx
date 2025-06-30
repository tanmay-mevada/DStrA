'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import { Play, RefreshCcw } from 'lucide-react';

type TreeNode = {
  id: number;
  label: string;
  left?: TreeNode;
  right?: TreeNode;
  x: number;
  y: number;
};

// Absolute positions for layout
const treeData: TreeNode = {
  id: 1, label: 'A', x: 400, y: 50,
  left: {
    id: 2, label: 'B', x: 250, y: 150,
    left: { id: 4, label: 'D', x: 150, y: 250 },
    right: { id: 5, label: 'E', x: 350, y: 250 }
  },
  right: {
    id: 3, label: 'C', x: 550, y: 150,
    left: { id: 6, label: 'F', x: 450, y: 250 },
    right: { id: 7, label: 'G', x: 650, y: 250 }
  }
};

export default function TreeVisualizer() {
  const [visited, setVisited] = useState<number[]>([]);
  const [running, setRunning] = useState(false);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const traverse = async (node: TreeNode | undefined, order: 'pre' | 'in' | 'post') => {
    if (!node || running) return;
    setRunning(true);
    const orderArr: number[] = [];

    async function visit(n: TreeNode | undefined) {
      if (!n) return;
      if (order === 'pre') {
        orderArr.push(n.id);
        setVisited([...orderArr]);
        await delay(600);
      }
      await visit(n.left);
      if (order === 'in') {
        orderArr.push(n.id);
        setVisited([...orderArr]);
        await delay(600);
      }
      await visit(n.right);
      if (order === 'post') {
        orderArr.push(n.id);
        setVisited([...orderArr]);
        await delay(600);
      }
    }

    await visit(node);
    setVisited([...orderArr]);
    setRunning(false);
  };

  const reset = () => {
    setVisited([]);
    setRunning(false);
  };

  const drawBranches = (node: TreeNode | undefined, paths: string[] = []): string[] => {
    if (!node) return paths;
    if (node.left) {
      const path = `M${node.x},${node.y} C${node.x},${(node.y + node.left.y) / 2} ${node.left.x},${(node.y + node.left.y) / 2} ${node.left.x},${node.left.y}`;
      paths.push(path);
      drawBranches(node.left, paths);
    }
    if (node.right) {
      const path = `M${node.x},${node.y} C${node.x},${(node.y + node.right.y) / 2} ${node.right.x},${(node.y + node.right.y) / 2} ${node.right.x},${node.right.y}`;
      paths.push(path);
      drawBranches(node.right, paths);
    }
    return paths;
  };

  const drawNodes = (node: TreeNode | undefined): JSX.Element[] => {
    if (!node) return [];
    const isVisited = visited.includes(node.id);

    return [
      <div
        key={node.id}
        className={`absolute flex items-center justify-center w-12 h-12 rounded-full font-bold border-2 transition-all duration-300 
          ${isVisited ? 'bg-yellow-400 border-yellow-600 scale-110' : 'bg-white dark:bg-zinc-800 border-blue-500 text-zinc-900 dark:text-zinc-100'}
        `}
        style={{ top: node.y, left: node.x, transform: 'translate(-50%, -50%)' }}
      >
        {node.label}
      </div>,
      ...drawNodes(node.left),
      ...drawNodes(node.right)
    ];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center text-zinc-800 dark:text-zinc-100">🌳 Tree Traversals</h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400">Visualize Preorder, Inorder, and Postorder traversal over a tree with curved connections</p>

      {/* Buttons */}
      <div className="flex justify-center flex-wrap gap-4">
        <button onClick={() => traverse(treeData, 'pre')} disabled={running} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">Preorder</button>
        <button onClick={() => traverse(treeData, 'in')} disabled={running} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">Inorder</button>
        <button onClick={() => traverse(treeData, 'post')} disabled={running} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50">Postorder</button>
        <button onClick={reset} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"><RefreshCcw size={16} /></button>
      </div>

      {/* Tree */}
      <div className="relative h-[340px] bg-white dark:bg-zinc-900 border rounded overflow-auto shadow-lg">
        <svg className="absolute top-0 left-0 w-full h-full">
          {drawBranches(treeData).map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#60a5fa" strokeWidth={2} />
          ))}
        </svg>
        {drawNodes(treeData)}
      </div>

      {/* Visited output */}
      {visited.length > 0 && (
        <div className="text-center text-sm text-zinc-600 dark:text-zinc-300 mt-2">
          <strong>Visited Order:</strong>{' '}
          {visited.map((id, i) => (
            <span key={id}>{treeDataMap[id]}{i !== visited.length - 1 && ' → '}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const treeDataMap: Record<number, string> = {
  1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G'
};
