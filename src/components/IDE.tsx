'use client';

import Editor from '@monaco-editor/react';
import Split from 'react-split';
import { Play, Bug, RotateCcw, Minus, Plus } from 'lucide-react';
import React from 'react';

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

  return (
    <div className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-2xl ml-3 p-6 space-y-5 shadow-lg h-full flex flex-col border border-gray-300 dark:border-zinc-800">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-blue-600 dark:text-blue-300 bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
          {language.toUpperCase()}
        </span>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setFontSize((s) => Math.max(10, s - 1))}
            className="w-9 h-9 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-400 dark:border-zinc-700"
            title="Decrease font size"
          >
            <Minus size={18} />
          </button>

          <span className="w-7 text-center font-mono text-blue-700 dark:text-blue-200">{fontSize}</span>

          <button
            onClick={() => setFontSize((s) => Math.min(32, s + 1))}
            className="w-9 h-9 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-400 dark:border-zinc-700"
            title="Increase font size"
          >
            <Plus size={18} />
          </button>

          <button
            onClick={onRun}
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 rounded text-white shadow-md hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-60"
            title="Run"
          >
            <Play size={18} />
          </button>

          <button
            onClick={onDebug}
            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-500 rounded text-white shadow-md hover:from-amber-600 hover:to-yellow-600 transition"
            title="Debug"
          >
            <Bug size={18} />
          </button>

          <button
            onClick={onReset}
            className="w-9 h-9 flex items-center justify-center bg-gray-300 dark:bg-zinc-700 rounded hover:bg-red-600 dark:hover:bg-red-700 text-black dark:text-white transition"
            title="Reset input/output"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Editor + I/O */}
      <div className="flex-1">
        <Split
          className="flex flex-col h-full"
          direction="vertical"
          sizes={[80, 16]}
          minSize={[200, 100]}
          gutterSize={6}
          gutterAlign="center"
          gutter={() => {
            const g = document.createElement('div');
            g.className = 'vertical-gutter';
            return g;
          }}
        >
          <div className="h-full">
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
              }}
              onChange={(val) => setCode(val || '')}
              className="rounded-xl overflow-hidden border border-gray-300 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-2 mb-2">
            <input
              type="text"
              className="bg-gray-100 dark:bg-zinc-950 text-green-600 dark:text-green-400 w-full p-3 py-1 rounded-lg outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500 font-mono text-base border border-gray-300 dark:border-zinc-800"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter space-separated input (e.g., 1 2 3 4 5 3)"
              disabled={loading}
            />

            <div className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white text-sm font-mono p-3 rounded-lg border border-gray-300 dark:border-zinc-700 overflow-auto h-full min-h-[60px]">
              <pre className="whitespace-pre-wrap break-words">{output || '> Output will appear here.'}</pre>
            </div>
          </div>
        </Split>
      </div>

      <style jsx global>{`
        .vertical-gutter {
          height: 6px;
          background-color: transparent;
          cursor: row-resize;
          position: relative;
        }
        .vertical-gutter::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          height: 2px;
          background-color: #d1d5db;
          border-radius: 1px;
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
