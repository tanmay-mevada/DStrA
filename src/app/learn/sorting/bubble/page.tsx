'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer, ArrowLeft, BookOpen, Code, Zap, TrendingUp, Clock } from 'lucide-react';

export default function BubbleSortPage() {
  const SIZE = 20;

  const [array, setArray] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [currentPass, setCurrentPass] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const speedRef = useRef(speed);
  const isPaused = useRef(false);
  const resetVersion = useRef(0);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    resetVersion.current++;
    isPaused.current = false;
    setPaused(false);
    setIsSorting(false);
    setCurrentPass(0);
    setComparisons(0);
    setSwaps(0);

    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);

    const newArray = Array.from({ length: SIZE }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setArray(newArray);
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const waitIfPaused = async (version: number) => {
    while (isPaused.current && resetVersion.current === version) {
      await delay(50);
    }
  };

  const resetSortingState = () => {
    setIsSorting(false);
    setComparing([]);
    setSwapping([]);
    setPaused(false);
    isPaused.current = false;
  };

  const bubbleSort = async () => {
    const version = resetVersion.current;
    setIsSorting(true);
    isPaused.current = false;
    setComparisons(0);
    setSwaps(0);

    const arr = [...array];
    const n = arr.length;
    const newSorted: number[] = [];
    let totalComparisons = 0;
    let totalSwaps = 0;

    outer: for (let i = 0; i < n; i++) {
      setCurrentPass(i + 1);
      
      for (let j = 0; j < n - i - 1; j++) {
        if (resetVersion.current !== version) break outer;

        await waitIfPaused(version);
        setComparing([j, j + 1]);
        totalComparisons++;
        setComparisons(totalComparisons);
        await delay(speedRef.current);
        await waitIfPaused(version);

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          totalSwaps++;
          setSwaps(totalSwaps);
          await delay(speedRef.current);
        }

        setSwapping([]);
      }

      if (resetVersion.current !== version) break;
      newSorted.push(n - i - 1);
      setSortedIndices([...newSorted]);
    }

    if (resetVersion.current === version) {
      setSortedIndices([...Array(n).keys()]);
      setComparing([]);
    }

    resetSortingState();
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-yellow-100 text-yellow-900 text-sm rounded-md shadow-md animate-fade md:hidden">
          <Clock className="inline mr-1" />
          This page is best viewed on larger screens for optimal visualization.
        </div>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#111827] dark:text-[#e2e8f0]" />
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] dark:text-[#e2e8f0]">
              Bubble Sort Visualization
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
            Watch how bubble sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they're in the wrong order.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <button
              onClick={generateArray}
              disabled={isSorting}
              className="flex items-center justify-center gap-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[#111827] dark:text-[#e2e8f0] font-medium px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="text-sm">Generate Array</span>
            </button>
            
            <button
              onClick={bubbleSort}
              disabled={isSorting}
              className="flex items-center justify-center gap-2 bg-[#38bdf8] dark:bg-[#0ea5e9] text-white font-medium px-4 py-2.5 rounded-lg hover:bg-[#0ea5e9] dark:hover:bg-[#38bdf8] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <span className="text-sm">Start Sorting</span>
            </button>
            
            <button
              onClick={() => {
                isPaused.current = !isPaused.current;
                setPaused(isPaused.current);
              }}
              disabled={!isSorting}
              className="flex items-center justify-center gap-2 bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100 font-medium px-4 py-2.5 rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pause className="w-4 h-4" />
              <span className="text-sm">{paused ? 'Resume' : 'Pause'}</span>
            </button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Timer className="w-4 h-4 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <span className="text-sm font-medium text-[#111827] dark:text-[#e2e8f0] whitespace-nowrap">
                Speed: {speed}ms
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              value={speed}
              onChange={(e) => {
                const newSpeed = Number(e.target.value);
                setSpeed(newSpeed);
                speedRef.current = newSpeed;
              }}
              className="flex-1 accent-[#38bdf8] dark:accent-[#0ea5e9]"
            />
            <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Fast</span>
              <span>Slow</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Current Pass</div>
            <div className="text-lg sm:text-xl font-bold text-[#38bdf8] dark:text-[#0ea5e9]">{currentPass}</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Comparisons</div>
            <div className="text-lg sm:text-xl font-bold text-yellow-500">{comparisons}</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Swaps</div>
            <div className="text-lg sm:text-xl font-bold text-red-500">{swaps}</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Sorted</div>
            <div className="text-lg sm:text-xl font-bold text-green-500">{sortedIndices.length}</div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <div className="flex items-end justify-center h-64 sm:h-80 md:h-96 overflow-x-auto">
            <div className="flex items-end gap-1 sm:gap-2 min-w-fit">
              {array.map((val, i) => {
                const isComparing = comparing.includes(i);
                const isSwapping = swapping.includes(i);
                const isSorted = sortedIndices.includes(i);
                
                let barColor = 'bg-[#38bdf8] dark:bg-[#0ea5e9]';
                if (isComparing) barColor = 'bg-yellow-400 ring-2 ring-yellow-300';
                else if (isSwapping) barColor = 'bg-red-400 ring-2 ring-red-300';
                else if (isSorted) barColor = 'bg-green-400 ring-2 ring-green-300';
                
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ minWidth: '20px' }}
                  >
                    {/* Value */}
                    <div className="text-xs font-medium text-[#111827] dark:text-[#e2e8f0] mb-1 select-none">
                      {val}
                    </div>
                    {/* Bar */}
                    <div
                      className={`w-4 sm:w-6 md:w-8 transition-all duration-200 rounded-t-lg ${barColor}`}
                      style={{ height: `${val * 2.5}px` }}
                    />
                    {/* Index */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 select-none">
                      {i}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#38bdf8] dark:bg-[#0ea5e9] rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 ring-2 ring-yellow-300 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 ring-2 ring-red-300 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 ring-2 ring-green-300 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Sorted</span>
            </div>
          </div>
        </div>

        {/* Theory Section */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* How it Works */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">How Bubble Sort Works</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              <p>
                Bubble sort is one of the simplest sorting algorithms to understand. It works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they're in the wrong order.
              </p>
              <p>
                The algorithm gets its name because smaller elements "bubble" to the beginning of the list, just like air bubbles rise to the surface of water.
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 mt-4">
                <h3 className="font-medium text-[#111827] dark:text-[#e2e8f0] mb-2">Algorithm Steps:</h3>
                <ol className="space-y-1 text-sm">
                  <li>1. Start with the first element</li>
                  <li>2. Compare adjacent elements</li>
                  <li>3. Swap if they're in wrong order</li>
                  <li>4. Continue until no swaps needed</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Complexity Analysis */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Complexity Analysis</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Time Complexity</div>
                  <div className="font-mono text-sm text-red-500">O(n²)</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Space Complexity</div>
                  <div className="font-mono text-sm text-green-500">O(1)</div>
                </div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p className="mb-2">
                  <strong>Best Case:</strong> O(n) - when array is already sorted
                </p>
                <p className="mb-2">
                  <strong>Average Case:</strong> O(n²) - random order
                </p>
                <p>
                  <strong>Worst Case:</strong> O(n²) - reverse sorted array
                </p>
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Pros & Cons</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-green-600 dark:text-green-400 mb-2">Advantages:</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Simple to understand and implement</li>
                  <li>• In-place sorting (constant space)</li>
                  <li>• Stable sorting algorithm</li>
                  <li>• Can detect if list is sorted</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">Disadvantages:</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Poor time complexity O(n²)</li>
                  <li>• Inefficient for large datasets</li>
                  <li>• More swaps than other algorithms</li>
                  <li>• Not suitable for production use</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Implementation */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Implementation</h2>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-slate-700 dark:text-slate-300">
                <code>{`function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swaps, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}