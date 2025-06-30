'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, RefreshCcw, X } from 'lucide-react';

// Node Box Component
function NodeBox({
  value,
  isFound,
}: {
  value: string;
  isFound: boolean;
}) {
  return (
    <div
      className={`w-24 h-16 rounded flex items-center justify-center border-2 px-2 transition-all duration-200 font-semibold text-lg
        ${isFound
          ? 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900 dark:border-yellow-400'
          : 'bg-white dark:bg-zinc-800 border-blue-500'}
      `}
    >
      <span className="truncate">{value}</span>
    </div>
  );
}

// Linked List Visualizer Component
function LinkedListVisualizer({
  list,
  foundIndex,
}: {
  list: { value: string }[];
  foundIndex: number | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to found node if needed
  useEffect(() => {
    if (
      foundIndex !== null &&
      containerRef.current &&
      containerRef.current.children[foundIndex]
    ) {
      const node = containerRef.current.children[foundIndex] as HTMLElement;
      node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [foundIndex]);

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto items-center gap-8 py-6 px-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
      style={{ minHeight: 110 }}
    >
      {list.length === 0 ? (
        <div className="text-zinc-500 mx-auto">List is empty</div>
      ) : (
        list.map((node, i) => (
          <div key={i} className="flex flex-col items-center gap-1 relative">
            {/* Node box with address and pointer */}
            <div className="flex flex-col items-center">
              <NodeBox value={node.value} isFound={foundIndex === i} />
              {/* Easy address: 1000, 1001, ... */}
              <span className="text-[11px] text-zinc-400 select-none mt-1">
                Addr: <span className="font-mono">{1000 + i}</span>
              </span>
            </div>
            {/* Pointer to next node */}
            {i !== list.length - 1 ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <span className="text-xs text-blue-400 font-mono mr-1">next ➔</span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {1000 + i + 1}
                  </span>
                </div>
                <ArrowRight className="text-blue-400 shrink-0 mt-1" />
              </div>
            ) : (
              // Last node's next is NULL
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <span className="text-xs text-blue-400 font-mono mr-1">next ➔</span>
                  <span className="text-[11px] text-red-400 font-mono">NULL</span>
                </div>
                <X className="text-blue-400 shrink-0 mt-1"/>
              </div>
            )}
          </div>
        ))
      )
      }
    </div>
  );
}

// Main Page Component
export default function LinkedListPage() {
  const [list, setList] = useState<{ value: string }[]>([]);
  const [value, setValue] = useState('');
  const [index, setIndex] = useState('');
  const [search, setSearch] = useState('');
  const [foundIndex, setFoundIndex] = useState<number | null>(null);

  const valueInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setList([]);
    setValue('');
    setIndex('');
    setSearch('');
    setFoundIndex(null);
    valueInputRef.current?.focus();
  };

  const insertAtStart = () => {
    if (!value) return;
    setList([{ value }, ...list]);
    setValue('');
    setFoundIndex(null);
    valueInputRef.current?.focus();
  };

  const insertAtEnd = () => {
    if (!value) return;
    setList([...list, { value }]);
    setValue('');
    setFoundIndex(null);
    valueInputRef.current?.focus();
  };

  const insertAtIndex = () => {
    if (!value || index === '') return;
    const i = parseInt(index);
    if (isNaN(i) || i < 0 || i > list.length) return;
    const newList = [...list];
    newList.splice(i, 0, { value });
    setList(newList);
    setValue('');
    setIndex('');
    setFoundIndex(null);
    valueInputRef.current?.focus();
  };

  const deleteFirst = () => {
    setList(list.slice(1));
    setFoundIndex(null);
  };

  const deleteLast = () => {
    setList(list.slice(0, -1));
    setFoundIndex(null);
  };

  const searchValue = () => {
    const idx = list.findIndex((node) => node.value === search.trim());
    setFoundIndex(idx);
  };

  // Focus value input on mount
  useEffect(() => {
    valueInputRef.current?.focus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-200 mb-2">
        🔗 Singly Linked List Visualizer
      </h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mb-4 text-sm">
        Insert, delete, and search nodes in a singly linked list.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3">
        <input
          ref={valueInputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          className="border px-3 py-2 rounded w-28"
          onKeyDown={e => { if (e.key === 'Enter') insertAtEnd(); }}
        />
        <input
          type="number"
          min={0}
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          placeholder="Index"
          className="border px-3 py-2 rounded w-24"
        />
        <button onClick={insertAtStart} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
          Insert at Start
        </button>
        <button onClick={insertAtEnd} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
          Insert at End
        </button>
        <button onClick={insertAtIndex} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
          Insert at Index
        </button>
        <button onClick={deleteFirst} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
          Delete First
        </button>
        <button onClick={deleteLast} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
          Delete Last
        </button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="border px-3 py-2 rounded w-28"
          onKeyDown={e => { if (e.key === 'Enter') searchValue(); }}
        />
        <button onClick={searchValue} className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
          Search
        </button>
        <button onClick={reset} className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* List Visualization */}
      <LinkedListVisualizer list={list} foundIndex={foundIndex} />
    </div>
  );
}
