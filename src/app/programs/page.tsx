'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

interface Program {
  _id: string;
  title: string;
  chapterNumber: number;
  c?: { code: string; description: string };
  cpp?: { code: string; description: string };
  python?: { code: string; description: string };
  available?: boolean;
}

const staticUnavailablePrograms: Program[] = [
  {
    _id: 'static-1',
    title: 'Graph: BFS & DFS Traversal',
    chapterNumber: 0,
    c: {
      code: '',
      description: 'Implementation of Breadth First Search (BFS) and Depth First Search (DFS) algorithms for graph traversal.'
    },
    available: false
  },
  {
    _id: 'static-2',
    title: 'BST Tree Construction',
    chapterNumber: 0,
    python: {
      code: '',
      description: 'Construction of a Binary Search Tree (BST) with insertion and basic traversal operations.'
    },
    available: false
  },
  {
    _id: 'static-3',
    title: 'Interpolation Search',
    chapterNumber: 0,
    cpp: {
      code: '',
      description: 'Implementation of Interpolation Search algorithm for searching elements in a sorted array.'
    },
    available: false
  },
  {
    _id: 'static-4',
    title: 'Hashing',
    chapterNumber: 0,
    c: {
      code: '',
      description: 'Implementation of hashing techniques including hash functions and collision handling methods.'
    },
    available: false
  }
];


export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

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
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/programs');
        const data = await res.json();
        
        // Add available: true to database programs and combine with static ones
        const availablePrograms = data.map((program: Program) => ({ ...program, available: true }));
        const allPrograms = [...availablePrograms, ...staticUnavailablePrograms];
        
        // Sort by chapter number
        allPrograms.sort((a, b) => a.chapterNumber - b.chapterNumber);
        
        setPrograms(allPrograms);
      } catch (err) {
        console.error('Failed to fetch programs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  function getDescription(p: Program): string {
    return (
      p.c?.description ||
      p.cpp?.description ||
      p.python?.description ||
      'No description available'
    ).slice(0, 80);
  }

  function getLanguages(p: Program): string[] {
    const languages = [];
    if (p.c) languages.push('C');
    if (p.cpp) languages.push('C++');
    if (p.python) languages.push('Python');
    return languages;
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen transition-colors duration-300 bg-background dark:bg-backgroundDark">
        <div className="border-b border-borderL dark:border-borderDark">
          <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 sm:py-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl font-michroma text-primary dark:text-darkPrimary">
                Programs
              </h1>
            </div>
            <p className="mt-2 text-sm text-borderL dark:text-borderDark font-techmono">
              Collection of programming solutions and code examples
            </p>
          </div>
        </div>
        
        <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Spinner className="w-8 h-8" />
              <p className="text-sm text-borderL dark:text-borderDark font-techmono">
                Loading programs...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background dark:bg-backgroundDark">
      {/* Header */}
      <div className="border-b border-borderL dark:border-borderDark">
        <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl font-michroma text-primary dark:text-primaryDark">
                Programs
              </h1>
              
              {/* Warning Icon with Tooltip */}
              <div className="relative">
                <button
                  className="w-5 h-5 text-amber-500 hover:text-amber-400 transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 rounded-full p-0.5"
                  onClick={() => setShowTooltip(!showTooltip)}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  aria-label="Important information about programs"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Tooltip - Mobile friendly with backdrop */}
                {showTooltip && (
                  <>
                    {/* Backdrop for mobile - clicking outside closes tooltip */}
                    <div 
                      className="fixed inset-0 z-40 bg-black bg-opacity-20 md:hidden"
                      onClick={() => setShowTooltip(false)}
                    />
                    
                    <div className="absolute z-50 transform -translate-x-1/2 top-8 left-1/2 w-72 sm:w-80 animate-fadeIn">
                      <div className="p-4 text-sm border rounded-lg shadow-xl bg-surface dark:bg-surfaceDark text-text dark:text-textDark border-borderL dark:border-borderDark">
                        {/* Arrow pointer */}
                        <div className="absolute w-2 h-2 transform rotate-45 -translate-x-1/2 border-t border-l -top-1 left-1/2 bg-surface dark:bg-surfaceDark border-borderL dark:border-borderDark"></div>
                        
                        {/* Close button for mobile */}
                        <div className="flex items-start justify-between mb-2 md:hidden">
                          <span className="text-xs font-medium text-amber-500 dark:text-amber-400 font-techmono">
                            Important Notice
                          </span>
                          <button
                            onClick={() => setShowTooltip(false)}
                            className="transition-colors text-borderL dark:text-borderDark hover:text-text dark:hover:text-textDark"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <p className="mb-3 leading-relaxed">
                          These programs are specially designed for DStrA's IDE and not recommended to practice in exams. They are intended to demonstrate coding concepts and practices.
                        </p>
                        
                        {/* Library Link in tooltip */}
                        <Link 
                          href="/library"
                          className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-primary dark:text-darkPrimary hover:text-primary/80 dark:hover:text-darkPrimary/80"
                          onClick={() => setShowTooltip(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Check Code Library for exam-ready solutions
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Library Link Button in Header */}
            <Link 
              href="/library" 
              className="items-center hidden gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg sm:flex bg-primary/10 hover:bg-primary/20 dark:bg-darkPrimary/10 dark:hover:bg-darkPrimary/20 text-primary dark:text-darkPrimary font-techmono hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Code Library
            </Link>
          </div>
          
          <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <p className="text-xs text-borderL dark:text-borderDark font-techmono sm:text-sm">
              Collection of programming solutions and code examples
            </p>
            
            {/* Mobile Library Link */}
            <Link 
              href="/library" 
              className="sm:hidden inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 dark:bg-darkPrimary/10 dark:hover:bg-darkPrimary/20 text-primary dark:text-darkPrimary rounded-lg transition-all duration-200 font-techmono text-xs font-medium self-start"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Code Library
            </Link>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 sm:py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const isAvailable = program.available !== false;
            
            if (isAvailable) {
              return (
                <Link key={program._id} href={`/programs/${program._id}`}>
                  <div className="transition-all duration-200 bg-white border rounded-lg cursor-pointer group dark:bg-surfaceDark border-borderL dark:border-borderDark hover:border-primary dark:hover:border-darkPrimary hover:shadow-lg">
                    <div className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-darkPrimary/10 dark:text-darkPrimary font-techmono">
                          Chapter {program.chapterNumber}
                        </span>
                        
                        <div className="flex flex-wrap gap-1">
                          {getLanguages(program).map((lang) => (
                            <span
                              key={lang}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium border rounded bg-surface dark:bg-backgroundDark text-text dark:text-textDark border-borderL dark:border-borderDark font-techmono"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-base font-semibold transition-colors sm:text-lg text-text dark:text-textDark group-hover:text-primary dark:group-hover:text-darkPrimary line-clamp-2">
                        {program.title}
                      </h3>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-borderL/20 dark:border-borderDark/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-borderL dark:text-borderDark font-techmono">Available</span>
                        </div>
                        
                        <div className="flex items-center transition-transform text-primary dark:text-darkPrimary group-hover:translate-x-1">
                          <span className="mr-1 text-sm font-medium font-techmono">View</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            } else {
              return (
                <div key={program._id} className="bg-white border rounded-lg cursor-not-allowed dark:bg-surfaceDark border-borderL dark:border-borderDark opacity-60">
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 font-techmono">
                        Chapter {program.chapterNumber}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-base font-semibold text-gray-500 sm:text-lg dark:text-gray-400 line-clamp-2">
                      {program.title}
                    </h3>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-techmono">Unavailable</span>
                      </div>
                      
                      <div className="flex items-center text-gray-400 dark:text-gray-500">
                        <span className="mr-1 text-sm font-medium font-techmono">Coming Soon</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* Empty state */}
        {programs.length === 0 && (
          <div className="py-16 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 border rounded-full bg-surface dark:bg-surfaceDark border-borderL dark:border-borderDark">
              <svg className="w-8 h-8 text-primary dark:text-darkPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-text dark:text-textDark font-michroma">No programs found</h3>
            <p className="mb-4 text-borderL dark:text-borderDark font-techmono">Check back later for new programming content</p>
            
            {/* Library link in empty state */}
            <Link 
              href="/library" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg bg-primary/10 hover:bg-primary/20 dark:bg-darkPrimary/10 dark:hover:bg-darkPrimary/20 text-primary dark:text-darkPrimary font-techmono hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Explore Code Library
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}