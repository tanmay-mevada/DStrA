'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

// Queue Box Component
function QueueBox({ value, isFront, isRear }: { value: string; isFront: boolean; isRear: boolean }) {
  return (
    <div className="relative w-20 h-20 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900 rounded flex items-center justify-center text-blue-700 dark:text-blue-100 font-semibold transition-all duration-200">
      <span className="truncate px-2">{value}</span>
      {isFront && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-green-600 font-bold">
          Front
        </div>
      )}
      {isRear && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-purple-600 font-bold">
          Rear
        </div>
      )}
    </div>
  );
}

// Empty Slot Component
function EmptyQueueSlot() {
  return (
    <div className="w-20 h-20 border-2 border-dashed border-blue-300 rounded opacity-20" />
  );
}

// Queue Visualizer Component
function QueueVisualizer({
  queue,
  maxSize,
}: {
  queue: string[];
  maxSize: number;
}) {
  return (
    <div
      className="flex flex-nowrap justify-center items-end gap-3 min-h-[150px] mt-1 pb-4 w-full overflow-x-visible"
    >
      {queue.length === 0 ? (
        <p className="text-zinc-400">Queue is empty</p>
      ) : (
        queue.map((item, i) => (
          <QueueBox
            key={i}
            value={item}
            isFront={i === 0}
            isRear={i === queue.length - 1}
          />
        ))
      )}

      {/* Empty slots */}
      {Array.from({ length: maxSize - queue.length }).map((_, i) => (
        <EmptyQueueSlot key={`empty-${i}`} />
      ))}
    </div>
  );
}

export default function QueueVisualizerPage() {
  const [queue, setQueue] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [maxSize, setMaxSize] = useState(6);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const enqueue = () => {
    setError(null);
    if (!input.trim()) return;
    if (queue.length >= maxSize) {
      setError('🚫 Queue Overflow: Maximum capacity reached.');
      return;
    }
    setQueue([...queue, input.trim()]);
    setInput('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const dequeue = () => {
    setError(null);
    if (queue.length === 0) {
      setError('⚠️ Queue Underflow: No elements to remove.');
      return;
    }
    setQueue(queue.slice(1));
  };

  const reset = () => {
    setQueue([]);
    setInput('');
    setError(null);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(3, Math.min(12, Number(e.target.value)));
    setMaxSize(val);
    setError(null);
    if (queue.length > val) {
      setQueue(queue.slice(0, val));
    }
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-200">
        🔄 Queue Operations Visualizer
      </h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mb-2 text-sm">
        Visualize queue enqueue/dequeue, overflow/underflow, and size limit.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter value"
          className="border px-3 py-2 rounded w-40"
          onKeyDown={e => {
            if (e.key === 'Enter') enqueue();
          }}
        />
        <button
          onClick={enqueue}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enqueue
        </button>
        <button
          onClick={dequeue}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Dequeue
        </button>
        <button
          onClick={reset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          <RefreshCcw size={16} />
        </button>
        <div className="flex items-center gap-2 text-sm ml-2">
          Max Size:
          <input
            type="number"
            min={3}
            max={12}
            value={maxSize}
            onChange={handleSizeChange}
            className="border px-2 py-1 w-16 rounded"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center text-red-600 font-medium">{error}</div>
      )}

      {/* Queue display */}
      <QueueVisualizer queue={queue} maxSize={maxSize} />

      <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Queue size: {queue.length} / {maxSize}
      </div>
    </div>
  );
}
