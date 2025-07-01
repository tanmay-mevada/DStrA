'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ChapterCardProps {
  id: string;
  title: string;
  description: string;
  chapterNumber: number;
}

export default function ChapterCard({ id, title, description, chapterNumber }: ChapterCardProps) {
  return (
    <div className="relative flex border rounded-xl overflow-hidden shadow bg-surface dark:bg-surfaceDark border-borderL dark:border-borderDark hover:shadow-lg transition h-56 sm:h-60 backdrop-blur-md">

      {/* Large Chapter Number on Left */}
      <div className="w-24 sm:w-32 flex items-center justify-center bg-background dark:bg-backgroundDark border-r border-borderL dark:border-borderDark">
        <span className="text-[7rem] sm:text-[8rem] font-extrabold text-darkPrimary dark:text-darkPrimary opacity-70 dark:opacity-30 leading-none select-none">
          {chapterNumber}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col justify-center z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-text dark:text-textDark truncate">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-text dark:text-textDark/70 mt-1 line-clamp-5">
          {description}
        </p>
      </div>

      {/* Right-side Open Button */}
      <Link
        href={`/chapters/${id}`}
        className="w-16 sm:w-20 bg-primary/10 dark:bg-darkPrimary/10 text-primary dark:text-darkPrimary hover:bg-primary/20 dark:hover:bg-darkPrimary/20 flex items-center justify-center text-base font-semibold transition z-10 gap-1 rounded-none border-l border-borderL dark:border-borderDark"
        aria-label={`Open chapter ${title}`}
      >
        <span className="hidden sm:inline">Open</span>
        <ArrowRight className="w-5 h-5" />
      </Link>

    </div>
  );
}