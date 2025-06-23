'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LearnCard from '@/components/LearnCard';

const learnTopics = [
  {
    id: 'complexity',
    title: 'Time & Space Complexity',
    description: 'Understand Big O, Omega, and Theta notations with visual time/input graphs.',
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    description: 'Visualize Bubble, Insertion, Merge, Quick, Radix, and more in action.',
  },
  {
    id: 'stack',
    title: 'Stacks & Recursion',
    description: 'Explore stack operations, expression conversions, and recursion call stacks.',
  },
  {
    id: 'queue',
    title: 'Queues',
    description: 'Learn about simple and circular queues with interactive enqueue/dequeue.',
  },
  {
    id: 'linkedlist',
    title: 'Linked Lists',
    description: 'Interact with singly, doubly, and circular linked list operations graphically.',
  },
  {
    id: 'trees',
    title: 'Tree Structures & Traversals',
    description: 'Understand tree types, traversals, and how binary search trees work.',
  },
  {
    id: 'graphs',
    title: 'Graph Algorithms',
    description: 'Visual BFS, DFS traversals, and types of graphs (directed/weighted).',
  },
  {
    id: 'recursion',
    title: 'Recursion Tree',
    description: 'Trace how recursive functions break down and build back with visual stacks.',
  },
  {
    id: 'searching',
    title: 'Searching Algorithms',
    description: 'Step-by-step visuals of Linear and Binary Search over data sets.',
  },
  {
    id: 'hashing',
    title: 'Hashing',
    description: 'Understand hash tables, collisions, and different hashing methods.',
  },
];

export default function LearnPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      router.push('/auth/login');
    }
  }, [status, session, router]);

  if (status === 'loading' || !session?.user) {
    return <p className="p-6 text-zinc-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
        Interactive Learning Modules
      </h1>

      <div className="space-y-4">
        {learnTopics.map((topic, index) => (
          <LearnCard
            key={topic.id}
            id={topic.id}
            title={topic.title}
            description={topic.description}
            moduleNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
