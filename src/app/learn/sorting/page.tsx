'use client';

import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const sortingAlgorithms = [
	{
		id: 'bubble',
		name: 'Bubble Sort',
		desc: 'Repeatedly swaps adjacent elements if they are in the wrong order.',
	},
	{
		id: 'selection',
		name: 'Selection Sort',
		desc: 'Selects the smallest/largest element and places it in the correct position.',
	},
	{
		id: 'insertion',
		name: 'Insertion Sort',
		desc: 'Builds sorted array one element at a time by inserting in correct place.',
	},
	{
		id: 'merge',
		name: 'Merge Sort',
		desc: 'Divide and conquer approach, recursively splits and merges arrays.',
	},
	{
		id: 'quick',
		name: 'Quick Sort',
		desc: 'Divides array around a pivot and recursively sorts partitions.',
	},
	{
		id: 'radix',
		name: 'Radix Sort',
		desc: 'Sorts numbers digit by digit using counting sort as subroutine.',
	},
];

// Improved universal sorting preview animation
function UniversalSortPreview() {
	const [arr, setArr] = useState<number[]>([5, 3, 8, 1, 6]);
	const [highlight, setHighlight] = useState<number[]>([]);
	const [phase, setPhase] = useState<'sorting' | 'done'>('sorting');
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const iRef = useRef(0);
	const jRef = useRef(0);
	const arrRef = useRef<number[]>([...arr]);

	useEffect(() => {
		arrRef.current = [5, 3, 8, 1, 6];
		setArr([...arrRef.current]);
		setPhase('sorting');
		iRef.current = 0;
		jRef.current = 0;

		function bubbleStep() {
			if (iRef.current < arrRef.current.length - 1) {
				if (jRef.current < arrRef.current.length - iRef.current - 1) {
					setHighlight([jRef.current, jRef.current + 1]);
					if (arrRef.current[jRef.current] > arrRef.current[jRef.current + 1]) {
						[arrRef.current[jRef.current], arrRef.current[jRef.current + 1]] =
							[arrRef.current[jRef.current + 1], arrRef.current[jRef.current]];
						setArr([...arrRef.current]);
					}
					jRef.current++;
				} else {
					jRef.current = 0;
					iRef.current++;
				}
			} else {
				setHighlight([]);
				setPhase('done');
				clearInterval(intervalRef.current!);
				setTimeout(() => {
					// Reset after short pause
					arrRef.current = shuffle([5, 3, 8, 1, 6]);
					setArr([...arrRef.current]);
					iRef.current = 0;
					jRef.current = 0;
					setPhase('sorting');
					intervalRef.current = setInterval(bubbleStep, 250);
				}, 900);
			}
		}

		function shuffle(a: number[]) {
			const arr = [...a];
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
			return arr;
		}

		intervalRef.current = setInterval(bubbleStep, 250);

		return () => clearInterval(intervalRef.current!);
	}, []);

	return (
		<div className="flex flex-col items-center mb-8 w-full">
			<div className="flex items-end gap-2 h-20 w-48 sm:w-56 md:w-64 rounded-xl shadow-inner px-1 py-1 transition-all duration-300 bg-gradient-to-br from-primary/10 via-white/60 to-blue-200 dark:from-darkPrimary/10 dark:via-black/30 dark:to-blue-900/10 border border-primary/20 dark:border-darkPrimary/20">
				{arr.map((v, i) => (
					<div
						key={i}
						className={`flex-1 rounded-t-lg mx-0.5 transition-all duration-300
              ${highlight.includes(i)
							? 'bg-yellow-400 scale-110 shadow-lg'
							: phase === 'done'
								? 'bg-green-400'
								: 'bg-primary dark:bg-darkPrimary'}
            `}
						style={{
							height: `${v * 12 }px`,
							minWidth: 16,
						}}
					/>
				))}
			</div>
		</div>
	);
}

export default function SortingIntroPage() {
	return (
		<div className="min-h-screen w-full bg-background dark:bg-backgroundDark py-0">
			<div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
				{/* Animation, title, and description in a card */}
				<div className="bg-white/40 dark:bg-zinc-900/25 rounded-2xl shadow-lg border border-primary/20 dark:border-darkPrimary/20 px-3 py-4 mb-6 flex flex-col items-center backdrop-blur-md glass-gradient">
					<br></br>
					<UniversalSortPreview />
					<h1 className="text-3xl sm:text-5xl font-bold text-primary dark:text-darkPrimary mb-2 text-center drop-shadow">
						Sorting Algorithms
					</h1>
				</div>

				{/* Algorithm cards */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{sortingAlgorithms.map((algo) => (
						<Link
							href={`/learn/sorting/${algo.id}`}
							key={algo.id}
							className="block border border-primary/20 dark:border-darkPrimary/20 bg-white/40 dark:bg-zinc-900/40 p-5 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all group backdrop-blur-md"
						>
							<h2 className="text-xl font-semibold text-primary dark:text-darkPrimary mb-1 group-hover:underline">
								{algo.name}
							</h2>
							<p className="text-sm text-text dark:text-textDark/80">{algo.desc}</p>
							<div className="mt-3 text-sm text-primary dark:text-darkPrimary font-medium flex items-center gap-1">
								<PlayCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Visualize
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
