'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play } from 'lucide-react';

export default function BinarySearchPage() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState('');
  const [low, setLow] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState('');
  const [speed, setSpeed] = useState(400);

  const speedRef = useRef(speed);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    const newArr = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 90 + 10)
    ).sort((a, b) => a - b);
    setArray(newArr);
    resetSearch();
  };

  const resetSearch = () => {
    setLow(null);
    setHigh(null);
    setMid(null);
    setFoundIndex(null);
    setIsSearching(false);
    setMessage('');
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleSearch = async () => {
    const num = parseInt(target);
    if (isNaN(num)) return setMessage('❗ Please enter a valid number');

    setIsSearching(true);
    setFoundIndex(null);
    setMessage('');

    let l = 0;
    let r = array.length - 1;

    while (l <= r) {
      setLow(l);
      setHigh(r);
      const m = Math.floor((l + r) / 2);
      setMid(m);
      await delay(speedRef.current);

      if (array[m] === num) {
        setFoundIndex(m);
        setMessage(`✅ Found at index ${m}`);
        break;
      } else if (array[m] < num) {
        l = m + 1;
      } else {
        r = m - 1;
      }

      await delay(speedRef.current);
    }

    if (!array.includes(num)) {
      setMessage('❌ Not found in array');
    }

    setMid(null);
    setLow(null);
    setHigh(null);
    setIsSearching(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center text-zinc-800 dark:text-zinc-100">
        🧮 Binary Search Visualization
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Enter value to search"
          className="border px-3 py-2 rounded w-48"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          <Play size={16} className="inline-block mr-1" />
          Start Search
        </button>
        <button
          onClick={generateArray}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <RefreshCcw size={16} className="inline-block mr-1" />
          New Sorted Array
        </button>
        <div className="flex items-center gap-2 text-sm">
          Speed:
          <input
            type="range"
            min={100}
            max={1000}
            step={100}
            value={speed}
            onChange={(e) => {
              const newSpeed = Number(e.target.value);
              setSpeed(newSpeed);
              speedRef.current = newSpeed;
            }}
            className="accent-blue-500 w-32"
          />
          <span>{speed}ms</span>
        </div>
      </div>

      {/* Array Display */}
      <div className="flex justify-center flex-wrap gap-2 mt-6">
        {array.map((num, idx) => {
          let bg = 'bg-zinc-200';
          if (foundIndex === idx) bg = 'bg-green-500 text-white';
          else if (mid === idx) bg = 'bg-yellow-400';
          else if (low !== null && high !== null && (idx < low || idx > high)) {
            bg = 'bg-zinc-300 opacity-40';
          }

          return (
            <div
              key={idx}
              className={`w-12 h-12 rounded flex items-center justify-center font-semibold border ${bg} transition-all`}
            >
              {num}
            </div>
          );
        })}
      </div>

      {/* Message */}
      {message && (
        <div className="text-center mt-4 text-lg font-medium text-zinc-700 dark:text-zinc-300">
          {message}
        </div>
      )}
    </div>
  );
}
