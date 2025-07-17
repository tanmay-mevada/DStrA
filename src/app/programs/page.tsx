'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Program {
  _id: string;
  title: string;
  chapterNumber: number;
  c?: { code: string; description: string };
  cpp?: { code: string; description: string };
  python?: { code: string; description: string };
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch('/api/programs');
        const data = await res.json();
        setPrograms(data);
      } catch (err) {
        console.error('Failed to fetch programs:', err);
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

  return (
    <div className="min-h-screen bg-background dark:bg-backgroundDark transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-borderL dark:border-borderDark">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-michroma font-bold text-text dark:text-textDark">
              Programs
            </h1>
            
            {/* Warning Icon with Tooltip */}
            <div className="relative">
              <svg 
                className="w-5 h-5 text-amber-500 hover:text-amber-400 transition-colors cursor-help" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-64 z-50 animate-fadeIn">
                  <div className="bg-surface dark:bg-surfaceDark text-text dark:text-textDark text-sm rounded-lg p-3 shadow-lg border border-borderL dark:border-borderDark">
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-surface dark:bg-surfaceDark rotate-45 border-l border-t border-borderL dark:border-borderDark"></div>
                    These programs are specially designed for DStrA's IDE and not recommended to practice in exams. They are intended to demonstrate coding concepts and practices. Check out our code library for exam-ready solutions.
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <p className="mt-2 text-borderL dark:text-borderDark font-techmono text-sm">
            Collection of programming solutions and code examples
          </p>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Link key={program._id} href={`/programs/${program._id}`}>
              <div className="group bg-white dark:bg-surfaceDark rounded-lg border border-borderL dark:border-borderDark hover:border-primary dark:hover:border-darkPrimary transition-all duration-200 hover:shadow-lg cursor-pointer">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-darkPrimary/10 dark:text-darkPrimary font-techmono">
                      Chapter {program.chapterNumber}
                    </span>
                    
                    <div className="flex gap-1">
                      {getLanguages(program).map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-surface dark:bg-backgroundDark text-text dark:text-textDark border border-borderL dark:border-borderDark font-techmono"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-text dark:text-textDark mb-3 group-hover:text-primary dark:group-hover:text-darkPrimary transition-colors">
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p className="text-borderL dark:text-borderDark text-sm mb-4 font-techmono leading-relaxed">
                    {getDescription(program)}...
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-borderL/20 dark:border-borderDark/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-borderL dark:text-borderDark font-techmono">Available</span>
                    </div>
                    
                    <div className="flex items-center text-primary dark:text-darkPrimary group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium mr-1 font-techmono">View</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {programs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface dark:bg-surfaceDark rounded-full flex items-center justify-center border border-borderL dark:border-borderDark">
              <svg className="w-8 h-8 text-primary dark:text-darkPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text dark:text-textDark mb-2 font-michroma">No programs found</h3>
            <p className="text-borderL dark:text-borderDark font-techmono">Check back later for new programming content</p>
          </div>
        )}
      </div>
    </div>
  );
}