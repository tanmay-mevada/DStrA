'use client';

import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { Moon, Sun, Play, Bug, RotateCcw } from 'lucide-react';
import Split from 'react-split';

export default function IDE({
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
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark'));
  };

  return (
    <div className="bg-zinc-900 rounded-xl ml-2 p-4 space-y-4 shadow-md h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex justify-between items-center text-white text-sm">
        <div className="flex gap-2 items-center">
          <span className="font-mono">Language: {language}</span>
          <button onClick={toggleTheme} className="hover:text-yellow-300" title="Toggle Theme">
            {theme === 'vs-dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setFontSize((s) => Math.max(10, s - 1))}
            className="bg-zinc-700 px-2 rounded"
            title="Decrease font size"
          >
            –
          </button>
          <span className="w-6 text-center">{fontSize}</span>
          <button
            onClick={() => setFontSize((s) => Math.min(32, s + 1))}
            className="bg-zinc-700 px-2 rounded"
            title="Increase font size"
          >
            +
          </button>

          <button
            onClick={onRun}
            disabled={loading}
            className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700 flex items-center gap-1"
          >
            <Play size={16} />
            {loading ? 'Running...' : 'Run'}
          </button>

          <button
            onClick={onDebug}
            className="bg-amber-600 px-3 py-1 rounded text-white hover:bg-amber-700 flex items-center gap-1"
          >
            <Bug size={16} />
            Debug
          </button>

          <button
            onClick={onReset}
            className="px-3 py-1 rounded text-white hover:bg-red-700 flex items-center gap-1"
          >
            <RotateCcw size={16} />
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
              theme={theme}
              options={{
                fontSize,
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
              }}
              onChange={(val) => setCode(val || '')}
              className="rounded overflow-hidden"
            />
          </div>

          <div className=''>
          <input
            type="text"
            className="bg-black text-green-400 w-full p-3 py-0.5 my-1 rounded outline-none placeholder:text-zinc-500"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter space-separated input (e.g., 1 2 3 4 5 3)"
            disabled={loading}
          />

          <div className="bg-zinc-800 text-white text-sm font-mono p-3 rounded overflow-auto h-full">
            <pre>{output || '> Output will appear here.'}</pre>
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
          background-color: #4b5563;
          border-radius: 1px;
          transition: background-color 0.3s ease;
        }
        .vertical-gutter:hover::before {
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
