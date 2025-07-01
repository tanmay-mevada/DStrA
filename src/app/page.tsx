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
    <div className="relative min-h-screen w-full bg-background dark:bg-backgroundDark flex items-center justify-center overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/15 dark:bg-darkPrimary/15 rounded-full blur-3xl opacity-50 pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-pink-400/10 dark:bg-fuchsia-700/10 rounded-full blur-2xl opacity-40 pointer-events-none z-0" />
      <main className="relative z-10 mt-16 sm:mt-20 mb-8 sm:mb-16 px-2 sm:px-4 py-8 sm:py-6 max-w-3xl mx-auto min-h-[50vh] sm:min-h-[36vh] flex flex-col justify-center animate-fadeIn rounded-2xl border border-borderL dark:border-borderDark shadow-2xl bg-white/40 dark:bg-surfaceDark/40 backdrop-blur-2xl bg-gradient-to-br from-white/80 via-primary/20 to-surface/90 dark:from-surfaceDark/80 dark:via-darkPrimary/20 dark:to-backgroundDark/90">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-5xl font-black text-primary dark:text-darkPrimary tracking-tight drop-shadow-sm">
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
