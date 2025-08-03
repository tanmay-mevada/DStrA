'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  Code,
  FileText,
  BarChart3,
  LayoutDashboard,
  Menu,
  X,
  Users,
  ChevronRight
} from 'lucide-react';

const adminSections = [
  { title: 'Chapters', href: '/admin/chapters', icon: BookOpen },
  { title: 'Programs', href: '/admin/programs', icon: FileText },
  { title: 'Library', href: '/admin/library', icon: Code },
  { title: 'Analytics', href: '/admin/users', icon: BarChart3 },
  { title: 'Users', href: '/admin/user-management', icon: Users },
];

export default function AdminHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = '/admin'; // Simulated current path

  // Simulate session
  const session = { user: { role: 'admin' } };
  const status = 'authenticated';

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 border-solid rounded-full animate-spin border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-50
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
              <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {adminSections.map((section) => (
              <button
                key={section.title}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${pathname === section.href
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        
        {/* Header */}
        <header className="px-4 py-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
              //ADMIN_ACCESS_GRANTED
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
              System online and ready. Use the navigation menu to manage your platform components.
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
            {adminSections.map((section) => (
              <button
                key={section.title}
                className="p-6 text-left transition-all duration-200 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 group hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <section.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage {section.title.toLowerCase()} and related settings
                </p>
              </button>
            ))}
          </div>

          {/* System Status */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                System Status
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">All systems operational</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database connected</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Services running</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}