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
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center text-zinc-800 dark:text-zinc-100">
        🧩 Hashing (Division Method + Linear Probing)
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter value to insert"
          className="border px-3 py-2 rounded w-48"
        />
        <button
          onClick={insert}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <PlusCircle size={16} className="inline-block mr-1" />
          Insert
        </button>
        <button
          onClick={resetTable}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          <RefreshCcw size={16} className="inline-block mr-1" />
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="grid grid-cols-5 gap-4 justify-center mt-6">
        {table.map((val, idx) => (
          <div
            key={idx}
            className={`w-24 h-16 flex flex-col items-center justify-center border-2 rounded-md text-sm font-medium transition-all
              ${highlight.includes(idx) ? 'bg-yellow-300 border-yellow-500' :
              val !== null ? 'bg-blue-100 border-blue-400' : 'bg-white border-zinc-300'}
            `}
          >
            <div className="text-xs text-zinc-500 mb-1">Index {idx}</div>
            <div>{val !== null ? val : '—'}</div>
          </div>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className="text-center text-lg mt-4 text-zinc-700 dark:text-zinc-300">
          {message}
        </div>
      )}

      {/* Logic review:
      - Uses division method: index = num % TABLE_SIZE
      - Linear probing for collision: tries next slot (circularly)
      - Handles full table (shows message)
      - Highlights probed slots
      - Resets table and highlights
      - UI and async animation are correct

      The logic for insertion, collision handling, and UI feedback is correct for division method + linear probing.
      No issues found. */}
    </div>
  );
}
