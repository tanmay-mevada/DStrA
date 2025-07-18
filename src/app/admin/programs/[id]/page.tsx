'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Lang = 'python' | 'cpp' | 'c';
const languages: Lang[] = ['python', 'cpp', 'c'];

export default function EditProgramPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [code, setCode] = useState<{ [key in Lang]: string }>({ python: '', cpp: '', c: '' });
  const [description, setDescription] = useState<{ [key in Lang]: string }>({ python: '', cpp: '', c: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await fetch(`/api/programs/${id}`);
        const data = await res.json();

        setTitle(data.title);
        setChapterNumber(data.chapterNumber);
        setCode({
          python: data.code?.python || '',
          cpp: data.code?.cpp || '',
          c: data.code?.c || '',
        });
        setDescription({
          python: data.description?.python || '',
          cpp: data.description?.cpp || '',
          c: data.description?.c || '',
        });
      } catch (err) {
        console.error('Failed to fetch program:', err);
        alert('Error loading program data');
      }
    };

    fetchProgram();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/programs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, chapterNumber, code, description }),
      });

      if (res.ok) {
        router.push('/admin/programs');
      } else {
        const errorData = await res.json();
        alert(`Failed to update program: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderLanguageFields = (lang: Lang) => (
    <div key={lang}>
      <h3 className="text-lg font-semibold capitalize mt-4">{lang}</h3>

      <label className="block font-semibold mt-2">Description ({lang})</label>
      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        value={description[lang]}
        onChange={(e) => setDescription({ ...description, [lang]: e.target.value })}
      />

      <label className="block font-semibold mt-2">Code ({lang})</label>
      <textarea
        className="w-full p-2 border rounded font-mono"
        rows={5}
        value={code[lang]}
        onChange={(e) => setCode({ ...code, [lang]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Program</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Chapter Number</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(Number(e.target.value))}
            required
          />
        </div>

        {languages.map(renderLanguageFields)}

        <div className="flex gap-4 items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Program'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-600 underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
