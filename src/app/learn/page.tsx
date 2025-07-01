'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from '@/components/Spinner';

const learnTopics = [
	{
		id: 'complexity',
		title: 'Time & Space Complexity',
		description:
			'Understand Big O, Omega, and Theta notations with visual time/input graphs.',
	},
	{
		id: 'sorting',
		title: 'Sorting Algorithms',
		description: 'Visualize Bubble, Insertion, Merge, Quick, Radix, and more in action.',
	},
	{
		id: 'stack',
		title: 'Stacks & Recursion',
		description:
			'Explore stack operations, expression conversions, and recursion call stacks.',
	},
	{
		id: 'queue',
		title: 'Queues',
		description: 'Learn about simple and circular queues with interactive enqueue/dequeue.',
	},
	{
		id: 'linkedlist',
		title: 'Linked Lists',
		description:
			'Interact with singly, doubly, and circular linked list operations graphically.',
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
	// {
	//   id: 'recursion',
	//   title: 'Recursion Tree',
	//   description: 'Trace how recursive functions break down and build back with visual stacks.',
	// },
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
		return (
			<div className="flex justify-center items-center h-40">
				<Spinner className="w-8 h-8" />
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-6">
			<h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
				Interactive Learning Modules
			</h1>
			<div className="space-y-4">
				{learnTopics.map((topic, index) => (
					<div
						key={topic.id}
						className="flex items-center justify-between border border-borderL dark:border-borderDark rounded-xl bg-white/70 dark:bg-black/30 px-5 py-4 hover:shadow transition"
					>
						<div>
							<h2 className="text-lg md:text-xl font-semibold text-primary dark:text-darkPrimary mb-1">
								{index + 1}. {topic.title}
							</h2>
							<p className="text-sm text-text dark:text-textDark/80 max-w-xl">
								{topic.description}
							</p>
						</div>
						<a
							href={`/learn/${topic.id}`}
							className="ml-4 px-4 py-2 rounded-lg bg-primary/10 dark:bg-darkPrimary/10 text-primary dark:text-darkPrimary hover:bg-primary/20 dark:hover:bg-darkPrimary/20 font-medium text-sm transition"
						>
							Explore
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
