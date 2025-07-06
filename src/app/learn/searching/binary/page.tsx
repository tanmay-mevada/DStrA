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
    <div className="min-h-screen w-full bg-background dark:bg-backgroundDark flex items-center justify-center py-0">
      <div className="max-w-5xl w-full mx-auto px-4 py-10 space-y-10">
        <h1 className="text-3xl font-bold text-center text-primary dark:text-darkPrimary mb-2 drop-shadow">
          Binary Search Visualization
        </h1>

        {/* Controls */}
        <div className="flex flex-wrap justify-center items-center gap-4 bg-white/20 dark:bg-zinc-900/20 border border-primary/15 dark:border-darkPrimary/15 rounded-2xl shadow-md px-6 py-5 mb-4 backdrop-blur-md glass-gradient">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter value to search"
            className="border border-primary/20 dark:border-darkPrimary/20 px-3 py-2 rounded-lg w-48 bg-white/20 dark:bg-zinc-900/20 focus:ring-2 focus:ring-accent dark:focus:ring-accentDark outline-none transition"
            disabled={isSearching}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 disabled:opacity-50 transition-all"
          >
            <Play size={16} /> Start Search
          </button>
          <button
            onClick={generateArray}
            disabled={isSearching}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 disabled:opacity-50 transition-all"
          >
            <RefreshCcw size={16} /> New Sorted Array
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
              disabled={isSearching}
            />
            <span>{speed}ms</span>
          </div>
        </div>

        {/* Array Display */}
        <div className="flex justify-center flex-wrap gap-2 mt-6 bg-white/20 dark:bg-zinc-900/20 border border-primary/10 dark:border-darkPrimary/10 rounded-2xl shadow-inner px-6 py-6 backdrop-blur-md glass-gradient">
          {array.map((num, idx) => {
            let bg = 'bg-zinc-200';
            let text = 'text-zinc-900';
            let border = 'border-primary/20 dark:border-darkPrimary/20';
            if (foundIndex === idx) {
              bg = 'bg-green-500';
              text = 'text-white';
              border = 'border-green-600';
            } else if (mid === idx) {
              bg = 'bg-yellow-400';
              text = 'text-zinc-900';
              border = 'border-yellow-500';
            } else if (low !== null && high !== null && (idx < low || idx > high)) {
              bg = 'bg-zinc-300 opacity-40';
              text = 'text-zinc-400';
              border = 'border-zinc-300';
            }

            return (
              <div
                key={idx}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold border-2 ${bg} ${text} ${border} transition-all duration-300 shadow-sm`}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Message */}
        {message && (
          <div className="text-center mt-4 text-lg font-medium text-primary dark:text-darkPrimary bg-white/20 dark:bg-zinc-900/20 border border-primary/10 dark:border-darkPrimary/10 rounded-xl px-4 py-3 shadow-sm backdrop-blur-md glass-gradient">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
