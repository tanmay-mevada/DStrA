'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { BookOpen, Save, Plus, ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { trackUserActivity } from '@/lib/trackUserActivity';
import Spinner from '@/components/Spinner';
import toast from 'react-hot-toast';

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

export default function EditChapter() {
  const { id } = useParams();
  const [form, setForm] = useState<Chapter | null>(null);

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
    if (!id) return;
    fetch(`/api/chapters/${id}`)
      .then((res) => res.json())
      .then(setForm)
      .catch((err) => console.error('Failed to fetch chapter:', err));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    await fetch(`/api/chapters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    router.push('/admin/chapters');
  };

  if (!form) {
    return <p className="p-6 text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-5xl p-4 mx-auto sm:p-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-6 text-3xl font-extrabold text-primary dark:text-darkPrimary">
        <BookOpen className="w-7 h-7" /> Edit Chapter
      </div>

      <form onSubmit={handleUpdate} className="p-6 mb-10 space-y-4 shadow-md bg-surface dark:bg-surfaceDark rounded-xl">
        <input
          className="w-full p-3 border rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Chapter Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="w-full p-3 border rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Short Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {form.sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <input
              className="w-full p-3 border rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={`Section ${index + 1} Heading`}
              value={section.heading}
              onChange={(e) => {
                const updated = [...form.sections];
                updated[index].heading = e.target.value;
                setForm({ ...form, sections: updated });
              }}
            />
            <textarea
              className="w-full p-3 border rounded-lg bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={4}
              placeholder="Section Content"
              value={section.content}
              onChange={(e) => {
                const updated = [...form.sections];
                updated[index].content = e.target.value;
                setForm({ ...form, sections: updated });
              }}
            />
          </div>
        ))}

        <div className="flex flex-wrap gap-3 mt-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, sections: [...form.sections, { heading: '', content: '' }] })}
            className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            + Add Section
          </button>
          {form.sections.length > 1 && (
            <button
              type="button"
              onClick={() => setForm({ ...form, sections: form.sections.slice(0, -1) })}
              className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
            >
              – Remove Section
            </button>
          )}
        </div>

        <div className="flex flex-col items-stretch gap-3 mt-6 sm:flex-row sm:justify-between">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white transition rounded bg-primary dark:bg-darkPrimary hover:opacity-90"
          >
            <Save className="w-5 h-5" /> Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </form>
    </div>
  );
}
