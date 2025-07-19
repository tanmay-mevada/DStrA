'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Book, Code, Hash, Calendar, AlertCircle, RefreshCw, Search, Filter, X } from 'lucide-react';

// Types
interface CodeLanguages {
  c?: string;
  cpp?: string;
  python?: string;
}

interface LibraryItem {
  _id: string;
  title: string;
  chapterNumber: number;
  codes: CodeLanguages;
  createdAt: string;
  updatedAt: string;
}

interface LibraryStats {
  totalItems: number;
  maxChapter: number;
  totalLanguages: number;
  filteredItems: number;
}

interface FilterState {
  searchQuery: string;
  selectedChapter: number | null;
}

// Constants
const LANGUAGE_DISPLAY_NAMES = {
  c: 'C',
  cpp: 'C++',
  python: 'Python'
} as const;

const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_DISPLAY_NAMES) as Array<keyof CodeLanguages>;
const CHAPTER_OPTIONS = [1, 2, 3, 4, 5];

// Utility functions
const getAvailableLanguages = (codes: CodeLanguages): string[] => {
  return SUPPORTED_LANGUAGES
    .filter(lang => codes[lang])
    .map(lang => LANGUAGE_DISPLAY_NAMES[lang]);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const filterItems = (items: LibraryItem[], filters: FilterState): LibraryItem[] => {
  return items.filter(item => {
    const matchesSearch = filters.searchQuery === '' || 
      item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      getAvailableLanguages(item.codes).some(lang => 
        lang.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );

    const matchesChapter = filters.selectedChapter === null || 
      item.chapterNumber === filters.selectedChapter;

    return matchesSearch && matchesChapter;
  });
};

// Components
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading library...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center max-w-md">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  </div>
);

const LibraryHeader = () => (
  <div className="text-center mb-8">
    <div className="flex justify-center items-center gap-3 mb-4">
      <div className="p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
        <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Code Library
      </h1>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
      Explore our comprehensive collection of programming examples and tutorials
    </p>
  </div>
);

const SearchBar = ({ 
  searchQuery, 
  onSearchChange 
}: { 
  searchQuery: string; 
  onSearchChange: (query: string) => void;
}) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type="text"
      placeholder="Search by title or language..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border dark:bg-zinc-600/10 border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-gray-900 dark:text-white dark:placeholder-gray-400"
    />
    {searchQuery && (
      <button
        onClick={() => onSearchChange('')}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100/10 dark:hover:bg-zinc-700/10 rounded-full transition-colors"
      >
        <X className="h-4 w-4 text-gray-400" />
      </button>
    )}
  </div>
);

const ChapterFilter = ({ 
  selectedChapter, 
  onChapterChange,
  availableChapters 
}: { 
  selectedChapter: number | null; 
  onChapterChange: (chapter: number | null) => void;
  availableChapters: number[];
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Filter by Chapter
      </span>
    </div>
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChapterChange(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedChapter === null
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
        }`}
      >
        All Chapters
      </button>
      {CHAPTER_OPTIONS.filter(ch => availableChapters.includes(ch)).map((chapter) => (
        <button
          key={chapter}
          onClick={() => onChapterChange(chapter)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedChapter === chapter
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
        >
          Chapter {chapter}
        </button>
      ))}
    </div>
  </div>
);

const FilterControls = ({ 
  filters, 
  onFiltersChange, 
  availableChapters 
}: {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableChapters: number[];
}) => (
  <div className="mb-8 space-y-6">
    <SearchBar 
      searchQuery={filters.searchQuery}
      onSearchChange={(query) => onFiltersChange({ ...filters, searchQuery: query })}
    />
    <ChapterFilter
      selectedChapter={filters.selectedChapter}
      onChapterChange={(chapter) => onFiltersChange({ ...filters, selectedChapter: chapter })}
      availableChapters={availableChapters}
    />
  </div>
);

const StatsCard = ({ icon: Icon, value, label, color }: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  color: string;
}) => (
  <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-700">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg border border-gray-200 dark:border-zinc-700 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value.toLocaleString()}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {label}
        </p>
      </div>
    </div>
  </div>
);

const LanguageTag = ({ language }: { language: string }) => (
  <span className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-full">
    {language}
  </span>
);

const LibraryCard = ({ item }: { item: LibraryItem }) => {
  const availableLanguages = useMemo(() => getAvailableLanguages(item.codes), [item.codes]);
  const formattedDate = useMemo(() => formatDate(item.createdAt), [item.createdAt]);

  return (
    <Link
      href={`/library/${item._id}`}
      className="group block p-6 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700">
            <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Chapter {item.chapterNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
        {item.title}
      </h3>

      {/* Languages */}
      <div className="flex flex-wrap gap-2 mb-6">
        {availableLanguages.map((language) => (
          <LanguageTag key={language} language={language} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {availableLanguages.length} language{availableLanguages.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
          <span className="text-sm font-medium">View Code</span>
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

const EmptyState = ({ 
  hasActiveFilters, 
  onClearFilters 
}: { 
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}) => (
  <div className="text-center py-20">
    <div className="p-6 w-24 h-24 mx-auto mb-6 rounded-full border border-gray-200 dark:border-zinc-700">
      {hasActiveFilters ? (
        <Search className="h-12 w-12 text-gray-400 mx-auto" />
      ) : (
        <Book className="h-12 w-12 text-gray-400 mx-auto" />
      )}
    </div>
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
      {hasActiveFilters ? 'No items match your filters' : 'Your library is empty'}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
      {hasActiveFilters 
        ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
        : 'Start building your code collection by adding programming examples and tutorials.'
      }
    </p>
    {hasActiveFilters && (
      <button
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <X className="h-4 w-4" />
        Clear All Filters
      </button>
    )}
  </div>
);

const ResultsHeader = ({ 
  filteredCount, 
  totalCount, 
  hasActiveFilters 
}: {
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
}) => {
  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
      <Filter className="h-4 w-4" />
      <span>
        Showing {filteredCount} of {totalCount} items
      </span>
    </div>
  );
};

// Main component
export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedChapter: null
  });

  const fetchLibrary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/library');
      if (!response.ok) {
        throw new Error(`Failed to fetch library items: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Library fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const handleClearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedChapter: null
    });
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const filteredItems = useMemo(() => filterItems(items, filters), [items, filters]);

  const availableChapters = useMemo(() => {
    const chapters = [...new Set(items.map(item => item.chapterNumber))].sort((a, b) => a - b);
    return chapters;
  }, [items]);

  const libraryStats = useMemo((): LibraryStats => ({
    totalItems: items.length,
    maxChapter: items.length > 0 ? Math.max(...items.map(item => item.chapterNumber)) : 0,
    totalLanguages: SUPPORTED_LANGUAGES.length,
    filteredItems: filteredItems.length
  }), [items, filteredItems]);

  const hasActiveFilters = filters.searchQuery !== '' || filters.selectedChapter !== null;

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <LibraryHeader />

        <FilterControls 
          filters={filters}
          onFiltersChange={setFilters}
          availableChapters={availableChapters}
        />

        <ResultsHeader 
          filteredCount={filteredItems.length}
          totalCount={items.length}
          hasActiveFilters={hasActiveFilters}
        />

        {filteredItems.length === 0 ? (
          <EmptyState 
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <LibraryCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}