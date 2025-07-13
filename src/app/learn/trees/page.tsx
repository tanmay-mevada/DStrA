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

// Perfect Binary Search Tree - inorder traversal gives 1,2,3,4,5,6,7
const treeData: TreeNode = {
  id: 4, label: '4', x: 50, y: 15, // Root
  left: {
    id: 2, label: '2', x: 25, y: 40,
    left: { id: 1, label: '1', x: 15, y: 70 },
    right: { id: 3, label: '3', x: 35, y: 70 }
  },
  right: {
    id: 6, label: '6', x: 75, y: 40,
    left: { id: 5, label: '5', x: 65, y: 70 },
    right: { id: 7, label: '7', x: 85, y: 70 }
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
        await delay(800);
      }
      await visit(n.left);
      if (order === 'in') {
        orderArr.push(n.id);
        setVisited([...orderArr]);
        await delay(800);
      }
      await visit(n.right);
      if (order === 'post') {
        orderArr.push(n.id);
        setVisited([...orderArr]);
        await delay(800);
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
    const visitIndex = visited.indexOf(node.id);

    return [
      <div
        key={node.id}
        className={`absolute flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold border-2 transition-all duration-500 text-sm sm:text-base
          ${isVisited 
            ? 'bg-[#38bdf8] border-[#0ea5e9] text-white scale-110 shadow-lg' 
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
        {node.label}
        {isVisited && visitIndex >= 0 && (
          <span className="absolute -top-2 -right-2 bg-[#0ea5e9] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {visitIndex + 1}
          </span>
        )}
      </div>,
      ...drawNodes(node.left),
      ...drawNodes(node.right)
    ];
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] dark:text-[#e2e8f0] mb-4">
            Binary Tree Traversals
          </h1>
          <p className="text-base sm:text-lg text-[#64748b] dark:text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Visualize different tree traversal algorithms on a Binary Search Tree where inorder produces sorted output
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-[#e2e8f0] dark:border-[#334155] p-6 sm:p-8 mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button
              onClick={() => traverse(treeData, 'pre')}
              disabled={running}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1e293b] hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4" /> 
              <span>Preorder</span>
            </button>
            
            <button
              onClick={() => traverse(treeData, 'in')}
              disabled={running}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1e293b] hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4" /> 
              <span>Inorder</span>
            </button>
            
            <button
              onClick={() => traverse(treeData, 'post')}
              disabled={running}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1e293b] hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4" /> 
              <span>Postorder</span>
            </button>
            
            <button
              onClick={reset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#64748b] hover:bg-[#475569] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1e293b] hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <RefreshCcw className="w-4 h-4" /> 
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-[#e2e8f0] dark:border-[#334155] p-4 sm:p-6 lg:p-8 mb-8">
          <div className="relative h-[300px] sm:h-[400px] lg:h-[450px] overflow-hidden">
            {/* SVG for branches */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {drawBranches(treeData).map((d, i) => (
                <path 
                  key={i} 
                  d={d} 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="0.5"
                  className="transition-all duration-300"
                  opacity={0.8}
                />
              ))}
            </svg>
            
            {/* Nodes */}
            {drawNodes(treeData)}
          </div>
        </div>

        {/* Traversal Output */}
        {visited.length > 0 && (
          <div className="bg-gradient-to-r from-[#38bdf8]/10 to-[#0ea5e9]/10 dark:from-[#38bdf8]/20 dark:to-[#0ea5e9]/20 rounded-2xl border border-[#38bdf8]/20 dark:border-[#38bdf8]/30 p-6 sm:p-8">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-[#e2e8f0] mb-4">
                Traversal Result
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
                {visited.map((id, i) => (
                  <div key={id} className="flex items-center">
                    <span className="bg-[#38bdf8] text-white px-3 py-1 rounded-lg font-semibold text-sm sm:text-base shadow-md">
                      {treeDataMap[id]}
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

        {/* Algorithm Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#e2e8f0] dark:border-[#334155] p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold text-[#111827] dark:text-[#e2e8f0] mb-3">Preorder</h3>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
              Visit root → left subtree → right subtree<br/>
              <span className="text-[#38bdf8] font-medium">Result: 4, 2, 1, 3, 6, 5, 7</span>
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#e2e8f0] dark:border-[#334155] p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold text-[#111827] dark:text-[#e2e8f0] mb-3">Inorder</h3>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
              Visit left subtree → root → right subtree<br/>
              <span className="text-emerald-500 font-medium">Result: 1, 2, 3, 4, 5, 6, 7 (sorted!)</span>
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#e2e8f0] dark:border-[#334155] p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold text-[#111827] dark:text-[#e2e8f0] mb-3">Postorder</h3>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
              Visit left subtree → right subtree → root<br/>
              <span className="text-violet-500 font-medium">Result: 1, 3, 2, 5, 7, 6, 4</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const treeDataMap: Record<number, string> = {
  1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7'
};