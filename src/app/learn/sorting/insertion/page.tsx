'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer } from 'lucide-react';

export default function InsertionSortPage() {
  const SIZE = 30;

  const [array, setArray] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [keyIndex, setKeyIndex] = useState<number | null>(null);
  const [outerIndex, setOuterIndex] = useState<number | null>(null); // used to mark sorted vs waiting

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
    setKeyIndex(null);
    setOuterIndex(null);
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
    setKeyIndex(null);
    setOuterIndex(null);
    setPaused(false);
    isPaused.current = false;
  };

  const insertionSort = async () => {
    const version = resetVersion.current;
    setIsSorting(true);
    isPaused.current = false;

    const arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      if (resetVersion.current !== version) break;

      let key = arr[i];
      let j = i - 1;

      setOuterIndex(i);       // ✅ for "waiting" section
      setKeyIndex(i);         // ✅ current key

      await delay(speedRef.current);

      while (j >= 0 && arr[j] > key) {
        if (resetVersion.current !== version) break;

        setComparing([j]);
        await waitIfPaused(version);
        await delay(speedRef.current);

        arr[j + 1] = arr[j];
        setArray([...arr]);
        setSwapping([j + 1]);
        await delay(speedRef.current);
        j--;
      }

      arr[j + 1] = key;
      setArray([...arr]);

      setSwapping([]);
      setComparing([]);
      setSortedIndices((prev) => [...new Set([...prev, ...Array(i + 1).keys()])]);
    }

    if (resetVersion.current === version) {
      setSortedIndices([...Array(n).keys()]);
    }

    resetSortingState();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
        Insertion Sort Visualization
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={generateArray}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          <RefreshCcw size={16} /> Generate New Array
        </button>

        <button
          onClick={insertionSort}
          disabled={isSorting}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
        >
          <Play size={16} /> Start Insertion Sort
        </button>

        <button
          onClick={() => {
            isPaused.current = !isPaused.current;
            setPaused(isPaused.current);
          }}
          disabled={!isSorting}
          className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 disabled:opacity-50"
        >
          <Pause size={16} /> {paused ? 'Resume' : 'Pause'}
        </button>

        <div className="flex items-center gap-2">
          <Timer size={16} className="text-zinc-600 dark:text-zinc-300" />
          <label className="text-sm text-zinc-600 dark:text-zinc-300">
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
            className="w-32 accent-blue-500"
          />
        </div>
      </div>

      {/* Visualizer */}
      <div className="flex justify-center">
        <div className="flex items-end h-[500px] w-full max-w-5xl bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-inner overflow-hidden px-4 py-4">
          {array.map((val, i) => {
            const isComparing = comparing.includes(i);
            const isSwapping = swapping.includes(i);
            const isSorted = sortedIndices.includes(i);
            const isKey = keyIndex === i;

            let barColor = 'bg-blue-400'; // 🔵 waiting

            if (outerIndex !== null && i < outerIndex) barColor = 'bg-green-500'; // 🟢 sorted
            if (i > (outerIndex ?? SIZE)) barColor = 'bg-blue-400'; // 🔵 still waiting

            if (isKey) barColor = 'bg-purple-500'; // 🟣 key
            if (isComparing) barColor = 'bg-yellow-400'; // 🟡 comparing
            if (isSwapping) barColor = 'bg-red-500'; // 🔴 shifting

            return (
              <div
                key={i}
                className="relative mx-[3.9px] w-[10px] sm:w-[12px] md:w-[14px] flex flex-col items-center justify-end"
              >
                <div className="text-[10px] sm:text-xs mb-1 text-zinc-800 dark:text-zinc-200 font-semibold select-none">
                  {val}
                </div>
                <div
                  className={`w-full transition-all duration-100 ${barColor}`}
                  style={{ height: `${val * 3}px` }}
                />
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 select-none">
                  {i}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
