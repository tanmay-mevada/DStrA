'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Book, Code, Hash, Calendar } from 'lucide-react';

interface LibraryItem {
  _id: string;
  title: string;
  chapterNumber: number;
  codes: {
    c?: string;
    cpp?: string;
    python?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await fetch('/api/library');
        if (!response.ok) {
          throw new Error('Failed to fetch library items');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const getAvailableLanguages = (codes: LibraryItem['codes']) => {
    const languages = [];
    if (codes.c) languages.push('C');
    if (codes.cpp) languages.push('C++');
    if (codes.python) languages.push('Python');
    return languages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Book className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Code Library
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore our collection of programming examples and tutorials
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-800/10 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3">
              <Book className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {items.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Total Items</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800/10 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3">
              <Hash className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.max(...items.map(item => item.chapterNumber), 0)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Chapters</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800/10 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3">
              <Code className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                <p className="text-gray-600 dark:text-gray-400">Languages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Library Items */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No items in library
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The library is empty. Add some code examples to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item._id}
                href={`/library/${item._id}`}
                className="group bg-white dark:bg-zinc-800/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Chapter {item.chapterNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {getAvailableLanguages(item.codes).map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {getAvailableLanguages(item.codes).length} language{getAvailableLanguages(item.codes).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                    <span className="text-sm font-medium">View Code</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}