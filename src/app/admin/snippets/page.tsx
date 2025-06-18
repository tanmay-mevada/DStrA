'use client';

import { useEffect, useState } from 'react';
import { Code2, Trash2 } from 'lucide-react';

interface Chapter {
  _id: string;
  title: string;
}
interface Snippet {
  _id: string;
  title: string;
  language: string;
  code: string;
  chapterId: Chapter;
}

export default function AdminSnippets() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [form, setForm] = useState({
    title: '',
    language: '',
    code: '',
    chapterId: '',
  });

  useEffect(() => {
    fetch('/api/snippets').then((res) => res.json()).then(setSnippets);
    fetch('/api/chapters').then((res) => res.json()).then(setChapters);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/snippets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', language: '', code: '', chapterId: '' });
    const updated = await fetch('/api/snippets').then(res => res.json());
    setSnippets(updated);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/snippets/${id}`, { method: 'DELETE' });
    const updated = await fetch('/api/snippets').then(res => res.json());
    setSnippets(updated);
  }

  return (
    <div className="max-w-6xl p-4 mx-auto sm:p-6 animate-fadeIn">
      <h1 className="flex items-center gap-2 mb-6 text-3xl font-extrabold text-primary dark:text-darkPrimary">
        <Code2 className="w-7 h-7" /> Manage Snippets
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 mb-10 space-y-4 shadow-md bg-surface dark:bg-surfaceDark rounded-xl">
        <input
          className="w-full p-3 rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark placeholder:text-gray-500 dark:placeholder:text-gray-400"
          placeholder="Snippet Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="w-full p-3 rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark placeholder:text-gray-500 dark:placeholder:text-gray-400"
          placeholder="Language (C, Python, etc.)"
          value={form.language}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
          required
        />
        <select
          className="w-full p-3 rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark"
          value={form.chapterId}
          onChange={(e) => setForm({ ...form, chapterId: e.target.value })}
          required
        >
          <option value="">Select Chapter</option>
          {chapters.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
        <textarea
          className="w-full p-3 font-mono text-green-500 rounded bg-background dark:bg-backgroundDark"
          rows={5}
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white transition rounded bg-primary dark:bg-darkPrimary hover:opacity-90"
        >
          Add Snippet
        </button>
      </form>

      {/* Snippet List */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {snippets.map((s) => (
          <div key={s._id} className="p-5 border shadow bg-surface dark:bg-surfaceDark rounded-xl border-border dark:border-borderDark">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full">
                <h2 className="text-xl font-semibold text-text dark:text-textDark">{s.title}</h2>
                <p className="text-sm text-text/60 dark:text-textDark/60">
                  Language: <span className="font-medium">{s.language}</span> | Chapter: <span className="font-medium">{s.chapterId?.title}</span>
                </p>
                <pre className="p-3 mt-3 overflow-auto font-mono text-sm text-green-400 whitespace-pre-wrap bg-black rounded">
                  {s.code}
                </pre>
              </div>
              <button
                onClick={() => handleDelete(s._id)}
                className="flex items-center gap-1 text-sm text-red-500 hover:underline"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
