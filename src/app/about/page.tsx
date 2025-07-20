import React from 'react';
import {
    User,
    BookOpen,
    Code,
    Target,
    Zap,
    Heart,
    Award,
    Users,
    Globe,
    ArrowRight,
    Mail,
    Github,
    Linkedin,
    Link,
    Sparkles,
    GraduationCap,
    Star
} from 'lucide-react';

export default function AboutPage() {

    const features = [
        {
            icon: Target,
            title: 'GTU Focused',
            description: 'Tailored specifically for GTU diploma students with curriculum-aligned content and exam-focused practice materials.',
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            icon: Zap,
            title: 'Interactive Learning',
            description: 'Engage with dynamic visualizations, live code editors, and hands-on exercises for better understanding.',
            gradient: 'from-purple-500 to-purple-600'
        },
        {
            icon: Heart,
            title: 'Student Focused',
            description: 'Designed with students in mind, featuring clear explanations and progressive difficulty levels.',
            gradient: 'from-pink-500 to-pink-600'
        },
        {
            icon: Globe,
            title: 'Accessible Everywhere',
            description: 'Learn anytime, anywhere with our responsive design that works on all devices seamlessly.',
            gradient: 'from-green-500 to-green-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-16 sm:mb-20">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            v0.2.68
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            About <span className="font-techmono text-blue-600 dark:text-blue-400 relative">
                                DStrA

                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                            DStrA is a comprehensive guide for third semester students doing diploma in CE from GTU seeking to gain knowledge and skills in the field of DSA (Data Structures and Algorithms). It covers all the important topics of the syllabus for subject Data Structure (DI03000021) in a structured manner, providing clear explanations, code examples, and interactive exercises to help students understand and apply the concepts effectively.
                        </p>
                    </div>
                </div>

                {/* Inspiration Section with Premium Design */}
                <div className="relative mb-16 sm:mb-20 p-8 sm:p-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800/30 dark:via-gray-900/10 dark:to-purple-900/10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <div className="absolute top-4 right-4 opacity-20">
                        <GraduationCap className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-6">
                            <Star className="w-4 h-4" />
                            Our Inspiration
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                            Inspired by Excellence
                        </h2>
                        <div className="space-y-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>
                                The <strong className="text-blue-600 dark:text-blue-400">DStrA</strong> project is humbly inspired by <strong className="text-purple-600 dark:text-purple-400">Prof. Bharat V. Chawda</strong>, who taught us subjects like <em>Java</em> and <em>Data Structures & Algorithms</em> during our Diploma in Computer Engineering at <strong>B. & B. Institute of Technology</strong>.
                            </p>
                            <p>
                                Prof. Chawda's clear teaching style, strong technical knowledge, and dedication to students have left a lasting impact on our learning. His ability to explain complex topics in a simple and structured manner helped build a solid foundation in core computer science subjects.
                            </p>
                            <p>
                                This project is a small tribute to his guidance and inspiration. We are truly grateful for the role he played in shaping our understanding and interest in the field.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section with Enhanced Profile Card */}
                <div className="mb-16 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                        Developed & Crafted<span className="text-blue-600 dark:text-blue-400"> by</span>
                    </h2>
                    <div className="max-w-2xl mx-auto">
                        <div className="relative text-center p-8 bg-white/40 dark:bg-gray-800/20 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                            <div className="relative z-10">
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <h3 className="font-michroma text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Tanmay Mevada
                                </h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                                    <GraduationCap className="w-4 h-4" />
                                    Developer & Student
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                    A former Diploma student from the 2022 batch in Computer Engineering at B & B Institute of Technology, Vallabh Vidyanagar. Currently pursuing B.Tech in Computer Science & Engineering at Nirma University, Ahmedabad.                                </p>
                                <div className="flex justify-center gap-4">
                                    <a href="mailto:tanmaymevada24@gmail.com" className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Mail className="w-5 h-5 text-white" />
                                    </a>
                                    <a href="https://github.com/tanmay-mevada" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-lg">
                                        <Github className="w-5 h-5 text-white" />
                                    </a>
                                    <a href="https://myportfolio-nine-eta-17.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                        <Link className="w-5 h-5 text-white" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}