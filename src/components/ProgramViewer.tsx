'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import IDE from './IDE';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import Split from 'react-split';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link, Youtube, Save, Share2, Download, AlertTriangle } from 'lucide-react';

interface Props {
  title: string;
  chapter: number;
  language: string;
  description: Record<string, string> | undefined;
  code: Record<string, string> | undefined;
  programId?: string; // For saving changes
}

// Custom hook for localStorage with error handling
const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: any) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

// Tooltip Component
const Tooltip = ({ children, content, showOnMobile = false }: { 
  children: React.ReactNode; 
  content: string; 
  showOnMobile?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInteraction = () => {
    if (isMobile && showOnMobile) {
      setIsVisible(!isVisible);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => !isMobile && setIsVisible(true)}
        onMouseLeave={() => !isMobile && setIsVisible(false)}
        onClick={handleInteraction}
        className="cursor-pointer"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg -top-12 left-1/2 transform -translate-x-1/2 min-w-max max-w-xs">
          <div className="relative">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProgramViewer({
  title,
  chapter,
  language,
  description = {},
  code = {},
  programId,
}: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const availableLangs = Object.keys(code).length ? Object.keys(code) : ['python'];
  const [lang, setLang] = useLocalStorage(`program-${programId}-lang`, 
    availableLangs.includes(language) ? language : availableLangs[0]
  );
  const [codeMap, setCodeMap] = useState(code);
  const [inputContent, setInputContent] = useLocalStorage(`program-${programId}-input`, '');
  const [terminalContent, setTerminalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => setMounted(true), []);

  // Optimize mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    const debouncedResize = debounce(checkMobile, 150);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  // Debounce utility
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !programId) return;

    const autoSave = debounce(async () => {
      try {
        setSaveStatus('saving');
        await fetch(`/api/programs/${programId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: codeMap,
            lastModified: new Date().toISOString(),
          }),
        });
        setSaveStatus('saved');
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, 2000);

    autoSave();
  }, [codeMap, hasUnsavedChanges, programId]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCodeMap((prev) => ({ ...prev, [lang]: newCode }));
    setHasUnsavedChanges(true);
  }, [lang]);

  const handleReset = useCallback(() => {
    setTerminalContent('');
    setInputContent('');
  }, [setInputContent]);

  const handleLanguageChange = useCallback((newLang: string) => {
    setLang(newLang);
  }, [setLang]);

  const runOrDebug = useCallback(async (debug = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          source_code: debug ? `# Debug Mode\n${codeMap[lang]}` : codeMap[lang],
          stdin: inputContent.trim().split(/\s+/).join('\n'),
        }),
      });

      const data = await res.json();
      const result = data?.output || data?.stderr || 'No output returned.';
      setTerminalContent(result);
    } catch (err) {
      setTerminalContent('Error executing code.');
    } finally {
      setLoading(false);
    }
  }, [lang, codeMap, inputContent]);

  // Export functionality
  const exportCode = useCallback(() => {
    const content = codeMap[lang] || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${lang}.${lang === 'python' ? 'py' : lang}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [codeMap, lang, title]);

  // Share functionality
  const shareCode = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - Chapter ${chapter}`,
          text: `Check out this programming exercise: ${title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
        console.log('Link copied to clipboard');
      } catch (err) {
        console.error('Failed to copy link');
      }
    }
  }, [title, chapter]);

  // Memoize markdown renderer for performance
  const MarkdownRenderer = useMemo(() => {
    return ({ content }: { content: string }) => (
      <article className="prose prose-sm sm:prose lg:prose-lg max-w-none text-zinc-800 dark:text-zinc-100 dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h3:text-blue-600 dark:prose-h3:text-cyan-300 prose-h4:text-blue-500 dark:prose-h4:text-cyan-200 prose-p:mb-5 prose-p:text-base prose-p:font-normal prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-blue-300 dark:prose-blockquote:border-cyan-700 prose-blockquote:bg-blue-50/40 dark:prose-blockquote:bg-cyan-900/20 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: (props) => <h1 className="mb-4 text-3xl font-bold underline text-blue-800 dark:text-cyan-200" {...props} />,
            h2: (props) => <h2 className="mb-3 text-2xl font-semibold underline text-blue-700 dark:text-cyan-300" {...props} />,
            h3: (props) => <h3 className="mb-2 text-xl font-semibold text-blue-600 dark:text-cyan-300" {...props} />,
            h4: (props) => <h4 className="mb-1 text-lg font-medium text-blue-500 dark:text-cyan-200" {...props} />,
            p: (props) => <p className="mb-5 text-base font-normal leading-relaxed text-zinc-800 dark:text-zinc-100" {...props} />,
            ul: (props) => <ul className="mb-4 space-y-1 list-disc list-inside" {...props} />,
            ol: (props) => <ol className="mb-4 space-y-1 list-decimal list-inside" {...props} />,
            li: (props) => <li {...props} />,
            a: ({ href, children, ...props }) => {
              const isExternal = href?.startsWith('http');
              const isYouTube = href?.includes('youtube.com') || href?.includes('youtu.be');

              const icon = isYouTube ? (
                <Youtube size={18} className="text-red-600 dark:text-red-400" />
              ) : (
                <Link size={16} className="text-indigo-600 dark:text-lime-400" />
              );

              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center gap-1 underline font-medium transition-colors ${
                    isYouTube
                      ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                      : 'text-indigo-600 hover:text-indigo-800 dark:text-lime-400 dark:hover:text-lime-300'
                  }`}
                  {...props}
                >
                  {icon}
                  {children}
                </a>
              );
            },
            code({
              inline,
              className,
              children,
              ...props
            }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeContent = String(children).trim();
              const isInlineOrShort =
                inline || (!match && codeContent.length < 30 && !codeContent.includes('\n'));

              if (isInlineOrShort) {
                return (
                  <code
                    className="px-1 py-0.5 rounded font-mono 
      bg-[#f0f0f0] dark:bg-zinc-900 
      text-[#6B21A8] dark:text-[#4ADE80] 
      border border-purple-200 dark:border-green-700 
      text-[15px] tracking-tight shadow-sm
      md:bg-[#f0f0f0] md:dark:bg-zinc-900 
      md:border md:border-purple-200 md:dark:border-green-700 
      bg-transparent border-0"
                    style={{ fontWeight: 600, letterSpacing: "0.01em" }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              const commonStyle = {
                padding: '1.2rem',
                borderRadius: '0.7rem',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.2rem',
                fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                boxShadow: theme === 'dark' ? '0 2px 8px #0002' : '0 2px 8px #6366f11a',
              };

              const styleWithTheme = {
                ...commonStyle,
                background: theme === 'dark' ? '#18181b' : '#f8fafc',
                color: theme === 'dark' ? '#a6e3a1' : '#7c3aed',
                border: theme === 'dark' ? '1.5px solid #334155' : '1.5px solid #c7d2fe',
              };

              const stylePlain = {
                ...commonStyle,
                background: theme === 'dark' ? '#0f172a' : '#f1f5f9',
                border: theme === 'dark' ? '1px solid #334155' : '1px solid #cbd5e1',
                color: theme === 'dark' ? '#a6e3a1' : '#7e22ce',
              };

              return match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  style={theme === 'dark' ? vscDarkPlus : oneLight}
                  customStyle={styleWithTheme}
                  PreTag="div"
                  {...props}
                >
                  {codeContent}
                </SyntaxHighlighter>
              ) : (
                <pre style={stylePlain}>
                  <code style={{ all: 'unset' }}>{codeContent}</code>
                </pre>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    );
  }, [theme]);

  if (!mounted) return null;

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-4 space-y-4">
          {/* Header Section with Action Buttons */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-blue-700 dark:text-cyan-300 tracking-tight">
                    {title}
                  </h1>
                  <Tooltip 
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    showOnMobile={true}
                  >
                    <AlertTriangle size={20} className="text-amber-500 dark:text-amber-400" />
                  </Tooltip>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-3">
                  <span className="font-semibold">Chapter {chapter}</span> · 
                  <span className="font-semibold">Language:</span> {lang.toUpperCase()}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={shareCode}
                  className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  title="Share"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={exportCode}
                  className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition"
                  title="Export Code"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex flex-wrap gap-2 mb-3">
              {['python', 'cpp', 'c'].map((l) => (
                <button
                  key={l}
                  onClick={() => handleLanguageChange(l)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-600 shadow-sm ${
                    l === lang
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-cyan-700 dark:to-blue-700 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-blue-50 dark:hover:bg-cyan-900'
                  }`}
                  disabled={!codeMap?.[l]}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Save Status */}
            {saveStatus !== 'idle' && (
              <div className={`text-sm font-medium ${
                saveStatus === 'saving' ? 'text-blue-600' :
                saveStatus === 'saved' ? 'text-green-600' :
                'text-red-600'
              }`}>
                {saveStatus === 'saving' ? 'Saving...' :
                 saveStatus === 'saved' ? 'Saved!' :
                 'Save failed'}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <MarkdownRenderer content={description?.[lang] ?? 'No description available.'} />
          </div>

          {/* IDE Section */}
          <div className="h-[50vh] min-h-[350px] max-h-[60vh]">
            <IDE
              theme={theme}
              language={lang}
              code={codeMap?.[lang] ?? ''}
              setCode={handleCodeChange}
              onRun={() => runOrDebug(false)}
              onDebug={() => runOrDebug(true)}
              loading={loading}
              output={terminalContent}
              input={inputContent}
              setInput={setInputContent}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout - Fixed to viewport height
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="p-4 lg:p-6 h-full">
        <Split
          className="flex h-full"
          sizes={[38, 62]}
          minSize={[300, 400]}
          maxSize={[Infinity, Infinity]}
          gutterSize={8}
          gutterAlign="center"
          gutter={() => {
            const gutter = document.createElement('div');
            gutter.className = 'custom-gutter';
            return gutter;
          }}
        >
          {/* Left Panel */}
          <div className="bg-white mr-3 dark:bg-zinc-900 rounded-2xl p-4 lg:p-6 shadow-lg flex flex-col space-y-4 lg:space-y-6 border border-zinc-200 dark:border-zinc-800 min-w-0 h-full">
            <div className="flex-shrink-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-blue-700 dark:text-cyan-300 tracking-tight">
                      {title}
                    </h1>
                    <Tooltip content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.">
                      <AlertTriangle size={24} className="text-amber-500 dark:text-amber-400" />
                    </Tooltip>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm lg:text-base mb-2">
                    <span className="font-semibold">Chapter {chapter}</span> · 
                    <span className="font-semibold">Language:</span> {lang.toUpperCase()}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={shareCode}
                    className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    title="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={exportCode}
                    className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition"
                    title="Export Code"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
              
              {/* Language Selector */}
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {['python', 'cpp', 'c'].map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLanguageChange(l)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-600 shadow-sm ${
                      l === lang
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-cyan-700 dark:to-blue-700 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-blue-50 dark:hover:bg-cyan-900'
                    }`}
                    disabled={!codeMap?.[l]}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Save Status */}
              {saveStatus !== 'idle' && (
                <div className={`text-sm font-medium mb-2 ${
                  saveStatus === 'saving' ? 'text-blue-600' :
                  saveStatus === 'saved' ? 'text-green-600' :
                  'text-red-600'
                }`}>
                  {saveStatus === 'saving' ? 'Saving...' :
                   saveStatus === 'saved' ? 'Saved!' :
                   'Save failed'}
                </div>
              )}
            </div>

            {/* Description with scrollable content */}
            <div className="flex-1 min-h-0 overflow-auto">
              <MarkdownRenderer content={description?.[lang] ?? 'No description available.'} />
            </div>
          </div>

          {/* Right Panel - IDE */}
          <div className="min-w-0 flex-1 h-full">
            <IDE
              theme={theme}
              language={lang}
              code={codeMap?.[lang] ?? ''}
              setCode={handleCodeChange}
              onRun={() => runOrDebug(false)}
              onDebug={() => runOrDebug(true)}
              loading={loading}
              output={terminalContent}
              input={inputContent}
              setInput={setInputContent}
              onReset={handleReset}
            />
          </div>
        </Split>
      </div>

      <style jsx global>{`
        .custom-gutter {
          width: 8px;
          background-color: transparent;
          cursor: col-resize;
          position: relative;
          flex-shrink: 0;
        }
        .custom-gutter::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          background-color: #d1d5db;
          border-radius: 2px;
          transition: background-color 0.3s ease;
        }
        .dark .custom-gutter::before {
          background-color: #4b5563;
        }
        .custom-gutter:hover::before {
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}