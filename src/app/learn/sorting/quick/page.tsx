'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer } from 'lucide-react';

export default function QuickSortHoarePage() {
  const SIZE = 30;
  const BAR_WIDTH = 16;

  const [array, setArray] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [iIndex, setIIndex] = useState<number | null>(null);
  const [jIndex, setJIndex] = useState<number | null>(null);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [stepInfo, setStepInfo] = useState<string>('Ready');
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
    setPivotIndex(null);
    setIIndex(null);
    setJIndex(null);
    setSwapping([]);
    setSortedIndices([]);
    setStepInfo('New array generated');

    const newArray = Array.from({ length: SIZE }, () =>
      Math.floor(Math.random() * 100) + 10
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
    setStepInfo('Done!');
    isPaused.current = false;
    setPaused(false);
  };

  const quickSort = async () => {
    const version = resetVersion.current;
    setIsSorting(true);
    const arr = [...array];

    const sort = async (start: number, end: number) => {
      if (start >= end || resetVersion.current !== version) return;

      const key = arr[start];
      setPivotIndex(start);
      setStepInfo(
        `Choosing pivot: <span class="font-bold text-purple-600">A[${start}] = ${key}</span>`
      );
      await delay(speedRef.current);

      let i = start;
      let j = end;

      while (i < j) {
        while (arr[i] <= key && i < end) {
          setIIndex(i);
          setStepInfo(
            `Move <span class="font-bold text-yellow-600">i</span> right: A[i=${i}] = ${arr[i]} ≤ pivot`
          );
          await waitIfPaused(version);
          await delay(speedRef.current);
          i++;
        }

        while (arr[j] > key) {
          setJIndex(j);
          setStepInfo(
            `Move <span class="font-bold text-yellow-600">j</span> left: A[j=${j}] = ${arr[j]} > pivot`
          );
          await waitIfPaused(version);
          await delay(speedRef.current);
          j--;
        }

        if (i < j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setStepInfo(
            `Swap <span class="font-bold text-red-600">A[${i}]</span> and <span class="font-bold text-red-600">A[${j}]</span>`
          );
          setSwapping([i, j]);
          setArray([...arr]);
          await delay(speedRef.current);
          setSwapping([]);
        }
      }

      setStepInfo(
        `Place pivot: Swap <span class="font-bold text-purple-600">A[${start}]</span> and <span class="font-bold text-green-600">A[${j}]</span>`
      );
      [arr[start], arr[j]] = [arr[j], arr[start]];
      setSwapping([start, j]);
      setArray([...arr]);
      await delay(speedRef.current);
      setSwapping([]);
      setSortedIndices((prev) => [...new Set([...prev, j])]);

      await sort(start, j - 1);
      await sort(j + 1, end);
    };

    await sort(0, array.length - 1);

    if (resetVersion.current === version) {
      setSortedIndices([...Array(array.length).keys()]);
      setStepInfo('All elements sorted!');
    }

    resetSortingState();
  };

  const Legend = () => (
    <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
      <div className="flex items-center gap-2">
        <span className="inline-block w-5 h-3 rounded bg-purple-500" />{' '}
        <span className="text-xs">Pivot (P)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-5 h-3 rounded bg-yellow-400" />{' '}
        <span className="text-xs">i / j pointers</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-5 h-3 rounded bg-red-500" />{' '}
        <span className="text-xs">Swapping</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-5 h-3 rounded bg-green-500" />{' '}
        <span className="text-xs">Sorted</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-5 h-3 rounded bg-blue-400" />{' '}
        <span className="text-xs">Unsorted</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
        Quick Sort (Hoare Partition) Visualization
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
          onClick={quickSort}
          disabled={isSorting}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
        >
          <Play size={16} /> Start Quick Sort
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
        <div className="flex items-end h-[400px] w-full max-w-5xl bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-inner overflow-hidden px-4 py-4">
          {array.map((val, i) => {
            const isPivot = pivotIndex === i;
            const isI = iIndex === i;
            const isJ = jIndex === i;
            const isSwap = swapping.includes(i);
            const isSorted = sortedIndices.includes(i);

            let barColor = 'bg-blue-400';
            if (isSwap) barColor = 'bg-red-500';
            else if (isI || isJ) barColor = 'bg-yellow-400';
            else if (isPivot) barColor = 'bg-purple-500';
            else if (isSorted) barColor = 'bg-green-500';

            let pointer: string | null = null;
            let pointerColor = 'text-zinc-400';

            if (isI) {
              pointer = 'i';
              pointerColor = 'text-yellow-600';
            }
            if (isJ) {
              pointer = pointer ? pointer + '/j' : 'j';
              pointerColor = 'text-yellow-600';
            }
            if (isPivot) {
              pointer = pointer ? pointer + '/P' : 'P';
              pointerColor = 'text-purple-600';
            }

            return (
              <div
                key={i}
                className="relative mx-[3.9px] w-[14px] flex flex-col items-center justify-end"
              >
                {/* Value above */}
                <div className="text-[10px] sm:text-xs mb-1 text-zinc-800 dark:text-zinc-200 font-semibold select-none">
                  {val}
                </div>

                {/* Bar */}
                <div
                  className={`w-full ${barColor} transition-all duration-200`}
                  style={{ height: `${val * 3}px` }}
                />

                {/* Index below */}
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 select-none">
                  {i}
                </div>

                {/* Pointer arrow and label */}
                <div className={`text-[12px] font-bold h-4 leading-3 ${pointerColor}`}>
                  {pointer && <span>↓ {pointer}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend moved below the graph */}
      <Legend />

      {/* Narration - make more visible */}
      <div
        className="text-xl text-center text-blue-700 dark:text-yellow-300 font-bold bg-blue-50 dark:bg-zinc-800 rounded-lg px-4 py-4 shadow mt-6"
        dangerouslySetInnerHTML={{ __html: stepInfo }}
      />
    </div>
  );
}
