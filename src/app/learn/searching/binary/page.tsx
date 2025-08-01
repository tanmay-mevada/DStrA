'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import {
  RefreshCcw,
  Play,
  Pause,
  Search,
  Clock,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

export default function BinarySearchPage() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState('');
  const [low, setLow] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState<JSX.Element | string>('');
  const [speed, setSpeed] = useState(400);
  const [comparisons, setComparisons] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [arraySize, setArraySize] = useState(20);

  const speedRef = useRef(speed);
  const pauseRef = useRef(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      toast('Please Login to continue');
      router.replace('/auth/login');
      return;
    }
    trackUserActivity(pathname);
  }, [session, status, router, pathname]);

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }
  
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const generateArray = () => {
    const newArr = Array.from({ length: arraySize }, () =>
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
    setComparisons(0);
    setIsPaused(false);
    pauseRef.current = false;
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleSearch = async () => {
    const num = parseInt(target);
    if (isNaN(num)) {
      setMessage(
        <span className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle size={16} /> Please enter a valid number
        </span>
      );
      return;
    }

    setIsSearching(true);
    setFoundIndex(null);
    setMessage(
      <span className="flex items-center gap-2">
        <Search size={16} /> Searching...
      </span>
    );
    setComparisons(0);
    pauseRef.current = false;
    setIsPaused(false);

    let l = 0;
    let r = array.length - 1;
    let compCount = 0;

    while (l <= r) {
      if (pauseRef.current) {
        while (pauseRef.current) {
          await delay(100);
        }
      }

      setLow(l);
      setHigh(r);
      const m = Math.floor((l + r) / 2);
      setMid(m);
      compCount++;
      setComparisons(compCount);
      await delay(speedRef.current);

      if (array[m] === num) {
        setFoundIndex(m);
        setMessage(
          <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 size={16} />
            Found {num} at index {m} after {compCount} comparison
            {compCount !== 1 ? 's' : ''}
          </span>
        );
        break;
      } else if (array[m] < num) {
        l = m + 1;
        setMessage(
          <span className="flex items-center gap-2">
            <Search size={16} />
            {array[m]} &lt; {num}, searching right half...
          </span>
        );
      } else {
        r = m - 1;
        setMessage(
          <span className="flex items-center gap-2">
            <Search size={16} />
            {array[m]} &gt; {num}, searching left half...
          </span>
        );
      }

      await delay(speedRef.current);
    }

    if (foundIndex === null && !array.includes(num)) {
      setMessage(
        <span className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <XCircle size={16} />
          {num} not found after {compCount} comparisons
        </span>
      );
    }

    setMid(null);
    setLow(null);
    setHigh(null);
    setIsSearching(false);
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(!isPaused);
  };

  const getArrayItemClasses = (idx: number) => {
    let bg = 'bg-surface dark:bg-surfaceDark';
    let text = 'text-text dark:text-textDark';
    let border = 'border-borderL/30 dark:border-borderDark/30';
    let shadow = 'shadow-sm';

    if (foundIndex === idx) {
      bg = 'bg-green-500 dark:bg-green-600';
      text = 'text-white';
      border = 'border-green-600 dark:border-green-500';
      shadow = 'shadow-lg shadow-green-500/20';
    } else if (mid === idx) {
      bg = 'bg-yellow-500 dark:bg-yellow-600';
      text = 'text-white';
      border = 'border-yellow-600 dark:border-yellow-500';
      shadow = 'shadow-lg shadow-yellow-500/20';
    } else if (low !== null && high !== null && (idx < low || idx > high)) {
      bg = 'bg-red-200 dark:bg-red-900/30';
      text = 'text-red-600 dark:text-red-400';
      border = 'border-red-300 dark:border-red-600';
      shadow = 'shadow-sm';
    } else if (low !== null && high !== null && idx >= low && idx <= high) {
      bg = 'bg-blue-100 dark:bg-blue-900/30';
      text = 'text-blue-600 dark:text-blue-400';
      border = 'border-blue-300 dark:border-blue-600';
      shadow = 'shadow-sm';
    }

    return `${bg} ${text} ${border} ${shadow}`;
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background dark:bg-backgroundDark">
      <div className="max-w-6xl px-4 py-6 mx-auto space-y-6 md:py-10 md:space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl text-text dark:text-textDark">
            Binary Search Visualization
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-text/70 dark:text-textDark/70">
            Watch how binary search efficiently finds elements by dividing the sorted array in half with each comparison
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 border bg-surface/30 dark:bg-surfaceDark/30 rounded-2xl md:p-6 backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
          <div className="grid items-end grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text dark:text-textDark">
                <Target size={16} className="text-primary dark:text-darkPrimary" />
                Target Value
              </label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Enter value to search"
                className="w-full px-3 py-2 transition-all duration-200 border rounded-lg border-borderL/30 dark:border-borderDark/30 bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-darkPrimary/50"
                disabled={isSearching}
              />
            </div>

            {/* Array Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text dark:text-textDark">Array Size</label>
              <select
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-full px-3 py-2 transition-all duration-200 border rounded-lg border-borderL/30 dark:border-borderDark/30 bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-darkPrimary/50"
                disabled={isSearching}
              >
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text dark:text-textDark">Speed</label>
              <div className="flex items-center gap-2">
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
                  className="flex-1 accent-primary dark:accent-darkPrimary"
                  disabled={isSearching}
                />
                <span className="text-xs text-text/70 dark:text-textDark/70 min-w-[40px]">{speed}ms</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={isSearching && !isPaused}
                className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white transition-all duration-200 rounded-lg bg-primary dark:bg-darkPrimary hover:bg-primary/90 dark:hover:bg-darkPrimary/90 disabled:opacity-50"
              >
                <Play size={16} />
                Search
              </button>
              {isSearching && (
                <button
                  onClick={togglePause}
                  className="px-3 py-2 text-white transition-all duration-200 bg-yellow-500 rounded-lg dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700"
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
              )}
              <button
                onClick={generateArray}
                disabled={isSearching}
                className="px-3 py-2 transition-all duration-200 rounded-lg bg-borderL/20 dark:bg-borderDark/20 text-text dark:text-textDark hover:bg-borderL/30 dark:hover:bg-borderDark/30"
              >
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="p-4 border bg-surface/30 dark:bg-surfaceDark/30 rounded-xl backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
            <div className="text-center">
              <div className="text-lg font-bold md:text-xl text-text dark:text-textDark">{array.length}</div>
              <div className="text-xs md:text-sm text-text/70 dark:text-textDark/70">Array Size</div>
            </div>
          </div>
          <div className="p-4 border bg-surface/30 dark:bg-surfaceDark/30 rounded-xl backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
            <div className="text-center">
              <div className="text-lg font-bold md:text-xl text-text dark:text-textDark">{comparisons}</div>
              <div className="text-xs md:text-sm text-text/70 dark:text-textDark/70">Comparisons</div>
            </div>
          </div>
          <div className="p-4 border bg-surface/30 dark:bg-surfaceDark/30 rounded-xl backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
            <div className="text-center">
              <div className="text-lg font-bold md:text-xl text-text dark:text-textDark">{low !== null ? low : '-'}</div>
              <div className="text-xs md:text-sm text-text/70 dark:text-textDark/70">Low</div>
            </div>
          </div>
          <div className="p-4 border bg-surface/30 dark:bg-surfaceDark/30 rounded-xl backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
            <div className="text-center">
              <div className="text-lg font-bold md:text-xl text-text dark:text-textDark">{high !== null ? high : '-'}</div>
              <div className="text-xs md:text-sm text-text/70 dark:text-textDark/70">High</div>
            </div>
          </div>
          <div className="p-4 border bg-surface/30 dark:bg-surfaceDark/30 rounded-xl backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
            <div className="text-center">
              <div className="text-lg font-bold md:text-xl text-text dark:text-textDark">{mid !== null ? mid : '-'}</div>
              <div className="text-xs md:text-sm text-text/70 dark:text-textDark/70">Mid</div>
            </div>
          </div>
        </div>

        {/* Array Display */}
        <div className="p-4 border bg-surface/20 dark:bg-surfaceDark/20 rounded-2xl md:p-6 backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3">
            {array.map((num, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center font-semibold border-2 transition-all duration-300 ${getArrayItemClasses(idx)}`}
                >
                  <span className="text-xs sm:text-sm md:text-base">{num}</span>
                </div>
                <div className="mt-1 font-mono text-xs text-text/60 dark:text-textDark/60">
                  {idx}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="text-center">
            <div className="inline-block px-6 py-3 border bg-surface/50 dark:bg-surfaceDark/50 rounded-xl backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
              <div className="text-sm font-medium md:text-base text-text dark:text-textDark">
                {message}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="p-4 border bg-surface/20 dark:bg-surfaceDark/20 rounded-xl backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 rounded-lg bg-surface dark:bg-surfaceDark border-borderL/30 dark:border-borderDark/30"></div>
              <span className="text-sm text-text/70 dark:text-textDark/70">Unvisited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded-lg dark:bg-blue-900/30 dark:border-blue-600"></div>
              <span className="text-sm text-text/70 dark:text-textDark/70">Search Range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-600 rounded-lg dark:bg-yellow-600 dark:border-yellow-500"></div>
              <span className="text-sm text-text/70 dark:text-textDark/70">Mid (Checking)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-200 border-2 border-red-300 rounded-lg dark:bg-red-900/30 dark:border-red-600"></div>
              <span className="text-sm text-text/70 dark:text-textDark/70">Eliminated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded-lg dark:bg-green-600 dark:border-green-500"></div>
              <span className="text-sm text-text/70 dark:text-textDark/70">Found</span>
            </div>
          </div>
        </div>

        {/* Theory Section */}
        <div className="p-6 border bg-surface/50 dark:bg-surfaceDark/50 rounded-2xl backdrop-blur-sm border-borderL/20 dark:border-borderDark/20">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-text dark:text-textDark">
                <Search size={20} className="text-primary dark:text-darkPrimary" />
                Algorithm Overview
              </h3>
              <p className="text-sm leading-relaxed text-text/80 dark:text-textDark/80">
                Binary search is an efficient algorithm for finding a target value in a sorted array by repeatedly dividing the search space in half.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium text-text dark:text-textDark">How it works:</h4>
                <ul className="space-y-1 text-sm list-disc list-inside text-text/80 dark:text-textDark/80">
                  <li>Start with the entire sorted array</li>
                  <li>Compare the middle element with the target</li>
                  <li>If equal, return the index</li>
                  <li>If target is smaller, search the left half</li>
                  <li>If target is larger, search the right half</li>
                  <li>Repeat until found or search space is empty</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-text dark:text-textDark">
                <Clock size={20} className="text-primary dark:text-darkPrimary" />
                Time Complexity
              </h3>
              <div className="p-4 border rounded-lg bg-background/80 dark:bg-backgroundDark/80 border-borderL/20 dark:border-borderDark/20">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text/70 dark:text-textDark/70">Best Case:</span>
                    <span className="font-mono text-green-600 dark:text-green-400">O(1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70 dark:text-textDark/70">Average Case:</span>
                    <span className="font-mono text-yellow-600 dark:text-yellow-400">O(log n)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70 dark:text-textDark/70">Worst Case:</span>
                    <span className="font-mono text-red-600 dark:text-red-400">O(log n)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70 dark:text-textDark/70">Space:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">O(1)</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-background/80 dark:bg-backgroundDark/80 border-borderL/20 dark:border-borderDark/20">
                <h4 className="mb-2 font-medium text-text dark:text-textDark">Key Advantage:</h4>
                <p className="text-sm text-text/80 dark:text-textDark/80">
                  Much faster than linear search for large arrays. For 1 million elements, binary search needs at most 20 comparisons!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}