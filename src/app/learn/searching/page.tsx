'use client';

import Link from 'next/link';
import { PlayCircle, ChevronRight, Search } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

const searchingAlgorithms = [
  {
    id: 'linear',
    name: 'Linear Search',
    desc: 'Checks each element in sequence until the target is found or the list ends.',
    complexity: 'O(n)',
    difficulty: 'Easy',
  },
  {
    id: 'binary',
    name: 'Binary Search',
    desc: 'Efficiently searches a sorted array by repeatedly dividing the search interval in half.',
    complexity: 'O(log n)',
    difficulty: 'Easy',
  },
];


export default function SearchingIntroPage() {
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
  
  return (
    <div className="min-h-screen w-full bg-[#f9fafb] dark:bg-[#0f172a] py-4 sm:py-6 lg:py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="px-4 py-6 mb-6 border shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-slate-200 dark:border-slate-700 sm:px-6 lg:px-8 sm:py-8 lg:py-12 sm:mb-8 lg:mb-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 sm:mb-6">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-[#38bdf8] dark:text-[#0ea5e9] mx-auto mb-3 sm:mb-4" />
              <h1 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-primary dark:text-darkPrimary sm:mb-4">
                Searching Algorithms
              </h1>
              <p className="max-w-3xl px-2 mx-auto text-sm leading-relaxed sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400">
                Explore interactive visualizations of fundamental searching algorithms. 
                Learn how they work, compare their performance, and understand their real-world applications.
              </p>
            </div>

          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="grid max-w-4xl grid-cols-1 gap-4 mx-auto sm:grid-cols-2 sm:gap-6">
          {searchingAlgorithms.map((algo) => (
            <Link
              href={`/learn/searching/${algo.id}`}
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