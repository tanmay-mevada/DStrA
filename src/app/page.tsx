'use client';

import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500 dark:text-gray-400">Loading session...</p>
      </div>
    );
  }

  return (
    <main className="px-6 py-16 max-w-6xl mx-auto min-h-[80vh] flex flex-col justify-center animate-fadeIn">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-extrabold text-primary dark:text-darkPrimary">
            Welcome to <span className="text-text dark:text-textDark">DStrA</span>
          </h1>
          <p className="mt-3 text-lg text-text dark:text-textDark/70">
            The ultimate DSA guide tailored for GTU diploma students.
          </p>
        </div>

      </div>

      {session?.user && (
        <p className="mb-6 text-md text-text dark:text-textDark">
          Logged in as <strong>{session.user.name || session.user.email}</strong>
        </p>
      )}

      <p className="max-w-3xl text-lg leading-relaxed text-text dark:text-textDark">
        Explore organized chapters, understand the algorithms visually, and write code interactively 
        All designed to help you master the Data Structures subject (DI03000021) with ease and confidence.
      </p>
    </main>
  );
}
