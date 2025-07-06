'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play } from 'lucide-react';

export default function LinearSearchPage() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState('');
  const [speed, setSpeed] = useState(300);

  const speedRef = useRef(speed);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    const newArr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90 + 10));
    setArray(newArr);
    resetSearch();
  };

  const resetSearch = () => {
    setCurrentIndex(null);
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

    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      await delay(speedRef.current);
      if (array[i] === num) {
        setFoundIndex(i);
        setMessage(`✅ Found at index ${i}`);
        break;
      }
    }

    if (foundIndex === null && !array.includes(num)) {
      setMessage('❌ Not found in array');
    }

    setCurrentIndex(null);
    setIsSearching(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center text-zinc-800 dark:text-zinc-100">
        Linear Search Visualization
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
          New Array
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
      <div className="flex justify-center flex-wrap gap-2 mt-6 bg-white/20 dark:bg-zinc-900/20 border border-primary/10 dark:border-darkPrimary/10 rounded-2xl shadow-inner px-6 py-6 backdrop-blur-md glass-gradient">
        {array.map((num, idx) => {
          let bg = 'bg-zinc-200';
          let text = 'text-zinc-900';
          let border = 'border-primary/20 dark:border-darkPrimary/20';
          if (foundIndex === idx) {
            bg = 'bg-green-500';
            text = 'text-white';
            border = 'border-green-600';
          } else if (currentIndex === idx) {
            bg = 'bg-yellow-400';
            text = 'text-zinc-900';
            border = 'border-yellow-500';
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
        <div className="text-center mt-4 text-lg font-medium text-zinc-700 dark:text-zinc-300">
          {message}
        </div>
      )}
    </div>
  );
}
