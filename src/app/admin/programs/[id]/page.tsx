'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { trackUserActivity } from '@/lib/trackUserActivity';
import Spinner from '@/components/Spinner';
import { toast } from 'react-hot-toast';

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
  const { data: session, status } = useSession();
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
      <h3 className="mt-4 text-lg font-semibold capitalize">{lang}</h3>

      <label className="block mt-2 font-semibold">Description ({lang})</label>
      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        value={description[lang]}
        onChange={(e) => setDescription({ ...description, [lang]: e.target.value })}
      />

      <label className="block mt-2 font-semibold">Code ({lang})</label>
      <textarea
        className="w-full p-2 font-mono border rounded"
        rows={5}
        value={code[lang]}
        onChange={(e) => setCode({ ...code, [lang]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Edit Program</h1>
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

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
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
