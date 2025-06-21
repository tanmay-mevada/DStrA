'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChapterCard from '@/components/ChapterCard';

interface Chapter {
  _id: string;
  title: string;
  description: string;
}

export default function ChaptersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      router.push('/auth/login');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/chapters')
        .then((res) => res.json())
        .then(setChapters)
        .catch(console.error);
    }
  }, [session]);

  if (status === 'loading' || !session?.user) {
    return <p className="p-6 text-zinc-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
        All DSA Chapters
      </h1>

      {chapters.length === 0 ? (
        <p className="text-zinc-500">No chapters found.</p>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <ChapterCard
              key={chapter._id}
              id={chapter._id}
              title={chapter.title}
              description={chapter.description}
              chapterNumber={index + 1}
            />
          ))}

        </div>
      )}
    </div>
  );
}
