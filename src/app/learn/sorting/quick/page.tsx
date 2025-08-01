'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer, ArrowLeft, BookOpen, Code, Zap, TrendingUp, Clock } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

export default function QuickSortPage() {
  const SIZE = 20;

  const [array, setArray] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [iIndex, setIIndex] = useState<number | null>(null);
  const [jIndex, setJIndex] = useState<number | null>(null);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [partitioning, setPartitioning] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [partitions, setPartitions] = useState(0);

  const speedRef = useRef(speed);
  const isPaused = useRef(false);
  const resetVersion = useRef(0);

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

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }
  
  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    resetVersion.current++;
    isPaused.current = false;
    setPaused(false);
    setIsSorting(false);
    setCurrentDepth(0);
    setComparisons(0);
    setSwaps(0);
    setPartitions(0);
    setPivotIndex(null);
    setIIndex(null);
    setJIndex(null);
    setSwapping([]);
    setSortedIndices([]);
    setPartitioning([]);

    const newArray = Array.from({ length: SIZE }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setArray(newArray);
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const waitIfPaused = async (version: number) => {
    while (isPaused.current && resetVersion.current === version) {
      await delay(50);
    }
  };

  const resetSortingState = () => {
    setIsSorting(false);
    setPivotIndex(null);
    setIIndex(null);
    setJIndex(null);
    setSwapping([]);
    setPartitioning([]);
    isPaused.current = false;
    setPaused(false);
  };

  const quickSort = async () => {
    const version = resetVersion.current;
    setIsSorting(true);
    const arr = [...array];
    let totalComparisons = 0;
    let totalSwaps = 0;
    let totalPartitions = 0;

    const sort = async (start: number, end: number, depth: number = 0) => {
      if (start >= end || resetVersion.current !== version) return;

      setCurrentDepth(depth);
      setPartitioning([start, end]);
      
      const pivotValue = arr[start];
      setPivotIndex(start);
      totalPartitions++;
      setPartitions(totalPartitions);
      
      await waitIfPaused(version);
      await delay(speedRef.current);

      let i = start;
      let j = end;

      while (i < j) {
        if (resetVersion.current !== version) return;

        // Move i pointer right
        while (arr[i] <= pivotValue && i < end) {
          setIIndex(i);
          totalComparisons++;
          setComparisons(totalComparisons);
          await waitIfPaused(version);
          await delay(speedRef.current);
          i++;
        }

        // Move j pointer left
        while (arr[j] > pivotValue) {
          setJIndex(j);
          totalComparisons++;
          setComparisons(totalComparisons);
          await waitIfPaused(version);
          await delay(speedRef.current);
          j--;
        }

        if (i < j) {
          setSwapping([i, j]);
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          totalSwaps++;
          setSwaps(totalSwaps);
          await delay(speedRef.current);
          setSwapping([]);
        }
      }

      // Place pivot in correct position
      setSwapping([start, j]);
      [arr[start], arr[j]] = [arr[j], arr[start]];
      setArray([...arr]);
      totalSwaps++;
      setSwaps(totalSwaps);
      await delay(speedRef.current);
      setSwapping([]);
      
      setSortedIndices((prev) => [...new Set([...prev, j])]);
      setPartitioning([]);

      // Recursively sort left and right partitions
      await sort(start, j - 1, depth + 1);
      await sort(j + 1, end, depth + 1);
    };

    await sort(0, array.length - 1);

    if (resetVersion.current === version) {
      setSortedIndices([...Array(array.length).keys()]);
      setPartitioning([]);
    }

    resetSortingState();
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] py-4 sm:py-6 lg:py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button className="p-2 transition-colors border rounded-lg bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5 text-[#111827] dark:text-[#e2e8f0]" />
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] dark:text-[#e2e8f0]">
              Quick Sort (Hoare Partition) Visualization
            </h1>
          </div>
          <p className="max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Watch how Quick Sort uses divide-and-conquer to efficiently sort arrays by partitioning around pivot elements using the Hoare partition scheme.
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 mb-6 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border-slate-200 dark:border-slate-700 sm:p-6 sm:mb-8">
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={generateArray}
              disabled={isSorting}
              className="flex items-center justify-center gap-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[#111827] dark:text-[#e2e8f0] font-medium px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="text-sm">Generate Array</span>
            </button>
            
            <button
              onClick={quickSort}
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
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
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
        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-5 sm:mb-8">
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Depth</div>
            <div className="text-lg sm:text-xl font-bold text-[#38bdf8] dark:text-[#0ea5e9]">{currentDepth}</div>
          </div>
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Comparisons</div>
            <div className="text-lg font-bold text-yellow-500 sm:text-xl">{comparisons}</div>
          </div>
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Swaps</div>
            <div className="text-lg font-bold text-red-500 sm:text-xl">{swaps}</div>
          </div>
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Partitions</div>
            <div className="text-lg font-bold text-purple-500 sm:text-xl">{partitions}</div>
          </div>
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Sorted</div>
            <div className="text-lg font-bold text-green-500 sm:text-xl">{sortedIndices.length}</div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="p-4 mb-6 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border-slate-200 dark:border-slate-700 sm:p-6 sm:mb-8">
          <div className="flex items-end justify-center h-64 overflow-x-auto sm:h-80 md:h-96">
            <div className="flex items-end gap-1 sm:gap-2 min-w-fit">
              {array.map((val, i) => {
                const isPivot = pivotIndex === i;
                const isI = iIndex === i;
                const isJ = jIndex === i;
                const isSwap = swapping.includes(i);
                const isSorted = sortedIndices.includes(i);
                const isPartitioning = partitioning.length === 2 && i >= partitioning[0] && i <= partitioning[1];
                
                let barColor = 'bg-[#38bdf8] dark:bg-[#0ea5e9]';
                if (isSwap) barColor = 'bg-red-400 ring-2 ring-red-300';
                else if (isPivot) barColor = 'bg-purple-400 ring-2 ring-purple-300';
                else if (isI || isJ) barColor = 'bg-yellow-400 ring-2 ring-yellow-300';
                else if (isSorted) barColor = 'bg-green-400 ring-2 ring-green-300';
                else if (isPartitioning) barColor = 'bg-orange-300 ring-1 ring-orange-200';
                
                let pointer: string[] = [];
                if (isI) pointer.push('i');
                if (isJ) pointer.push('j');
                if (isPivot) pointer.push('P');
                
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
                    <div className="mt-1 text-xs select-none text-slate-500 dark:text-slate-400">
                      {i}
                    </div>
                    {/* Pointer */}
                    <div className="h-4 text-xs font-bold leading-3 text-yellow-600 dark:text-yellow-400">
                      {pointer.length > 0 && <span>↓ {pointer.join('/')}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-4 mt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#38bdf8] dark:bg-[#0ea5e9] rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-300 rounded ring-1 ring-orange-200"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Current Partition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-400 rounded ring-2 ring-purple-300"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Pivot (P)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded ring-2 ring-yellow-300"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Pointers (i/j)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded ring-2 ring-red-300"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded ring-2 ring-green-300"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Sorted</span>
            </div>
          </div>
        </div>

        {/* Theory Section */}
        <div className="grid gap-6 lg:grid-cols-2 sm:gap-8">
          {/* How it Works */}
          <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">How Quick Sort Works</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              <p>
                Quick Sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element and partitioning the array around it. The Hoare partition scheme uses two pointers moving towards each other.
              </p>
              <p>
                The algorithm recursively applies the same process to the sub-arrays on either side of the pivot until the entire array is sorted.
              </p>
              <div className="p-3 mt-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <h3 className="font-medium text-[#111827] dark:text-[#e2e8f0] mb-2">Hoare Partition Steps:</h3>
                <ol className="space-y-1 text-sm">
                  <li>1. Choose first element as pivot</li>
                  <li>2. Move i pointer right while element ≤ pivot</li>
                  <li>3. Move j pointer left while element {'<'}  pivot</li>
                  <li>4. Swap elements if i {'>'} j, repeat</li>
                  <li>5. Place pivot in correct position</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Complexity Analysis */}
          <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Complexity Analysis</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Avg Time Complexity</div>
                  <div className="font-mono text-sm text-green-500">O(n log n)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Space Complexity</div>
                  <div className="font-mono text-sm text-blue-500">O(log n)</div>
                </div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p className="mb-2">
                  <strong>Best Case:</strong> O(n log n) - balanced partitions
                </p>
                <p className="mb-2">
                  <strong>Average Case:</strong> O(n log n) - random pivots
                </p>
                <p>
                  <strong>Worst Case:</strong> O(n²) - already sorted arrays
                </p>
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Pros & Cons</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium text-green-600 dark:text-green-400">Advantages:</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Excellent average performance O(n log n)</li>
                  <li>• In-place sorting algorithm</li>
                  <li>• Cache-efficient due to good locality</li>
                  <li>• Widely used in practice</li>
                  <li>• Parallelizable algorithm</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-red-600 dark:text-red-400">Disadvantages:</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Worst-case O(n²) performance</li>
                  <li>• Not stable (relative order not preserved)</li>
                  <li>• Recursive implementation uses stack space</li>
                  <li>• Performance depends on pivot selection</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Implementation */}
          <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Implementation</h2>
            </div>
            <div className="p-4 overflow-x-auto rounded-lg bg-slate-100 dark:bg-slate-800">
              <pre className="text-sm text-slate-700 dark:text-slate-300">
                <code>{`function quickSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;
  
  const pivot = hoarePartition(arr, start, end);
  quickSort(arr, start, pivot - 1);
  quickSort(arr, pivot + 1, end);
}

function hoarePartition(arr, start, end) {
  const pivotValue = arr[start];
  let i = start;
  let j = end;
  
  while (i < j) {
    while (arr[i] <= pivotValue && i < end) i++;
    while (arr[j] > pivotValue) j--;
    
    if (i < j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[start], arr[j]] = [arr[j], arr[start]];
  return j;
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}