'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ChapterCardProps {
  id: string;
  title: string;
  description: string;
  chapterNumber: number;
}

export default function ChapterCard({
  id,
  title,
  description,
  chapterNumber,
}: ChapterCardProps) {
  return (
    <div className="relative flex flex-col sm:flex-row border rounded-xl overflow-hidden shadow bg-surface dark:bg-surfaceDark border-borderL dark:border-borderDark hover:shadow-lg transition backdrop-blur-md h-auto sm:h-56">

      {/* Chapter Number Section */}
      <div className="w-full sm:w-24 md:w-32 flex items-center justify-center bg-background dark:bg-backgroundDark border-b sm:border-b-0 sm:border-r border-borderL dark:border-borderDark">
        <span className="text-[5rem] sm:text-[7rem] md:text-[8rem] font-extrabold text-darkPrimary dark:text-darkPrimary opacity-70 dark:opacity-30 leading-none select-none">
          {chapterNumber}
        </span>
      </div>

      {/* Title & Description */}
      <div className="flex-1 p-4 flex flex-col justify-center gap-2 z-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-text dark:text-textDark truncate">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-text dark:text-textDark/70 line-clamp-5">
          {description}
        </p>
      </div>

      {/* Open Button */}
      <Link
        href={`/chapters/${id}`}
        className="w-full sm:w-16 md:w-20 bg-primary/10 dark:bg-darkPrimary/10 text-primary dark:text-darkPrimary hover:bg-primary/20 dark:hover:bg-darkPrimary/20 flex items-center justify-center gap-1 py-2 sm:py-0 sm:border-l border-t sm:border-t-0 border-borderL dark:border-borderDark text-sm sm:text-base font-semibold transition z-10"
        aria-label={`Open chapter ${title}`}
      >
        <span className="hidden sm:inline">Open</span>
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
