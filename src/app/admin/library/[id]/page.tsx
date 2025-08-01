'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { trackUserActivity } from '@/lib/trackUserActivity';
import Spinner from '@/components/Spinner';
import toast from 'react-hot-toast';

export default function EditLibraryPage() {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [algorithm, setAlgorithm] = useState(''); // ← added
  const [code, setCode] = useState({ c: '', cpp: '', python: '' });
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch(`/api/library/${id}`);
        const data = await res.json();

        console.log('Fetched library data:', data);

        setTitle(data.title || '');
        setChapterNumber(data.chapterNumber || 1);
        setAlgorithm(data.algorithm || ''); // ← added
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
          algorithm,
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
    <div className="max-w-3xl p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-primary dark:text-darkPrimary">
        Edit Library Code
      </h1>

      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-5 shadow-md bg-surface dark:bg-surfaceDark rounded-xl"
      >
        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold text-text dark:text-textDark">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>

        {/* Chapter Number */}
        <div>
          <label className="block mb-1 font-semibold text-text dark:text-textDark">Chapter Number</label>
          <input
            type="number"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(parseInt(e.target.value))}
            className="w-full p-3 border rounded border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>

        {/* Algorithm */}
        <div>
          <label className="block mb-1 font-semibold text-text dark:text-textDark">Algorithm</label>
          <textarea
            rows={6}
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full p-3 font-mono border rounded resize-y border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>

        {/* Code Fields */}
        {['c', 'cpp', 'python'].map((lang) => (
          <div key={lang}>
            <label className="block mb-1 font-semibold capitalize text-text dark:text-textDark">
              {lang} Code
            </label>
            <textarea
              rows={6}
              value={code[lang as keyof typeof code]}
              onChange={(e) =>
                setCode({ ...code, [lang]: e.target.value })
              }
              className="w-full p-3 font-mono border rounded resize-y border-border dark:border-borderDark bg-background dark:bg-backgroundDark text-text dark:text-textDark focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 font-medium rounded transition text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}
