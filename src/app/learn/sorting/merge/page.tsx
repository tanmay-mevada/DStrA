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
    // Split 30 elements into two sorted arrays of 15 each
    const arr = Array.from({ length: SIZE }, () => Math.floor(Math.random() * 90) + 10).sort((a, b) => a - b);
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
        arr3[k] = arr1[i];
        i++;
        k++;
      } else {
        arr3[k] = arr2[j];
        j++;
        k++;
      }
      setA3([...arr3]);
      setC1(i);
      setC2(j);
      setC3(k);
    }
    while (i < arr1.length) {
      await delay(speedRef.current);
      arr3[k] = arr1[i];
      i++;
      k++;
      setA3([...arr3]);
      setC1(i);
      setC2(j);
      setC3(k);
    }
    while (j < arr2.length) {
      await delay(speedRef.current);
      arr3[k] = arr2[j];
      j++;
      k++;
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

      <div className="space-y-8">
        <ArrayBarRow arr={a1} highlight={c1 < a1.length ? c1 : null} label="A1" />
        <ArrayBarRow arr={a2} highlight={c2 < a2.length ? c2 : null} label="A2" />
        <ArrayBarRow arr={a3} highlight={c3 < a3.length ? c3 : null} label="A3" isMerged />
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
    <div className="flex items-end mb-4">
      <span className="w-12 font-bold mr-4 text-lg text-blue-700 dark:text-blue-300">{label}</span>
      <div className="flex items-end h-[200px] bg-gradient-to-b from-zinc-100/80 to-zinc-200/60 dark:from-zinc-900/80 dark:to-zinc-800/60 rounded-lg px-3 py-3 shadow-inner border border-zinc-200 dark:border-zinc-700">
        {arr.map((val, i) => {
          const isBar = val !== null;
          const barColor =
            highlight === i
              ? isMerged
                ? 'bg-purple-500'
                : 'bg-yellow-400'
              : 'bg-blue-500';

          return (
            <div
              key={i}
              className={`relative mx-[6px] w-[18px] flex flex-col items-center justify-end rounded-lg shadow-md transition-all duration-200 group ${
                isBar ? barColor : 'bg-zinc-200 dark:bg-zinc-700'
              } ${highlight === i ? 'ring-2 ring-purple-400' : ''}`}
              style={{
                minHeight: 20,
                height: isBar ? `${val! * 4}px` : '20px',
                opacity: isBar ? 1 : 0.3,
                border: '1.5px solid #e5e7eb',
                transition: 'background 0.2s, height 0.2s, box-shadow 0.2s, border 0.2s',
              }}
            >
              {/* Value above */}
              <div className="text-[11px] sm:text-xs mb-1 text-zinc-800 dark:text-zinc-200 font-bold select-none drop-shadow group-hover:scale-110 transition-transform">
                {isBar ? val : ''}
              </div>
              {/* Bar */}
              <div
                className={`w-full ${isMerged ? '' : 'invisible'} rounded-b`}
                style={{
                  height: isMerged && val != null ? `${val * 4}px` : 0,
                  background: isMerged
                    ? highlight === i
                      ? '#a78bfa'
                      : 'linear-gradient(180deg, #60a5fa 60%, #3b82f6 100%)'
                    : 'transparent',
                  borderRadius: 4,
                  transition: 'background 0.2s, height 0.2s',
                }}
              />
              {/* Index below */}
              <div className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-1 select-none font-mono group-hover:text-blue-600">
                {i}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
       

//       {/* Active Merge Label */}
//       {activeRange && (
//         <div className="text-center text-md font-semibold text-purple-600 dark:text-purple-400">
//           Merging indices {activeRange[0]} to {activeRange[1]}
//         </div>
//       )}

//       {/* Visualizer */}
//       <div className="flex justify-center">
//         <div className="flex items-end h-[500px] w-full max-w-5xl bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-inner overflow-hidden px-4 py-4">
//           {array.map((val, i) => {
//             const isMerging = mergingIndices.includes(i);
//             const isSorted = sortedIndices.includes(i);
//             const isActive =
//               activeRange && i >= activeRange[0] && i <= activeRange[1];
//             const isFaded = activeRange && (i < activeRange[0] || i > activeRange[1]);

//             const barColor = isMerging
//               ? 'bg-purple-500'
//               : isSorted
//               ? 'bg-green-500'
//               : isActive
//               ? 'bg-yellow-400'
//               : 'bg-blue-500';

//             return (
//               <div
//                 key={i}
//                 className={`relative mx-[3.9px] w-[14px] flex flex-col items-center justify-end${isFaded ? ' opacity-30' : ''}`}
//               >
//                 {/* Value above */}
//                 <div className="text-[10px] sm:text-xs mb-1 text-zinc-800 dark:text-zinc-200 font-semibold select-none">
//                   {val}
//                 </div>

//                 {/* Bar */}
//                 <div
//                   className={`w-full transition-all duration-200 ${barColor}`}
//                   style={{ height: `${val * 3}px` }}
//                 />

//                 {/* Index below */}
//                 <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 select-none">
//                   {i}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
