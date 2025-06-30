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
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
        Merge Two Sorted Arrays Visualization
      </h1>

      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          disabled={merging}
        >
          <RefreshCcw size={16} /> Generate New Arrays
        </button>
        <button
          onClick={mergeStep}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
          disabled={merging || done}
        >
          <Play size={16} /> Start Merge
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

      {/* Layout change: A1 and A2 side by side, A3 below */}
      <div className="space-y-8">
        <div className="flex flex-row gap-8">
          <div className="flex-1">
            <ArrayBarRow arr={a1} highlight={c1 < a1.length ? c1 : null} label="A1" />
          </div>
          <div className="flex-1">
            <ArrayBarRow arr={a2} highlight={c2 < a2.length ? c2 : null} label="A2" />
          </div>
        </div>
        <div>
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
    <div className="mb-6">
      <div className="mb-2 text-blue-500 font-semibold text-lg">{label}</div>
      <div className="flex gap-1 items-end h-[200px] px-2 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-sm shadow-inner border border-zinc-300 dark:border-zinc-700 overflow-x-auto">
        {arr.map((val, i) => {
          const isBar = val !== null;
          const isHighlighted = highlight === i;

          return (
            <div key={i} className="flex flex-col items-center w-[20px]">
              <div className="text-[11px] mb-1 text-zinc-800 dark:text-zinc-100 font-medium">
                {isBar ? val : ''}
              </div>
              <div
                className={`w-full rounded-sm transition-all duration-200 ${
                  isHighlighted
                    ? isMerged
                      ? 'bg-purple-400'
                      : 'bg-yellow-400'
                    : isMerged
                    ? 'bg-blue-400'
                    : 'bg-blue-500'
                }`}
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
