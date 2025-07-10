'use client';

import { useSession } from 'next-auth/react';
import { User } from 'lucide-react';
import Spinner from '../components/Spinner';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-backgroundDark">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background dark:bg-backgroundDark flex items-center justify-center">
      {/* Smooth gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-[#dbeafe] via-[#f0f9ff] to-white dark:from-[#1e1b4b] dark:via-[#0f172a] dark:to-[#020617]" />

      <main className="relative z-10 mt-16 sm:mt-20 mb-8 sm:mb-16 px-4 py-8 sm:py-10 max-w-3xl mx-auto flex flex-col justify-center rounded-3xl border border-borderL dark:border-borderDark shadow-xl bg-white/60 dark:bg-surfaceDark/70 backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-black text-primary dark:text-darkPrimary tracking-tight drop-shadow-sm">
              Welcome to <span className="text-text dark:text-textDark">DStrA</span>
            </h1>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-text dark:text-textDark/80 font-medium">
              The ultimate DSA guide tailored for GTU diploma students.
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center bg-surface/80 dark:bg-surfaceDark/80 rounded-full p-4 shadow-md border border-borderL dark:border-borderDark backdrop-blur-md">
            <User className="w-10 h-10 text-primary dark:text-darkPrimary" />
          </div>
        </div>

        {session?.user && (
          <div className="flex items-center gap-2 mb-6 text-md text-text dark:text-textDark bg-surface/80 dark:bg-surfaceDark/80 rounded-xl px-4 py-2 shadow border border-borderL dark:border-borderDark backdrop-blur-md">
            <User className="w-5 h-5 text-primary dark:text-darkPrimary" />
            <span className="truncate">Logged in as <strong>{session.user.email}</strong></span>
          </div>
        )}

        <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-text dark:text-textDark opacity-90 font-normal">
          Explore organized chapters, understand the algorithms visually, and write code interactively. All designed to help you master the Data Structures subject (DI03000021) with ease and confidence.
        </p>
      </main>
    </div>
  );
}
