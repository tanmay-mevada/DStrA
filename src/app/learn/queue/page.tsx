'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCcw, AlertTriangle, Ban, Plus, Minus, ArrowRight } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

function QueueBox({ value, isFront, isRear }: { value: string; isFront: boolean; isRear: boolean }) {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0 w-16 h-16 font-semibold transition-all duration-300 border-2 sm:w-20 sm:h-20 border-primary/40 dark:border-darkPrimary/40 rounded-xl bg-surface/70 dark:bg-surfaceDark/70 text-text dark:text-textDark hover:shadow-lg hover:scale-105 animate-fadeIn">
      <span className="px-1 text-xs truncate sm:px-2 sm:text-sm">{value}</span>
      {isFront && (
        <div className="absolute flex flex-col items-center -translate-x-1/2 -top-8 left-1/2">
          <div className="px-2 py-1 text-xs font-bold border rounded-full shadow-sm text-primary dark:text-darkPrimary bg-surface dark:bg-surfaceDark border-primary/30 dark:border-darkPrimary/30 backdrop-blur whitespace-nowrap">
            FRONT
          </div>
          <div className="w-0 h-0 mt-1 border-t-4 border-l-4 border-r-4 border-l-transparent border-r-transparent border-t-primary dark:border-t-darkPrimary"></div>
        </div>
      )}
      {isRear && (
        <div className="absolute flex flex-col items-center -translate-x-1/2 -bottom-8 left-1/2">
          <div className="w-0 h-0 mb-1 border-b-4 border-l-4 border-r-4 border-l-transparent border-r-transparent border-b-primary dark:border-b-darkPrimary"></div>
          <div className="px-2 py-1 text-xs font-bold border rounded-full shadow-sm text-primary dark:text-darkPrimary bg-surface dark:bg-surfaceDark border-primary/30 dark:border-darkPrimary/30 backdrop-blur whitespace-nowrap">
            REAR
          </div>
        </div>
      )}
    </div>
  );
}

// Empty Slot Component
function EmptyQueueSlot() {
  return (
    <div className="flex-shrink-0 w-16 h-16 transition-all duration-200 border-2 border-dashed sm:w-20 sm:h-20 border-borderL/30 dark:border-borderDark/30 rounded-xl opacity-40 bg-surface/30 dark:bg-surfaceDark/30 backdrop-blur-sm" />
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
  const containerRef = useRef<HTMLDivElement>(null);
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

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [queue.length]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative p-4 border-2 shadow-xl border-borderL/20 dark:border-borderDark/20 rounded-2xl sm:p-6 bg-surface/80 dark:bg-surfaceDark/80 backdrop-blur-md">

        {/* Direction indicators */}
        <div className="flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-2 text-primary dark:text-darkPrimary">
            <span className="text-xs font-semibold sm:text-sm">DEQUEUE</span>
            <ArrowRight size={16} />
          </div>
          <div className="flex items-center gap-2 text-primary dark:text-darkPrimary">
            <ArrowRight size={16} />
            <span className="text-xs font-semibold sm:text-sm">ENQUEUE</span>
          </div>
        </div>

        {/* Queue Base */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-2 bg-borderL/40 dark:bg-borderDark/40 rounded-full shadow-inner"></div>

        <div
          ref={containerRef}
          className="flex flex-nowrap justify-start items-end gap-2 sm:gap-3 min-h-[120px] sm:min-h-[150px] overflow-x-auto pb-6 px-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {queue.length === 0 ? (
            <div className="flex items-center justify-center w-full h-24 sm:h-32">
              <p className="text-sm font-medium text-borderL dark:text-borderDark sm:text-base">
                Queue is empty
              </p>
            </div>
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
      </div>
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
      setError('Queue Overflow: Maximum capacity reached.');
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
      setError('Queue Underflow: No elements to remove.');
      return;
    }
    setQueue(queue.slice(1));
  };

  const reset = () => {
    setQueue([]);
    setInput('');
    setError(null);
  };

  const handleSizeChange = (newSize: number) => {
    const val = Math.max(3, Math.min(12, newSize));
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
    <div className="flex items-center justify-center w-full min-h-screen p-4 bg-background dark:bg-backgroundDark">
      <div className="w-full max-w-5xl mx-auto">
        <div className="overflow-hidden border shadow-xl rounded-2xl border-borderL/20 dark:border-borderDark/20 bg-surface/90 dark:bg-surfaceDark/90 backdrop-blur-md">

          {/* Header */}
          <div className="px-6 py-8 text-center bg-primary dark:bg-darkPrimary">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Queue Operations Visualizer
            </h1>
            <p className="max-w-2xl mx-auto text-sm font-medium text-white/90 sm:text-base">
              Interactive visualization of queue data structure with enqueue/dequeue operations and FIFO behavior
            </p>
          </div>

          <div className="p-6 space-y-6 sm:p-8">

            {/* Queue Size Controls */}
            <div className="p-4 border bg-surface/50 dark:bg-surfaceDark/50 rounded-2xl sm:p-6 border-borderL/20 dark:border-borderDark/20">
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <label className="text-sm font-semibold sm:text-base text-text dark:text-textDark">
                  Queue Size:
                </label>
                <div className="flex items-center gap-2 p-2 border shadow-inner bg-background dark:bg-backgroundDark rounded-xl border-borderL/20 dark:border-borderDark/20">
                  <button
                    onClick={() => handleSizeChange(maxSize - 1)}
                    disabled={maxSize <= 3}
                    className="p-2 transition border rounded-lg bg-surface dark:bg-surfaceDark hover:bg-borderL/20 dark:hover:bg-borderDark/20 disabled:opacity-50 disabled:cursor-not-allowed border-borderL/20 dark:border-borderDark/20"
                  >
                    <Minus size={16} className="text-text dark:text-textDark" />
                  </button>
                  <span className="w-12 text-lg font-bold text-center text-text dark:text-textDark">
                    {maxSize}
                  </span>
                  <button
                    onClick={() => handleSizeChange(maxSize + 1)}
                    disabled={maxSize >= 12}
                    className="p-2 transition border rounded-lg bg-surface dark:bg-surfaceDark hover:bg-borderL/20 dark:hover:bg-borderDark/20 disabled:opacity-50 disabled:cursor-not-allowed border-borderL/20 dark:border-borderDark/20"
                  >
                    <Plus size={16} className="text-text dark:text-textDark" />
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-borderL dark:text-borderDark">
                  (max 12)
                </span>
              </div>
            </div>

            {/* Input and Controls */}
            <div className="space-y-4">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter value to enqueue"
                  className="flex-1 px-4 py-3 font-medium transition border-2 outline-none border-borderL/30 dark:border-borderDark/30 rounded-xl bg-background dark:bg-backgroundDark focus:ring-2 focus:ring-primary dark:focus:ring-darkPrimary focus:border-transparent text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark"
                  onKeyDown={e => {
                    if (e.key === 'Enter') enqueue();
                  }}
                  maxLength={16}
                  autoComplete="off"
                />
                <div className="flex gap-2">
                  <button
                    onClick={enqueue}
                    disabled={!input.trim() || queue.length >= maxSize}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 disabled:bg-borderL/50 dark:disabled:bg-borderDark/50 text-white px-6 py-3 rounded-xl shadow-lg transition font-semibold disabled:cursor-not-allowed disabled:opacity-50 min-w-[100px]"
                  >
                    Enqueue
                  </button>
                  <button
                    onClick={dequeue}
                    disabled={queue.length === 0}
                    className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 disabled:bg-borderL/50 dark:disabled:bg-borderDark/50 text-white px-6 py-3 rounded-xl shadow-lg transition font-semibold disabled:cursor-not-allowed disabled:opacity-50 min-w-[100px]"
                  >
                    Dequeue
                  </button>
                  <button
                    onClick={reset}
                    title="Reset Queue"
                    className="flex items-center justify-center px-4 py-3 text-white transition shadow-lg bg-borderL dark:bg-borderDark hover:bg-borderL/80 dark:hover:bg-borderDark/80 rounded-xl"
                  >
                    <RefreshCcw size={18} />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 border border-l-4 border-red-500 rounded-lg bg-red-50 dark:bg-red-900/30 border-borderL/20 dark:border-borderDark/20">
                  <div className="flex items-center gap-2">
                    {error.includes('Overflow') && <Ban className="w-5 h-5 text-red-500" />}
                    {error.includes('Underflow') && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                    <span className="font-medium text-red-700 dark:text-red-300">
                      {error.replace('Queue ', '')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Queue Visualizer */}
            <div className="space-y-4">
              <QueueVisualizer queue={queue} maxSize={maxSize} />

              {/* Queue Info */}
              <div className="p-4 text-center border bg-primary/10 dark:bg-darkPrimary/10 rounded-2xl border-primary/20 dark:border-darkPrimary/20">
                <div className="text-sm font-medium sm:text-base text-text dark:text-textDark">
                  Queue Elements:
                  <span className="ml-2 text-lg font-bold sm:text-xl text-primary dark:text-darkPrimary">
                    {queue.length}
                  </span>
                  <span className="mx-2 text-borderL dark:text-borderDark">/</span>
                  <span className="text-lg font-bold sm:text-xl text-primary dark:text-darkPrimary">
                    {maxSize}
                  </span>
                </div>
                <div className="w-full h-2 mt-2 overflow-hidden border rounded-full bg-surface dark:bg-surfaceDark border-borderL/20 dark:border-borderDark/20">
                  <div
                    className="h-full transition-all duration-300 ease-out bg-primary dark:bg-darkPrimary"
                    style={{ width: `${(queue.length / maxSize) * 100}%` }}
                  />
                </div>
              </div>

              {/* FIFO Explanation */}
              <div className="p-4 text-center border bg-surface/50 dark:bg-surfaceDark/50 rounded-2xl border-borderL/20 dark:border-borderDark/20">
                <div className="text-sm font-medium sm:text-base text-text dark:text-textDark">
                  <span className="block sm:inline">FIFO (First In, First Out)</span>
                  <span className="hidden mx-2 sm:inline text-borderL dark:text-borderDark">•</span>
                  <span className="block sm:inline">Elements are removed in the order they were added</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}