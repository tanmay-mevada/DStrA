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
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle grid pattern fading out towards the bottom */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)]"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px]"></div>
        <div className="absolute top-[15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[120px]"></div>
      </div>

      <main className="relative z-10 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-12">
        {/* Hero Section */}
        <div className="grid items-center gap-12 min-h-[75vh] lg:min-h-[80vh] pb-8 mb-16 sm:mb-20 lg:grid-cols-2">
          {/* Left: copy (unchanged text) */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-blue-600 rounded-full font-techmono bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 bg-blue-600 rounded-full"></span>
              </span>
              DI03000021 &middot; GTU DIPLOMA
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-left text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              <span className="block mb-2 text-3xl sm:text-4xl lg:text-5xl text-gray-500 dark:text-gray-400">Master</span>
              <span className="block mb-1">
                <span className="text-blue-600 dark:text-blue-400">D</span>ata{' '}
                <span className="text-blue-600 dark:text-blue-400">Str</span>uctures &{' '}
                <span className="text-blue-600 dark:text-blue-400">A</span>lgorithms
              </span>
              <span className="block mt-3 text-4xl sm:text-5xl lg:text-6xl">
                <span className="text-gray-500 dark:text-gray-400">with </span>
                <span className="text-blue-600 font-techmono dark:text-blue-400">DStrA</span>
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-left text-gray-600 sm:text-xl dark:text-gray-300">
              The ultimate DSA guide made for GTU diploma students for subject
              Data Structures (DI03000021). Learn, practice, and code all at
              one place.
            </p>

            <div className="flex flex-col items-start justify-start gap-4 mt-10 sm:flex-row">
              <Link href="/learn" className="relative group/btn">
                <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-40 group-hover/btn:opacity-80 transition duration-500"></div>
                <button className="relative flex items-center gap-2 px-8 py-3.5 font-medium text-white transition-all duration-300 bg-blue-600 rounded-lg group hover:bg-blue-500 hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-900/20">
                  <Play className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </Link>

              <Link href="https://s3-ap-southeast-1.amazonaws.com/gtusitecirculars/Syallbus/DI03000021.pdf" target="_blank" rel="noopener noreferrer" className="group/syllabus">
                <button className="flex items-center gap-2 px-8 py-3.5 font-medium text-gray-700 transition-all duration-300 border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/5 dark:shadow-none">
                  <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover/syllabus:scale-110 group-hover/syllabus:text-blue-500 dark:group-hover/syllabus:text-blue-400" />
                  <span>View Syllabus</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right: signature terminal, recolored to match site's light theme */}
          <div className="relative group">
            {/* Glowing background blob */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-300"></div>
            
            <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-2xl dark:bg-[#0A0F1C]/95 dark:border-gray-800 transition-transform duration-500 group-hover:-translate-y-2">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 bg-gray-50/80 dark:bg-gray-900/80 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 group-hover:gap-2 transition-all duration-300">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></span>
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></span>
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></span>
                  </div>
                  <span className="ml-2 text-xs text-gray-400 font-techmono dark:text-gray-500 transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400">bst_insert.c</span>
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-techmono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
                  Ready
                </div>
              </div>
              
              <div className="p-5 text-[13px] leading-[1.7] font-techmono selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
                <div className="px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-text group/line">
                  <span className="inline-block w-6 mr-3 text-right text-gray-300 select-none dark:text-gray-600 group-hover/line:text-blue-400">1</span><span className="text-purple-600 dark:text-purple-400">struct</span> <span className="text-gray-800 dark:text-gray-200">Node* insert(</span><span className="text-purple-600 dark:text-purple-400">struct</span> <span className="text-gray-800 dark:text-gray-200">Node* root, </span><span className="text-blue-600 dark:text-blue-400">int</span> <span className="text-gray-800 dark:text-gray-200">key) {'{'}</span>
                </div>
                <div className="px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-text group/line">
                  <span className="inline-block w-6 mr-3 text-right text-gray-300 select-none dark:text-gray-600 group-hover/line:text-blue-400">2</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;</span><span className="text-purple-600 dark:text-purple-400">if</span><span className="text-gray-800 dark:text-gray-200"> (root == </span><span className="text-purple-600 dark:text-purple-400">NULL</span><span className="text-gray-800 dark:text-gray-200">) </span><span className="text-purple-600 dark:text-purple-400">return</span><span className="text-gray-800 dark:text-gray-200"> newNode(key);</span>
                </div>
                <div className="px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-text group/line">
                  <span className="inline-block w-6 mr-3 text-right text-gray-300 select-none dark:text-gray-600 group-hover/line:text-blue-400">3</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;</span><span className="text-purple-600 dark:text-purple-400">if</span><span className="text-gray-800 dark:text-gray-200"> (key &lt; root-&gt;data)</span>
                </div>
                <div className="px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-text group/line">
                  <span className="inline-block w-6 mr-3 text-right text-gray-300 select-none dark:text-gray-600 group-hover/line:text-blue-400">4</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;&nbsp;&nbsp;root-&gt;left = insert(root-&gt;left, key);</span>
                </div>
                <div className="px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-text group/line">
                  <span className="inline-block w-6 mr-3 text-right text-gray-300 select-none dark:text-gray-600 group-hover/line:text-blue-400">5</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;</span><span className="text-purple-600 dark:text-purple-400">else</span>
                </div>
                <div className="px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-text group/line">
                  <span className="inline-block w-6 mr-3 text-right text-gray-300 select-none dark:text-gray-600 group-hover/line:text-blue-400">6</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;&nbsp;&nbsp;root-&gt;right = insert(root-&gt;right, key);</span>
                </div>
                <div className="px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-text group/line">
                  <span className="inline-block w-6 mr-3 text-right text-gray-300 select-none dark:text-gray-600 group-hover/line:text-blue-400">7</span><span className="text-gray-400 dark:text-gray-500">// O(log n) avg &middot; O(n) worst</span>
                </div>
                <div className="px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-text group/line">
                  <span className="inline-block w-6 mr-3 text-right text-gray-300 select-none dark:text-gray-600 group-hover/line:text-blue-400">8</span><span className="text-gray-800 dark:text-gray-200">&nbsp;&nbsp;</span><span className="text-purple-600 dark:text-purple-400">return</span><span className="text-gray-800 dark:text-gray-200"> root;</span>
                </div>
                <div className="px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-text group/line">
                  <span className="inline-block w-6 mr-3 text-right text-gray-300 select-none dark:text-gray-600 group-hover/line:text-blue-400">9</span><span className="text-gray-800 dark:text-gray-200">{'}'}</span>
                </div>
                
                <div className="px-2 -mx-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center gap-2">
                  <span className="flex w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-green-600 dark:text-green-400 font-medium tracking-tight">&gt; Output: [12, 25, 30, 45, 60] ✓</span>
                </div>
              </div>
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

        {/* Bottom CTA — Terminal Execution Window */}
        <div className="relative group/cta max-w-4xl mx-auto mt-8 mb-8">
          {/* Glowing background blob */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover/cta:opacity-40 transition duration-1000"></div>
          
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-2xl dark:bg-[#0A0F1C]/95 dark:border-gray-800 transition-transform duration-500 hover:-translate-y-1">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 bg-gray-50/80 dark:bg-gray-900/80 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 hover:gap-2 transition-all duration-300 cursor-default">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></span>
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></span>
                </div>
                <span className="ml-2 text-xs text-gray-400 font-techmono dark:text-gray-500">./execute_learning_path</span>
              </div>
              <span className="text-[10px] text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 px-2 py-1 rounded font-techmono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Running
              </span>
            </div>
            
            <div className="p-10 text-center sm:p-14 relative overflow-hidden">
              {/* Subtle background code watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100/50 dark:text-gray-800/30 font-techmono text-[200px] leading-none pointer-events-none select-none z-0">
                {'}'}
              </div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="mb-5 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                  Ready to Master Data Structures?
                </h2>
                <p className="mb-10 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Dive into the GTU diploma syllabus with clear explanations, interactive code, and a structured learning path.
                </p>
                
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/learn" className="relative group/btn inline-block">
                    <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-40 group-hover/btn:opacity-80 transition duration-500"></div>
                    <button className="relative flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto font-medium text-white transition-all duration-300 bg-blue-600 rounded-lg group hover:bg-blue-500 hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-900/20">
                      <Code className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                      <span>Start Your Journey</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </button>
                  </Link>
                </div>
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