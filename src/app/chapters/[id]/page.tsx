'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Chapter {
  _id: string;
  title: string;
  content: string;
  description: string;
}

export default function ChapterDetail() {
  const { id } = useParams();
  const [chapter, setChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/chapters/${id}`)
      .then(res => res.json())
      .then(setChapter);
  }, [id]);

  if (!chapter) return <div className="p-6 text-gray-400">Loading chapter...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#38bdf8] mb-3">{chapter.title}</h1>
      <p className="text-gray-400 mb-6">{chapter.description}</p>
      <article className="prose prose-invert max-w-none text-gray-100 whitespace-pre-line">
        {chapter.content}
      </article>
    </div>
  );
}
