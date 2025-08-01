'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { trackUserActivity } from '@/lib/trackUserActivity';
import Spinner from '@/components/Spinner';
import { toast } from 'react-hot-toast';

interface Program {
  _id: string;
  title: string;
  chapterNumber: number;
  language: string;
  description: { python?: string; c?: string; cpp?: string };
  code: { python?: string; c?: string; cpp?: string };
}

const languages = ['python', 'cpp', 'c'] as const;

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [form, setForm] = useState({
    title: '',
    chapterNumber: '',
    code: { python: '', cpp: '', c: '' },
    description: { python: '', cpp: '', c: '' },
  });

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(setPrograms)
      .catch(err => console.error('Failed to fetch programs:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProgram = {
      title: form.title,
      chapterNumber: Number(form.chapterNumber),
      code: form.code,
      description: form.description,
      language: 'python',
    };

    const res = await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProgram),
    });

    if (res.ok) {
      const saved = await res.json();
      setPrograms([saved, ...programs]);
      setForm({
        title: '',
        chapterNumber: '',
        code: { python: '', cpp: '', c: '' },
        description: { python: '', cpp: '', c: '' },
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this program?')) return;

    await fetch(`/api/programs/${id}`, { method: 'DELETE' });
    setPrograms(programs.filter(p => p._id !== id));
  };

  const updateCode = (lang: string, value: string) => {
    setForm(prev => ({
      ...prev,
      code: { ...prev.code, [lang]: value },
    }));
  };

  const updateDesc = (lang: string, value: string) => {
    setForm(prev => ({
      ...prev,
      description: { ...prev.description, [lang]: value },
    }));
  };

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Auth check + activity tracking
  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user || session.user.role !== 'admin') {
      toast.error('ACCESS DENIED - UNAUTHORIZED');
      router.replace('/');
    } else {
      trackUserActivity(pathname);
    }
  }, [session, status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-backgroundDark">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="max-w-4xl p-6 mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Admin - Programs</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white shadow dark:bg-zinc-800 rounded-xl">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            placeholder="Chapter Number"
            type="number"
            value={form.chapterNumber}
            onChange={e => setForm({ ...form, chapterNumber: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Description Fields */}
        <div>
          <label className="block mb-2 font-medium">Descriptions</label>
          {languages.map((lang) => (
            <textarea
              key={lang}
              placeholder={`${lang.toUpperCase()} Description`}
              value={form.description[lang]}
              onChange={e => updateDesc(lang, e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
          ))}
        </div>

        {/* Code Fields */}
        <div>
          <label className="block mb-2 font-medium">Code</label>
          {languages.map((lang) => (
            <textarea
              key={lang}
              placeholder={`${lang.toUpperCase()} Code`}
              value={form.code[lang]}
              onChange={e => updateCode(lang, e.target.value)}
              className="w-full p-2 mb-2 font-mono border rounded"
            />
          ))}
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Program
        </button>
      </form>

      {/* Program List */}
      <div className="space-y-4">
        {programs.map((p) => (
          <div
            key={p._id}
            className="flex items-center justify-between p-4 bg-white border rounded shadow dark:bg-zinc-800"
          >
            <div>
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chapter {p.chapterNumber}
              </p>
            </div>
            <div className="space-x-2">
              <Link
                href={`/admin/programs/${p._id}`}
                className="text-blue-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
