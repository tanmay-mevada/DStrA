'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes'; // Import useTheme

import {
  ArrowLeft,
  Copy,
  Check,
  Hash,
  Calendar,
  Book,
  Code2,
  FileText,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  Info,
  // No need for Sun/Moon here anymore, as your Navbar handles the toggle UI
} from 'lucide-react';
import IDE from '@/components/IDE'; // Adjust path as needed

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

type Language = 'c' | 'cpp' | 'python';

export default function LibraryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<LibraryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('c');
  const [currentCode, setCurrentCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<Language, boolean>>({
    c: false,
    cpp: false,
    python: false,
  });

  // Use next-themes for theme management
  const { theme } = useTheme(); // Only need 'theme' here, as 'setTheme' is in your Navbar toggle
  const [mounted, setMounted] = useState(false); // To prevent hydration mismatch

  // Set mounted to true after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize bookmark state
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(id));
  }, [id]);

  useEffect(() => {
    const fetchLibraryItem = async () => {
      try {
        const response = await fetch(`/api/library/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch library item');
        }
        const data = await response.json();
        setItem(data);

        const availableLanguages = getAvailableLanguages(data.codes);
        if (availableLanguages.length > 0) {
          const defaultLang = availableLanguages[0].toLowerCase() as Language;
          setSelectedLanguage(defaultLang);
          setCurrentCode(data.codes[defaultLang] || '');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLibraryItem();
    }
  }, [id]);

  const getAvailableLanguages = (codes: LibraryItem['codes']) => {
    const languages = [];
    if (codes.c) languages.push('C');
    if (codes.cpp) languages.push('C++');
    if (codes.python) languages.push('Python');
    return languages;
  };

  const handleLanguageSwitch = useCallback((language: Language) => {
    if (item && item.codes[language]) {
      setSelectedLanguage(language);
      setCurrentCode(item.codes[language] || '');
      setOutput(''); // Clear output when switching languages
    }
  }, [item]);

  const handleCopy = useCallback(async (language: Language) => {
    if (item && item.codes[language]) {
      try {
        await navigator.clipboard.writeText(item.codes[language]!);
        setCopiedStates(prev => ({ ...prev, [language]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [language]: false }));
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  }, [item]);

  const handleDownload = useCallback((language: Language) => {
    if (item && item.codes[language]) {
      const extensions = { c: 'c', cpp: 'cpp', python: 'py' };
      const filename = `${item.title.replace(/\s+/g, '_')}_ch${item.chapterNumber}.${extensions[language]}`;
      const blob = new Blob([item.codes[language]!], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [item]);

  const handleDownloadAll = useCallback(() => {
    if (!item) return;

    const availableLanguages = getAvailableLanguages(item.codes);
    const extensions = { c: 'c', cpp: 'cpp', python: 'py' };

    availableLanguages.forEach(lang => {
      const langKey = lang.toLowerCase() as Language;
      if (item.codes[langKey]) {
        const filename = `${item.title.replace(/\s+/g, '_')}_ch${item.chapterNumber}_${lang}.${extensions[langKey]}`;
        const blob = new Blob([item.codes[langKey]!], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  }, [item]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(prev => {
      const newState = !prev;
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      if (item) {
        if (newState) {
          bookmarks.push(item._id);
        } else {
          const index = bookmarks.indexOf(item._id);
          if (index > -1) bookmarks.splice(index, 1);
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      }
      return newState;
    });
  }, [item]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item?.title,
          text: `Check out this code example: ${item?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  }, [item]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    // Simulate code execution - replace with actual execution logic
    setTimeout(() => {
      setOutput(`Executing ${selectedLanguage.toUpperCase()} code...\nInput: ${input}\nOutput: Hello World!\n\nExecution completed successfully.`);
      setIsRunning(false);
    }, 1000);
  }, [selectedLanguage, input]);

  const handleDebug = useCallback(() => {
    setOutput(`Debug mode for ${selectedLanguage.toUpperCase()} code...\nSetting breakpoints...\nAnalyzing variables...\nDebugging information would appear here.\n\nDebug session ready.`);
  }, [selectedLanguage]);

  const handleReset = useCallback(() => {
    setInput('');
    setOutput('');
    if (item) {
      setCurrentCode(item.codes[selectedLanguage] || '');
    }
  }, [item, selectedLanguage]);


  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading library item...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Library item not found'}
          </p>
          <button
            onClick={() => router.push('/library')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const availableLanguages = getAvailableLanguages(item.codes);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/library')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Library</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Book className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                      {item.title}
                    </h1>
                    <div className="relative">
                      <button
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={() => setShowTooltip(!showTooltip)}
                        className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      {showTooltip && (
                        <div className="absolute left-0 top-6 z-20 w-64 sm:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-sm">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white mb-1">Important Notice</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Chapter {item.chapterNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Created {new Date(item.createdAt).toLocaleDateString()}</span>
                      <span className="sm:hidden">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmark}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>

                <button
                  onClick={handleDownloadAll}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Download all code files"
                >
                  <Download className="h-5 w-5" />
                </button>

                {/* Removed the Theme Toggle button from here, as it's in your Navbar */}
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">Language:</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {availableLanguages.map((lang) => {
                    const langKey = lang.toLowerCase() as Language;
                    const isSelected = selectedLanguage === langKey;
                    return (
                      <button
                        key={langKey}
                        onClick={() => handleLanguageSwitch(langKey)}
                        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Code Snippets Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                <span className="hidden sm:inline">Code Snippets</span>
                <span className="sm:hidden">Code</span>
              </h3>

              <div className="space-y-3">
                {availableLanguages.map((lang) => {
                  const langKey = lang.toLowerCase() as Language;
                  const isSelected = selectedLanguage === langKey;
                  const code = item.codes[langKey];

                  return (
                    <div
                      key={langKey}
                      className={`border rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                      }`}
                      onClick={() => handleLanguageSwitch(langKey)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`font-medium flex items-center gap-2 ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          <FileText className="h-4 w-4" />
                          {lang}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(langKey);
                            }}
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors p-1"
                            title="Download file"
                          >
                            <Download className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(langKey);
                            }}
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors p-1"
                            title="Copy code"
                          >
                            {copiedStates[langKey] ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
                        <span>{code ? `${code.split('\n').length} lines` : 'No code available'}</span>
                        {isSelected && (
                          <span className="text-blue-600 dark:text-blue-400 font-medium">Active</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={handleDownloadAll}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download All Files</span>
                    <span className="sm:hidden">Download All</span>
                  </button>
                  <button
                    onClick={() => handleCopy(selectedLanguage)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline">Copy Current Code</span>
                    <span className="sm:hidden">Copy Code</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* IDE */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="h-[50vh] sm:h-[60vh] lg:h-[calc(100vh-200px)] min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
              <IDE
                theme={theme} // This is the crucial part: pass the 'theme' from next-themes
                language={selectedLanguage}
                code={currentCode}
                setCode={setCurrentCode}
                onRun={handleRun}
                onDebug={handleDebug}
                loading={isRunning}
                output={output}
                input={input}
                setInput={setInput}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}