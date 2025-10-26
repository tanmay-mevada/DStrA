'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, RefreshCcw, X, Search, Plus, Trash2 } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

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

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      toast('Please Login to continue');
      router.replace('/auth/login');
      return;
    }
    trackUserActivity(pathname);
  }, [session, status, router, pathname]);

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

    if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-4 border shadow-sm bg-surface dark:bg-surfaceDark rounded-xl border-borderL dark:border-borderDark sm:p-6">
      <div
        ref={containerRef}
        className="flex items-center gap-4 py-4 overflow-x-auto sm:gap-6 scrollbar-thin scrollbar-thumb-borderL dark:scrollbar-thumb-borderDark scrollbar-track-transparent"
        style={{ minHeight: 120 }}
      >
        {list.length === 0 ? (
          <div className="py-8 mx-auto text-center text-borderL dark:text-borderDark">
            <div className="mb-2 text-lg font-medium">List is empty</div>
            <div className="text-sm opacity-75">Add some nodes to get started</div>
          </div>
        ) : (
          list.map((node, i) => (
            <div key={i} className="relative flex flex-col items-center gap-2 min-w-fit">
              {/* Node box with address */}
              <div className="flex flex-col items-center">
                <NodeBox value={node.value} isFound={foundIndex === i} />
                {/* Address */}
                <span className="mt-1 text-xs select-none text-borderL dark:text-borderDark">
                  <span className="font-mono">{1000 + i}</span>
                </span>
              </div>
              {/* Pointer to next node */}
              {i !== list.length - 1 ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-primary dark:text-primary">next</span>
                    <ArrowRight className="w-4 h-4 text-primary dark:text-primary" />
                    <span className="font-mono text-xs text-borderL dark:text-borderDark">
                      {1000 + i + 1}
                    </span>
                  </div>
                </div>
              ) : (
                // Last node's next is NULL
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-primary dark:text-primary">next</span>
                    <X className="w-4 h-4 text-red-500" />
                    <span className="font-mono text-xs text-red-500">NULL</span>
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

export default function LinkedListPage() {
  const [list, setList] = useState<{ value: string }[]>([]);
  const [value, setValue] = useState('');
  const [index, setIndex] = useState('');
  const [deleteIdx, setDeleteIdx] = useState('');
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
    <div className="min-h-screen transition-colors duration-300 bg-background dark:bg-backgroundDark text-text dark:text-textDark">
      <div className="max-w-6xl px-4 py-8 mx-auto space-y-8 sm:py-12">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl text-primary dark:text-primary">
            Singly Linked List Visualizer
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-borderL dark:text-borderDark sm:text-base">
            Interactive visualization of singly linked list operations including insertion, deletion, and search functionality.
          </p>
        </div>

        <div className="p-4 border shadow-sm bg-surface dark:bg-surfaceDark rounded-xl border-borderL dark:border-borderDark sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-text dark:text-textDark">
                  Value
                </label>
                <input
                  ref={valueInputRef}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 transition-all duration-200 bg-white border rounded-lg border-borderL dark:border-borderDark dark:bg-backgroundDark text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyDown={e => { if (e.key === 'Enter') insertAtEnd(); }}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-text dark:text-textDark">
                  Index (optional)
                </label>
                <input
                  type="number"
                  min={0}
                  max={list.length}
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                  placeholder="Position"
                  className="w-full px-3 py-2 transition-all duration-200 bg-white border rounded-lg border-borderL dark:border-borderDark dark:bg-backgroundDark text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={insertAtStart}
                disabled={!value.trim()}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-primary hover:bg-darkPrimary disabled:bg-borderL disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Insert Start
              </button>
              <button
                onClick={insertAtEnd}
                disabled={!value.trim()}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-primary hover:bg-darkPrimary disabled:bg-borderL disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Insert End
              </button>
              <button
                onClick={insertAtIndex}
                disabled={!value.trim() || index === '' || parseInt(index) < 0 || parseInt(index) > list.length}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-primary hover:bg-darkPrimary disabled:bg-borderL disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Insert at {index || 'Index'}
              </button>
              <button
                onClick={deleteFirst}
                disabled={list.length === 0}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-all duration-200 bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-borderL disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Delete First
              </button>
              <button
                onClick={deleteLast}
                disabled={list.length === 0}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-all duration-200 bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-borderL disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Delete Last
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={Math.max(0, list.length - 1)}
                  value={deleteIdx}
                  onChange={(e) => setDeleteIdx(e.target.value)}
                  placeholder="Delete Index"
                  className="w-28 px-3 py-2 text-sm transition-all duration-200 bg-white border rounded-lg border-borderL dark:border-borderDark dark:bg-backgroundDark text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={() => {
                    // delete at index handler
                    if (list.length === 0) return;
                    if (deleteIdx === '') return toast.error('Enter index to delete');
                    const i = parseInt(deleteIdx);
                    if (isNaN(i) || i < 0 || i >= list.length) return toast.error('Invalid index');
                    const newList = [...list];
                    newList.splice(i, 1);
                    setList(newList);
                    setFoundIndex(null);
                    setDeleteIdx('');
                    valueInputRef.current?.focus();
                  }}
                  disabled={list.length === 0 || deleteIdx === ''}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-all duration-200 bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-borderL disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete at Index
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border shadow-sm bg-surface dark:bg-surfaceDark rounded-xl border-borderL dark:border-borderDark sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-text dark:text-textDark">
                Search Value
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter value to search"
                className="w-full px-3 py-2 transition-all duration-200 bg-white border rounded-lg border-borderL dark:border-borderDark dark:bg-backgroundDark text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyDown={e => { if (e.key === 'Enter') searchValue(); }}
              />
            </div>
            <div className="flex gap-2 sm:items-end">
              <button
                onClick={searchValue}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-amber-500 hover:bg-amber-600"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-borderL hover:bg-gray-600"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
          {foundIndex !== null && (
            <div className="p-3 mt-4 border rounded-lg bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {foundIndex >= 0 ? `Found "${search}" at index ${foundIndex}` : `"${search}" not found in the list`}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border shadow-sm bg-surface dark:bg-surfaceDark rounded-xl border-borderL dark:border-borderDark sm:p-6">
          <div className="flex flex-wrap gap-4 text-sm sm:gap-6">
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
              <span className="font-semibold text-primary dark:text-primary">O(n) search, O(1) insert/delete (First & Last)</span>
            </div>
          </div>
        </div>

        <LinkedListVisualizer list={list} foundIndex={foundIndex} />
      </div>
    </div>
  );
}