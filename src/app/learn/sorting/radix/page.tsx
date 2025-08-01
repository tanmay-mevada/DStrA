'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Play, Pause, Timer, ArrowLeft, BookOpen, Code, Zap, TrendingUp, Clock } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

export default function RadixSortPage() {
  const SIZE = 30;

  const [array, setArray] = useState<number[]>([]);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [stepInfo, setStepInfo] = useState<string>('Ready');
  const [isSorting, setIsSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [bucketsState, setBucketsState] = useState<number[][]>([]);
  const [currentDigitPlace, setCurrentDigitPlace] = useState<number | null>(null);
  const [currentPass, setCurrentPass] = useState(0);
  const [totalPasses, setTotalPasses] = useState(0);

  const speedRef = useRef(speed);
  const isPaused = useRef(false);
  const resetVersion = useRef(0);
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
  }, []);

  const generateArray = () => {
    resetVersion.current++;
    isPaused.current = false;
    setPaused(false);
    setIsSorting(false);
    setHighlighted([]);
    setSortedIndices([]);
    setStepInfo('New array generated');
    setBucketsState(Array.from({ length: 10 }, () => []));
    setCurrentDigitPlace(null);
    setCurrentPass(0);
    setTotalPasses(0);

    const newArray = Array.from({ length: SIZE }, () =>
      Math.floor(Math.random() * 999) + 1
    );
    setArray(newArray);
    setTotalPasses(Math.max(...newArray).toString().length);
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
    setStepInfo('Sorting complete!');
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
      if (resetVersion.current !== version) break;
      setCurrentDigitPlace(digitPlace);
      setCurrentPass(digitPlace + 1);
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      setBucketsState([...buckets]);

      for (let i = 0; i < arr.length; i++) {
        if (resetVersion.current !== version) break outer;
        const digit = getDigit(arr[i], digitPlace);
        setHighlighted([i]);
        await waitIfPaused(version);
        await delay(speedRef.current / 2);

        buckets[digit].push(arr[i]);
        setBucketsState(buckets.map(b => [...b]));
        await delay(speedRef.current / 2);
      }

      arr = [];
      for (let b = 0; b < 10; b++) {
        for (let val of buckets[b]) {
          arr.push(val);
        }
      }

      setArray([...arr]);
      setHighlighted([]);
      await delay(speedRef.current);
    }

    setSortedIndices([...Array(arr.length).keys()]);
    setArray([...arr]);
    setBucketsState([]);
    setCurrentDigitPlace(null);
    resetSortingState();
  };

  // Buckets visualization component
  function Buckets({
    buckets,
    highlightDigit,
    bucketCount = 10,
  }: {
    buckets: number[][];
    highlightDigit: number | null;
    bucketCount?: number;
  }) {
    const displayBuckets =
      buckets.length === bucketCount
        ? buckets
        : Array.from({ length: bucketCount }, (_, i) => buckets[i] || []);

    return (
      <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
        <h3 className="text-lg font-semibold text-[#111827] dark:text-[#e2e8f0] mb-4">
          Buckets {currentDigitPlace !== null && `(Digit Position: ${currentDigitPlace + 1})`}
        </h3>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {displayBuckets.map((bucket, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center min-w-[60px] ${highlightDigit === idx ? 'scale-105' : ''
                } transition-transform`}
            >
              <div className={`text-sm font-semibold mb-2 ${highlightDigit === idx ? 'text-[#38bdf8]' : 'text-slate-600 dark:text-slate-400'
                }`}>
                {idx}
              </div>
              <div className={`min-h-[80px] w-full flex flex-col items-center justify-end bg-slate-100 dark:bg-slate-800 rounded-lg border p-2 transition-all duration-200 ${highlightDigit === idx ? 'ring-2 ring-[#38bdf8] border-[#38bdf8]' : 'border-slate-200 dark:border-slate-700'
                }`}>
                <div className="flex flex-wrap items-end justify-center w-full h-full gap-1">
                  {bucket.map((val, i) => (
                    <span
                      key={i}
                      className="inline-block text-xs font-mono bg-[#38bdf8] dark:bg-[#0ea5e9] text-white rounded px-1.5 py-0.5 text-center"
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
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] py-4 sm:py-6 lg:py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button className="p-2 transition-colors border rounded-lg bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5 text-[#111827] dark:text-[#e2e8f0]" />
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] dark:text-[#e2e8f0]">
              Radix Sort Visualization
            </h1>
          </div>
          <p className="max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Watch how radix sort works by sorting elements digit by digit, starting from the least significant digit to the most significant digit using counting sort as a subroutine.
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 mb-6 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border-slate-200 dark:border-slate-700 sm:p-6 sm:mb-8">
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={generateArray}
              disabled={isSorting}
              className="flex items-center justify-center gap-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[#111827] dark:text-[#e2e8f0] font-medium px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="text-sm">Generate Array</span>
            </button>

            <button
              onClick={radixSort}
              disabled={isSorting}
              className="flex items-center justify-center gap-2 bg-[#38bdf8] dark:bg-[#0ea5e9] text-white font-medium px-4 py-2.5 rounded-lg hover:bg-[#0ea5e9] dark:hover:bg-[#38bdf8] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <span className="text-sm">Start Sorting</span>
            </button>

            <button
              onClick={() => {
                isPaused.current = !isPaused.current;
                setPaused(isPaused.current);
              }}
              disabled={!isSorting}
              className="flex items-center justify-center gap-2 bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100 font-medium px-4 py-2.5 rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pause className="w-4 h-4" />
              <span className="text-sm">{paused ? 'Resume' : 'Pause'}</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Timer className="w-4 h-4 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <span className="text-sm font-medium text-[#111827] dark:text-[#e2e8f0] whitespace-nowrap">
                Speed: {speed}ms
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              className="flex-1 accent-[#38bdf8] dark:accent-[#0ea5e9]"
            />
            <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Fast</span>
              <span>Slow</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3 sm:mb-8">
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Current Pass</div>
            <div className="text-lg sm:text-xl font-bold text-[#38bdf8] dark:text-[#0ea5e9]">{currentPass} / {totalPasses}</div>
          </div>
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Digit Place</div>
            <div className="text-lg font-bold text-purple-500 sm:text-xl">
              {currentDigitPlace !== null ? `10^${currentDigitPlace}` : '-'}
            </div>
          </div>
          <div className="p-3 border rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 sm:p-4">
            <div className="mb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Status</div>
            <div className="text-lg font-bold text-green-500 sm:text-xl">
              {sortedIndices.length > 0 ? 'Complete' : isSorting ? 'Sorting' : 'Ready'}
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="p-4 mb-6 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border-slate-200 dark:border-slate-700 sm:p-6 sm:mb-8">
          <div className="flex items-end justify-center h-64 overflow-x-auto sm:h-80 md:h-96">
            <div className="flex items-end gap-1 sm:gap-2 min-w-fit">
              {array.map((val, i) => {
                const isHighlighted = highlighted.includes(i);
                const isSorted = sortedIndices.includes(i);

                let barColor = 'bg-[#38bdf8] dark:bg-[#0ea5e9]';
                if (isHighlighted) barColor = 'bg-yellow-400 ring-2 ring-yellow-300';
                else if (isSorted) barColor = 'bg-green-400 ring-2 ring-green-300';

                let label = val.toString();
                if (currentDigitPlace !== null) {
                  const digits = label.padStart(getMaxDigits(array), '0').split('');
                  label = digits
                    .map((d, idx) =>
                      idx === digits.length - 1 - currentDigitPlace
                        ? `<span class="text-purple-600 dark:text-purple-400 font-bold">${d}</span>`
                        : d
                    )
                    .join('');
                }

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ minWidth: '18px' }}
                  >
                    {/* Value */}
                    <div
                      className="text-xs font-medium text-[#111827] dark:text-[#e2e8f0] mb-1 select-none"
                      dangerouslySetInnerHTML={{ __html: label }}
                    />
                    {/* Bar */}
                    <div
                      className={`w-3 sm:w-4 md:w-5 transition-all duration-200 rounded-t-lg ${barColor}`}
                      style={{ height: `${val * 0.25}px` }}
                    />
                    {/* Index */}
                    <div className="mt-1 text-xs select-none text-slate-500 dark:text-slate-400">
                      {i}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-4 mt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#38bdf8] dark:bg-[#0ea5e9] rounded"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded ring-2 ring-yellow-300"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Being Processed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded ring-2 ring-green-300"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Sorted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-600 dark:text-purple-400">0</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">Highlighted Digit</span>
            </div>
          </div>
        </div>

        {/* Buckets */}
        {bucketsState.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <Buckets
              buckets={bucketsState}
              highlightDigit={currentDigitPlace}
              bucketCount={10}
            />
          </div>
        )}

        {/* Theory Section */}
        <div className="grid gap-6 lg:grid-cols-2 sm:gap-8">
          {/* How it Works */}
          <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">How Radix Sort Works</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              <p>
                Radix sort is a non-comparison sorting algorithm that sorts elements by processing individual digits. It processes digits from least significant to most significant digit.
              </p>
              <p>
                The algorithm uses counting sort as a subroutine to sort the array according to each digit position, maintaining stability throughout the process.
              </p>
              <div className="p-3 mt-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <h3 className="font-medium text-[#111827] dark:text-[#e2e8f0] mb-2">Algorithm Steps:</h3>
                <ol className="space-y-1 text-sm">
                  <li>1. Find the maximum number to know number of digits</li>
                  <li>2. For each digit position (from rightmost to leftmost):</li>
                  <li>3. Use counting sort to sort elements by current digit</li>
                  <li>4. Collect elements from buckets to form new array</li>
                  <li>5. Repeat until all digit positions are processed</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Complexity Analysis */}
          <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Complexity Analysis</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Time Complexity</div>
                  <div className="font-mono text-sm text-green-500">O(d×(n+b))</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Space Complexity</div>
                  <div className="font-mono text-sm text-yellow-500">O(n+b)</div>
                </div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p className="mb-2">
                  <strong>Where:</strong> d = number of digits, n = number of elements, b = base (10 for decimal)
                </p>
                <p className="mb-2">
                  <strong>Best/Average/Worst:</strong> O(d×(n+b)) - consistent performance
                </p>
                <p>
                  <strong>When d is constant:</strong> O(n) - linear time complexity
                </p>
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Pros & Cons</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium text-green-600 dark:text-green-400">Advantages:</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Can be faster than comparison-based algorithms</li>
                  <li>• Stable sorting algorithm</li>
                  <li>• Linear time complexity when d is constant</li>
                  <li>• Works well with integers and fixed-length strings</li>
                  <li>• Parallelizable</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-red-600 dark:text-red-400">Disadvantages:</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Limited to integers and fixed-length strings</li>
                  <li>• Requires extra memory for buckets</li>
                  <li>• Not suitable for general comparison-based sorting</li>
                  <li>• Performance depends on the range of input</li>
                  <li>• May be slower for small datasets</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Implementation */}
          <div className="p-4 border shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-700 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-[#38bdf8] dark:text-[#0ea5e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0]">Implementation</h2>
            </div>
            <div className="p-4 overflow-x-auto rounded-lg bg-slate-100 dark:bg-slate-800">
              <pre className="text-sm text-slate-700 dark:text-slate-300">
                <code>{`function radixSort(arr) {
  const getMax = (arr) => Math.max(...arr);
  const getDigit = (num, place) => 
    Math.floor(num / Math.pow(10, place)) % 10;
  
  const max = getMax(arr);
  const maxDigits = max.toString().length;
  
  for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
    // Create buckets for digits 0-9
    const buckets = Array.from({length: 10}, () => []);
    
    // Place numbers in buckets based on current digit
    for (let i = 0; i < arr.length; i++) {
      const digit = getDigit(arr[i], digitPlace);
      buckets[digit].push(arr[i]);
    }
    
    // Collect numbers from buckets
    arr = buckets.flat();
  }
  
  return arr;
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}