'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Code, Code2, BarChart3 } from 'lucide-react';
import { trackUserActivity } from '@/lib/trackUserActivity';

const adminSections = [
  {
    title: 'Manage Chapters',
    description: 'Create, edit, and delete DSA chapters.',
    href: '/admin/chapters',
    icon: <BookOpen className="w-6 h-6 text-sky-400" />,
  },
  {
    title: 'Manage Snippets',
    description: 'Add and organize code snippets per chapter.',
    href: '/admin/snippets',
    icon: <Code2 className="w-6 h-6 text-green-400" />,
  },
  {
    title: 'Manage Programs',
    description: 'Add and organize program codes and description.',
    href: '/admin/programs',
    icon: <Code className="w-6 h-6 text-green-400" />,
  },
  {
    title: 'Analytics',
    description: 'Track student activity and page views.',
    href: '/admin/users',
    icon: <BarChart3 className="w-6 h-6 text-yellow-400" />,
    disabled: false,
  }
];

export default function AdminHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user || session.user.role !== 'admin') {
      router.push('/');
      return;
    }

    trackUserActivity(pathname);
  }, [session, status, router, pathname]);

  if (status === 'loading' || session?.user?.role !== 'admin') {
    return <div className="p-6 text-gray-400">Loading or Unauthorized...</div>;
  }

  return (
    <main className="max-w-6xl p-4 mx-auto sm:p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold text-primary dark:text-darkPrimary">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-gray-400">Manage DStrA content and lessons efficiently.</p>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className={`group bg-slate-800 p-6 rounded-xl border border-slate-700 transition-transform shadow-md hover:shadow-lg ${
              section.disabled
                ? 'opacity-50 cursor-not-allowed pointer-events-none'
                : 'hover:scale-[1.02]'
            }`}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-full bg-slate-700">{section.icon}</div>
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            </div>
            <p className="text-sm text-gray-400">{section.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
