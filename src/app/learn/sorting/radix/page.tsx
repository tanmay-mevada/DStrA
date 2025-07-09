'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer } from 'lucide-react';

export default function RadixSortPage() {
  const SIZE = 30;
  const BAR_WIDTH = 16;

  const [array, setArray] = useState<number[]>([]);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [stepInfo, setStepInfo] = useState<string>('Ready');
  const [isSorting, setIsSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  // Add state for buckets and current digit place
  const [bucketsState, setBucketsState] = useState<number[][]>([]);
  const [currentDigitPlace, setCurrentDigitPlace] = useState<number | null>(null);

  const speedRef = useRef(speed);
  const isPaused = useRef(false);
  const resetVersion = useRef(0);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    // Stop/cancel any ongoing sort and reset all states
    resetVersion.current++;
    isPaused.current = false;
    setPaused(false);
    setIsSorting(false);
    setHighlighted([]);
    setSortedIndices([]);
    setStepInfo('New array generated');
    setBucketsState(Array.from({ length: 10 }, () => []));
    setCurrentDigitPlace(null);

    // Generate new array
    const newArray = Array.from({ length: SIZE }, () =>
      Math.floor(Math.random() * 499) + 1
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
    setHighlighted([]);
    setStepInfo('Done!');
    isPaused.current = false;
    setPaused(false);
  };

  const getMaxDigits = (arr: number[]) => {
    return Math.max(...arr).toString().length;
  };

  const getDigit = (num: number, place: number) => {
    return Math.floor(num / Math.pow(10, place)) % 10;
  };

  const radixSort = async () => {
    const version = resetVersion.current;
    setIsSorting(true);
    let arr = [...array];
    const maxDigits = getMaxDigits(arr);

    outer: for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      if (resetVersion.current !== version) break; // Stop if reset
      setCurrentDigitPlace(digitPlace);
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      setStepInfo(
        `Sorting by <span class="font-bold text-blue-600">digit place ${digitPlace + 1}</span> (10<sup>${digitPlace}</sup>)`
      );
      setBucketsState([...buckets]);

      for (let i = 0; i < arr.length; i++) {
        if (resetVersion.current !== version) break outer; // Stop if reset
        const digit = getDigit(arr[i], digitPlace);
        setHighlighted([i]);
        setStepInfo(
          `Looking at <span class="font-bold text-yellow-600">${arr[i]}</span> (digit <span class="font-bold text-blue-600">${digit}</span> at 10<sup>${digitPlace}</sup>)`
        );
        await waitIfPaused(version);
        await delay(speedRef.current / 2);

        setHighlighted([i, -1]);
        setStepInfo(
          `Placing <span class="font-bold text-red-600">${arr[i]}</span> in bucket <span class="font-bold text-blue-600">${digit}</span>`
        );
        await delay(speedRef.current / 2);

        buckets[digit].push(arr[i]);
        setBucketsState(buckets.map(b => [...b]));
      }

      arr = [];
      for (let b = 0; b < 10; b++) {
        for (let val of buckets[b]) {
          arr.push(val);
        }
      }

      setArray([...arr]);
      setHighlighted([]);
      setBucketsState(buckets.map(b => [...b]));
      await delay(speedRef.current);
    }

    setStepInfo('<span class="font-bold text-green-600">All digits sorted!</span>');
    setSortedIndices([...Array(arr.length).keys()]);
    setArray([...arr]);
    setBucketsState([]);
    setCurrentDigitPlace(null);
    resetSortingState();
  };

  const Legend = () => (
    <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
      <div className="flex items-center gap-2">
        <span className="inline-block w-5 h-3 rounded bg-red-500" />
        <span className="text-xs">Currently in bucket</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-5 h-3 rounded bg-green-500" />
        <span className="text-xs">Sorted</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-5 h-3 rounded bg-blue-400" />
        <span className="text-xs">Unsorted</span>
      </div>
    </div>
  );

  // Buckets visualization component
  function Buckets({
    buckets,
    highlightDigit,
    alwaysShow = false,
    bucketCount = 10,
  }: {
    buckets: number[][];
    highlightDigit: number | null;
    alwaysShow?: boolean;
    bucketCount?: number;
  }) {
    // Ensure buckets always has bucketCount buckets
    const displayBuckets =
      buckets.length === bucketCount
        ? buckets
        : Array.from({ length: bucketCount }, (_, i) => buckets[i] || []);
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col items-center">
        <div className="flex flex-row justify-center gap-2 md:gap-4 lg:gap-6 xl:gap-8 w-full">
          {displayBuckets.map((bucket, idx) => (
            <div key={idx} className={`flex flex-col items-center w-[60px] max-w-[60px] ${highlightDigit === idx ? 'scale-105' : ''} transition-transform`}>
              <div className={`text-xs font-semibold mb-1 text-center ${highlightDigit === idx ? 'text-blue-600' : 'text-zinc-500'}`}>B{idx}</div>
              <div className={`min-h-[80px] w-full flex flex-col items-center justify-end bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700 p-1 transition-all duration-200 ${highlightDigit === idx ? 'ring-2 ring-blue-400/70 dark:ring-blue-600/70' : ''}`}>
                <div className="flex flex-wrap items-end justify-center h-full w-full gap-0.5">
                  {bucket.map((val, i) => (
                    <span
                      key={i}
                      className="inline-block text-[12px] font-mono bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded px-2 py-0.5 m-0.5 text-center border border-blue-100 dark:border-blue-800 whitespace-nowrap"
                      style={{ maxWidth: '100%', overflow: 'visible', textOverflow: 'clip' }}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
        Radix Sort Visualization
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
          onClick={radixSort}
          disabled={isSorting}
          className="flex items-center gap-2 glass-btn border border-green-400/60 dark:border-green-700/60 bg-white/40 dark:bg-zinc-800/40 text-green-700 dark:text-green-200 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-green-100/60 dark:hover:bg-green-900/40 focus:outline-none focus:ring-2 focus:ring-green-400/60 transition disabled:opacity-50"
        >
          <Play size={16} /> Start Radix Sort
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
        <div className="flex items-end h-[380px] w-full max-w-5xl mx-auto bg-white/60 dark:bg-zinc-900/60 backdrop-blur-lg rounded-2xl border border-blue-300/40 dark:border-blue-900/40 shadow-xl overflow-hidden px-4 py-4 transition-all duration-300">
          <div className="flex items-end justify-center w-full h-full">
            {array.map((val, i) => {
              const isSorted = sortedIndices.includes(i);
              let barColor = 'bg-blue-400/80 border-blue-500/60 shadow-blue-200/30';
              if (highlighted.includes(i) && highlighted[0] === i && highlighted[1] !== -1) barColor = 'bg-yellow-300/90 border-yellow-400/80 shadow-yellow-200/40';
              else if (highlighted.includes(i) && highlighted[1] === -1) barColor = 'bg-red-400/90 border-red-500/80 shadow-red-200/40';
              else if (isSorted) barColor = 'bg-green-400/90 border-green-500/80 shadow-green-200/40';
              let label = val.toString();
              if (currentDigitPlace !== null) {
                const digits = label.padStart(getMaxDigits(array), '0').split('');
                label = digits
                  .map((d, idx) =>
                    idx === digits.length - 1 - currentDigitPlace
                      ? `<span class=\"text-blue-600 font-bold\">${d}</span>`
                      : d
                  )
                  .join('');
              }
              return (
                <div
                  key={i}
                  className="relative mx-[3.9px] w-[14px] flex flex-col items-center justify-end"
                >
                  {/* Value above, highlight digit */}
                  <div
                    className="text-[10px] sm:text-xs mb-1 text-zinc-800 dark:text-zinc-200 font-semibold select-none drop-shadow"
                    dangerouslySetInnerHTML={{ __html: label }}
                  />
                  {/* Bar */}
                  <div
                    className={`w-full transition-all duration-200 rounded-lg border ${barColor}`}
                    style={{ height: `${val * 0.6}px` }}
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

      {/* Buckets visualization: always show 10 buckets */}
      <Buckets
        buckets={bucketsState.length === 10 ? bucketsState : Array.from({ length: 10 }, () => [])}
        highlightDigit={currentDigitPlace}
        alwaysShow={true}
        bucketCount={10}
      />

      {/* Legend */}
      <Legend />

      {/* Narration */}
      {/* <div
        className="text-xl text-center text-blue-700 dark:text-yellow-300 font-bold bg-blue-50 dark:bg-zinc-800 rounded-lg px-4 py-4 shadow mt-6"
        dangerouslySetInnerHTML={{ __html: stepInfo }}
      /> */}
    </div>
  );
}
