'use client';

import Link from 'next/link';
import { Wrench, Home } from 'lucide-react';

export default function ProductionPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 sm:p-12 text-center max-w-md w-full">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto mb-6">
          <Wrench className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          This Page is Under Construction
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          We're still on building phase for this page.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
