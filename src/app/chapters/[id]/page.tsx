'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Spinner from '@/components/Spinner';
import { LinkIcon, Youtube } from 'lucide-react';
import { trackUserActivity } from '@/lib/trackUserActivity';
import toast from 'react-hot-toast';

interface Section {
  heading: string;
  content: string;
}

interface Chapter {
  _id: string;
  title: string;
  description: string;
  sections: Section[];
}

export default function ChapterDetail() {
  const { id } = useParams();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      toast('Please Login to continue');
      router.replace('/auth/login');
      return;
    }
    trackUserActivity(pathname);
  }, [session, status, router, pathname]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/chapters/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(setChapter)
      .catch((err) => {
        console.error('Failed to fetch chapter:', err);
      });
  }, [id]);

  if (!chapter)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-backgroundDark">
        <Spinner />
      </div>
    );

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen px-4 overflow-x-hidden bg-background dark:bg-backgroundDark sm:px-6 md:px-10">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-center text-transparent sm:text-5xl md:text-6xl bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 drop-shadow-lg sm:mb-12">
          {chapter.title}
        </h1>

        {chapter.sections.map((section, index) => (
          <div key={index} className="mb-12 sm:mb-14">
            <h2 className="pb-2 mb-3 text-2xl font-bold tracking-tight text-blue-700 border-b-2 border-blue-200 rounded-t sm:mb-4 sm:text-3xl md:text-4xl dark:text-cyan-300 dark:border-cyan-700 bg-gradient-to-r from-blue-100/60 via-white/60 to-blue-50/0 dark:from-cyan-900/30 dark:via-zinc-900/30 dark:to-cyan-900/0">
              {section.heading}
            </h2>

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
                      <LinkIcon size={16} className="text-indigo-600 dark:text-lime-400" />
                    );

                    return (
                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className={`inline-flex items-center gap-1 underline font-medium transition-colors ${isYouTube
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
                              ? 'w-fit text-sm border border-[1px] border-gray-300 dark:border-borderDark rounded'
                              : 'w-full max-w-3xl border border-[1px] border-gray-300 dark:border-borderDark table-auto'
                          }
                          {...props}
                        />
                      </div>
                    );
                  },
                  thead: (props) => (
                    <thead className="bg-surface dark:bg-surfaceDark text-text dark:text-textDark" {...props} />
                  ),
                  tbody: (props) => <tbody {...props} />,
                  th: (props) => (
                    <th className="px-4 py-2 font-semibold text-left border border-[1px] border-borderL dark:border-borderDark" {...props} />
                  ),
                  td: (props) => (
                    <td className="px-4 py-2 border border-[1px] text-text dark:text-textDark border-borderL dark:border-borderDark" {...props} />
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
                    <img className="h-auto max-w-full my-4 rounded-lg border-borderL dark:border-borderDark" {...props} />
                  ),
                  blockquote: (props) => (
                    <blockquote className="pl-4 my-4 italic border-l-4 border-blue-300 rounded-r-lg dark:border-cyan-700 bg-blue-50/40 dark:bg-cyan-900/20" {...props} />
                  ),
                }}
              >
                {section.content}
              </ReactMarkdown>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
