'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChapterCard from '@/components/ChapterCard';
import Spinner from '@/components/Spinner';
import toast from 'react-hot-toast';
import { trackUserActivity } from '@/lib/trackUserActivity';

interface Chapter {
  _id: string;
  title: string;
  description: string;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
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
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background dark:bg-backgroundDark">
      <main className="w-full max-w-4xl px-4 py-10 mx-auto sm:px-6 sm:py-12 animate-fadeIn">
        <h1 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl font-michroma text-primary dark:text-darkPrimary">
          All DSA Chapters
        </h1>

        {isLoadingChapters ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : chapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border shadow bg-surface/70 dark:bg-surfaceDark/70 rounded-xl border-borderL dark:border-borderDark">
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