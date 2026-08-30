"use client";

import type { Metadata } from 'next';

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
import { useState, Fragment } from 'react';
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
        <div className="grid items-center gap-12 mb-16 sm:mb-20 lg:grid-cols-2">
          {/* Left: copy (unchanged text) */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-blue-600 rounded-full font-techmono bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 bg-blue-600 rounded-full"></span>
              </span>
              DI03000021 &middot; GTU DIPLOMA
            </div>

            <h1 className="mb-8 font-bold text-left tracking-tight">
              <span className="block text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-1">
                Master
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl leading-[1.15] text-gray-900 dark:text-white mb-3">
                <span className="text-blue-600 dark:text-blue-400">D</span>ata <br />
                <span className="text-blue-600 dark:text-blue-400">Str</span>uctures & <br />
                <span className="text-blue-600 dark:text-blue-400">A</span>lgorithms
              </span>
              <span className="block text-xl sm:text-2xl lg:text-3xl text-gray-500 dark:text-gray-400 mb-1">
                with
              </span>
              <span className="block text-6xl sm:text-7xl lg:text-8xl text-blue-600 font-techmono dark:text-blue-400">
                DStrA
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-left text-gray-600 sm:text-xl dark:text-gray-300">
              The ultimate DSA guide made for GTU diploma students for subject
              Data Structures (DI03000021). Learn, practice, and code all at
              one place.
            </p>

            <div className="flex flex-col items-start justify-start gap-4 mt-8 sm:flex-row">
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

          {/* Right: signature terminal, recolored to match site's light theme */}
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800/40 dark:border-gray-700">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-900/40 dark:border-gray-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              <span className="ml-2 text-xs text-gray-400 font-techmono dark:text-gray-500">bst_insert.c</span>
            </div>
            <div className="p-5 text-[13px] leading-relaxed font-techmono">
              <div><span className="mr-3 text-gray-300 dark:text-gray-600">1</span><span className="text-purple-600 dark:text-purple-400">struct</span> <span className="text-gray-800 dark:text-gray-200">Node* insert(</span><span className="text-purple-600 dark:text-purple-400">struct</span> <span className="text-gray-800 dark:text-gray-200">Node* root, </span><span className="text-blue-600 dark:text-blue-400">int</span> <span className="text-gray-800 dark:text-gray-200">key) {'{'}</span></div>
              <div><span className="mr-3 text-gray-300 dark:text-gray-600">2</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;</span><span className="text-purple-600 dark:text-purple-400">if</span><span className="text-gray-800 dark:text-gray-200"> (root == </span><span className="text-purple-600 dark:text-purple-400">NULL</span><span className="text-gray-800 dark:text-gray-200">) </span><span className="text-purple-600 dark:text-purple-400">return</span><span className="text-gray-800 dark:text-gray-200"> newNode(key);</span></div>
              <div><span className="mr-3 text-gray-300 dark:text-gray-600">3</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;</span><span className="text-purple-600 dark:text-purple-400">if</span><span className="text-gray-800 dark:text-gray-200"> (key &lt; root-&gt;data)</span></div>
              <div><span className="mr-3 text-gray-300 dark:text-gray-600">4</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;&nbsp;&nbsp;root-&gt;left = insert(root-&gt;left, key);</span></div>
              <div><span className="mr-3 text-gray-300 dark:text-gray-600">5</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;</span><span className="text-purple-600 dark:text-purple-400">else</span></div>
              <div><span className="mr-3 text-gray-300 dark:text-gray-600">6</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;&nbsp;&nbsp;root-&gt;right = insert(root-&gt;right, key);</span></div>
              <div><span className="mr-3 text-gray-300 dark:text-gray-600">7</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;</span><span className="text-gray-400 dark:text-gray-500">// O(log n) avg &middot; O(n) worst</span></div>
              <div><span className="mr-3 text-gray-300 dark:text-gray-600">8</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;</span><span className="text-purple-600 dark:text-purple-400">return</span><span className="text-gray-800 dark:text-gray-200"> root;</span></div>
              <div><span className="mr-3 text-gray-300 dark:text-gray-600">9</span><span className="text-gray-800 dark:text-gray-200">{'}'}</span></div>
              <div className="mt-3 text-green-600 dark:text-green-400">&gt; output: [12, 25, 30, 45, 60] ✓</div>
            </div>
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

        {/* Card Catalog Fan Layout */}
        <div className="mb-16 lg:mb-24">
          <div className="relative max-w-[900px] mx-auto flex flex-col items-center gap-5 lg:block lg:h-[250px]">
            {features.map((feature, index) => {
              const cardStyles = [
                "lg:left-0 lg:-rotate-6 z-10",
                "lg:left-[230px] lg:rotate-3 z-20",
                "lg:left-[460px] lg:-rotate-3 z-20",
                "lg:left-[690px] lg:rotate-6 z-10"
              ];
              const romanNumerals = ["I", "II", "III", "IV"];
              const isLast = index === 3;
              
              return (
                <Fragment key={index}>
                  <Link 
                    href={feature.link} 
                    className={`group relative block w-full max-w-[320px] lg:absolute lg:top-0 lg:w-[220px] lg:h-[250px] bg-[#FDFCF8] dark:bg-gray-800 border border-[#D9DCE8] dark:border-gray-700 rounded-lg p-[18px] shadow-[0_12px_24px_-12px_rgba(29,35,64,0.25)] dark:shadow-none transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-[1.02] lg:hover:!rotate-0 hover:z-40 hover:shadow-[0_24px_40px_-12px_rgba(29,35,64,0.45)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:border-blue-500 ${cardStyles[index]}`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`absolute -top-2.5 right-4 font-techmono text-[10px] font-bold px-2 py-0.5 rounded ${isLast ? 'bg-[#EAB308] text-[#1D2340]' : 'bg-[#2338A6] text-white'}`}>
                      {romanNumerals[index]}
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#EBEEF5] dark:bg-gray-900 border-[1.5px] border-[#D9DCE8] dark:border-gray-700 mb-4 transition-colors duration-500 group-hover:bg-blue-100 group-hover:border-blue-400 dark:group-hover:bg-blue-900/50 dark:group-hover:border-blue-500"></div>
                    <h3 className="text-[15.5px] font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[#5B6689] dark:text-gray-400 leading-relaxed transition-colors duration-300 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      {feature.description}
                    </p>
                  </Link>
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* Call to Action — framed as the function this whole page is building up to calling */}
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-800/10 dark:border-gray-700">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-900/40 dark:border-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
            <span className="ml-2 text-xs text-gray-400 font-techmono dark:text-gray-500">main.c</span>
          </div>
          <div className="p-8 text-center sm:p-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                Ready to Master Data Structures?
              </h2>
              <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
                Join thousands of students who have improved their DSA skills with our comprehensive learning platform.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/learn">
                  <button className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg group hover:bg-blue-700">
                    <BookOpen className="w-5 h-5" />
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
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