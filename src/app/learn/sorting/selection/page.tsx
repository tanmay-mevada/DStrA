'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer } from 'lucide-react';

export default function SelectionSortPage() {
  const SIZE = 30;

  const [array, setArray] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [minIndex, setMinIndex] = useState<number | null>(null); // ✅ new
  const [isSorting, setIsSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(200);

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
    setMinIndex(null);

    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);

    const newArray = Array.from({ length: SIZE }, () =>
      Math.floor(Math.random() * 100) + 10
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
    setPaused(false);
    isPaused.current = false;
  };

  const selectionSort = async () => {
    const version = resetVersion.current;
    setIsSorting(true);
    isPaused.current = false;

    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n; i++) {
      if (resetVersion.current !== version) break;

      let minIdx = i;
      setMinIndex(minIdx);

      for (let j = i + 1; j < n; j++) {
        if (resetVersion.current !== version) break;

        setComparing([minIdx, j]);
        await waitIfPaused(version);
        await delay(speedRef.current);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setMinIndex(minIdx);
        }
      }

      if (resetVersion.current !== version) break;

      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        await delay(speedRef.current);
      }

      setSwapping([]);
      setSortedIndices((prev) => [...prev, i]);
      setMinIndex(null);
    }

    if (resetVersion.current === version) {
      setSortedIndices([...Array(n).keys()]);
    }

    resetSortingState();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
        Selection Sort Visualization
      </h1>
      {/* Controls */}
      <div className="w-full max-w-5xl mx-auto flex flex-wrap gap-4 items-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-xl border border-blue-300/40 dark:border-blue-900/40 shadow-lg px-6 py-4 mb-2">
        <button
          onClick={generateArray}
          className="flex items-center gap-2 glass-btn border border-blue-400/60 dark:border-blue-700/60 bg-white/40 dark:bg-zinc-800/40 text-blue-700 dark:text-blue-200 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-100/60 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-400/60 transition disabled:opacity-50"
        >
          <RefreshCcw size={16} /> Generate New Array
        </button>
        <button
          onClick={selectionSort}
          disabled={isSorting}
          className="flex items-center gap-2 glass-btn border border-green-400/60 dark:border-green-700/60 bg-white/40 dark:bg-zinc-800/40 text-green-700 dark:text-green-200 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-green-100/60 dark:hover:bg-green-900/40 focus:outline-none focus:ring-2 focus:ring-green-400/60 transition disabled:opacity-50"
        >
          <Play size={16} /> Start Selection Sort
        </button>
        <button
          onClick={() => {
            isPaused.current = !isPaused.current;
            setPaused(isPaused.current);
          }}
          disabled={!isSorting}
          className="flex items-center gap-2 glass-btn border border-yellow-400/60 dark:border-yellow-700/60 bg-white/40 dark:bg-zinc-800/40 text-yellow-700 dark:text-yellow-200 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-100/60 dark:hover:bg-yellow-900/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 transition disabled:opacity-50"
        >
          <Pause size={16} /> {paused ? 'Resume' : 'Pause'}
        </button>
        <div className="flex items-center gap-2 ml-2">
          <Timer size={16} className="text-blue-500 dark:text-blue-300" />
          <label className="text-sm text-zinc-700 dark:text-zinc-200 font-medium">
            Speed: {speed}ms
          </label>
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
            className="w-32 accent-blue-500 dark:accent-blue-400"
          />
        </div>
      </div>
      {/* Visualizer */}
      <div className="flex justify-center w-full">
        <div className="flex items-end h-[500px] w-full max-w-5xl mx-auto bg-white/60 dark:bg-zinc-900/60 backdrop-blur-lg rounded-2xl border border-blue-300/40 dark:border-blue-900/40 shadow-xl overflow-hidden px-4 py-4 transition-all duration-300">
          <div className="flex w-full justify-center">
            {array.map((val, i) => {
              const isComparing = comparing.includes(i);
              const isSwapping = swapping.includes(i);
              const isSorted = sortedIndices.includes(i);
              const isMin = minIndex === i;
              const barColor = isSwapping
                ? 'bg-red-400/90 border-red-500/80 shadow-red-200/40'
                : isMin
                ? 'bg-purple-400/90 border-purple-500/80 shadow-purple-200/40'
                : isComparing
                ? 'bg-yellow-300/90 border-yellow-400/80 shadow-yellow-200/40'
                : isSorted
                ? 'bg-green-400/90 border-green-500/80 shadow-green-200/40'
                : 'bg-blue-400/80 border-blue-500/60 shadow-blue-200/30';
              return (
                <div
                  key={i}
                  className="relative mx-[3.9px] w-[10px] sm:w-[12px] md:w-[14px] flex flex-col items-center justify-end"
                >
                  {/* Value above */}
                  <div className="text-[10px] sm:text-xs mb-1 text-zinc-800 dark:text-zinc-200 font-semibold select-none drop-shadow">
                    {val}
                  </div>
                  {/* Bar */}
                  <div
                    className={`w-full transition-all duration-200 rounded-lg border ${barColor}`}
                    style={{ height: `${val * 3}px` }}
                  />
                  {/* Index below */}
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 select-none">
                    {i}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
