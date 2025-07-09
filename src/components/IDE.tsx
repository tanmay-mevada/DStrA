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
    <div className="bg-zinc-900 rounded-2xl ml-3 p-6 space-y-5 shadow-lg h-full flex flex-col border border-zinc-800">
      {/* Toolbar */}
      <div className="flex justify-between items-center text-white text-base mb-1">
        <div className="flex gap-3 items-center">
          <span className="font-mono text-blue-300 bg-zinc-800 px-2 py-1 rounded text-sm">{language.toUpperCase()}</span>
          <button onClick={toggleTheme} className="hover:text-yellow-300 p-1 rounded transition" title="Toggle Theme">
            {theme === 'vs-dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setFontSize((s) => Math.max(10, s - 1))}
            className="bg-zinc-800 px-2 rounded text-lg hover:bg-zinc-700 border border-zinc-700"
            title="Decrease font size"
          >
            –
          </button>
          <span className="w-7 text-center font-mono text-blue-200">{fontSize}</span>
          <button
            onClick={() => setFontSize((s) => Math.min(32, s + 1))}
            className="bg-zinc-800 px-2 rounded text-lg hover:bg-zinc-700 border border-zinc-700"
            title="Increase font size"
          >
            +
          </button>

          <button
            onClick={onRun}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-1.5 rounded-lg text-white font-bold shadow-md hover:from-blue-600 hover:to-cyan-600 flex items-center gap-1 transition disabled:opacity-60"
          >
            <Play size={18} />
            {loading ? 'Running...' : 'Run'}
          </button>

          <button
            onClick={onDebug}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-1.5 rounded-lg text-white font-bold shadow-md hover:from-amber-600 hover:to-yellow-600 flex items-center gap-1 transition"
          >
            <Bug size={18} />
            Debug
          </button>

          <button
            onClick={onReset}
            className="bg-zinc-700 px-3 py-1.5 rounded-lg text-white hover:bg-red-700 flex items-center gap-1 transition"
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
              theme={theme}
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
              className="rounded-xl overflow-hidden border border-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              className="bg-zinc-950 text-green-400 w-full p-3 py-1 rounded-lg outline-none placeholder:text-zinc-500 font-mono text-base border border-zinc-800"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter space-separated input (e.g., 1 2 3 4 5 3)"
              disabled={loading}
            />

            <div className="bg-zinc-800 text-white text-sm font-mono p-3 rounded-lg border border-zinc-700 overflow-auto h-full min-h-[60px]">
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
