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
    <div className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-cyan-300 mb-2 text-center">
        {isEdit ? 'Edit Program' : 'Create New Program'}
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Program Title"
          className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-600 text-lg font-semibold text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition"
        />
        <input
          type="number"
          name="chapterNumber"
          value={form.chapterNumber}
          onChange={handleChange}
          placeholder="Chapter Number"
          className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-600 text-lg font-semibold text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition"
        />
        <input
          type="text"
          name="language"
          value={form.language}
          onChange={handleChange}
          placeholder="Language (e.g. js, cpp)"
          className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-600 text-lg font-semibold text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Markdown description"
          rows={4}
          className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-600 text-base text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition"
        />
        <textarea
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Initial code"
          rows={6}
          className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-600 font-mono text-base text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition"
        />
      </div>
      <button
        onClick={onSubmit}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-cyan-700 dark:to-blue-700 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-md hover:from-blue-600 hover:to-cyan-600 dark:hover:from-cyan-800 dark:hover:to-blue-800 transition"
      >
        {isEdit ? 'Update' : 'Create'} Program
      </button>
    </div>
  );
}
