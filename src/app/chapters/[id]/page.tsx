'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

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

  if (!chapter) return <div className="p-6 text-textDark">Loading chapter...</div>;

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="flex mb-3 text-4xl font-bold underline border border-white border-lg text-text dark:text-textDark">{chapter.title}</h1>
      <p className="mb-6 text-text/70 dark:text-textDark/70">{chapter.description}</p>

      {chapter.sections.map((section, index) => (
        <div key={index} className="mb-10">
          <h2 className="mb-2 text-4xl font-semibold underline text-text dark:text-textDark">{section.heading}</h2>
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
                    <div className="flex justify-center my-4">
                      <table
                        className={
                          isSmallTable
                            ? 'w-fit text-sm border border-[1px] border-[#000000l] dark:border-borderDark rounded'
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
                code: ({ node, ...props }) => (
                  <code
                    className="px-2 py-1 rounded bg-[#f0f0f0] text-purple-600 dark:bg-backgroundDark dark:text-green-400"
                    {...props}
                  />
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    className="p-3 mb-4 overflow-auto rounded bg-[#f0f0f0] text-text dark:bg-backgroundDark dark:text-textDark"
                    {...props}
                  />
                ),
                img: ({ node, ...props }) => (
                  <img className="my-4 border rounded-lg border-borderL dark:border-borderDark" {...props} />
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