'use client';

import React, { useState } from 'react';
import IDE from './IDE';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Split from 'react-split';
import { useTheme } from 'next-themes';

interface Props {
  title: string;
  chapter: number;
  language: string;
  description: Record<string, string> | undefined;
  code: Record<string, string> | undefined;
}

export default function ProgramViewer({
  title,
  chapter,
  language,
  description = {},
  code = {},
}: Props) {
  const { theme } = useTheme();
  const availableLangs = Object.keys(code).length ? Object.keys(code) : ['python'];
  const [lang, setLang] = useState(() =>
    availableLangs.includes(language) ? language : availableLangs[0]
  );
  const [codeMap, setCodeMap] = useState(code);
  const [inputContent, setInputContent] = useState('');
  const [terminalContent, setTerminalContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (newCode: string) => {
    setCodeMap((prev) => ({ ...prev, [lang]: newCode }));
  };

  const handleReset = () => {
    setTerminalContent('');
    setInputContent('');
  };

  const runOrDebug = async (debug = false) => {
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
  };

  return (
    <div className="p-6 space-y-6 h-[90vh]">
      <div className="h-full">
        <Split
          className="flex h-full"
          sizes={[38, 62]}
          minSize={[320, 480]}
          gutterSize={8}
          gutterAlign="center"
          gutter={() => {
            const gutter = document.createElement('div');
            gutter.className = 'custom-gutter';
            return gutter;
          }}
        >
          <div className="bg-white mr-3 dark:bg-zinc-900 rounded-2xl p-6 shadow-lg overflow-auto flex flex-col space-y-6 border border-zinc-200 dark:border-zinc-800">
            <div>
              <h1 className="text-3xl font-extrabold mb-2 text-blue-700 dark:text-cyan-300 tracking-tight">
                {title}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-base mb-2">
                <span className="font-semibold">Chapter {chapter}</span> · <span className="font-semibold">Language:</span> {lang.toUpperCase()}
              </p>
              <div className="space-x-2 mt-2">
                {['python', 'cpp', 'c'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
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
            </div>

            <div className="prose dark:prose-invert text-base leading-relaxed max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {description?.[lang] ?? 'No description available.'}
              </ReactMarkdown>
            </div>
          </div>

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
        </Split>
      </div>

      <style jsx global>{`
        .custom-gutter {
          width: 8px;
          background-color: transparent;
          cursor: col-resize;
          position: relative;
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
        .custom-gutter:hover::before {
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
