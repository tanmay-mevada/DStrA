'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Snippet {
  _id: string;
  title: string;
  language: string;
  code: string;
  chapterId?: {
    title: string;
  };
}

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) router.push('/auth/login');
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/snippets')
        .then((res) => res.json())
        .then(setSnippets)
        .catch((err) => console.error('Failed to load snippets:', err));
    }
  }, [session]);

  if (status === 'loading' || !session?.user) {
    return <p className="p-6 text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        📄 All Code Snippets
      </h1>

      {snippets.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No snippets found.</p>
      )}

      <div className="space-y-6">
        {snippets.map((s) => (
          <div
            key={s._id}
            className="p-5 bg-white border rounded-lg shadow dark:bg-slate-800 border-slate-300 dark:border-slate-700"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {s.title}
            </h2>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              Language: {s.language} | Chapter: {s.chapterId?.title || 'N/A'}
            </p>

            <article className="rounded p-3 overflow-auto whitespace-pre-wrap font-mono bg-gray-100 text-gray-800 dark:bg-[#0d1117] dark:text-gray-100">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {'```' + s.language + '\n' + s.code + '\n```'}
              </ReactMarkdown>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
