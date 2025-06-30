'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Searching algorithms info
const searchingAlgorithms = [
	{
		id: 'linear',
		name: 'Linear Search',
		desc: 'Checks each element in sequence until the target is found or the list ends.',
	},
	{
		id: 'binary',
		name: 'Binary Search',
		desc: 'Efficiently searches a sorted array by repeatedly dividing the search interval in half.',
	},
];

// Searching animation preview
function UniversalSearchPreview() {
	const [arr, setArr] = useState<number[]>([2, 4, 7, 10, 13, 18, 21, 25]);
	const [target, setTarget] = useState<number>(10);
	const [highlight, setHighlight] = useState<number[]>([]);
	const [foundIdx, setFoundIdx] = useState<number | null>(null);
	const [phase, setPhase] = useState<'linear' | 'binary'>('linear');
	const [step, setStep] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [binaryRange, setBinaryRange] = useState<[number, number]>([0, arr.length - 1]);
	const [magnifierPos, setMagnifierPos] = useState<number>(0);

	useEffect(() => {
		setArr([2, 4, 7, 10, 13, 18, 21, 25]);
		setTarget(10);
		setHighlight([]);
		setFoundIdx(null);
		setStep(0);
		setPhase('linear');
		setBinaryRange([0, 7]);
		setMagnifierPos(0);

		let i = 0;
		let left = 0;
		let right = arr.length - 1;

		function linearStep() {
			setHighlight([i]);
			setMagnifierPos(i);
			if (arr[i] === target) {
				setFoundIdx(i);
				clearInterval(intervalRef.current!);
				setTimeout(() => {
					setPhase('binary');
					setHighlight([]);
					setFoundIdx(null);
					setStep(0);
					setBinaryRange([0, arr.length - 1]);
					setMagnifierPos(Math.floor((0 + arr.length - 1) / 2));
					left = 0;
					right = arr.length - 1;
					intervalRef.current = setInterval(binaryStep, 700);
				}, 1000);
			} else if (i === arr.length - 1) {
				setFoundIdx(null);
				clearInterval(intervalRef.current!);
				setTimeout(() => {
					setPhase('binary');
					setHighlight([]);
					setFoundIdx(null);
					setStep(0);
					setBinaryRange([0, arr.length - 1]);
					setMagnifierPos(Math.floor((0 + arr.length - 1) / 2));
					left = 0;
					right = arr.length - 1;
					intervalRef.current = setInterval(binaryStep, 700);
				}, 1000);
			}
			i++;
		}

		function binaryStep() {
			setHighlight([]);
			if (left > right) {
				setHighlight([]);
				setFoundIdx(null);
				setBinaryRange([0, arr.length - 1]);
				setMagnifierPos(0);
				clearInterval(intervalRef.current!);
				setTimeout(() => {
					setPhase('linear');
					setHighlight([]);
					setFoundIdx(null);
					setStep(0);
					setMagnifierPos(0);
					i = 0;
					intervalRef.current = setInterval(linearStep, 700);
				}, 1200);
				return;
			}
			setBinaryRange([left, right]);
			const mid = Math.floor((left + right) / 2);
			setHighlight([mid]);
			setMagnifierPos(mid);
			if (arr[mid] === target) {
				setFoundIdx(mid);
				clearInterval(intervalRef.current!);
				setTimeout(() => {
					setPhase('linear');
					setHighlight([]);
					setFoundIdx(null);
					setStep(0);
					setBinaryRange([0, arr.length - 1]);
					setMagnifierPos(0);
					i = 0;
					intervalRef.current = setInterval(linearStep, 700);
				}, 1200);
			} else if (arr[mid] < target) {
				left = mid + 1;
			} else {
				right = mid - 1;
			}
		}

		intervalRef.current = setInterval(linearStep, 700);

		return () => clearInterval(intervalRef.current!);
		// eslint-disable-next-line
	}, []);

	return (
		<div className="flex flex-col items-center mb-8 w-full relative">
			<div className="flex items-end gap-2 h-24 w-80 sm:w-96 md:w-[28rem] rounded-xl shadow-inner px-1 py-1 transition-all duration-300 relative">
				{arr.map((v, i) => {
					const isInBinaryRange =
						phase === 'binary' && i >= binaryRange[0] && i <= binaryRange[1];
					return (
						<div
							key={i}
							className={`flex-1 rounded-lg mx-0.5 flex flex-col items-center justify-end transition-all duration-300
								${highlight.includes(i)
									? 'bg-yellow-400 scale-110 shadow-lg'
									: foundIdx === i
										? 'bg-green-400'
										: phase === 'binary' && isInBinaryRange
											? 'bg-blue-400/80'
											: 'bg-blue-200'}
							`}
							style={{
								height: `${v * 3 + 30}px`,
								minWidth: 28,
								maxWidth: 40,
								border: highlight.includes(i)
									? '2px solid #facc15'
									: foundIdx === i
										? '2px solid #22c55e'
										: phase === 'binary' && isInBinaryRange
											? '2px solid #60a5fa'
											: '2px solid #93c5fd',
								boxShadow: highlight.includes(i)
									? '0 0 0 4px #fde68a'
									: foundIdx === i
										? '0 0 0 4px #bbf7d0'
										: undefined,
								position: 'relative',
							}}
						>
							<span className="text-xs text-blue-900 font-bold mb-1">{v}</span>
							{foundIdx === i && (
								<span className="text-[10px] text-green-900 font-bold">Found</span>
							)}
							{phase === 'binary' && isInBinaryRange && (
								<span className="text-[9px] text-blue-700 font-semibold">
									{i === binaryRange[0]
										? 'L'
										: i === binaryRange[1]
											? 'R'
											: ''}
								</span>
							)}
							{/* Magnifier glass icon */}
							{magnifierPos === i && (
								<span
									className="absolute -top-7 left-1/2 -translate-x-1/2"
									style={{ pointerEvents: 'none' }}
								>
									<svg width="28" height="28" viewBox="0 0 28 28" className="animate-bounce" fill="none">
										<circle cx="12" cy="12" r="9" stroke="#2563eb" strokeWidth="3" fill="#fff" />
										<rect x="19" y="19" width="6" height="3" rx="1.5" transform="rotate(45 19 19)" fill="#2563eb" />
									</svg>
								</span>
							)}
						</div>
					);
				})}
			</div>
			<div className="text-xs text-zinc-500 mt-2 tracking-wide font-medium">
				{phase === 'linear'
					? 'Linear Search: Scanning left to right'
					: 'Binary Search: Shrinking range'}
			</div>
		</div>
	);
}

export default function SearchingIntroPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 py-0">
			<div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
				{/* Title and description in a card */}
				<div className="bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 px-3 py-4 mb-6 flex flex-col items-center">
					<h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 text-center drop-shadow">
						Searching Algorithms
					</h1>
					<p className="text-center text-zinc-500 dark:text-zinc-400 mt-2 text-base">
						Explore and visualize classic searching algorithms.
					</p>
				</div>

				{/* Algorithm cards */}
				<div className="grid md:grid-cols-2 gap-8">
					{searchingAlgorithms.map((algo) => (
						<Link
							href={`/learn/searching/${algo.id}`}
							key={algo.id}
							className="block border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 p-5 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all group"
						>
							<h2 className="text-xl font-semibold text-blue-600 dark:text-blue-300 mb-1 group-hover:underline">
								{algo.name}
							</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">{algo.desc}</p>
							<div className="mt-3 text-sm text-blue-500 dark:text-blue-300 font-medium flex items-center gap-1">
								<span className="transition-transform group-hover:translate-x-1">▶</span>{' '}
								Visualize
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
