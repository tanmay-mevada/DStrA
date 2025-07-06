'use client';

import { useState } from 'react';
import { RefreshCcw, PlusCircle } from 'lucide-react';

export default function HashingVisualizer() {
  const TABLE_SIZE = 10;
  const [table, setTable] = useState<(number | null)[]>(Array(TABLE_SIZE).fill(null));
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [highlight, setHighlight] = useState<number[]>([]);

  const resetTable = () => {
    setTable(Array(TABLE_SIZE).fill(null));
    setInput('');
    setMessage('');
    setHighlight([]);
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const insert = async () => {
    const num = parseInt(input.trim());
    if (isNaN(num)) return setMessage('❗ Enter a valid number');
    setMessage('');
    setHighlight([]);

    const index = num % TABLE_SIZE;
    let pos = index;
    const tempTable = [...table];

    for (let i = 0; i < TABLE_SIZE; i++) {
      setHighlight([pos]);
      await delay(400);

      if (tempTable[pos] === null) {
        tempTable[pos] = num;
        setTable(tempTable);
        setMessage(`✅ Inserted at index ${pos} using linear probing`);
        setHighlight([]);
        return;
      } else {
        setMessage(`⚠️ Collision at index ${pos}, trying next...`);
        pos = (pos + 1) % TABLE_SIZE;
      }
    }

    setMessage('❌ Table is full! Could not insert.');
    setHighlight([]);
  };

  return (
    <div className="min-h-screen w-full bg-background dark:bg-backgroundDark flex items-center justify-center py-0">
      <div className="max-w-3xl w-full mx-auto px-4 py-10 space-y-10">
        <h1 className="text-3xl font-bold text-center text-primary dark:text-darkPrimary mb-2 drop-shadow">
           Hashing (Division Method + Linear Probing)
        </h1>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-white/80 dark:bg-zinc-900/80 border border-primary/15 dark:border-darkPrimary/15 rounded-2xl shadow-md px-6 py-5 mb-4 backdrop-blur-md glass-gradient">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter value to insert"
            className="border border-primary/20 dark:border-darkPrimary/20 px-3 py-2 rounded-lg w-48 bg-white/90 dark:bg-zinc-900/90 focus:ring-2 focus:ring-accent dark:focus:ring-accentDark outline-none transition"
          />
          <button
            onClick={insert}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition-all"
          >
            <PlusCircle size={16} /> Insert
          </button>
          <button
            onClick={resetTable}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-600 transition-all"
          >
            <RefreshCcw size={16} /> Reset
          </button>
        </div>

        {/* Table */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 justify-center mt-6 bg-white/80 dark:bg-zinc-900/80 border border-primary/10 dark:border-darkPrimary/10 rounded-2xl shadow-inner px-6 py-6 backdrop-blur-md glass-gradient">
          {table.map((val, idx) => (
            <div
              key={idx}
              className={`w-24 h-16 flex flex-col items-center justify-center border-2 rounded-xl text-base font-semibold transition-all duration-300 shadow-sm
                ${highlight.includes(idx) ? 'bg-yellow-300 border-yellow-500' :
                val !== null ? 'bg-blue-100 border-blue-400' : 'bg-white border-primary/20 dark:bg-zinc-900/40 dark:border-darkPrimary/20'}
              `}
            >
              <div className="text-xs text-zinc-500 mb-1">Index {idx}</div>
              <div>{val !== null ? val : '—'}</div>
            </div>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="text-center mt-4 text-lg font-medium text-primary dark:text-darkPrimary bg-white/80 dark:bg-zinc-900/80 border border-primary/10 dark:border-darkPrimary/10 rounded-xl px-4 py-3 shadow-sm backdrop-blur-md glass-gradient">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
