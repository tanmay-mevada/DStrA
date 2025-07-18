'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LibraryItem {
  _id: string;
  title: string;
  chapterNumber: number;
  algorithm: string;
  codes: {
    c?: string;
    cpp?: string;
    python?: string;
  };
}

export default function AdminLibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [form, setForm] = useState({
    title: '',
    chapterNumber: '',
    algorithm: '',
    c: '',
    cpp: '',
    python: '',
  });

  useEffect(() => {
    fetch('/api/library')
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        chapterNumber: Number(form.chapterNumber),
        algorithm: form.algorithm,
        codes: {
          c: form.c,
          cpp: form.cpp,
          python: form.python,
        },
      }),
    });

    const newItem = await res.json();
    setItems([newItem, ...items]);
    setForm({ title: '', chapterNumber: '', algorithm:'', c: '', cpp: '', python: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this library item?')) return;
    await fetch(`/api/library/${id}`, { method: 'DELETE' });
    setItems(items.filter((item) => item._id !== id));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary dark:text-darkPrimary">Admin - Library</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-surface dark:bg-surfaceDark p-6 rounded-xl shadow space-y-4"
      >
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 rounded border border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
        <input
          type="number"
          placeholder="Chapter Number"
          value={form.chapterNumber}
          onChange={(e) => setForm({ ...form, chapterNumber: e.target.value })}
          className="w-full p-3 rounded border border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
        <textarea
          placeholder="Algorithm"
          value={form.algorithm}
          onChange={(e) => setForm({ ...form, algorithm: e.target.value })}
          className="w-full p-3 rounded border border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <textarea
          placeholder="C code"
          value={form.c}
          onChange={(e) => setForm({ ...form, c: e.target.value })}
          className="w-full p-3 rounded border border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <textarea
          placeholder="C++ code"
          value={form.cpp}
          onChange={(e) => setForm({ ...form, cpp: e.target.value })}
          className="w-full p-3 rounded border border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <textarea
          placeholder="Python code"
          value={form.python}
          onChange={(e) => setForm({ ...form, python: e.target.value })}
          className="w-full p-3 rounded border border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow transition"
        >
          Add to Library
        </button>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="p-4 rounded-xl shadow bg-surface dark:bg-surfaceDark border border-border dark:border-borderDark flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4"
          >
            <div>
              <h3 className="font-semibold text-lg text-text dark:text-textDark">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chapter {item.chapterNumber}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/library/${item._id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-500 hover:underline text-sm"
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
