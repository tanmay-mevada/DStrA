'use client';

import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

const learnTopics = [
  {
    id: 'complexity',
    unit: { number: 1, name: 'Basic Concepts of Data Structures' },
    title: 'Time & Space Complexity',
    description: 'Understand Big O, Omega, and Theta notations with visual time/input graphs.',
  },
  {
    id: 'stack',
    unit: { number: 2, name: 'Stack and Queues' },
    title: 'Stacks & Recursion',
    description: 'Explore stack operations visualization.',
  },
  {
    id: 'queue',
    unit: { number: 2, name: 'Stack and Queues' },
    title: 'Queues',
    description: 'Learn about simple queues with enqueue/dequeue operations and real-world applications.',
  },
  {
    id: 'linkedlist',
    unit: { number: 3, name: 'Linked List' },
    title: 'Linked Lists',
    description: 'Interact with singly linked list. Perform insert, delete, search, and count operations.',
  },
  {
    id: 'trees',
    unit: { number: 4, name: 'Trees and Graph' },
    title: 'Tree Structures & Traversals',
    description: 'Understand binary trees, traversals (inorder, preorder, postorder), and binary search tree operations.',
  },
  {
    id: 'graphs',
    unit: { number: 4, name: 'Trees and Graph' },
    title: 'Graph Algorithms',
    description: 'Visualize graph structures like directed, undirected, and weighted graphs using BFS and DFS.',
  },
  {
    id: 'sorting',
    unit: { number: 5, name: 'Sorting and Searching' },
    title: 'Sorting Algorithms',
    description: 'Visualize Bubble, Selection, Insertion, Merge, Quick, and Radix sort algorithms with step-by-step demos.',
  },
  {
    id: 'searching',
    unit: { number: 5, name: 'Sorting and Searching' },
    title: 'Searching Algorithms',
    description: 'Learn Linear and Binary Search with step-by-step examples and visual explanations.',
  },
  {
    id: 'hashing',
    unit: { number: 5, name: 'Sorting and Searching' },
    title: 'Hashing',
    description: 'Understand hash tables, collision resolution techniques, and hash functions like division and folding.',
  },
];

export default function LearnPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      toast('Please Login to continue');
      router.replace('/auth/login');
      return;
    }
    trackUserActivity(pathname);
  }, [session, status, router, pathname]);

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8 sm:py-8 lg:py-12">

        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl font-michroma text-primary dark:darkPrimary lg:mb-4">
            Data Structures Learning Path
          </h1>
          <p className="max-w-3xl text-base sm:text-lg text-zinc-600 dark:text-zinc-300">
            Master fundamental data structures through interactive lessons and visual examples.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-4 sm:gap-6">
          {learnTopics.map((topic, index) => (
            <div
              key={topic.id}
              className="flex flex-col justify-between p-4 transition-all duration-200 border group sm:flex-row sm:items-center sm:p-6 bg-white/40 dark:bg-gray-800/10 rounded-xl border-zinc-200 dark:border-zinc-700 hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-zinc-800/50"
            >
              <div className="flex-1 mb-4 sm:mb-0">
                <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:gap-3">
                  <span className="flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full bg-zinc-100/10 dark:bg-gray-700/10 text-zinc-700 dark:text-zinc-300 shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="mb-1 text-lg font-semibold sm:text-xl text-zinc-900 dark:text-zinc-100">
                      {topic.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                      Unit {topic.unit.number}: {topic.unit.name}
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 sm:ml-11">
                  {topic.description}
                </p>
              </div>

              <div className="flex justify-end sm:justify-start sm:ml-6">
                <a
                  href={`/learn/${topic.id}`}
                  className="group/btn flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-200 text-sm sm:text-base"
                >
                  Explore
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}