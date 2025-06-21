'use client';

import React, { useState } from 'react';
import IDE from './IDE';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  title: string;
  chapter: number;
  language: string;
  description: Record<string, string>;
  code: Record<string, string>;
}

export default function ProgramViewer({
  title,
  chapter,
  language: initialLang,
  description,
  code,
}: Props) {
  const [lang, setLang] = useState(initialLang);
  const [codeMap, setCodeMap] = useState(code);

  const handleCodeChange = (newCode: string) => {
    setCodeMap(prev => ({ ...prev, [lang]: newCode }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-1">{title}</h1>
        <p className="text-zinc-500">
          Chapter {chapter} · Language: {lang}
        </p>
        <div className="space-x-2 mt-2">
          {['python', 'cpp', 'c'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded text-sm ${
                l === lang ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm overflow-auto prose dark:prose-invert max-h-[500px]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description[lang] || 'No description'}
          </ReactMarkdown>
        </div>

        <IDE
          language={lang}
          code={codeMap[lang] || ''}
          setCode={handleCodeChange}
          output=""
          loading={false}
          onRun={() => {}}
        />
      </div>
    </div>
  );
}
