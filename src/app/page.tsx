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

      <main className="relative z-10 mt-8 sm:mt-12 md:mt-16 lg:mt-20 mb-6 sm:mb-8 md:mb-12 lg:mb-16 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 lg:py-12 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto flex flex-col justify-center rounded-2xl sm:rounded-3xl border border-borderL dark:border-borderDark shadow-xl bg-white/60 dark:bg-surfaceDark/70 backdrop-blur-2xl">
        
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-primary dark:text-darkPrimary tracking-tight drop-shadow-sm leading-tight">
              Welcome to <span className="text-text dark:text-textDark">DStrA</span>
            </h1>
            <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-text dark:text-textDark/80 font-medium">
              The ultimate DSA guide tailored for GTU diploma students.
            </p>
          </div>
          
          {/* User icon - hidden on mobile, visible on larger screens */}
          <div className="hidden md:flex items-center justify-center bg-surface/80 dark:bg-surfaceDark/80 rounded-full p-3 lg:p-4 shadow-md border border-borderL dark:border-borderDark backdrop-blur-md">
            <User className="w-8 h-8 lg:w-10 lg:h-10 text-primary dark:text-darkPrimary" />
          </div>
        </div>

        {session?.user && (
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-sm sm:text-base text-text dark:text-textDark bg-surface/80 dark:bg-surfaceDark/80 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow border border-borderL dark:border-borderDark backdrop-blur-md">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary dark:text-darkPrimary flex-shrink-0" />
            <span className="truncate">
              Logged in as <strong className="break-all sm:break-normal">{session.user.email}</strong>
            </span>
          </div>
        )}

        <p className="max-w-full text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-text dark:text-textDark opacity-90 font-normal text-center lg:text-left">
          Explore organized chapters, understand the algorithms visually, and write code interactively. All designed to help you master the Data Structures subject (DI03000021) with ease and confidence.
        </p>
      </main>
    </div>
  );
}