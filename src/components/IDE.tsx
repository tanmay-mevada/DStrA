'use client';

import Editor from '@monaco-editor/react';
import Split from 'react-split';
import { Play, Bug, RotateCcw, Minus, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function IDE({
  theme,
  language,
  code,
  setCode,
  onRun,
  onDebug,
  loading,
  output,
  input,
  setInput,
  onReset,
}: {
  theme: string | undefined;
  language: string;
  code: string;
  setCode: (value: string) => void;
  onRun: () => void;
  onDebug: () => void;
  loading: boolean;
  output: string;
  input: string;
  setInput: (value: string) => void;
  onReset: () => void;
}) {
  const [fontSize, setFontSize] = React.useState(14);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile layout - stacked vertically without split
  if (isMobile) {
    return (
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl p-3 shadow-lg h-full flex flex-col border border-gray-300 dark:border-zinc-800">
        {/* Mobile Toolbar */}
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <span className="font-mono text-blue-600 dark:text-blue-300 bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded text-xs">
            {language.toUpperCase()}
          </span>

          <div className="flex gap-1 items-center">
            <button
              onClick={() => setFontSize((s) => Math.max(10, s - 1))}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-400 dark:border-zinc-700"
              title="Decrease font size"
            >
              <Minus size={14} />
            </button>

            <span className="w-6 text-center font-mono text-blue-700 dark:text-blue-200 text-xs">{fontSize}</span>

            <button
              onClick={() => setFontSize((s) => Math.min(24, s + 1))}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-400 dark:border-zinc-700"
              title="Increase font size"
            >
              <Plus size={14} />
            </button>

            <button
              onClick={onRun}
              disabled={loading}
              className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 rounded text-white shadow-md hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-60"
              title="Run"
            >
              <Play size={14} />
            </button>

            <button
              onClick={onDebug}
              className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-500 rounded text-white shadow-md hover:from-amber-600 hover:to-yellow-600 transition"
              title="Debug"
            >
              <Bug size={14} />
            </button>

            <button
              onClick={onReset}
              className="w-8 h-8 flex items-center justify-center bg-gray-300 dark:bg-zinc-700 rounded hover:bg-red-600 dark:hover:bg-red-700 text-black dark:text-white transition"
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Mobile Editor */}
        <div className="flex-1 mb-3 min-h-0">
          <Editor
            key={language}
            height="100%"
            language={language}
            value={code}
            theme={theme === 'dark' ? 'vs-dark' : 'vs'}
            options={{
              fontSize: Math.min(fontSize, 16), // Cap font size on mobile
              minimap: { enabled: false },
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
              fontWeight: '500',
              lineNumbers: 'on',
              smoothScrolling: true,
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
            onChange={(val) => setCode(val || '')}
            className="rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-800"
          />
        </div>

        {/* Mobile I/O */}
        <div className="space-y-2 flex-shrink-0">
          <input
            type="text"
            className="bg-gray-100 dark:bg-zinc-950 text-green-600 dark:text-green-400 w-full p-2 rounded-lg outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500 font-mono text-sm border border-gray-300 dark:border-zinc-800"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input (space-separated)"
            disabled={loading}
          />

          <div className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white text-xs font-mono p-2 rounded-lg border border-gray-300 dark:border-zinc-700 overflow-auto h-20 max-h-20">
            <pre className="whitespace-pre-wrap break-words">{output || '> Output will appear here.'}</pre>
          </div>
        </div>
      </div>
    );
  }

  // Desktop/Tablet layout - with split panes and proper constraints
  return (
    <div className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-2xl ml-3 p-4 lg:p-6 shadow-lg h-full flex flex-col border border-gray-300 dark:border-zinc-800">
      {/* Desktop Toolbar */}
      <div className="flex justify-between items-center mb-3 lg:mb-4 flex-shrink-0">
        <span className="font-mono text-blue-600 dark:text-blue-300 bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
          {language.toUpperCase()}
        </span>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setFontSize((s) => Math.max(10, s - 1))}
            className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-400 dark:border-zinc-700"
            title="Decrease font size"
          >
            <Minus size={16} />
          </button>

          <span className="w-6 lg:w-7 text-center font-mono text-blue-700 dark:text-blue-200 text-sm">{fontSize}</span>

          <button
            onClick={() => setFontSize((s) => Math.min(32, s + 1))}
            className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-400 dark:border-zinc-700"
            title="Increase font size"
          >
            <Plus size={16} />
          </button>

          <button
            onClick={onRun}
            disabled={loading}
            className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 rounded text-white shadow-md hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-60"
            title="Run"
          >
            <Play size={16} />
          </button>

          <button
            onClick={onDebug}
            className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-500 rounded text-white shadow-md hover:from-amber-600 hover:to-yellow-600 transition"
            title="Debug"
          >
            <Bug size={16} />
          </button>

          <button
            onClick={onReset}
            className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-gray-300 dark:bg-zinc-700 rounded hover:bg-red-600 dark:hover:bg-red-700 text-black dark:text-white transition"
            title="Reset input/output"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Desktop Editor + I/O with constrained split */}
      <div className="flex-1 min-h-0">
        <Split
          className="flex flex-col h-full"
          direction="vertical"
          sizes={[70, 30]}
          minSize={[200, 120]}
          maxSize={[Infinity, 300]}
          gutterSize={8}
          gutterAlign="center"
          gutter={() => {
            const g = document.createElement('div');
            g.className = 'vertical-gutter';
            return g;
          }}
        >
          {/* Editor Panel */}
          <div className="min-h-0 flex-1">
            <Editor
              key={language}
              height="100%"
              language={language}
              value={code}
              theme={theme === 'dark' ? 'vs-dark' : 'vs'}
              options={{
                fontSize,
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                fontWeight: '500',
                lineNumbers: 'on',
                smoothScrolling: true,
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
              onChange={(val) => setCode(val || '')}
              className="rounded-xl overflow-hidden border border-gray-300 dark:border-zinc-800"
            />
          </div>

          {/* I/O Panel with fixed height constraints */}
          <div className="flex flex-col space-y-2 min-h-0 flex-shrink-0">
            <input
              type="text"
              className="bg-gray-100 dark:bg-zinc-950 text-green-600 dark:text-green-400 w-full p-2 lg:p-3 rounded-lg outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500 font-mono text-sm lg:text-base border border-gray-300 dark:border-zinc-800 flex-shrink-0"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter space-separated input (e.g., 1 2 3 4 5 3)"
              disabled={loading}
            />

            <div className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white text-sm font-mono p-2 lg:p-3 rounded-lg border border-gray-300 dark:border-zinc-700 overflow-auto flex-1 min-h-[60px]">
              <pre className="whitespace-pre-wrap break-words">{output || '> Output will appear here.'}</pre>
            </div>
          </div>
        </Split>
      </div>

      <style jsx global>{`
        .vertical-gutter {
          height: 8px;
          background-color: transparent;
          cursor: row-resize;
          position: relative;
          flex-shrink: 0;
        }
        .vertical-gutter::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          height: 3px;
          background-color: #d1d5db;
          border-radius: 2px;
          transition: background-color 0.3s ease;
        }
        .dark .vertical-gutter::before {
          background-color: #4b5563;
        }
        .vertical-gutter:hover::before {
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}