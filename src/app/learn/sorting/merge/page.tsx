'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer, ArrowLeft, BookOpen, Code, Zap, TrendingUp, Clock } from 'lucide-react';

export default function MergeSortPage() {
  const SIZE = 20;

  const [array, setArray] = useState<number[]>([]);
  const [leftArray, setLeftArray] = useState<number[]>([]);
  const [rightArray, setRightArray] = useState<number[]>([]);
  const [mergedArray, setMergedArray] = useState<number[]>([]);
  const [leftPointer, setLeftPointer] = useState<number | null>(null);
  const [rightPointer, setRightPointer] = useState<number | null>(null);
  const [mergePointer, setMergePointer] = useState<number | null>(null);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentRange, setCurrentRange] = useState<[number, number] | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [merges, setMerges] = useState(0);
  const [splits, setSplits] = useState(0);

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
    setCurrentDepth(0);
    setComparisons(0);
    setMerges(0);
    setSplits(0);
    setLeftArray([]);
    setRightArray([]);
    setMergedArray([]);
    setLeftPointer(null);
    setRightPointer(null);
    setMergePointer(null);
    setComparing([]);
    setSortedIndices([]);
    setCurrentRange(null);

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
    setLeftArray([]);
    setRightArray([]);
    setMergedArray([]);
    setLeftPointer(null);
    setRightPointer(null);
    setMergePointer(null);
    setComparing([]);
    setCurrentRange(null);
    isPaused.current = false;
    setPaused(false);
  };

  const mergeSort = async () => {
    const version = resetVersion.current;
    setIsSorting(true);
    const arr = [...array];
    let totalComparisons = 0;
    let totalMerges = 0;
    let totalSplits = 0;

    const sort = async (start: number, end: number, depth: number = 0): Promise<void> => {
      if (start >= end || resetVersion.current !== version) return;

      setCurrentDepth(depth);
      setCurrentRange([start, end]);

      await waitIfPaused(version);
      await delay(speedRef.current);

      if (start === end) {
        setSortedIndices(prev => [...new Set([...prev, start])]);
        return;
      }

      // Split phase
      const mid = Math.floor((start + end) / 2);
      totalSplits++;
      setSplits(totalSplits);

      await waitIfPaused(version);
      await delay(speedRef.current);

      // Recursively sort left and right halves
      await sort(start, mid, depth + 1);
      await sort(mid + 1, end, depth + 1);

      if (resetVersion.current !== version) return;

      // Merge phase
      setCurrentRange([start, end]);
      const leftArr = arr.slice(start, mid + 1);
      const rightArr = arr.slice(mid + 1, end + 1);

      setLeftArray(leftArr);
      setRightArray(rightArr);
      setMergedArray(Array(end - start + 1).fill(null));

      totalMerges++;
      setMerges(totalMerges);

      await waitIfPaused(version);
      await delay(speedRef.current);

      let i = 0, j = 0, k = 0;
      const merged = [];

      while (i < leftArr.length && j < rightArr.length) {
        if (resetVersion.current !== version) return;

        setLeftPointer(i);
        setRightPointer(j);
        setMergePointer(k);
        setComparing([start + i, mid + 1 + j]);

        totalComparisons++;
        setComparisons(totalComparisons);

        await waitIfPaused(version);
        await delay(speedRef.current);

        if (leftArr[i] <= rightArr[j]) {
          merged[k] = leftArr[i];
          arr[start + k] = leftArr[i];
          i++;
        } else {
          merged[k] = rightArr[j];
          arr[start + k] = rightArr[j];
          j++;
        }

        k++;
        setMergedArray([...merged]);
        setArray([...arr]);

        await waitIfPaused(version);
        await delay(speedRef.current);
      }

      // Copy remaining elements
      while (i < leftArr.length) {
        if (resetVersion.current !== version) return;

        setLeftPointer(i);
        setRightPointer(null);
        setMergePointer(k);

        merged[k] = leftArr[i];
        arr[start + k] = leftArr[i];
        i++;
        k++;

        setMergedArray([...merged]);
        setArray([...arr]);

        await waitIfPaused(version);
        await delay(speedRef.current);
      }

      while (j < rightArr.length) {
        if (resetVersion.current !== version) return;

        setLeftPointer(null);
        setRightPointer(j);
        setMergePointer(k);

        merged[k] = rightArr[j];
        arr[start + k] = rightArr[j];
        j++;
        k++;

        setMergedArray([...merged]);
        setArray([...arr]);

        await waitIfPaused(version);
        await delay(speedRef.current);
      }

      // Mark this range as sorted
      setSortedIndices(prev => {
        const newSorted = [...prev];
        for (let idx = start; idx <= end; idx++) {
          if (!newSorted.includes(idx)) {
            newSorted.push(idx);
          }
        }
        return newSorted;
      });

      setComparing([]);
      setLeftPointer(null);
      setRightPointer(null);
      setMergePointer(null);

      await waitIfPaused(version);
      await delay(speedRef.current);
    };

    await sort(0, array.length - 1);

    if (resetVersion.current === version) {
      setSortedIndices([...Array(array.length).keys()]);
      setLeftArray([]);
      setRightArray([]);
      setMergedArray([]);
      setCurrentRange(null);
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
              Merge Sort Visualization
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
            Watch how Merge Sort uses divide-and-conquer to efficiently sort arrays by recursively dividing them and merging sorted subarrays.
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
              onClick={mergeSort}
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6 sm:mb-8">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Depth</div>
            <div className="text-lg sm:text-xl font-bold text-[#38bdf8] dark:text-[#0ea5e9]">{currentDepth}</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Comparisons</div>
            <div className="text-lg sm:text-xl font-bold text-yellow-500">{comparisons}</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Merges</div>
            <div className="text-lg sm:text-xl font-bold text-purple-500">{merges}</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Splits</div>
            <div className="text-lg sm:text-xl font-bold text-blue-500">{splits}</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Sorted</div>
            <div className="text-lg sm:text-xl font-bold text-green-500">{sortedIndices.length}</div>
          </div>
        </div>

        {/* Main Array Visualizer */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <h3 className="text-lg font-semibold text-[#111827] dark:text-[#e2e8f0] mb-4">Main Array</h3>
          <div className="flex items-end justify-center h-64 sm:h-80 md:h-96 overflow-x-auto">
            <div className="flex items-end gap-1 sm:gap-2 min-w-fit">
              {array.map((val, i) => {
                const isComparing = comparing.includes(i);
                const isSorted = sortedIndices.includes(i);
                const isInCurrentRange = currentRange && i >= currentRange[0] && i <= currentRange[1];

                let barColor = 'bg-[#38bdf8] dark:bg-[#0ea5e9]';
                if (isComparing) barColor = 'bg-yellow-400 ring-2 ring-yellow-300';
                else if (isSorted) barColor = 'bg-green-400 ring-2 ring-green-300';
                else if (isInCurrentRange) barColor = 'bg-orange-300 ring-1 ring-orange-200';

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
        </div>

        {/* Merge Process Visualizer */}
        {(leftArray.length > 0 || rightArray.length > 0) && (
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
            <h3 className="text-lg font-semibold text-[#111827] dark:text-[#e2e8f0] mb-4">Merge Process</h3>
            <div className="space-y-6">
              {/* Left and Right Arrays */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Array */}
                <div>
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Left Array</h4>
                  <div className="flex items-end gap-1 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 overflow-x-auto">
                    {leftArray.map((val, i) => (
                      <div key={i} className="flex flex-col items-center" style={{ minWidth: '20px' }}>
                        <div className="text-xs font-medium text-[#111827] dark:text-[#e2e8f0] mb-1">
                          {val}
                        </div>
                        <div
                          className={`w-4 rounded-t ${leftPointer === i ? 'bg-yellow-400' : 'bg-blue-400'}`}
                          style={{ height: `${val * 0.8}px` }}
                        />
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {i}
                        </div>
                        {leftPointer === i && <div className="text-xs font-bold text-yellow-600">↓ L</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Array */}
                <div>
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Right Array</h4>
                  <div className="flex items-end gap-1 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 overflow-x-auto">
                    {rightArray.map((val, i) => (
                      <div key={i} className="flex flex-col items-center" style={{ minWidth: '20px' }}>
                        <div className="text-xs font-medium text-[#111827] dark:text-[#e2e8f0] mb-1">
                          {val}
                        </div>
                        <div
                          className={`w-4 rounded-t ${rightPointer === i ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ height: `${val * 0.8}px` }}
                        />
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {i}
                        </div>
                        {rightPointer === i && <div className="text-xs font-bold text-yellow-600">↓ R</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Merged Array */}
              <div>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Merged Array</h4>
                <div className="flex items-end gap-1 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 overflow-x-auto">
                  {mergedArray.map((val, i) => (
                    <div key={i} className="flex flex-col items-center" style={{ minWidth: '20px' }}>
                      <div className="text-xs font-medium text-[#111827] dark:text-[#e2e8f0] mb-1">
                        {val || ''}
                      </div>
                      <div
                        className={`w-4 rounded-t ${mergePointer === i ? 'bg-purple-400' : val ? 'bg-green-400' : 'bg-gray-300'}`}
                        style={{ height: val ? `${val * 0.8}px` : '10px' }}
                      />
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {i}
                      </div>
                      {mergePointer === i && <div className="text-xs font-bold text-purple-600">↓ M</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <h3 className="text-lg font-semibold text-[#111827] dark:text-[#e2e8f0] mb-4">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#38bdf8] dark:bg-[#0ea5e9] rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-300 ring-1 ring-orange-200 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Current Range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 ring-2 ring-yellow-300 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 ring-2 ring-green-300 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Sorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Left Array</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Right Array</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-400 rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Merge Pointer</span>
            </div>
          </div>
        </div>
{/* Theory Section */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* How it Works */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">How Merge Sort Works</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              <p>
                Merge Sort is a divide-and-conquer algorithm that works by recursively dividing the array into smaller subarrays until each subarray has only one element.
              </p>
              <p>
                It then merges these subarrays back together in sorted order, combining two sorted arrays into one sorted array at each step.
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 mt-4">
                <h3 className="font-medium text-[#111827] dark:text-[#e2e8f0] mb-2">Algorithm Steps:</h3>
                <ol className="space-y-1 text-sm">
                  <li>1. Divide array into two halves</li>
                  <li>2. Recursively sort both halves</li>
                  <li>3. Merge the sorted halves</li>
                  <li>4. Compare elements and place in order</li>
                  <li>5. Continue until entire array is sorted</li>
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
                  <div className="font-mono text-sm text-green-500">O(n log n)</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Space Complexity</div>
                  <div className="font-mono text-sm text-blue-500">O(n)</div>
                </div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p className="mb-2">
                  <strong>Best Case:</strong> O(n log n) - always consistent
                </p>
                <p className="mb-2">
                  <strong>Average Case:</strong> O(n log n) - stable performance
                </p>
                <p>
                  <strong>Worst Case:</strong> O(n log n) - guaranteed efficiency
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
                  <li>• Guaranteed O(n log n) performance</li>
                  <li>• Stable sorting algorithm</li>
                  <li>• Predictable performance characteristics</li>
                  <li>• Works well with linked lists</li>
                  <li>• Good for large datasets</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">Disadvantages:</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Requires O(n) extra space</li>
                  <li>• Not in-place sorting</li>
                  <li>• Slower than quick sort in practice</li>
                  <li>• More complex implementation</li>
                  <li>• Higher memory overhead</li>
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
                <code>{`function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`}</code>
              </pre>
            </div>
          </div>
        </div>
            </div>
            </div>
        
  );
}