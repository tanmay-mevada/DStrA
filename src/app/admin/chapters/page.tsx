'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Edit3, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    fetchChapters();
  }, []);

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

      <form onSubmit={handleSubmit} className="p-6 mb-10 space-y-4 shadow-md bg-surface dark:bg-surfaceDark rounded-xl">
        <input
          className="w-full p-3 rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark"
          placeholder="Chapter Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="w-full p-3 rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark"
          placeholder="Short Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {form.sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <input
              className="w-full p-3 rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark"
              placeholder={`Section ${index + 1} Heading`}
              value={section.heading}
              onChange={(e) => {
                const updated = [...form.sections];
                updated[index].heading = e.target.value;
                setForm({ ...form, sections: updated });
              }}
            />
            <textarea
              className="w-full p-3 rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark"
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

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                sections: [...form.sections, { heading: '', content: '' }],
              })
            }
            className="px-3 py-1 mt-2 text-sm text-white bg-green-600 rounded"
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
              className="px-3 py-1 mt-2 text-sm text-white bg-red-500 rounded"
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

      {/* Chapters List */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {chapters.map((c) => (
          <div
            key={c._id}
            className="p-5 transition border shadow bg-surface dark:bg-surfaceDark rounded-xl border-border dark:border-borderDark hover:shadow-lg"
          >
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-primary dark:text-darkPrimary">{c.title}</h2>
                <p className="text-sm text-text/70 dark:text-textDark/70">{c.description}</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/admin/chapters/${c._id}`}
                  className="flex items-center gap-1 text-sm text-yellow-500 hover:underline"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:underline"
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