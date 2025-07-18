'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditLibraryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [code, setCode] = useState({ c: '', cpp: '', python: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch(`/api/library/${id}`);
        const data = await res.json();

        console.log('Fetched library data:', data);

        setTitle(data.title || '');
        setChapterNumber(data.chapterNumber || 1);
        setCode({
          c: data.codes?.c || '',
          cpp: data.codes?.cpp || '',
          python: data.codes?.python || '',
        });
      } catch (error) {
        console.error('Failed to fetch library:', error);
      }
    };

    if (id) fetchLibrary();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/library/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          chapterNumber,
          codes: code,
        }),
      });

      if (!res.ok) throw new Error('Update failed');
      router.push('/admin/library');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update library entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary dark:text-darkPrimary mb-6">
        Edit Library Code
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-surface dark:bg-surfaceDark p-6 rounded-xl shadow-md"
      >
        {/* Title */}
        <div>
          <label className="block font-semibold text-text dark:text-textDark mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark rounded focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>

        {/* Chapter Number */}
        <div>
          <label className="block font-semibold text-text dark:text-textDark mb-1">Chapter Number</label>
          <input
            type="number"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(parseInt(e.target.value))}
            className="w-full p-3 border border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark rounded focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>

        {/* Code Fields */}
        {['c', 'cpp', 'python'].map((lang) => (
          <div key={lang}>
            <label className="block font-semibold text-text dark:text-textDark mb-1 capitalize">
              {lang} Code
            </label>
            <textarea
              rows={6}
              value={code[lang as keyof typeof code]}
              onChange={(e) =>
                setCode({ ...code, [lang]: e.target.value })
              }
              className="w-full font-mono p-3 border border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark rounded resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 font-medium rounded transition text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}
