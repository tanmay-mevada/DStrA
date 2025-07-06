'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Timer } from 'lucide-react';

export default function MergeSortPage() {
  const SIZE = 30;
  const [a1, setA1] = useState<number[]>([]);
  const [a2, setA2] = useState<number[]>([]);
  const [a3, setA3] = useState<number[]>(Array(SIZE).fill(null));
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);
  const [merging, setMerging] = useState(false);
  const [done, setDone] = useState(false);
  const [speed, setSpeed] = useState(200);

  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    const arr = Array.from({ length: SIZE }, () =>
      Math.floor(Math.random() * 40) + 10
    ).sort((a, b) => a - b);
    const arr1 = arr.slice(0, SIZE / 2);
    const arr2 = arr.slice(SIZE / 2);
    setA1(arr1);
    setA2(arr2);
    setA3(Array(SIZE).fill(null));
    setC1(0);
    setC2(0);
    setC3(0);
    setMerging(false);
    setDone(false);
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const mergeStep = async () => {
    setMerging(true);
    let arr1 = [...a1],
      arr2 = [...a2],
      arr3 = [...a3];
    let i = c1,
      j = c2,
      k = c3;

    while (i < arr1.length && j < arr2.length) {
      await delay(speedRef.current);
      if (arr1[i] < arr2[j]) {
        arr3[k] = arr1[i++];
      } else {
        arr3[k] = arr2[j++];
      }
      k++;
      setA3([...arr3]);
      setC1(i);
      setC2(j);
      setC3(k);
    }

    while (i < arr1.length) {
      await delay(speedRef.current);
      arr3[k++] = arr1[i++];
      setA3([...arr3]);
      setC1(i);
      setC2(j);
      setC3(k);
    }

    while (j < arr2.length) {
      await delay(speedRef.current);
      arr3[k++] = arr2[j++];
      setA3([...arr3]);
      setC1(i);
      setC2(j);
      setC3(k);
    }

    setDone(true);
    setMerging(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
        Merge Two Sorted Arrays Visualization
      </h1>
      {/* Controls */}
      <div className="w-full max-w-5xl mx-auto flex flex-wrap gap-4 items-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-xl border border-blue-300/40 dark:border-blue-900/40 shadow-lg px-6 py-4 mb-2">
        <button
          onClick={reset}
          className="flex items-center gap-2 glass-btn border border-blue-400/60 dark:border-blue-700/60 bg-white/40 dark:bg-zinc-800/40 text-blue-700 dark:text-blue-200 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-100/60 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-400/60 transition disabled:opacity-50"
          disabled={merging}
        >
          <RefreshCcw size={16} /> Generate New Arrays
        </button>
        <button
          onClick={mergeStep}
          className="flex items-center gap-2 glass-btn border border-green-400/60 dark:border-green-700/60 bg-white/40 dark:bg-zinc-800/40 text-green-700 dark:text-green-200 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-green-100/60 dark:hover:bg-green-900/40 focus:outline-none focus:ring-2 focus:ring-green-400/60 transition disabled:opacity-50"
          disabled={merging || done}
        >
          <Play size={16} /> Start Merge
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
      {/* Layout change: A1 and A2 side by side, A3 below */}
      <div className="space-y-8">
        <div className="flex flex-row gap-2 md:gap-4 lg:gap-6 xl:gap-8 justify-center items-end w-full">
          <div className="flex flex-col items-center flex-1 min-w-0 max-w-[420px]">
            <ArrayBarRow arr={a1} highlight={c1 < a1.length ? c1 : null} label="A1" />
          </div>
          <div className="flex flex-col items-center flex-1 min-w-0 max-w-[420px]">
            <ArrayBarRow arr={a2} highlight={c2 < a2.length ? c2 : null} label="A2" />
          </div>
        </div>
        <div className="flex justify-center w-full">
          <ArrayBarRow arr={a3} highlight={c3 < a3.length ? c3 : null} label="A3" isMerged />
        </div>
      </div>
    </div>
  );
}

function ArrayBarRow({
  arr,
  highlight,
  label,
  isMerged = false,
}: {
  arr: number[];
  highlight: number | null;
  label: string;
  isMerged?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="mb-2 text-blue-500 font-semibold text-lg text-center">{label}</div>
      <div className="flex gap-1 items-end h-[200px] px-2 py-2 bg-white/60 dark:bg-zinc-800/60 backdrop-blur rounded-lg border border-blue-300/40 dark:border-blue-900/40 shadow-inner overflow-x-auto justify-center">
        {arr.map((val, i) => {
          const isBar = val !== null;
          const isHighlighted = highlight === i;
          return (
            <div key={i} className="flex flex-col items-center w-[20px]">
              <div className="text-[11px] mb-1 text-zinc-800 dark:text-zinc-100 font-medium">
                {isBar ? val : ''}
              </div>
              <div
                className={`w-full rounded transition-all duration-200 ${
                  isHighlighted
                    ? isMerged
                      ? 'bg-purple-400/90 border-purple-500/80 shadow-purple-200/40'
                      : 'bg-yellow-300/90 border-yellow-400/80 shadow-yellow-200/40'
                    : isMerged
                    ? 'bg-blue-400/80 border-blue-500/60 shadow-blue-200/30'
                    : 'bg-blue-500/80 border-blue-700/60 shadow-blue-200/20'
                } border`}
                style={{
                  height: isBar ? `${val * 3}px` : '20px',
                  opacity: isBar ? 1 : 0.3,
                }}
              />
              <div className="text-[10px] mt-1 text-zinc-500 font-mono">
                {i}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
