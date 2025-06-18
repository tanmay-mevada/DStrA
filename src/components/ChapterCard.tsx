'use client';

import Link from 'next/link';

interface Props {
  id: string;
  title: string;
  description?: string;
}

export default function ChapterCard({ id, title, description }: Props) {
  return (
    <Link
      href={`/chapters/${id}`}
      className="group p-5 rounded-lg shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200 block min-h-[120px]
        bg-surface dark:bg-surfaceDark border border-border dark:border-borderDark"
    >
      <div
        role="heading"
        className="text-xl font-semibold text-text dark:text-textDark group-hover:text-primary dark:group-hover:text-darkPrimary"
      >
        {title}
      </div>
      <p className="mt-1 text-sm leading-snug text-text dark:text-textDark/70 line-clamp-3">
        {description || 'No description available.'}
      </p>
    </Link>
  );
}
