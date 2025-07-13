'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, RefreshCcw, X, Search, Plus, Trash2 } from 'lucide-react';

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
      className={`w-20 h-14 sm:w-24 sm:h-16 rounded-lg flex items-center justify-center border-2 px-2 transition-all duration-300 font-semibold text-sm sm:text-lg shadow-sm
        ${isFound
          ? 'bg-amber-50 border-amber-400 dark:bg-amber-900/30 dark:border-amber-400 text-amber-800 dark:text-amber-200'
          : 'bg-white dark:bg-surfaceDark border-borderL dark:border-borderDark text-text dark:text-textDark'}
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
    <div className="bg-surface dark:bg-surfaceDark rounded-xl border border-borderL dark:border-borderDark p-4 sm:p-6 shadow-sm">
      <div
        ref={containerRef}
        className="flex overflow-x-auto items-center gap-4 sm:gap-6 py-4 scrollbar-thin scrollbar-thumb-borderL dark:scrollbar-thumb-borderDark scrollbar-track-transparent"
        style={{ minHeight: 120 }}
      >
        {list.length === 0 ? (
          <div className="text-borderL dark:text-borderDark mx-auto py-8 text-center">
            <div className="text-lg font-medium mb-2">List is empty</div>
            <div className="text-sm opacity-75">Add some nodes to get started</div>
          </div>
        ) : (
          list.map((node, i) => (
            <div key={i} className="flex flex-col items-center gap-2 relative min-w-fit">
              {/* Node box with address */}
              <div className="flex flex-col items-center">
                <NodeBox value={node.value} isFound={foundIndex === i} />
                {/* Address */}
                <span className="text-xs text-borderL dark:text-borderDark select-none mt-1">
                  <span className="font-mono">{1000 + i}</span>
                </span>
              </div>
              {/* Pointer to next node */}
              {i !== list.length - 1 ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-primary dark:text-primary font-medium">next</span>
                    <ArrowRight className="text-primary dark:text-primary w-4 h-4" />
                    <span className="text-xs text-borderL dark:text-borderDark font-mono">
                      {1000 + i + 1}
                    </span>
                  </div>
                </div>
              ) : (
                // Last node's next is NULL
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-primary dark:text-primary font-medium">next</span>
                    <X className="text-red-500 w-4 h-4" />
                    <span className="text-xs text-red-500 font-mono">NULL</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
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
    if (!value.trim()) return;
    setList([{ value: value.trim() }, ...list]);
    setValue('');
    setFoundIndex(null);
    valueInputRef.current?.focus();
  };

  const insertAtEnd = () => {
    if (!value.trim()) return;
    setList([...list, { value: value.trim() }]);
    setValue('');
    setFoundIndex(null);
    valueInputRef.current?.focus();
  };

  const insertAtIndex = () => {
    if (!value.trim() || index === '') return;
    const i = parseInt(index);
    if (isNaN(i) || i < 0 || i > list.length) return;
    const newList = [...list];
    newList.splice(i, 0, { value: value.trim() });
    setList(newList);
    setValue('');
    setIndex('');
    setFoundIndex(null);
    valueInputRef.current?.focus();
  };

  const deleteFirst = () => {
    if (list.length === 0) return;
    setList(list.slice(1));
    setFoundIndex(null);
  };

  const deleteLast = () => {
    if (list.length === 0) return;
    setList(list.slice(0, -1));
    setFoundIndex(null);
  };

  const searchValue = () => {
    if (!search.trim()) {
      setFoundIndex(null);
      return;
    }
    const idx = list.findIndex((node) => node.value === search.trim());
    setFoundIndex(idx >= 0 ? idx : null);
  };

  // Focus value input on mount
  useEffect(() => {
    valueInputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-backgroundDark text-text dark:text-textDark transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-primary">
            Singly Linked List Visualizer
          </h1>
          <p className="text-borderL dark:text-borderDark text-sm sm:text-base max-w-2xl mx-auto">
            Interactive visualization of singly linked list operations including insertion, deletion, and search functionality.
          </p>
        </div>

        {/* Input Controls */}
        <div className="bg-surface dark:bg-surfaceDark rounded-xl border border-borderL dark:border-borderDark p-4 sm:p-6 shadow-sm">
          <div className="space-y-4">
            {/* Value and Index Inputs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-text dark:text-textDark">
                  Value
                </label>
                <input
                  ref={valueInputRef}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 border border-borderL dark:border-borderDark rounded-lg bg-white dark:bg-backgroundDark text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  onKeyDown={e => { if (e.key === 'Enter') insertAtEnd(); }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-text dark:text-textDark">
                  Index (optional)
                </label>
                <input
                  type="number"
                  min={0}
                  max={list.length}
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                  placeholder="Position"
                  className="w-full px-3 py-2 border border-borderL dark:border-borderDark rounded-lg bg-white dark:bg-backgroundDark text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button 
                onClick={insertAtStart} 
                disabled={!value.trim()}
                className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-darkPrimary disabled:bg-borderL disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Insert Start
              </button>
              <button 
                onClick={insertAtEnd} 
                disabled={!value.trim()}
                className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-darkPrimary disabled:bg-borderL disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Insert End
              </button>
              <button 
                onClick={insertAtIndex} 
                disabled={!value.trim() || index === '' || parseInt(index) < 0 || parseInt(index) > list.length}
                className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-darkPrimary disabled:bg-borderL disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Insert at {index || 'Index'}
              </button>
              <button 
                onClick={deleteFirst} 
                disabled={list.length === 0}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-borderL disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete First
              </button>
              <button 
                onClick={deleteLast} 
                disabled={list.length === 0}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-borderL disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Last
              </button>
            </div>
          </div>
        </div>

        {/* Search Controls */}
        <div className="bg-surface dark:bg-surfaceDark rounded-xl border border-borderL dark:border-borderDark p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-text dark:text-textDark">
                Search Value
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter value to search"
                className="w-full px-3 py-2 border border-borderL dark:border-borderDark rounded-lg bg-white dark:bg-backgroundDark text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                onKeyDown={e => { if (e.key === 'Enter') searchValue(); }}
              />
            </div>
            <div className="flex gap-2 sm:items-end">
              <button 
                onClick={searchValue}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button 
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 bg-borderL hover:bg-gray-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
          {foundIndex !== null && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {foundIndex >= 0 ? `Found "${search}" at index ${foundIndex}` : `"${search}" not found in the list`}
              </p>
            </div>
          )}
        </div>

        {/* List Stats */}
        <div className="bg-surface dark:bg-surfaceDark rounded-xl border border-borderL dark:border-borderDark p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-borderL dark:text-borderDark">Length:</span>
              <span className="font-semibold text-primary dark:text-primary">{list.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-borderL dark:text-borderDark">Memory Usage:</span>
              <span className="font-semibold text-primary dark:text-primary">{list.length * 8} bytes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-borderL dark:text-borderDark">Time Complexity:</span>
              <span className="font-semibold text-primary dark:text-primary">O(n) search, O(1) insert/delete</span>
            </div>
          </div>
        </div>

        {/* List Visualization */}
        <LinkedListVisualizer list={list} foundIndex={foundIndex} />
      </div>
    </div>
  );
}