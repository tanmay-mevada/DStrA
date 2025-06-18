'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChapterCard from '@/components/ChapterCard';
import { BookOpen } from 'lucide-react';

interface Chapter {
  _id: string;
  title: string;
  description: string;
}

export default function ChaptersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [chapters, setChapters] = useState<Chapter[]>([]);

  // 🔐 Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/auth/login');
    }
  }, [status, session, router]);

  // 📦 Fetch chapters after session is confirmed
  useEffect(() => {
    if (session?.user) {
      fetch('/api/chapters')
        .then((res) => res.json())
        .then(setChapters)
        .catch((err) => console.error('Failed to load chapters:', err));
    }
  }, [session]);

  if (status === 'loading' || !session?.user) {
    return <p className="p-6 text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-7 h-7 text-text" />
        <h1 className="text-3xl font-bold text-text">All DSA Chapters</h1>
      </div>

      {chapters.length === 0 ? (
        <p className="text-gray-400">No chapters found. Please check back later.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter._id}
              id={chapter._id}
              title={chapter.title}
              description={chapter.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
