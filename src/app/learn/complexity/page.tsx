'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BarChart2, Brain, BookOpen } from 'lucide-react';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Title);

const complexityFunctions: Record<string, (n: number) => number[]> = {
  'O(1)': (n) => Array.from({ length: n }, () => 1),
  'O(log n)': (n) => Array.from({ length: n }, (_, i) => Math.log2(i + 1)),
  'O(n)': (n) => Array.from({ length: n }, (_, i) => i + 1),
  'O(n log n)': (n) => Array.from({ length: n }, (_, i) => (i + 1) * Math.log2(i + 1)),
  'O(n²)': (n) => Array.from({ length: n }, (_, i) => (i + 1) ** 2),
};

const complexityInfo = [
  {
    label: 'O(1)',
    meaning: 'Constant Time',
    desc: 'No matter how big your input is, the time taken stays the same. Think of looking up a name in your phone by number—always instant.',
    example: 'Example: Accessing an array element by index.',
    analogy: 'Analogy: Grabbing a book from a specific spot on a shelf—you know exactly where it is.',
    color: '#3b82f6',
  },
  {
    label: 'O(log n)',
    meaning: 'Logarithmic Time',
    desc: 'The bigger the input, the slower it gets, but it slows down much less than you’d expect. Like cutting a deck of cards in half over and over to find a card.',
    example: 'Example: Binary search in a sorted list.',
    analogy: 'Analogy: Guessing a number between 1 and 100 by always picking the middle.',
    color: '#16a34a',
  },
  {
    label: 'O(n)',
    meaning: 'Linear Time',
    desc: 'Time grows directly with the size of your input. If you double the input, it takes twice as long. Like reading every page in a book.',
    example: 'Example: Looping through an array to find a value.',
    analogy: 'Analogy: Checking every item in a grocery list one by one.',
    color: '#f59e0b',
  },
  {
    label: 'O(n log n)',
    meaning: 'Linearithmic Time',
    desc: 'A bit more than linear, but much better than quadratic. Common in efficient sorting. Like sorting a pile of cards by splitting and merging.',
    example: 'Example: Merge sort or quick sort.',
    analogy: 'Analogy: Organizing books by splitting them into piles, sorting, then combining.',
    color: '#8b5cf6',
  },
  {
    label: 'O(n²)',
    meaning: 'Quadratic Time',
    desc: 'Time increases rapidly as input grows. If you double the input, it takes four times as long. Like comparing every student in a class to every other student.',
    example: 'Example: Bubble sort or checking all pairs in a list.',
    analogy: 'Analogy: Everyone in a room shaking hands with everyone else.',
    color: '#ef4444',
  },
];

export default function ComplexityVisualizer() {
  const [n, setN] = useState(30);
  const [selected, setSelected] = useState(complexityInfo.map((c) => c.label));
  const labels = Array.from({ length: n }, (_, i) => i + 1);

  const handleCheckbox = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const chartOptions = (title?: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#6b7280',
          font: { size: 15, weight: 'bold' } as any,
          boxWidth: 22,
          boxHeight: 12,
          padding: 18,
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'nearest' as const,
        intersect: false,
        callbacks: {
          title: (tooltipItems: any) => `Input size (n): ${tooltipItems[0].label}`,
          label: (context: any) =>
            `${context.dataset.label}: ${context.formattedValue}`,
        },
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#64748b',
        borderWidth: 1,
      },
      title: title
        ? {
            display: true,
            text: title,
            color: '#334155',
            font: { size: 16, weight: 'bold' } as any,
          }
        : undefined,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#6b7280' },
        grid: {
          color: 'rgba(100,116,139,0.1)',
          borderDash: [5, 5],
        },
      },
      x: {
        ticks: { color: '#6b7280' },
        grid: {
          color: 'rgba(100,116,139,0.05)',
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* 1. Brief Description */}
      <section>
        <h1 className="text-3xl font-bold text-primary dark:text-darkPrimary mb-2">
          Time Complexity in Data Structures
        </h1>
        <p className="text-text dark:text-textDark max-w-3xl">
          Time complexity describes how the time to complete an algorithm grows with input size.
          It's usually denoted using <span className="font-semibold text-primary dark:text-darkPrimary">Big-O Notation</span>, like O(n), O(1), etc., to express the upper bound of growth.
        </p>
      </section>

      {/* 2. Main Combined Graph */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-text dark:text-textDark mb-3">
          <BarChart2 className="w-5 h-5 text-primary dark:text-darkPrimary" />
          Combined Complexity Graph
        </h2>
        <div className="bg-surface dark:bg-surfaceDark p-6 rounded-xl shadow h-[450px] border border-borderL dark:border-borderDark relative overflow-visible">
          {/* Pill-style checkbox legend inside chart, now blended */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex flex-wrap gap-2 px-3 py-1 rounded-xl bg-white/40 dark:bg-black/30 shadow-sm backdrop-blur-md"
               style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)', border: 'none'}}>
            {complexityInfo.map(({ label, color }) => (
              <label
                key={label}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer transition text-xs font-semibold
                  ${selected.includes(label) ? 'ring-1 ring-primary/30 dark:ring-darkPrimary/30 bg-white/60 dark:bg-black/40' : 'opacity-60 hover:opacity-90'}`}
                style={{ userSelect: 'none', border: 'none' }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(label)}
                  onChange={() => handleCheckbox(label)}
                  className="accent-primary dark:accent-darkPrimary w-3.5 h-3.5 rounded focus:ring-1 focus:ring-primary/30 dark:focus:ring-darkPrimary/30 transition border-none"
                  style={{ boxShadow: 'none' }}
                />
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span style={{ color }}>{label}</span>
              </label>
            ))}
          </div>
          <Line
            data={{
              labels,
              datasets: complexityInfo
                .filter(({ label }) => selected.includes(label))
                .map(({ label, color }) => ({
                  label,
                  data: complexityFunctions[label](n),
                  borderColor: color,
                  borderWidth: 2,
                  tension: 0.3,
                  pointRadius: 2,
                  fill: false,
                })),
            }}
            options={{
              ...chartOptions(),
              plugins: {
                ...chartOptions().plugins,
                legend: { display: false },
              },
            }}
          />
        </div>
      </section>

      {/* 3. One-line intro to all types */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-text dark:text-textDark mb-4">
          <Brain className="w-5 h-5 text-primary dark:text-darkPrimary" />
          Complexity Quick View
        </h2>
        <ul className="list-disc pl-6 text-text dark:text-textDark space-y-3">
          <li><strong>O(1):</strong> Constant Time — Always takes the same time, no matter the input. <span className='text-xs text-text/70 dark:text-textDark/70'>(Like grabbing a book from a known spot.)</span></li>
          <li><strong>O(log n):</strong> Logarithmic Time — Gets slower slowly as input grows. <span className='text-xs text-text/70 dark:text-textDark/70'>(Like guessing a number by halving the range each time.)</span></li>
          <li><strong>O(n):</strong> Linear Time — Time grows directly with input. <span className='text-xs text-text/70 dark:text-textDark/70'>(Like reading every page in a book.)</span></li>
          <li><strong>O(n log n):</strong> Linearithmic Time — A bit more than linear, common in fast sorting. <span className='text-xs text-text/70 dark:text-textDark/70'>(Like sorting cards by splitting and merging.)</span></li>
          <li><strong>O(n²):</strong> Quadratic Time — Gets slow fast as input grows. <span className='text-xs text-text/70 dark:text-textDark/70'>(Like everyone shaking hands with everyone else.)</span></li>
        </ul>
      </section>

      {/* 4. Theory + Individual Graphs */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-text dark:text-textDark mb-6">
          <BookOpen className="w-5 h-5 text-primary dark:text-darkPrimary" />
          Individual Complexity Types
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {complexityInfo.map(({ label, meaning, desc, color, example, analogy }, idx) => (
            <div
              key={label}
              className="bg-gradient-to-br from-surface/80 via-white/60 to-primary/10 dark:from-surfaceDark/80 dark:via-black/40 dark:to-darkPrimary/10 p-5 rounded-2xl shadow-lg border border-borderL dark:border-borderDark space-y-3 transition-transform hover:scale-[1.025] hover:shadow-xl backdrop-blur-sm"
            >
              <h3 className="text-lg font-bold text-primary dark:text-darkPrimary flex items-center gap-2">
                <span style={{ color }}>{label}</span> <span className="text-text dark:text-textDark/80 font-normal">- {meaning}</span>
              </h3>
              <p className="text-sm text-text dark:text-textDark/80 mb-1">{desc}</p>
              <p className="text-xs text-text/70 dark:text-textDark/70 mb-1"><strong>Example:</strong> {example}</p>
              <p className="text-xs text-text/70 dark:text-textDark/70 mb-2"><strong>Analogy:</strong> {analogy}</p>
              <div className="h-[230px] bg-white/60 dark:bg-black/30 rounded-xl shadow-inner p-2 flex items-center justify-center">
                <Line
                  data={{
                    labels,
                    datasets: [
                      {
                        label,
                        data: complexityFunctions[label](n),
                        borderColor: color,
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 2,
                        fill: false,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions(label),
                    plugins: {
                      ...chartOptions(label).plugins,
                      legend: { display: false },
                    },
                  }}
                />
              </div>
            </div>
          ))}
          {/* If odd number of cards, add an invisible placeholder to center the last card */}
          {complexityInfo.length % 2 === 1 && (
            <div className="hidden md:block" aria-hidden="true"></div>
          )}
        </div>
      </section>
    </div>
  );
}
