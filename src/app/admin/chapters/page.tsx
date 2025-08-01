'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Edit3, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import Spinner from '@/components/Spinner';
import toast from 'react-hot-toast';

interface Section {
  heading: string;
  content: string;
}

interface Chapter {
  _id: string;
  title: string;
  description: string;
  sections: Section[];
}

export default function AdminChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    sections: [{ heading: '', content: '' }],
  });
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user || session.user.role !== 'admin') {
      toast.error("ACCESS DENIED - UNAUTHORIZED");
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

  if (!session?.user || session.user.role !== 'admin') {
    return null;
  }

  async function fetchChapters() {
    const res = await fetch('/api/chapters');
    const data = await res.json();
    setChapters(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/chapters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', description: '', sections: [{ heading: '', content: '' }] });
    fetchChapters();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/chapters/${id}`, { method: 'DELETE' });
    fetchChapters();
  }

  return (
    <div className="max-w-5xl p-4 mx-auto sm:p-6 animate-fadeIn">
      <h1 className="flex items-center gap-2 mb-6 text-3xl font-extrabold text-primary dark:text-darkPrimary">
        <BookOpen className="w-7 h-7" /> Manage Chapters
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 mb-10 space-y-4 shadow-md bg-surface dark:bg-surfaceDark rounded-xl">
        <input
          className="w-full p-3 border rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Chapter Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="w-full p-3 border rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Short Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {form.sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <input
              className="w-full p-3 border rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={`Section ${index + 1} Heading`}
              value={section.heading}
              onChange={(e) => {
                const updated = [...form.sections];
                updated[index].heading = e.target.value;
                setForm({ ...form, sections: updated });
              }}
            />
            <textarea
              className="w-full p-3 border rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={4}
              placeholder="Section Content (Markdown supported)"
              value={section.content}
              onChange={(e) => {
                const updated = [...form.sections];
                updated[index].content = e.target.value;
                setForm({ ...form, sections: updated });
              }}
            />
          </div>
        ))}

        {/* Section Controls */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                sections: [...form.sections, { heading: '', content: '' }],
              })
            }
            className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            + Add Section
          </button>
          {form.sections.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  sections: form.sections.slice(0, -1),
                })
              }
              className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
            >
              – Remove Section
            </button>
          )}
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition rounded bg-primary dark:bg-darkPrimary hover:opacity-90"
        >
          <Plus className="w-5 h-5" /> Add Chapter
        </button>
      </form>

      {/* Chapters Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((c) => (
          <div
            key={c._id}
            className="p-5 transition-all duration-200 border shadow-sm bg-surface dark:bg-surfaceDark rounded-xl border-border dark:border-borderDark hover:shadow-md"
          >
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary dark:text-darkPrimary">{c.title}</h2>
                <p className="mt-1 text-sm text-text/70 dark:text-textDark/70">{c.description}</p>
              </div>
              <div className="flex items-center justify-end gap-4 mt-4 text-sm">
                <Link
                  href={`/admin/chapters/${c._id}`}
                  className="flex items-center gap-1 text-yellow-600 hover:underline"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="flex items-center gap-1 text-red-600 hover:underline"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
