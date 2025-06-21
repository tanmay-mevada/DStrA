'use client';

import Link from 'next/link';

type Program = {
  _id: string;
  title: string;
  chapterNumber: number;
  language: string;
};

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <Link href={`/programs/${program._id}`}>
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md hover:shadow-lg transition">
        <h2 className="text-xl font-semibold">{program.title}</h2>
        <p className="text-sm text-zinc-500">
          Chapter {program.chapterNumber} · {program.language.toUpperCase()}
        </p>
      </div>
    </Link>
  );
}
