'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  if (!chapter) return <div className="p-6 text-gray-400">Loading chapter...</div>;

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="text-3xl font-bold text-[#38bdf8] mb-3">{chapter.title}</h1>
      <p className="mb-6 text-gray-400">{chapter.description}</p>

      {chapter.sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="mb-2 text-2xl font-semibold text-white">{section.heading}</h2>
          <article className="prose text-gray-100 prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
          </article>
        </div>
      ))}
    </div>
  );
}
