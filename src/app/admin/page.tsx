'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Code,
  FileText,
  Database,
  BarChart3,
  LayoutDashboard,
  Terminal,
} from 'lucide-react';
import { trackUserActivity } from '@/lib/trackUserActivity';

const adminSections = [
  { title: 'Chapters', href: '/admin/chapters', icon: BookOpen },
  { title: 'Snippets', href: '/admin/snippets', icon: Code },
  { title: 'Programs', href: '/admin/programs', icon: FileText },
  { title: 'Library', href: '/admin/library', icon: Database },
  { title: 'Analytics', href: '/admin/users', icon: BarChart3 },
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

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 p-6 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-3 mb-10 text-2xl font-bold text-blue-600 dark:text-blue-400">
          <LayoutDashboard className="w-8 h-8" />
          Admin Panel
        </div>
        <nav className="flex flex-col gap-3">
          {adminSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-blue-100 dark:hover:bg-blue-900
                ${
                  pathname === section.href
                    ? 'bg-blue-100 dark:bg-blue-900 font-semibold text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
            >
              <section.icon className="w-5 h-5" />
              {section.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content - Welcome */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-50">
            //ADMIN_ACCESS_GRANTED
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The system is online and awaiting your directives. Navigate the console
            using the sidebar to manage critical operations.
          </p>
        </div>
      </main>
    </div>
  );
}