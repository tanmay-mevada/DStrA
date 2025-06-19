'use client';

import Link from 'next/link';

interface ChapterCardProps {
  id: string;
  title: string;
  description: string;
  sections?: { heading: string; content: string }[];
}

export default function ChapterCard({ id, title, description, sections }: ChapterCardProps) {
  const firstSection = sections?.[0];

  return (
    <div className="p-4 border rounded shadow bg-surface dark:bg-surfaceDark border-border dark:border-borderDark">
      <h2 className="text-xl font-bold text-primary dark:text-darkPrimary">{title}</h2>
      <p className="mb-2 text-sm text-text/70 dark:text-textDark/70">{description}</p>

      {firstSection && (
        <div className="text-sm text-text/60 dark:text-textDark/60 line-clamp-3">
          <strong>{firstSection.heading}:</strong>{' '}
          {firstSection.content.length > 120
            ? firstSection.content.slice(0, 120) + '...'
            : firstSection.content}
        </div>
      )}

      <Link
        href={`/chapters/${id}`}
        className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        Read More →
      </Link>
    </div>
  );
}
