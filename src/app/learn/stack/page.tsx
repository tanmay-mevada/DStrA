'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

// Stack Box Component
function StackBox({ value, isTop }: { value: string; isTop: boolean }) {
  return (
    <div className="relative w-full max-w-xs h-10 border border-blue-600 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 flex items-center justify-center mb-2 transition-all duration-200">
      <span className="truncate px-2">{value}</span>
      {isTop && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-blue-600 dark:text-blue-300">
          Top
        </span>
      )}
    </div>
  );
}

// Empty Slot Component
function EmptySlot() {
  return (
    <div className="w-full max-w-xs h-10 border border-dashed border-blue-300 rounded mb-2 opacity-20" />
  );
}

// Stack Visualizer Component
function StackVisualizer({
  stack,
  size,
  scrollToTop,
}: {
  stack: string[];
  size: number;
  scrollToTop?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToTop && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [stack.length, scrollToTop]);

  return (
    <div
      ref={containerRef}
      className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900 min-h-[200px] max-h-[400px] overflow-y-auto"
    >
      <div className="flex flex-col-reverse items-center">
        {stack.map((item, idx) => (
          <StackBox
            key={idx}
            value={item}
            isTop={idx === stack.length - 1}
          />
        ))}
        {Array.from({ length: size - stack.length }).map((_, i) => (
          <EmptySlot key={`empty-${i}`} />
        ))}
      </div>
    </div>
  );
}

// Main Page Component
export default function StackOperationsPage() {
  const [stack, setStack] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [size, setSize] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [scrollToTop, setScrollToTop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = () => {
    setError(null);
    if (!input.trim()) return;
    if (stack.length >= size) {
      setError('🚫 Stack Overflow: Maximum size reached.');
      return;
    }
    setStack((prev) => [...prev, input.trim()]);
    setInput('');
    setScrollToTop(true);
    setTimeout(() => setScrollToTop(false), 100);
  };

  const pop = () => {
    setError(null);
    if (stack.length === 0) {
      setError('⚠️ Stack Underflow: Stack is already empty.');
      return;
    }
    setStack((prev) => prev.slice(0, -1));
  };

  const reset = () => {
    setStack([]);
    setInput('');
    setError(null);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(20, Number(e.target.value)));
    setSize(val);
    setError(null);
    if (stack.length > val) {
      setStack(stack.slice(0, val));
    }
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-200 mb-2">
        Stack Operations Visualizer
      </h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mb-4 text-sm">
        Visualize stack push/pop, overflow/underflow, and size limit.
      </p>

      {/* Stack Size Input */}
      <div className="flex items-center gap-3 justify-center text-sm text-zinc-700 dark:text-zinc-300">
        <label htmlFor="stack-size">Stack Size:</label>
        <input
          id="stack-size"
          type="number"
          min={1}
          max={20}
          value={size}
          onChange={handleSizeChange}
          className="border px-2 py-1 w-16 rounded text-center"
        />
        <span>(max 20)</span>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter value"
          className="border px-3 py-2 rounded w-full sm:w-auto"
          onKeyDown={e => {
            if (e.key === 'Enter') push();
          }}
        />
        <button
          onClick={push}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Push
        </button>
        <button
          onClick={pop}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Pop
        </button>
        <button
          onClick={reset}
          title="Reset"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 font-medium">{error}</div>
      )}

      {/* Stack Visualizer */}
      <StackVisualizer stack={stack} size={size} scrollToTop={scrollToTop} />

      <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Stack size: {stack.length} / {size}
      </div>
    </div>
  );
}
