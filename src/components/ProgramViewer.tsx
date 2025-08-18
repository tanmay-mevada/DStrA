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
import { Link, Youtube, Save, Share2, Download, AlertTriangle, RotateCcw } from 'lucide-react';

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
        <div className="absolute z-50 max-w-xs px-3 py-2 text-sm text-white transform -translate-x-1/2 bg-gray-900 rounded-lg shadow-lg dark:bg-gray-800 -top-12 left-1/2 min-w-max">
          <div className="relative">
            {content}
            <div className="absolute w-0 h-0 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent top-full left-1/2 border-t-gray-900 dark:border-t-gray-800"></div>
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
  
  // Separate original code from user-modified code
  const [originalCode] = useState(code); // Keep original code immutable
  const [userCodeMap, setUserCodeMap] = useLocalStorage(`program-${programId}-user-code`, {}); // User modifications
  
  const [inputContent, setInputContent] = useLocalStorage(`program-${programId}-input`, '');
  const [terminalContent, setTerminalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Get current code (user modified or original)
  const getCurrentCode = useCallback((language: string) => {
    return userCodeMap[language] || originalCode[language] || '';
  }, [userCodeMap, originalCode]);

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

  // Handle code changes - only store in localStorage, not database
  const handleCodeChange = useCallback((newCode: string) => {
    setUserCodeMap((prev: any) => ({ ...prev, [lang]: newCode }));
  }, [lang, setUserCodeMap]);

  // Reset to original code
  const handleResetCode = useCallback(() => {
    setUserCodeMap((prev: any) => {
      const newMap = { ...prev };
      delete newMap[lang]; // Remove user modifications for current language
      return newMap;
    });
    setTerminalContent('');
    setInputContent('');
  }, [lang, setUserCodeMap, setInputContent]);

  const handleReset = useCallback(() => {
    setTerminalContent('');
    setInputContent('');
  }, [setInputContent]);

  const handleLanguageChange = useCallback((newLang: string) => {
    setLang(newLang);
  }, [setLang]);

  const runOrDebug = useCallback(async (debug = false) => {
    setLoading(true);
    setDebugMode(debug);
    
    try {
      const currentCode = getCurrentCode(lang);
      let codeToExecute = currentCode;
      
      if (debug) {
        // Enhanced debug information for all languages
        if (lang === 'python') {
          codeToExecute = `# DEBUG MODE ENABLED
import sys
import traceback
import os

print("=== DEBUG INFORMATION ===")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Input received: {repr(input().strip()) if input else 'No input'}")
print("=== CODE EXECUTION START ===")
print()

try:
${currentCode.split('\n').map((line: string, index: number) => `    print(f"Line ${index + 1}: Executing..."); ${line}`).join('\n')}
    print()
    print("=== CODE EXECUTION COMPLETED SUCCESSFULLY ===")
except Exception as e:
    print()
    print("=== ERROR DETECTED ===")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {str(e)}")
    print(f"Error occurred in line: {traceback.extract_tb(e.__traceback__)[-1].lineno}")
    print()
    print("=== FULL TRACEBACK ===")
    traceback.print_exc()
    print("=== DEBUG SESSION END ===")
except SystemExit:
    print("=== PROGRAM EXITED ===")
except KeyboardInterrupt:
    print("=== EXECUTION INTERRUPTED ===")
`;
        } else if (lang === 'cpp') {
          // For C++, we need to wrap the code more carefully
          const hasMainFunction = currentCode.includes('int main(');
          
          if (hasMainFunction) {
            // If code already has main, wrap it in try-catch
            codeToExecute = `// DEBUG MODE ENABLED
#include <iostream>
#include <exception>
#include <stdexcept>
#include <string>

${currentCode.replace(/int main\s*\([^)]*\)\s*{/, `
void debug_info() {
    std::cout << "=== DEBUG INFORMATION ===" << std::endl;
    std::cout << "Compiler: C++" << std::endl;
    std::cout << "=== CODE EXECUTION START ===" << std::endl;
    std::cout << std::endl;
}

int main() {
    debug_info();
    
    try {`).replace(/}\s*$/, `
        std::cout << std::endl;
        std::cout << "=== CODE EXECUTION COMPLETED SUCCESSFULLY ===" << std::endl;
        return 0;
    } catch (const std::exception& e) {
        std::cout << std::endl;
        std::cout << "=== ERROR DETECTED ===" << std::endl;
        std::cout << "Error type: std::exception" << std::endl;
        std::cout << "Error message: " << e.what() << std::endl;
        std::cout << "=== DEBUG SESSION END ===" << std::endl;
        return 1;
    } catch (...) {
        std::cout << std::endl;
        std::cout << "=== UNKNOWN ERROR DETECTED ===" << std::endl;
        std::cout << "An unknown error occurred during execution" << std::endl;
        std::cout << "=== DEBUG SESSION END ===" << std::endl;
        return 1;
    }
}`)}`;
          } else {
            // If no main function, add one with debug wrapper
            codeToExecute = `// DEBUG MODE ENABLED
#include <iostream>
#include <exception>
#include <stdexcept>

${currentCode}

int main() {
    std::cout << "=== DEBUG INFORMATION ===" << std::endl;
    std::cout << "Compiler: C++" << std::endl;
    std::cout << "=== CODE EXECUTION START ===" << std::endl;
    std::cout << std::endl;
    
    try {
        // Your code would be executed here
        std::cout << "Note: Add a main() function to execute your code" << std::endl;
        std::cout << std::endl;
        std::cout << "=== CODE EXECUTION COMPLETED SUCCESSFULLY ===" << std::endl;
        return 0;
    } catch (const std::exception& e) {
        std::cout << std::endl;
        std::cout << "=== ERROR DETECTED ===" << std::endl;
        std::cout << "Error: " << e.what() << std::endl;
        std::cout << "=== DEBUG SESSION END ===" << std::endl;
        return 1;
    }
}`;
          }
        } else if (lang === 'c') {
          // For C, similar approach but with C-style error handling
          const hasMainFunction = currentCode.includes('int main(');
          
          if (hasMainFunction) {
            codeToExecute = `// DEBUG MODE ENABLED
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>

${currentCode.replace(/int main\s*\([^)]*\)\s*{/, `
void debug_info() {
    printf("=== DEBUG INFORMATION ===\\n");
    printf("Compiler: C\\n");
    printf("=== CODE EXECUTION START ===\\n");
    printf("\\n");
}

void handle_signal(int sig) {
    printf("\\n=== RUNTIME ERROR DETECTED ===\\n");
    printf("Signal received: %d\\n", sig);
    if (sig == SIGSEGV) {
        printf("Error type: Segmentation fault\\n");
    } else if (sig == SIGFPE) {
        printf("Error type: Floating point exception\\n");
    } else if (sig == SIGABRT) {
        printf("Error type: Abort signal\\n");
    }
    printf("=== DEBUG SESSION END ===\\n");
    exit(1);
}

int main() {
    signal(SIGSEGV, handle_signal);
    signal(SIGFPE, handle_signal);
    signal(SIGABRT, handle_signal);
    
    debug_info();`).replace(/}\s*$/, `
    printf("\\n");
    printf("=== CODE EXECUTION COMPLETED SUCCESSFULLY ===\\n");
    return 0;
}`)}`;
          } else {
            codeToExecute = `// DEBUG MODE ENABLED
#include <stdio.h>
#include <stdlib.h>

${currentCode}

int main() {
    printf("=== DEBUG INFORMATION ===\\n");
    printf("Compiler: C\\n");
    printf("=== CODE EXECUTION START ===\\n");
    printf("\\n");
    
    printf("Note: Add a main() function to execute your code\\n");
    printf("\\n");
    printf("=== CODE EXECUTION COMPLETED SUCCESSFULLY ===\\n");
    return 0;
}`;
          }
        }
      }

      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          source_code: codeToExecute,
          stdin: inputContent.trim(),
          debug: debug,
        }),
      });

      const data = await res.json();
      
      let result = '';
      
      if (debug) {
        // Enhanced error reporting for debug mode
        if (data?.compile_output && data.compile_output.trim()) {
          result += `=== COMPILATION OUTPUT ===\n${data.compile_output}\n\n`;
        }
        
        if (data?.output) {
          result += data.output;
        }
        
        if (data?.stderr && data.stderr.trim()) {
          result += `\n=== RUNTIME ERRORS ===\n${data.stderr}`;
        }
        
        if (data?.error) {
          result += `\n=== EXECUTION ERROR ===\n${data.error}`;
        }
        
        // Add execution status
        if (data?.status) {
          result += `\n=== EXECUTION STATUS ===\nExit code: ${data.status}`;
          if (data.status !== 0) {
            result += ` (Error - non-zero exit code)`;
          }
        }
        
        if (!result.trim()) {
          result = '=== DEBUG SESSION ===\nNo output or errors detected.\n=== DEBUG SESSION END ===';
        }
      } else {
        // Normal execution mode
        if (data?.output) {
          result = data.output;
        } else if (data?.stderr) {
          result = `Error:\n${data.stderr}`;
        } else if (data?.error) {
          result = `Execution Error:\n${data.error}`;
        } else if (data?.compile_output) {
          result = `Compilation Error:\n${data.compile_output}`;
        } else {
          result = 'No output returned.';
        }
      }
      
      setTerminalContent(result);
    } catch (err) {
      console.error('Execution error:', err);
      const errorMessage = debug 
        ? `=== DEBUG SESSION ERROR ===\nNetwork Error: Unable to execute code.\n${err instanceof Error ? err.message : 'Unknown error'}\n=== DEBUG SESSION END ===`
        : `Network Error: Unable to execute code.\n${err instanceof Error ? err.message : 'Unknown error'}`;
      setTerminalContent(errorMessage);
    } finally {
      setLoading(false);
      setDebugMode(false);
    }
  }, [lang, getCurrentCode, inputContent]);

  //     const res = await fetch('/api/execute', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         language: lang,
  //         source_code: codeToExecute,
  //         stdin: inputContent.trim(),
  //         debug: debug,
  //       }),
  //     });

  //     const data = await res.json();
      
  //     let result = '';
  //     if (data?.output) {
  //       result = data.output;
  //     } else if (data?.stderr) {
  //       result = `Error:\n${data.stderr}`;
  //     } else if (data?.error) {
  //       result = `Execution Error:\n${data.error}`;
  //     } else {
  //       result = 'No output returned.';
  //     }
      
  //     setTerminalContent(result);
  //   } catch (err) {
  //     console.error('Execution error:', err);
  //     setTerminalContent(`Network Error: Unable to execute code.\n${err instanceof Error ? err.message : 'Unknown error'}`);
  //   } finally {
  //     setLoading(false);
  //     setDebugMode(false);
  //   }
  // }, [lang, getCurrentCode, inputContent]);

  // Export functionality - downloads current user-modified code
  const exportCode = useCallback(() => {
    const currentCode = getCurrentCode(lang);
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const extension = lang === 'python' ? 'py' : lang === 'cpp' ? 'cpp' : 'c';
    a.download = `${title.replace(/\s+/g, '_')}_${lang}_${timestamp}.${extension}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getCurrentCode, lang, title]);

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

  // Check if code has been modified
  const hasModifications = useMemo(() => {
    return userCodeMap[lang] && userCodeMap[lang] !== originalCode[lang];
  }, [userCodeMap, lang, originalCode]);

  // Memoize markdown renderer for performance
  const MarkdownRenderer = useMemo(() => {
    return ({ content }: { content: string }) => (
      <article className="prose-sm prose sm:prose lg:prose-lg max-w-none text-zinc-800 dark:text-zinc-100 dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h3:text-blue-600 dark:prose-h3:text-cyan-300 prose-h4:text-blue-500 dark:prose-h4:text-cyan-200 prose-p:mb-5 prose-p:text-base prose-p:font-normal prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-blue-300 dark:prose-blockquote:border-cyan-700 prose-blockquote:bg-blue-50/40 dark:prose-blockquote:bg-cyan-900/20 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: (props) => <h1 className="mb-4 text-3xl font-bold text-blue-800 underline dark:text-cyan-200" {...props} />,
            h2: (props) => <h2 className="mb-3 text-2xl font-semibold text-blue-700 underline dark:text-cyan-300" {...props} />,
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
          <div className="p-4 bg-white border shadow-lg dark:bg-zinc-900 rounded-xl border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-blue-700 sm:text-2xl dark:text-cyan-300">
                    {title}
                  </h1>
                  <Tooltip 
                    content="This program is only designed to help you understand the concepts of data structures and algorithms."
                    showOnMobile={true}
                  >
                    <AlertTriangle size={20} className="text-amber-500 dark:text-amber-400" />
                  </Tooltip>
                </div>
                <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold">Chapter {chapter}</span> · 
                  <span className="font-semibold">Language:</span> {lang.toUpperCase()}
                  {hasModifications && (
                    <span className="px-2 py-1 ml-2 text-xs text-blue-700 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                      Modified
                    </span>
                  )}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {hasModifications && (
                  <Tooltip content="Reset to original code" showOnMobile={true}>
                    <button
                      onClick={handleResetCode}
                      className="p-2 text-orange-600 transition bg-orange-100 rounded-lg dark:bg-orange-900 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800"
                      title="Reset Code"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </Tooltip>
                )}
                <button
                  onClick={shareCode}
                  className="p-2 text-blue-600 transition bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                  title="Share"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={exportCode}
                  className="p-2 text-green-600 transition bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
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
                  disabled={!originalCode?.[l]}
                >
                  {l.toUpperCase()}
                  {userCodeMap[l] && userCodeMap[l] !== originalCode[l] && (
                    <span className="inline-block w-2 h-2 ml-1 bg-yellow-400 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="p-4 bg-white border shadow-lg dark:bg-zinc-900 rounded-xl border-zinc-200 dark:border-zinc-800">
            <MarkdownRenderer content={description?.[lang] ?? 'No description available.'} />
          </div>

          {/* IDE Section */}
          <div className="h-[50vh] min-h-[350px] max-h-[60vh]">
            <IDE
              theme={theme}
              language={lang}
              code={getCurrentCode(lang)}
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
    <div className="overflow-hidden h-screen-safe bg-gray-50 dark:bg-gray-900">
      <div className="h-full p-4 lg:p-6">
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
          <div className="flex flex-col h-full min-w-0 p-4 mr-3 space-y-4 bg-white border shadow-lg dark:bg-zinc-900 rounded-2xl lg:p-6 lg:space-y-6 border-zinc-200 dark:border-zinc-800">
            <div className="flex-shrink-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-blue-700 lg:text-3xl dark:text-cyan-300">
                      {title}
                    </h1>
                    <Tooltip content="This program is only designed to help you understand the concepts of data structures and algorithms.">
                      <AlertTriangle size={24} className="text-amber-500 dark:text-amber-400" />
                    </Tooltip>
                  </div>
                  <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400 lg:text-base">
                    <span className="font-semibold">Chapter {chapter}</span> · 
                    <span className="font-semibold">Language:</span> {lang.toUpperCase()}
                    {hasModifications && (
                      <span className="px-2 py-1 ml-2 text-xs text-blue-700 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                        Modified
                      </span>
                    )}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {hasModifications && (
                    <Tooltip content="Reset to original code">
                      <button
                        onClick={handleResetCode}
                        className="p-2 text-orange-600 transition bg-orange-100 rounded-lg dark:bg-orange-900 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800"
                        title="Reset Code"
                      >
                        <RotateCcw size={18} />
                      </button>
                    </Tooltip>
                  )}
                  <button
                    onClick={shareCode}
                    className="p-2 text-blue-600 transition bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                    title="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={exportCode}
                    className="p-2 text-green-600 transition bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
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
                    disabled={!originalCode?.[l]}
                  >
                    {l.toUpperCase()}
                    {userCodeMap[l] && userCodeMap[l] !== originalCode[l] && (
                      <span className="inline-block w-2 h-2 ml-1 bg-yellow-400 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Description with scrollable content */}
            <div className="flex-1 min-h-0 overflow-auto">
              <MarkdownRenderer content={description?.[lang] ?? 'No description available.'} />
            </div>
          </div>

          {/* Right Panel - IDE */}
          <div className="flex-1 h-full min-w-0">
            <IDE
              theme={theme}
              language={lang}
              code={getCurrentCode(lang)}
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