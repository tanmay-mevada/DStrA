'use client';

import Editor from '@monaco-editor/react';
import { useState } from 'react';

export default function IDE({
  language,
  code,
  setCode,
  output,
  onRun,
  loading
}: {
  language: string;
  code: string;
  setCode: (value: string) => void;
  output: string;
  onRun: () => void;
  loading: boolean;
}) {
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  return (
    <div className="bg-zinc-900 rounded-xl p-4 space-y-4 shadow-md">
      <div className="flex justify-between items-center">
        <span className="text-sm text-white font-mono">Language: {language}</span>
        <button
          className="text-xs text-blue-300 underline"
          onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
        >
          Toggle Theme
        </button>
      </div>

      <Editor
  key={language} // Only language is enough to reset the editor
  height="300px"
  language={language}
  defaultValue={code} // ✅ Sets new content on re-mount
  theme={theme}
  onChange={(val) => setCode(val || '')}
  className="rounded overflow-hidden"
/>



      <button
        onClick={onRun}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loading ? 'Running...' : 'Run Code'}
      </button>

      <div className="bg-black text-green-400 text-sm p-3 rounded h-40 overflow-auto whitespace-pre-wrap">
        {output || 'No output yet'}
      </div>
    </div>
  );
}
