import type { Metadata } from 'next';

// Add metadata for social sharing
export const metadata: Metadata = {
  title: 'DStrA - Master Data Structures & Algorithms',
  description: 'The ultimate DSA guide made for GTU diploma students for subject Data Structures (DI03000021). Learn, practice, and code all at one place.',
  keywords: ['Data Structures', 'Algorithms', 'GTU', 'Programming', 'Education', 'DSA'],
  authors: [{ name: 'Tanmay Mevada' }],
  

  openGraph: {
    title: 'DStrA - Master Data Structures & Algorithms',
    description: 'The ultimate DSA guide made for GTU diploma students. Interactive learning platform with coding exercises and visual algorithms.',
    type: 'website',
    locale: 'en_US',
    url: 'https://dstra.vercel.app',
    siteName: 'DStrA',
    images: [
      {
        url: 'https://dstra.vercel.app/dstraogg.jpg',
        width: 1200,
        height: 630,
        alt: 'DStrA - Data Structures & Algorithms Learning Platform',
      },
    ],
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  alternates: {
    canonical: 'https://tanmaymevada.vercel.app',
  },
};

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
  Github,
  Mail,
  ExternalLink,
  GraduationCap,
  Link2,
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

  const quickLinks = [
    { label: 'Learn', href: '/learn' },
    { label: 'Chapters', href: '/chapters' },
    { label: 'Programs', href: '/programs' },
    { label: 'About', href: '/about' },
  ];

  const resources = [
    { label: 'GTU Syllabus', href: 'https://s3-ap-southeast-1.amazonaws.com/gtusitecirculars/Syallbus/DI03000021.pdf' },
    { label: 'Library', href: '/library' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center sm:mb-20">
          <div className="mb-8">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              Master<span className="mt-2 text-blue-600 dark:text-blue-400"> D</span>ata
              <span className="mt-2 text-blue-600 dark:text-blue-400"> Str</span>uctures &
              <span className="mt-2 text-blue-600 dark:text-blue-400"> A</span>lgorithms<br></br>
              with <span className="mt-2 text-blue-600 font-techmono dark:text-blue-400">
                DStrA
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-300">
              The ultimate DSA guide made for GTU diploma students for subject
              Data Structures (DI03000021). Learn, practice, and code all at
              one place.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/learn">
              <button className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg group hover:bg-blue-700">
                <Play className="w-5 h-5" />
                Start Learning
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>

            <Link href="https://s3-ap-southeast-1.amazonaws.com/gtusitecirculars/Syallbus/DI03000021.pdf" target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-2 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <BookOpen className="w-5 h-5" />
                View Syllabus
              </button>
            </Link>
          </div>
        </div>

        {/* User Session Card */}
        {session?.user && (
          <div className="flex items-center gap-3 p-4 mb-12 border border-gray-200 rounded-lg shadow-sm bg-white/10 dark:bg-gray-800/10 dark:border-gray-700">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Welcome back, {session.user.name || 'User'}!
              </p>
              <p className='text-xs text-gray-400 truncate dark:text-gray-600'>
                Logged in with {session.user.email}
              </p>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => {
            const CardContent = (
              <div
                className="p-6 transition-all duration-200 border border-gray-200 rounded-lg cursor-pointer group bg-white/20 dark:bg-gray-800/10 dark:border-gray-700 hover:shadow-md"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                role="link"
                tabIndex={0}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 transition-colors rounded-lg bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
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
        <div className="p-8 text-center bg-gray-100 border border-gray-200 rounded-lg sm:p-12 dark:bg-gray-800/10 dark:border-gray-700">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Ready to Master Data Structures?
            </h2>
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
              Join thousands of students who have improved their DSA skills with our comprehensive learning platform.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/learn">
                <button className="flex items-center gap-2 px-6 py-3 font-medium text-gray-900 transition-colors duration-200 bg-white rounded-lg group hover:bg-gray-100">
                  <BookOpen className="w-5 h-5" />
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-techmono">
                  DStrA
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                A Data Structures & Algorithms learning platform for GTU diploma students. 
                Study materials and practice exercises for subject code DI03000021.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">Resources</h4>
              <ul className="space-y-2">
                {resources.map((resource) => (
                  <li key={resource.href}>
                    <Link 
                      href={resource.href}
                      target={resource.href.startsWith('http') ? '_blank' : '_self'}
                      rel={resource.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="flex items-center gap-1 text-sm text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {resource.label}
                      {resource.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              
              {/* Developer Info */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full dark:bg-gray-700">
                    <GraduationCap className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Developer's Link
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href="mailto:tanmaymevada24@gmail.com"
                    className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/tanmay-mevada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://myportfolio-nine-eta-17.vercel.app/"
                    className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                    title="Portfolio"
                  >
                    <Link2 className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 DStrA v0.2.68; Educational project for GTU students.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}