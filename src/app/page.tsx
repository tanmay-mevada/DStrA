'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  User,
  BookOpen,
  Code,
  Zap,
  Target,
  ArrowRight,
  Play,
} from 'lucide-react';
import { useState } from 'react';
import Spinner from '../components/Spinner';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  const features = [
    {
      icon: BookOpen,
      title: 'Structured Learning',
      description:
        'Follow GTU syllabus with organized chapters and clear progression',
      link: '/chapters',
    },
    {
      icon: Code,
      title: 'Interactive Coding',
      description:
        'Write and test code directly in your browser with instant feedback',
      link: '/programs',
    },
    {
      icon: Zap,
      title: 'Visual Algorithms',
      description:
        'Understand complex algorithms through interactive visualizations',
      link: '/learn',
    },
    {
      icon: Target,
      title: 'Exam Focused',
      description:
        'Practice questions and examples tailored for GTU diploma exams',
      link: '/production',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Screen Warning */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-yellow-100 text-yellow-900 text-sm rounded-md shadow-md animate-fade md:hidden">
        Best viewed on larger screens. Most of the pages are responsive but still under developement so some features may not work properly on mobile. It is recommended to use a desktop or laptop for the best experience.
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master<span className="text-blue-600 dark:text-blue-400 mt-2"> D</span>ata
              <span className="text-blue-600 dark:text-blue-400 mt-2"> Str</span>uctures &
              <span className="text-blue-600 dark:text-blue-400 mt-2"> A</span>lgorithms<br></br>
              with <span className=" text-blue-600 dark:text-blue-400 mt-2">
                DStrA
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The ultimate DSA guide made for GTU diploma students for subject
              Data Structures (DI03000021). Learn, practice, and code all at
              one place.
            </p>
          </div>


          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/learn">
              <button className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                <Play className="w-5 h-5" />
                Start Learning
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link href="https://s3-ap-southeast-1.amazonaws.com/gtusitecirculars/Syallbus/DI03000021.pdf" target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                <BookOpen className="w-5 h-5" />
                View Syllabus
              </button>
            </Link>
          </div>
        </div>

        {/* User Session Card */}
        {session?.user && (
          <div className="flex items-center gap-3 mb-12 p-4 bg-white/10 dark:bg-gray-800/10 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Welcome back, {session.user.name || 'User'}!
              </p>
              <p className='text-xs text-gray-400 dark:text-gray-600 truncate'>
                Logged in with {session.user.email}
              </p>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => {
            const CardContent = (
              <div
                className="group p-6 bg-white/20 dark:bg-gray-800/10 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                role="link"
                tabIndex={0}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );

            return feature.link ? (
              <Link key={index} href={feature.link}>
                {CardContent}
              </Link>
            ) : (
              <div key={index}>{CardContent}</div>
            );
          })}
        </div>


        {/* Call to Action */}
        <div className="text-center p-8 sm:p-12 bg-gray-100 dark:bg-gray-800/10 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Master Data Structures?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">

            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                <BookOpen className="w-5 h-5" />
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
