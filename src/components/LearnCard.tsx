'use client';

import Link from 'next/link';

interface LearnCardProps {
  id: string;
  title: string;
  description: string;
  moduleNumber: number;
}

export default function LearnCard({ id, title, description, moduleNumber }: LearnCardProps) {
  return (
    <div className="relative flex border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:shadow-md transition h-60">

      {/* Left Large Module Number */}
      <div className="w-32 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700">
        <span className="text-[12rem] font-extrabold text-black dark:text-black opacity-60 leading-none select-none">
          {moduleNumber}
        </span>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-4 flex flex-col justify-center z-10">
        <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 truncate">
          {title}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-7">
          {description}
        </p>
      </div>

      {/* Open Link */}
      <Link
        href={`/learn/${id}`}
        className="w-28 sm:w-32 bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-800 flex items-center justify-center text-sm font-medium transition z-10"
      >
        Explore →
      </Link>
    </div>
  );
}
