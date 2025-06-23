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
    desc: 'Time remains the same no matter the input size.',
    color: '#3b82f6',
  },
  {
    label: 'O(log n)',
    meaning: 'Logarithmic Time',
    desc: 'Grows slowly even as input increases significantly.',
    color: '#16a34a',
  },
  {
    label: 'O(n)',
    meaning: 'Linear Time',
    desc: 'Time grows proportionally with input size.',
    color: '#f59e0b',
  },
  {
    label: 'O(n log n)',
    meaning: 'Linearithmic Time',
    desc: 'Efficient for complex operations like Merge/Quick sort.',
    color: '#8b5cf6',
  },
  {
    label: 'O(n²)',
    meaning: 'Quadratic Time',
    desc: 'Very slow for large input, often seen in nested loops.',
    color: '#ef4444',
  },
];

export default function ComplexityVisualizer() {
  const [n, setN] = useState(30);
  const labels = Array.from({ length: n }, (_, i) => i + 1);

  const chartOptions = (title?: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#6b7280' },
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
            font: { size: 16, weight: 'bold' },
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
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Time Complexity in Data Structures
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Time complexity describes how the time to complete an algorithm grows with input size.
          It's usually denoted using **Big-O Notation**, like O(n), O(1), etc., to express the upper bound of growth.
        </p>
      </section>

      {/* 2. Main Combined Graph */}
      <section>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-3">📊 Combined Complexity Graph</h2>
        <div className="mb-4">
          <label className="text-sm text-zinc-600 dark:text-zinc-300">
            Adjust Input Size (n): <strong>{n}</strong>
          </label>
          <input
            type="range"
            min={5}
            max={100}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow h-[450px]">
          <Line
            data={{
              labels,
              datasets: complexityInfo.map(({ label, color }) => ({
                label,
                data: complexityFunctions[label](n),
                borderColor: color,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 2,
                fill: false,
              })),
            }}
            options={chartOptions()}
          />
        </div>
      </section>

      {/* 3. One-line intro to all types */}
      <section>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">🧠 Complexity Quick View</h2>
        <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-1">
          <li><strong>O(1):</strong> Constant Time — Fastest possible.</li>
          <li><strong>O(log n):</strong> Logarithmic Time — Efficient for binary splits.</li>
          <li><strong>O(n):</strong> Linear Time — Time grows directly with input.</li>
          <li><strong>O(n log n):</strong> Linearithmic Time — Seen in Merge/Quick Sort.</li>
          <li><strong>O(n²):</strong> Quadratic Time — Poor for large inputs (e.g., Bubble Sort).</li>
        </ul>
      </section>

      {/* 4. Theory + Individual Graphs */}
      <section>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6">📘 Individual Complexity Types</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {complexityInfo.map(({ label, meaning, desc, color }) => (
            <div key={label} className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow space-y-3">
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">{label} - {meaning}</h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{desc}</p>
              <div className="h-[250px]">
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
                  options={chartOptions(label)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
