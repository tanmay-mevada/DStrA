'use client';

import Link from 'next/link';
import { PlayCircle, ChevronRight, BarChart3, ChevronDown, ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

const sortingAlgorithms = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    desc: 'Repeatedly swaps adjacent elements if they are in the wrong order.',
    complexity: 'O(n²)',
    difficulty: 'Easy',
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    desc: 'Selects the smallest/largest element and places it in the correct position.',
    complexity: 'O(n²)',
    difficulty: 'Easy',
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    desc: 'Builds sorted array one element at a time by inserting in correct place.',
    complexity: 'O(n²)',
    difficulty: 'Easy',
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    desc: 'Divides array around a pivot and recursively sorts partitions.',
    complexity: 'O(n log n)',
    difficulty: 'Hard',
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    desc: 'Sorts numbers digit by digit using counting sort as subroutine.',
    complexity: 'O(d × n)',
    difficulty: 'Advanced',
  },
];

// Enhanced sorting preview animation
function SortingPreview() {
  const [arr, setArr] = useState<number[]>([8, 3, 5, 4, 7, 6, 1, 2]);
  const [highlight, setHighlight] = useState<number[]>([]);
  const [phase, setPhase] = useState<'sorting' | 'done'>('sorting');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const iRef = useRef(0);
  const jRef = useRef(0);
  const arrRef = useRef<number[]>([...arr]);

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
  
  useEffect(() => {
    arrRef.current = [8, 3, 5, 4, 7, 6, 1, 2];
    setArr([...arrRef.current]);
    setPhase('sorting');
    iRef.current = 0;
    jRef.current = 0;

    function bubbleStep() {
      if (iRef.current < arrRef.current.length - 1) {
        if (jRef.current < arrRef.current.length - iRef.current - 1) {
          setHighlight([jRef.current, jRef.current + 1]);
          if (arrRef.current[jRef.current] > arrRef.current[jRef.current + 1]) {
            [arrRef.current[jRef.current], arrRef.current[jRef.current + 1]] =
              [arrRef.current[jRef.current + 1], arrRef.current[jRef.current]];
            setArr([...arrRef.current]);
          }
          jRef.current++;
        } else {
          jRef.current = 0;
          iRef.current++;
        }
      } else {
        setHighlight([]);
        setPhase('done');
        clearInterval(intervalRef.current!);
        setTimeout(() => {
          // Reset after short pause
          arrRef.current = shuffle([8, 3, 5, 4, 7, 6, 1, 2]);
          setArr([...arrRef.current]);
          iRef.current = 0;
          jRef.current = 0;
          setPhase('sorting');
          intervalRef.current = setInterval(bubbleStep, 300);
        }, 1200);
      }
    }

    function shuffle(a: number[]) {
      const arr = [...a];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    intervalRef.current = setInterval(bubbleStep, 300);

    return () => clearInterval(intervalRef.current!);
  }, []);

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full mb-8">
      <div className="flex items-end w-full h-24 max-w-xs gap-1 p-3 border shadow-inner sm:gap-2 sm:h-28 md:h-32 sm:max-w-md md:max-w-lg bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/30 rounded-xl border-slate-200 dark:border-slate-700 sm:p-4">
        {arr.map((v, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-lg transition-all duration-300 min-w-[2rem] sm:min-w-[3rem] relative
              ${highlight.includes(i)
                ? 'bg-yellow-400 scale-110 shadow-lg ring-2 ring-yellow-300'
                : phase === 'done'
                  ? 'bg-green-400'
                  : 'bg-[#38bdf8] dark:bg-[#0ea5e9]'}
            `}
            style={{
              height: `${v * 8 + 20}px`,
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 py-1 text-xs font-semibold text-center text-white">
              {v}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        {phase === 'sorting' ? 'Sorting in progress...' : 'Sort complete!'}
      </div> */}
    </div>
  );
}

export default function SortingIntroPage() {
  return (
    <div className="min-h-screen w-full bg-[#f9fafb] dark:bg-[#0f172a] py-4 sm:py-6 lg:py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="px-4 py-6 mb-8 border shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-slate-200 dark:border-slate-700 sm:px-6 lg:px-8 sm:py-8 lg:py-12 sm:mb-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 sm:mb-8">
              <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-[#38bdf8] dark:text-[#0ea5e9] mx-auto mb-4" />
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl text-primary dark:text-darkPrimary">
                Sorting Algorithms
              </h1>
              <p className="max-w-3xl mx-auto text-base leading-relaxed sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
                Explore interactive visualizations of fundamental sorting algorithms. 
                Learn how they work, compare their performance, and understand their real-world applications.
              </p>
            </div>
            
            <SortingPreview />
            <div className="absolute transform -translate-x-1/2 bottom-6 left-1/2">
        <ArrowDown className="w-6 h-6 animate-bounce text-zinc-500 dark:text-zinc-400" />
      </div>
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8">
          {sortingAlgorithms.map((algo) => (
            <Link
              href={`/learn/sorting/${algo.id}`}
              key={algo.id}
              className="group block bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#38bdf8] dark:hover:border-[#0ea5e9]"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-[#e2e8f0] group-hover:text-[#38bdf8] dark:group-hover:text-[#0ea5e9] transition-colors">
                  {algo.name}
                </h2>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  algo.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : algo.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {algo.difficulty}
                </div>
              </div>
              
              <p className="mb-4 text-sm leading-relaxed sm:text-base text-slate-600 dark:text-slate-400">
                {algo.desc}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium sm:text-sm text-slate-500 dark:text-slate-400">
                    Time Complexity:
                  </span>
                  <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs sm:text-sm font-mono text-[#38bdf8] dark:text-[#0ea5e9]">
                    {algo.complexity}
                  </code>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#38bdf8] dark:text-[#0ea5e9] font-medium text-sm sm:text-base">
                  <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Visualize</span>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-[#38bdf8] dark:group-hover:text-[#0ea5e9] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
        
        
      </div>
    </div>
  );
}