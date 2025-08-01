'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer, ArrowLeft, BookOpen, Code, Zap, TrendingUp, Clock } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

export default function InsertionSortPage() {
  const SIZE = 20;

  const [array, setArray] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [keyIndex, setKeyIndex] = useState<number | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [currentPass, setCurrentPass] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [insertions, setInsertions] = useState(0);

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
    setCurrentPass(0);
    setComparisons(0);
    setInsertions(0);
    setKeyIndex(null);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([0]); // First element is always sorted initially

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
    setKeyIndex(null);
    setPaused(false);
    isPaused.current = false;
  };

  const insertionSort = async () => {
    const version = resetVersion.current;
    setIsSorting(true);
    isPaused.current = false;
    setComparisons(0);
    setInsertions(0);

    const arr = [...array];
    const n = arr.length;
    let totalComparisons = 0;
    let totalInsertions = 0;

    // First element is already sorted
    setSortedIndices([0]);

    outer: for (let i = 1; i < n; i++) {
      if (resetVersion.current !== version) break outer;

      setCurrentPass(i);
      let j = i;
      setKeyIndex(i);
      await waitIfPaused(version);
      await delay(speedRef.current);

      while (j > 0 && arr[j - 1] > arr[j]) {
        if (resetVersion.current !== version) break outer;

        await waitIfPaused(version);
        setComparing([j - 1, j]);
        totalComparisons++;
        setComparisons(totalComparisons);
        await delay(speedRef.current);

        setSwapping([j - 1, j]);
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        setArray([...arr]);
        totalInsertions++;
        setInsertions(totalInsertions);
        await delay(speedRef.current);

        setSwapping([]);
        j--;
      }

      if (resetVersion.current !== version) break;
      
      // Add current element to sorted portion
      setSortedIndices(prev => [...prev, i]);
      setComparing([]);
      setKeyIndex(null);
    }

    if (resetVersion.current === version) {
      setSortedIndices([...Array(n).keys()]);
      setComparing([]);
      setKeyIndex(null);
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
              Insertion Sort Visualization
            </h1>
          </div>
          <p className="max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Watch how insertion sort builds the final sorted array one element at a time, inserting each element into its correct position within the already sorted portion.
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
              onClick={insertionSort}
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
        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4 sm:mb-8">
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Current Pass</div>
            <div className="text-lg sm:text-xl font-bold text-[#38bdf8] dark:text-[#0ea5e9]">{currentPass}</div>
          </div>
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Comparisons</div>
            <div className="text-lg font-bold text-yellow-500 sm:text-xl">{comparisons}</div>
          </div>
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Insertions</div>
            <div className="text-lg font-bold text-red-500 sm:text-xl">{insertions}</div>
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
                const isComparing = comparing.includes(i);
                const isSwapping = swapping.includes(i);
                const isSorted = sortedIndices.includes(i);
                const isKey = keyIndex === i;
                
                let barColor = 'bg-[#38bdf8] dark:bg-[#0ea5e9]';
                if (isKey) barColor = 'bg-purple-400 ring-2 ring-purple-300';
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
                    <div className="mt-1 text-xs select-none text-slate-500 dark:text-slate-400">
                      {i}
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
              <div className="w-4 h-4 bg-purple-400 rounded ring-2 ring-purple-300"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Current Key</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded ring-2 ring-yellow-300"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded ring-2 ring-red-300"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Inserting</span>
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
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">How Insertion Sort Works</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              <p>
                Insertion sort builds the final sorted array one element at a time. It's similar to how you might sort playing cards in your hand - you take each card and insert it into its correct position among the already sorted cards.
              </p>
              <p>
                The algorithm maintains a sorted subarray at the beginning and repeatedly takes the next element from the unsorted portion to insert it into the correct position in the sorted portion.
              </p>
              <div className="p-3 mt-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <h3 className="font-medium text-[#111827] dark:text-[#e2e8f0] mb-2">Algorithm Steps:</h3>
                <ol className="space-y-1 text-sm">
                  <li>1. Start with second element (first is sorted)</li>
                  <li>2. Compare with elements in sorted portion</li>
                  <li>3. Shift larger elements to the right</li>
                  <li>4. Insert current element in correct position</li>
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
                  <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Time Complexity</div>
                  <div className="font-mono text-sm text-red-500">O(n²)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Space Complexity</div>
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
          <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Pros & Cons</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium text-green-600 dark:text-green-400">Advantages:</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Efficient for small datasets</li>
                  <li>• Adaptive - performs well on nearly sorted data</li>
                  <li>• Stable sorting algorithm</li>
                  <li>• In-place sorting (constant space)</li>
                  <li>• Online - can sort as it receives data</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-red-600 dark:text-red-400">Disadvantages:</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Poor performance on large datasets</li>
                  <li>• More writes than selection sort</li>
                  <li>• O(n²) comparisons and writes</li>
                  <li>• Not efficient for reverse sorted arrays</li>
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
                <code>{`function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    
    // Move elements that are greater than key
    // one position ahead of their current position
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Place key in its correct position
    arr[j + 1] = key;
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