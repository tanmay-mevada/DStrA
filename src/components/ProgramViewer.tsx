'use client';

import React, { useState } from 'react';
import IDE from './IDE';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Split from 'react-split';

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
        stdin: inputContent.trim().split(/\s+/).join('\n'), // 👈 KEY CHANGE
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
          sizes={[35, 65]}
          minSize={[300, 500]}
          gutterSize={6}
          gutterAlign="center"
          gutter={() => {
            const gutter = document.createElement('div');
            gutter.className = 'custom-gutter';
            return gutter;
          }}
        >
          <div className="bg-white mr-2 dark:bg-zinc-900 rounded-xl p-4 shadow-sm overflow-auto flex flex-col space-y-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{title}</h1>
              <p className="text-zinc-500 text-sm">
                Chapter {chapter} · Language: {lang}
              </p>
              <div className="space-x-2 mt-2">
                {['python', 'cpp', 'c'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 rounded text-sm ${
                      l === lang
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white'
                    }`}
                    disabled={!codeMap?.[l]}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="prose dark:prose-invert text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {description?.[lang] ?? 'No description available.'}
              </ReactMarkdown>
            </div>
          </div>

          <IDE
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
          width: 6px;
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
          width: 2px;
          background-color: #d1d5db;
          border-radius: 1px;
          transition: background-color 0.3s ease;
        }

        .custom-gutter:hover::before {
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
