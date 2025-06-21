'use client';

import { useState } from 'react';

type ProgramForm = {
  title: string;
  chapterNumber: number;
  language: string;
  code: string;
  description: string;
};

type Props = {
  form: ProgramForm;
  setForm: (val: ProgramForm) => void;
  onSubmit: () => void;
  isEdit?: boolean;
};

export default function ProgramEditor({ form, setForm, onSubmit, isEdit }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'chapterNumber' ? +value : value });
  };

  return (
    <div className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md">
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Program Title"
        className="w-full p-2 rounded border border-zinc-300 dark:border-zinc-700"
      />
      <input
        type="number"
        name="chapterNumber"
        value={form.chapterNumber}
        onChange={handleChange}
        placeholder="Chapter Number"
        className="w-full p-2 rounded border border-zinc-300 dark:border-zinc-700"
      />
      <input
        type="text"
        name="language"
        value={form.language}
        onChange={handleChange}
        placeholder="Language (e.g. js, cpp)"
        className="w-full p-2 rounded border border-zinc-300 dark:border-zinc-700"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Markdown description"
        rows={5}
        className="w-full p-2 rounded border border-zinc-300 dark:border-zinc-700"
      />
      <textarea
        name="code"
        value={form.code}
        onChange={handleChange}
        placeholder="Initial code"
        rows={5}
        className="w-full p-2 rounded border border-zinc-300 dark:border-zinc-700 font-mono"
      />
      <button
        onClick={onSubmit}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {isEdit ? 'Update' : 'Create'} Program
      </button>
    </div>
  );
}
