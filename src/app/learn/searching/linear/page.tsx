'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, BookOpen, Clock, Search, Target } from 'lucide-react';

export default function LinearSearchPage() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState('');
  const [speed, setSpeed] = useState(300);
  const [comparisons, setComparisons] = useState(0);
  const [showTheory, setShowTheory] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [arraySize, setArraySize] = useState(15);

  const speedRef = useRef(speed);
  const pauseRef = useRef(false);

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const generateArray = () => {
    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90 + 10));
    setArray(newArr);
    resetSearch();
  };

  const resetSearch = () => {
    setCurrentIndex(null);
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
    if (isNaN(num)) return setMessage('❗ Please enter a valid number');
    setIsSearching(true);
    setFoundIndex(null);
    setMessage('🔍 Searching...');
    setComparisons(0);
    pauseRef.current = false;
    setIsPaused(false);

    for (let i = 0; i < array.length; i++) {
      if (pauseRef.current) {
        while (pauseRef.current) {
          await delay(100);
        }
      }
      
      setCurrentIndex(i);
      setComparisons(i + 1);
      await delay(speedRef.current);
      
      if (array[i] === num) {
        setFoundIndex(i);
        setMessage(`✅ Found ${num} at index ${i} after ${i + 1} comparison${i !== 0 ? 's' : ''}`);
        break;
      }
    }

    if (foundIndex === null && !array.includes(num)) {
      setMessage(`❌ ${num} not found after ${array.length} comparisons`);
    }

    setCurrentIndex(null);
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
    } else if (currentIndex === idx) {
      bg = 'bg-primary dark:bg-darkPrimary';
      text = 'text-white';
      border = 'border-primary dark:border-darkPrimary';
      shadow = 'shadow-lg shadow-primary/20';
    }

    return `${bg} ${text} ${border} ${shadow}`;
  };

  return (
    <div className="min-h-screen bg-background dark:bg-backgroundDark transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text dark:text-textDark">
            Linear Search Visualization
          </h1>
          <p className="text-sm md:text-base text-text/70 dark:text-textDark/70 max-w-2xl mx-auto">
            Watch how linear search examines each element sequentially until it finds the target value
          </p>
        </div>



        {/* Controls */}
        <div className="bg-surface/30 dark:bg-surfaceDark/30 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-borderL/20 dark:border-borderDark/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text dark:text-textDark flex items-center gap-2">
                <Target size={16} className="text-primary dark:text-darkPrimary" />
                Target Value
              </label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Enter value to search"
                className="w-full border border-borderL/30 dark:border-borderDark/30 px-3 py-2 rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-darkPrimary/50 transition-all duration-200"
              />
            </div>

            {/* Array Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text dark:text-textDark">Array Size</label>
              <select
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-full border border-borderL/30 dark:border-borderDark/30 px-3 py-2 rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-darkPrimary/50 transition-all duration-200"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
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
                />
                <span className="text-xs text-text/70 dark:text-textDark/70 min-w-[40px]">{speed}ms</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={isSearching && !isPaused}
                className="flex-1 bg-primary dark:bg-darkPrimary text-white px-4 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-darkPrimary/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Play size={16} />
                Search
              </button>
              {isSearching && (
                <button
                  onClick={togglePause}
                  className="bg-yellow-500 dark:bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-all duration-200"
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
              )}
              <button
                onClick={generateArray}
                className="bg-borderL/20 dark:bg-borderDark/20 text-text dark:text-textDark px-3 py-2 rounded-lg hover:bg-borderL/30 dark:hover:bg-borderDark/30 transition-all duration-200"
              >
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface/30 dark:bg-surfaceDark/30 rounded-xl p-4 backdrop-blur-sm border border-borderL/20 dark:border-borderDark/20">
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-text dark:text-textDark">{array.length}</div>
              <div className="text-xs md:text-sm text-text/70 dark:text-textDark/70">Array Size</div>
            </div>
          </div>
          <div className="bg-surface/30 dark:bg-surfaceDark/30 rounded-xl p-4 backdrop-blur-sm border border-borderL/20 dark:border-borderDark/20">
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-text dark:text-textDark">{comparisons}</div>
              <div className="text-xs md:text-sm text-text/70 dark:text-textDark/70">Comparisons</div>
            </div>
          </div>
          <div className="bg-surface/30 dark:bg-surfaceDark/30 rounded-xl p-4 backdrop-blur-sm border border-borderL/20 dark:border-borderDark/20">
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-text dark:text-textDark">{currentIndex !== null ? currentIndex + 1 : '-'}</div>
              <div className="text-xs md:text-sm text-text/70 dark:text-textDark/70">Current Index</div>
            </div>
          </div>
          <div className="bg-surface/30 dark:bg-surfaceDark/30 rounded-xl p-4 backdrop-blur-sm border border-borderL/20 dark:border-borderDark/20">
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-text dark:text-textDark">{foundIndex !== null ? foundIndex : '-'}</div>
              <div className="text-xs md:text-sm text-text/70 dark:text-textDark/70">Found At</div>
            </div>
          </div>
        </div>

        {/* Array Display */}
        <div className="bg-surface/20 dark:bg-surfaceDark/20 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-borderL/20 dark:border-borderDark/20">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3">
            {array.map((num, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center font-semibold border-2 transition-all duration-300 ${getArrayItemClasses(idx)}`}
                >
                  <span className="text-xs sm:text-sm md:text-base">{num}</span>
                </div>
                <div className="text-xs text-text/60 dark:text-textDark/60 mt-1 font-mono">
                  {idx}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="text-center">
            <div className="inline-block bg-surface/50 dark:bg-surfaceDark/50 px-6 py-3 rounded-xl backdrop-blur-sm border border-borderL/20 dark:border-borderDark/20">
              <div className="text-sm md:text-base font-medium text-text dark:text-textDark">
                {message}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-surface/20 dark:bg-surfaceDark/20 rounded-xl p-4 backdrop-blur-sm border border-borderL/20 dark:border-borderDark/20">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-surface dark:bg-surfaceDark border-2 border-borderL/30 dark:border-borderDark/30"></div>
              <span className="text-sm text-text/70 dark:text-textDark/70">Unvisited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary dark:bg-darkPrimary border-2 border-primary dark:border-darkPrimary"></div>
              <span className="text-sm text-text/70 dark:text-textDark/70">Checking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-green-500 dark:bg-green-600 border-2 border-green-600 dark:border-green-500"></div>
              <span className="text-sm text-text/70 dark:text-textDark/70">Found</span>
            </div>
          </div>
        </div>

        {/* Theory Section */}
        <div className="bg-surface/50 dark:bg-surfaceDark/50 rounded-2xl p-6 backdrop-blur-sm border border-borderL/20 dark:border-borderDark/20">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text dark:text-textDark flex items-center gap-2">
                <Search size={20} className="text-primary dark:text-darkPrimary" />
                Algorithm Overview
              </h3>
              <p className="text-sm text-text/80 dark:text-textDark/80 leading-relaxed">
                Linear search is the simplest searching algorithm that checks each element in the array sequentially until it finds the target value or reaches the end of the array.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium text-text dark:text-textDark">How it works:</h4>
                <ul className="text-sm text-text/80 dark:text-textDark/80 space-y-1 list-disc list-inside">
                  <li>Start from the first element</li>
                  <li>Compare each element with the target</li>
                  <li>If found, return the index</li>
                  <li>If not found after checking all elements, return -1</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text dark:text-textDark flex items-center gap-2">
                <Clock size={20} className="text-primary dark:text-darkPrimary" />
                Time Complexity
              </h3>
              <div className="bg-background/80 dark:bg-backgroundDark/80 rounded-lg p-4 border border-borderL/20 dark:border-borderDark/20">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text/70 dark:text-textDark/70">Best Case:</span>
                    <span className="font-mono text-green-600 dark:text-green-400">O(1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70 dark:text-textDark/70">Average Case:</span>
                    <span className="font-mono text-yellow-600 dark:text-yellow-400">O(n)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70 dark:text-textDark/70">Worst Case:</span>
                    <span className="font-mono text-red-600 dark:text-red-400">O(n)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70 dark:text-textDark/70">Space:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">O(1)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}