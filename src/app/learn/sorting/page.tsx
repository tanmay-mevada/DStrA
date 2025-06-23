'use client';

import Link from 'next/link';

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

export default function SortingIntroPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        🧠 Sorting Algorithms
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl">
        Explore interactive visualizations of popular sorting algorithms. Understand how they work step-by-step through animated comparisons and swaps.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortingAlgorithms.map((algo) => (
          <Link
            href={`/learn/sorting/${algo.id}`}
            key={algo.id}
            className="block border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 rounded-xl shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-300 mb-1">
              {algo.name}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{algo.desc}</p>
            <div className="mt-2 text-sm text-blue-500 dark:text-blue-300 font-medium">▶ Visualize</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
