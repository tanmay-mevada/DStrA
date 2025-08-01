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
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Title);

// Time complexity functions
const complexityFunctions: Record<string, (n: number) => number[]> = {
  'O(1)': (n) => Array.from({ length: n }, () => 1),
  'O(log n)': (n) => Array.from({ length: n }, (_, i) => Math.log2(i + 1)),
  'O(n)': (n) => Array.from({ length: n }, (_, i) => i + 1),
  'O(n log n)': (n) => Array.from({ length: n }, (_, i) => (i + 1) * Math.log2(i + 1)),
  'O(n²)': (n) => Array.from({ length: n }, (_, i) => (i + 1) ** 2),
};

// Info for each type
const complexityInfo = [
  {
    label: 'O(1)',
    meaning: 'Constant Time',
    desc: 'No matter how big your input is, the time taken stays the same.',
    example: 'Accessing an array element by index.',
    analogy: 'Grabbing a book from a specific spot on a shelf.',
    color: '#3b82f6',
  },
  {
    label: 'O(log n)',
    meaning: 'Logarithmic Time',
    desc: 'Time increases slowly as input grows. Like binary search.',
    example: 'Binary search in a sorted list.',
    analogy: 'Guessing a number between 1 and 100 by halving each time.',
    color: '#16a34a',
  },
  {
    label: 'O(n)',
    meaning: 'Linear Time',
    desc: 'Time grows directly with the input size.',
    example: 'Looping through an array to find a value.',
    analogy: 'Checking every item in a grocery list one by one.',
    color: '#f59e0b',
  },
  {
    label: 'O(n log n)',
    meaning: 'Linearithmic Time',
    desc: 'Slightly more than linear. Common in efficient sorts.',
    example: 'Merge sort or quick sort.',
    analogy: 'Splitting and merging to organize books.',
    color: '#8b5cf6',
  },
  {
    label: 'O(n²)',
    meaning: 'Quadratic Time',
    desc: 'Time increases rapidly with input.',
    example: 'Bubble sort or comparing all pairs in a list.',
    analogy: 'Everyone in a room shaking hands with everyone else.',
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

  return (
    <div className="px-4 py-12 mx-auto space-y-12 overflow-hidden max-w-7xl">
      {/* Header */}
      <section>
        <h1 className="mb-2 text-4xl font-bold md:text-5xl text-primary dark:text-darkPrimary">
          Time Complexity in Data Structures
        </h1>
        <p className="max-w-3xl text-lg md:text-xl text-text dark:text-textDark">
          Time complexity shows how an algorithm scales with input size using <span className="font-semibold text-primary dark:text-darkPrimary">Big-O Notation</span>.
        </p>
      </section>

      {/* Combined Chart */}

<section>
  <h2 className="flex items-center gap-2 mb-3 text-2xl font-semibold md:text-3xl text-text dark:text-textDark">
    <BarChart2 className="w-6 h-6 text-primary dark:text-darkPrimary" />
    Combined Complexity Graph
  </h2>

  {/* Move legend outside the chart box */}
  <div className="flex flex-wrap justify-center gap-2 px-3 py-2 mb-4 border shadow-sm rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur-md border-borderL dark:border-borderDark">
    {complexityInfo.map(({ label, color }) => (
      <label
        key={label}
        className={`flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer text-xs md:text-sm font-semibold ${
          selected.includes(label)
            ? 'ring-1 ring-primary/30 dark:ring-darkPrimary/30 bg-white/60 dark:bg-black/40'
            : 'opacity-60 hover:opacity-90'
        }`}
      >
        <input
          type="checkbox"
          checked={selected.includes(label)}
          onChange={() => handleCheckbox(label)}
          className="accent-primary dark:accent-darkPrimary w-3.5 h-3.5 rounded border-none"
        />
        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
        <span style={{ color }}>{label}</span>
      </label>
    ))}
  </div>

  {/* Chart Container */}
  <div className="relative bg-surface dark:bg-surfaceDark p-6 rounded-xl shadow h-[450px] border border-borderL dark:border-borderDark overflow-hidden">
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


      {/* Quick List */}
      <section>
        <h2 className="flex items-center gap-2 mb-4 text-2xl font-semibold md:text-3xl text-text dark:text-textDark">
          <Brain className="w-6 h-6 text-primary dark:text-darkPrimary" />
          Complexity Quick View
        </h2>
        <ul className="pl-6 space-y-3 list-disc text-text dark:text-textDark">
          {complexityInfo.map((c) => (
            <li key={c.label}>
              <strong>{c.label}:</strong> {c.meaning} — {c.desc}{' '}
              <span className="text-xs text-text/70 dark:text-textDark/70">(e.g., {c.analogy})</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Individual Graph Cards */}
      <section>
        <h2 className="flex items-center gap-2 mb-6 text-2xl font-semibold md:text-3xl text-text dark:text-textDark">
          <BookOpen className="w-6 h-6 text-primary dark:text-darkPrimary" />
          Individual Complexity Types
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {complexityInfo.map(({ label, meaning, desc, color, example, analogy }) => (
            <div
              key={label}
              className="p-5 space-y-4 bg-white border shadow-lg dark:bg-gray-800/20 rounded-2xl border-borderL dark:border-borderDark hover:shadow-xl"
            >
              <h3 className="flex items-center gap-2 text-lg font-bold md:text-xl text-primary dark:text-darkPrimary">
                <span style={{ color }}>{label}</span>
                <span className="font-normal text-text dark:text-textDark/80">- {meaning}</span>
              </h3>
              <p className="text-sm md:text-base text-text dark:text-textDark/80">{desc}</p>
              <p className="text-xs text-text/70 dark:text-textDark/70">
                <strong>Example:</strong> {example}
              </p>
              <p className="text-xs text-text/70 dark:text-textDark/70">
                <strong>Analogy:</strong> {analogy}
              </p>
              <div className="w-full h-[250px] max-w-full overflow-hidden">
              
  <div className="min-w-[200]">
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

            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
