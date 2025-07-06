'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCcw, AlertTriangle, Ban } from 'lucide-react';

// Stack Box Component
function StackBox({ value, isTop }: { value: string; isTop: boolean }) {
  return (
    <div className="relative w-full max-w-lg h-10 border border-primary/40 dark:border-darkPrimary/40 rounded-xl bg-white/70 dark:bg-zinc-900/70 text-primary dark:text-darkPrimary flex items-center justify-center mb-2 shadow-sm backdrop-blur-md transition-all duration-200">
      <span className="truncate px-2 font-medium text-base tracking-wide">{value}</span>
      {isTop && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-accent dark:text-accentDark bg-white/90 dark:bg-zinc-900/90 px-2 py-0.5 rounded shadow-sm border border-accent/30 dark:border-accentDark/30 backdrop-blur">
          Top
        </span>
      )}
    </div>
  );
}

// Empty Slot Component
function EmptySlot() {
  return (
    <div className="w-full max-w-lg h-10 border border-dashed border-primary/20 dark:border-darkPrimary/20 rounded-xl mb-2 opacity-20 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md" />
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
      className="border border-primary/20 dark:border-darkPrimary/20 rounded-2xl p-6 bg-white/70 dark:bg-zinc-900/70 min-h-[220px] max-h-[400px] overflow-y-auto shadow-lg backdrop-blur-md glass-gradient flex flex-col items-center"
    >
      <div className="flex flex-col-reverse items-center w-full">
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

  // Handlers
  const push = () => {
    setError(null);
    if (!input.trim()) return;
    if (stack.length >= size) {
      setError('Stack Overflow: Maximum size reached.');
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
      setError('Stack Underflow: Stack is already empty.');
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
    <div className="min-h-screen w-full bg-background dark:bg-backgroundDark flex items-center justify-center py-10">
      <div className="w-full max-w-2xl mx-auto px-0 sm:px-4 py-0 sm:py-8">
        <div className="rounded-2xl shadow-xl border border-primary/15 dark:border-darkPrimary/15 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md flex flex-col items-center gap-0">
          <div className="w-full px-10 pt-8 pb-4 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary dark:text-darkPrimary mb-1 drop-shadow-sm tracking-tight">
              Stack Operations Visualizer
            </h1>
            <p className="text-center text-zinc-500 dark:text-zinc-400 mb-4 text-base font-medium">
              Visualize stack push/pop, overflow/underflow, and size limit.
            </p>
            {/* Stack Size Input */}
            <div className="flex items-center gap-3 justify-center text-sm text-zinc-700 dark:text-zinc-300 w-full mb-4">
              <label htmlFor="stack-size" className="font-semibold">Stack Size:</label>
              <input
                id="stack-size"
                type="number"
                min={1}
                max={20}
                value={size}
                onChange={handleSizeChange}
                className="border border-primary/30 dark:border-darkPrimary/30 px-2 py-1 w-16 rounded text-center bg-white/90 dark:bg-zinc-900/90 focus:ring-2 focus:ring-accent dark:focus:ring-accentDark outline-none transition font-semibold"
              />
              <span className="opacity-60">(max 20)</span>
            </div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full mb-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter value"
                className="border border-primary/30 dark:border-darkPrimary/30 px-3 py-2 rounded w-full sm:w-auto bg-white/90 dark:bg-zinc-900/90 focus:ring-2 focus:ring-accent dark:focus:ring-accentDark outline-none transition font-medium"
                onKeyDown={e => {
                  if (e.key === 'Enter') push();
                }}
                maxLength={16}
                autoComplete="off"
              />
              <button
                onClick={push}
                className="bg-accent dark:bg-accentDark text-white px-4 py-2 rounded-lg hover:bg-accent/90 dark:hover:bg-accentDark/90 shadow transition font-semibold w-full sm:w-auto"
              >
                Push
              </button>
              <button
                onClick={pop}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow transition font-semibold w-full sm:w-auto"
              >
                Pop
              </button>
              <button
                onClick={reset}
                title="Reset"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 shadow transition flex items-center justify-center w-full sm:w-auto"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
            {/* Error Message */}
            {error && (
              <div className="text-center text-red-600 font-medium flex items-center justify-center gap-2 w-full mb-2">
                {error.includes('Overflow') && <Ban className="w-5 h-5 text-red-500" />}
                {error.includes('Underflow') && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                <span className="truncate">{error.replace('Stack ', '')}</span>
              </div>
            )}
          </div>
          {/* Stack Visualizer */}
          <div className="w-full flex flex-col items-center px-10 pb-6">
            <StackVisualizer stack={stack} size={size} scrollToTop={scrollToTop} />
            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 font-medium w-full mt-2">
              Stack size: <span className="text-primary dark:text-darkPrimary font-bold">{stack.length}</span> / {size}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
