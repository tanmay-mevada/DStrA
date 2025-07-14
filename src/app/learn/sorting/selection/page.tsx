'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer, ArrowLeft, BookOpen, Code, Zap, TrendingUp, Clock } from 'lucide-react';

export default function SelectionSortPage() {
  const SIZE = 20;

  const [array, setArray] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [minIndex, setMinIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
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
    setMinIndex(null);
    setCurrentIndex(null);
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
    setMinIndex(null);
    setCurrentIndex(null);
    setPaused(false);
    isPaused.current = false;
  };

  const selectionSort = async () => {
    const version = resetVersion.current;
    setIsSorting(true);
    isPaused.current = false;
    setComparisons(0);
    setSwaps(0);

    const arr = [...array];
    const n = arr.length;
    let totalComparisons = 0;
    let totalSwaps = 0;

    outer: for (let i = 0; i < n; i++) {
      if (resetVersion.current !== version) break outer;

      setCurrentPass(i + 1);
      setCurrentIndex(i);
      let minIdx = i;
      setMinIndex(minIdx);

      await waitIfPaused(version);
      await delay(speedRef.current);

      for (let j = i + 1; j < n; j++) {
        if (resetVersion.current !== version) break outer;

        setComparing([minIdx, j]);
        totalComparisons++;
        setComparisons(totalComparisons);
        
        await waitIfPaused(version);
        await delay(speedRef.current);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setMinIndex(minIdx);
        }
      }

      if (resetVersion.current !== version) break;

      setComparing([]);
      
      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        totalSwaps++;
        setSwaps(totalSwaps);
        await delay(speedRef.current);
      }

      setSwapping([]);
      setSortedIndices((prev) => [...prev, i]);
      setMinIndex(null);
      setCurrentIndex(null);
    }

    if (resetVersion.current === version) {
      setSortedIndices([...Array(n).keys()]);
    }

    resetSortingState();
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#111827] dark:text-[#e2e8f0]" />
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] dark:text-[#e2e8f0]">
              Selection Sort Visualization
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
            Watch how selection sort works by repeatedly finding the minimum element from the unsorted portion and swapping it with the first element of the unsorted portion.
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
              onClick={selectionSort}
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
                const isMin = minIndex === i;
                const isCurrent = currentIndex === i;
                
                let barColor = 'bg-[#38bdf8] dark:bg-[#0ea5e9]';
                if (isCurrent) barColor = 'bg-blue-600 ring-2 ring-blue-400';
                else if (isMin) barColor = 'bg-purple-400 ring-2 ring-purple-300';
                else if (isComparing) barColor = 'bg-yellow-400 ring-2 ring-yellow-300';
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
              <div className="w-4 h-4 bg-blue-600 ring-2 ring-blue-400 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Current Position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-400 ring-2 ring-purple-300 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Current Minimum</span>
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
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">How Selection Sort Works</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              <p>
                Selection sort divides the array into two parts: sorted and unsorted. It repeatedly finds the minimum element from the unsorted portion and swaps it with the first element of the unsorted portion.
              </p>
              <p>
                The algorithm maintains a sorted subarray at the beginning and expands it one element at a time by selecting the smallest remaining element.
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 mt-4">
                <h3 className="font-medium text-[#111827] dark:text-[#e2e8f0] mb-2">Algorithm Steps:</h3>
                <ol className="space-y-1 text-sm">
                  <li>1. Find the minimum element in the unsorted array</li>
                  <li>2. Swap it with the first element of unsorted portion</li>
                  <li>3. Move the boundary between sorted and unsorted</li>
                  <li>4. Repeat until the entire array is sorted</li>
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
                  <strong>Best Case:</strong> O(n²) - even when array is sorted
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
                  <li>• Simple implementation</li>
                  <li>• In-place sorting (constant space)</li>
                  <li>• Minimizes the number of swaps</li>
                  <li>• Performance is not affected by initial order</li>
                  <li>• Good for small datasets</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">Disadvantages:</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Poor performance on large datasets</li>
                  <li>• Not adaptive - doesn't benefit from pre-sorted data</li>
                  <li>• Not stable - may change relative order of equal elements</li>
                  <li>• Always O(n²) time complexity</li>
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
                <code>{`function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    // Find the minimum element in the remaining array
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
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