'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChapterCard from '@/components/ChapterCard';
import Spinner from '@/components/Spinner';

interface Chapter {
  _id: string;
  title: string;
  description: string;
}

export default function ChaptersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      router.push('/auth/login');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user) {
      setIsLoadingChapters(true);
      fetch('/api/chapters')
        .then((res) => res.json())
        .then((data) => {
          setChapters(data);
          setIsLoadingChapters(false);
        })
        .catch((error) => {
          console.error('Failed to fetch chapters:', error);
          setIsLoadingChapters(false);
        });
    }
  }, [session]);

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-backgroundDark">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-background dark:bg-backgroundDark overflow-x-hidden">
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 animate-fadeIn">
        <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl font-michroma text-primary dark:text-darkPrimary mb-8 tracking-tight">
          All DSA Chapters
        </h1>

        {isLoadingChapters ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : chapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-surface/70 dark:bg-surfaceDark/70 rounded-xl shadow border border-borderL dark:border-borderDark">
            <p className="text-lg text-text dark:text-textDark/80">No chapters found.</p>
          </div>
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
      </main>
    </div>
  );
}