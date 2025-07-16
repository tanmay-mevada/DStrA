'use client';

import React, { useState, useEffect } from 'react';
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
import { LinkIcon, Youtube } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);
  const availableLangs = Object.keys(code).length ? Object.keys(code) : ['python'];
  const [lang, setLang] = useState(() =>
    availableLangs.includes(language) ? language : availableLangs[0]
  );
  const [codeMap, setCodeMap] = useState(code);
  const [inputContent, setInputContent] = useState('');
  const [terminalContent, setTerminalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setMounted(true), []);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const MarkdownRenderer = ({ content }: { content: string }) => (
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
              <LinkIcon size={16} className="text-indigo-600 dark:text-lime-400" />
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
          table: ({ node, ...props }) => {
            const isSmallTable =
              Array.isArray(node?.children) &&
              node.children.length <= 3 &&
              node.children[0] &&
              'children' in node.children[0] &&
              Array.isArray((node.children[0] as any).children) &&
              (node.children[0] as any).children.length <= 6;

            return (
              <div className="my-4 overflow-x-auto">
                <table
                  className={
                    isSmallTable
                      ? 'w-fit text-sm border border-[1px] border-gray-300 dark:border-zinc-700 rounded'
                      : 'w-full max-w-3xl border border-[1px] border-gray-300 dark:border-zinc-700 table-auto'
                  }
                  {...props}
                />
              </div>
            );
          },
          thead: (props) => (
            <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100" {...props} />
          ),
          tbody: (props) => <tbody {...props} />,
          th: (props) => (
            <th className="px-4 py-2 font-semibold text-left border border-[1px] border-zinc-300 dark:border-zinc-700" {...props} />
          ),
          td: (props) => (
            <td className="px-4 py-2 border border-[1px] text-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700" {...props} />
          ),
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
          img: (props) => (
            <img className="my-4 rounded-lg border-zinc-300 dark:border-zinc-700 max-w-full h-auto" {...props} />
          ),
          blockquote: (props) => (
            <blockquote className="pl-4 my-4 italic border-l-4 border-blue-300 dark:border-cyan-700 bg-blue-50/40 dark:bg-cyan-900/20 rounded-r-lg" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );

  if (!mounted) return null;

  // Mobile layout - stacked vertically
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
        <div className="p-4 space-y-4">
          {/* Header Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <h1 className="text-xl sm:text-2xl font-extrabold mb-2 text-blue-700 dark:text-cyan-300 tracking-tight">
              {title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-3">
              <span className="font-semibold">Chapter {chapter}</span> · <span className="font-semibold">Language:</span> {lang.toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-2">
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

  // Desktop/Tablet layout - split panes with fixed constraints
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="p-4 lg:p-6 h-screen">
        <Split
          className="flex h-full"
          sizes={[38, 62]}
          minSize={[300, 400]}
          maxSize={[600, Infinity]}
          gutterSize={8}
          gutterAlign="center"
          gutter={() => {
            const gutter = document.createElement('div');
            gutter.className = 'custom-gutter';
            return gutter;
          }}
        >
          {/* Left Panel - Description */}
          <div className="bg-white mr-3 dark:bg-zinc-900 rounded-2xl p-4 lg:p-6 shadow-lg overflow-auto flex flex-col space-y-4 lg:space-y-6 border border-zinc-200 dark:border-zinc-800 min-w-0">
            <div className="flex-shrink-0">
              <h1 className="text-2xl lg:text-3xl font-extrabold mb-2 text-blue-700 dark:text-cyan-300 tracking-tight">
                {title}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm lg:text-base mb-2">
                <span className="font-semibold">Chapter {chapter}</span> · <span className="font-semibold">Language:</span> {lang.toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
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

            <div className="flex-1 min-h-0">
              <MarkdownRenderer content={description?.[lang] ?? 'No description available.'} />
            </div>
          </div>

          {/* Right Panel - IDE */}
          <div className="min-w-0 flex-1">
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