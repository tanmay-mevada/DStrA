'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Program {
  _id: string;
  title: string;
  chapterNumber: number;
  language: string;
  description: {
    python?: string;
    c?: string;
    cpp?: string;
  };
  code: {
    python?: string;
    c?: string;
    cpp?: string;
  };
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [form, setForm] = useState({
    title: '',
    chapterNumber: '',
    pythonCode: '',
    cppCode: '',
    cCode: '',
    pythonDesc: '',
    cppDesc: '',
    cDesc: '',
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
      code: {
        python: form.pythonCode,
        cpp: form.cppCode,
        c: form.cCode,
      },
      description: {
        python: form.pythonDesc,
        cpp: form.cppDesc,
        c: form.cDesc,
      },
      language: 'python', // default
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
        title: '', chapterNumber: '', pythonCode: '', cppCode: '', cCode: '', pythonDesc: '', cppDesc: '', cDesc: '',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Delete this program?');
    if (!confirmed) return;

    await fetch(`/api/programs/${id}`, { method: 'DELETE' });
    setPrograms(programs.filter(p => p._id !== id));
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Admin - Programs</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-zinc-800 p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Chapter Number"
            type="number"
            value={form.chapterNumber}
            onChange={e => setForm({ ...form, chapterNumber: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* Description Fields */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            placeholder="Python description"
            value={form.pythonDesc}
            onChange={e => setForm({ ...form, pythonDesc: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <textarea
            placeholder="C++ description"
            value={form.cppDesc}
            onChange={e => setForm({ ...form, cppDesc: e.target.value })}
            className="border p-2 rounded w-full mt-2"
          />
          <textarea
            placeholder="C description"
            value={form.cDesc}
            onChange={e => setForm({ ...form, cDesc: e.target.value })}
            className="border p-2 rounded w-full mt-2"
          />
        </div>

        {/* Code Fields */}
        <div>
          <label className="block font-medium">Code</label>
          <textarea
            placeholder="Python code"
            value={form.pythonCode}
            onChange={e => setForm({ ...form, pythonCode: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <textarea
            placeholder="C++ code"
            value={form.cppCode}
            onChange={e => setForm({ ...form, cppCode: e.target.value })}
            className="border p-2 rounded w-full mt-2"
          />
          <textarea
            placeholder="C code"
            value={form.cCode}
            onChange={e => setForm({ ...form, cCode: e.target.value })}
            className="border p-2 rounded w-full mt-2"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Program
        </button>
      </form>

      <div className="space-y-4">
        {programs.map((p) => (
          <div key={p._id} className="p-4 border rounded shadow flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">Chapter {p.chapterNumber}</p>
            </div>
            <div className="space-x-2">
              <Link href={`/admin/programs/${p._id}`} className="text-blue-600">Edit</Link>
              <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}