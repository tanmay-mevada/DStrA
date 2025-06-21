'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github as lightStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vscDarkPlus as darkStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/chapters/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(setChapter)
      .catch((err) => {
        console.error('Failed to fetch chapter:', err);
      });
  }, [id]);

  if (!chapter || !mounted) return <div className="p-6 text-textDark">Loading chapter...</div>;

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="text-center text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 drop-shadow-lg mb-8">
        {chapter.title}
      </h1>

      <br />
      {chapter.sections.map((section, index) => (
        <div key={index} className="mb-10">
          <h2 className="mb-2 text-4xl font-semibold underline text-text dark:text-textDark">
            {section.heading}
          </h2>
          <article className="prose max-w-none text-text dark:text-textDark dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="mb-4 text-3xl font-bold underline text-text dark:text-textDark" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="mb-3 text-2xl font-semibold underline text-text dark:text-textDark" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="mb-2 text-xl font-medium underline text-text dark:text-textDark" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="mb-1 text-lg font-medium underline text-text dark:text-textDark" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed text-text dark:text-textDark" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="mb-4 space-y-1 list-disc list-inside text-text dark:text-textDark" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="mb-4 space-y-1 list-decimal list-inside text-text dark:text-textDark" {...props} />
                ),
                li: ({ node, ...props }) => <li {...props} />,
                table: ({ node, ...props }) => {
                  const isSmallTable =
                    node?.children?.length &&
                    node.children.length <= 3 &&
                    node.children[0]?.children?.length &&
                    node.children[0].children.length <= 6;

                  return (
                    <div className="my-4">
                      <table
                        className={
                          isSmallTable
                            ? 'w-fit text-sm border border-[1px] border-[#0000001a] dark:border-borderDark rounded'
                            : 'w-full max-w-3xl border border-[1px] border-borderL dark:border-borderDark table-auto'
                        }
                        {...props}
                      />
                    </div>
                  );
                },
                thead: ({ node, ...props }) => (
                  <thead className="bg-surface dark:bg-surfaceDark text-text dark:text-textDark" {...props} />
                ),
                tbody: ({ node, ...props }) => <tbody {...props} />,
                th: ({ node, ...props }) => (
                  <th className="px-4 py-2 font-semibold text-left border border-[1px] border-borderL dark:border-borderDark" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-4 py-2 border border-[1px] text-text dark:text-textDark border-borderL dark:border-borderDark" {...props} />
                ),
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  if (inline || !match) {
                    return (
                      <code
                        className="px-2 py-1 rounded bg-[#f0f0f0] text-purple-600 dark:bg-backgroundDark dark:text-green-400"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <SyntaxHighlighter
                      language={match[1]}
                      style={theme === 'dark' ? darkStyle : lightStyle}
                      customStyle={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        marginBottom: '1rem',
                      }}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                },
                img: ({ node, ...props }) => (
                  <img className="my-4 rounded-lg border-borderL dark:border-borderDark" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="pl-4 my-4 italic border-l-4 text-text dark:text-textDark border-primary dark:border-darkPrimary" {...props} />
                ),
              }}
            >
              {section.content}
            </ReactMarkdown>
          </article>
        </div>
      ))}
    </div>
  );
}
