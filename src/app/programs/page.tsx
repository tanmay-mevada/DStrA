// src/app/programs/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Program {
  _id: string;
  title: string;
  chapterNumber: number;
  c?: { code: string; description: string };
  cpp?: { code: string; description: string };
  python?: { code: string; description: string };
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch('/api/programs');
        const data = await res.json();
        setPrograms(data);
      } catch (err) {
        console.error('Failed to fetch programs:', err);
      }
    };
    fetchPrograms();
  }, []);

  function getDescription(p: Program): string {
    return (
      p.c?.description ||
      p.cpp?.description ||
      p.python?.description ||
      'No description available'
    ).slice(0, 80);
  }

  return (
    <div className="max-w-5xl p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Programs</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((p) => (
          <Link key={p._id} href={`/programs/${p._id}`}>
            <div className="border rounded p-4 hover:shadow cursor-pointer">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600">{getDescription(p)}...</p>
              <p className="text-xs text-blue-500 mt-2">Chapter {p.chapterNumber}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
