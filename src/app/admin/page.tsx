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
  ArrowRight,
} from 'lucide-react';
import { trackUserActivity } from '@/lib/trackUserActivity';

const adminSections = [
  { title: 'Chapters', href: '/admin/chapters', icon: BookOpen, description: 'Manage course chapters and content' },
  { title: 'Snippets', href: '/admin/snippets', icon: Code, description: 'Code snippets and examples' },
  { title: 'Programs', href: '/admin/programs', icon: FileText, description: 'Program management and settings' },
  { title: 'Library', href: '/admin/library', icon: Database, description: 'Resource library and materials' },
  { title: 'Analytics', href: '/admin/users', icon: BarChart3, description: 'User analytics and insights' },
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 rounded-full dark:border-blue-400 animate-spin border-t-transparent"></div>
          <p className="text-lg text-slate-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-100 sm:text-5xl">
              Admin Dashboard
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-gray-300">
            Manage your platform with powerful administrative tools. Select a module below to get started.
          </p>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {adminSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="relative p-6 overflow-hidden transition-all duration-300 bg-white border shadow-sm group rounded-2xl dark:bg-gray-800 border-slate-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 mb-4 transition-colors duration-300 bg-slate-50 dark:bg-gray-700 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                  <section.icon className="w-8 h-8 transition-colors duration-300 text-slate-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>
                
                <h3 className="mb-2 text-lg font-semibold transition-colors duration-300 text-slate-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {section.title}
                </h3>
                
                <p className="mb-4 text-sm transition-colors duration-300 text-slate-500 dark:text-gray-400 group-hover:text-slate-600 dark:group-hover:text-gray-300">
                  {section.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-blue-600 transition-opacity duration-300 opacity-0 dark:text-blue-400 group-hover:opacity-100">
                  Access
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" />
                </div>
              </div>
              
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-transparent group-hover:opacity-100 rounded-2xl"></div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-full shadow-sm text-slate-600 dark:text-gray-300 dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <div className="w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse"></div>
            System Status: Online
          </div>
        </div>
      </div>
    </div>
  );
}