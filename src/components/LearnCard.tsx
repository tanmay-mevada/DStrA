'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface LearnCardProps {
  id: string;
  title: string;
  description: string;
  moduleNumber: number;
}

export default function LearnCard({ id, title, description, moduleNumber }: LearnCardProps) {
  return (
    <div className="relative flex border rounded-2xl overflow-hidden shadow bg-gradient-to-br from-surface/80 via-white/60 to-primary/10 dark:from-surfaceDark/80 dark:via-black/40 dark:to-darkPrimary/10 border-borderL dark:border-borderDark hover:scale-[1.015] hover:shadow-xl transition h-56 md:h-60 backdrop-blur-sm group">
      {/* Left Large Module Number */}
      <div className="w-24 md:w-32 flex items-center justify-center bg-primary/10 dark:bg-darkPrimary/10 border-r border-borderL dark:border-borderDark">
        <span className="text-6xl md:text-[5.5rem] font-extrabold text-primary dark:text-darkPrimary opacity-60 leading-none select-none">
          {moduleNumber}
        </span>
      </div>

      {/* Right Content with soft bg */}
      <div className="flex-1 p-4 flex flex-col justify-center z-10">
        <div className="rounded-lg bg-white/60 dark:bg-black/20 px-4 py-3">
          <h2 className="text-xl md:text-2xl font-semibold text-text dark:text-textDark truncate mb-1">
            {title}
          </h2>
          <p className="text-sm text-text/80 dark:text-textDark/70 line-clamp-5">
            {description}
          </p>
        </div>
      </div>

      {/* Open Link */}
      <Link
        href={`/learn/${id}`}
        className="w-20 md:w-28 bg-primary/10 dark:bg-darkPrimary/10 text-primary dark:text-darkPrimary hover:bg-primary/20 dark:hover:bg-darkPrimary/20 flex items-center justify-center text-sm font-semibold transition z-10 gap-1"
      >
        Explore <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </div>
  );
}
