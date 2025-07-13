'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCcw, AlertTriangle, Ban, Plus, Minus, ArrowRight } from 'lucide-react';

// Queue Box Component
function QueueBox({ value, isFront, isRear }: { value: string; isFront: boolean; isRear: boolean }) {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-2 border-primary/40 dark:border-darkPrimary/40 rounded-xl bg-surface/70 dark:bg-surfaceDark/70 text-text dark:text-textDark font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fadeIn flex items-center justify-center flex-shrink-0">
      <span className="truncate px-1 sm:px-2 text-xs sm:text-sm">{value}</span>
      {isFront && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="text-xs font-bold text-primary dark:text-darkPrimary bg-surface dark:bg-surfaceDark px-2 py-1 rounded-full shadow-sm border border-primary/30 dark:border-darkPrimary/30 backdrop-blur whitespace-nowrap">
            FRONT
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary dark:border-t-darkPrimary mt-1"></div>
        </div>
      )}
      {isRear && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-primary dark:border-b-darkPrimary mb-1"></div>
          <div className="text-xs font-bold text-primary dark:text-darkPrimary bg-surface dark:bg-surfaceDark px-2 py-1 rounded-full shadow-sm border border-primary/30 dark:border-darkPrimary/30 backdrop-blur whitespace-nowrap">
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
    <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-borderL/30 dark:border-borderDark/30 rounded-xl opacity-40 bg-surface/30 dark:bg-surfaceDark/30 backdrop-blur-sm transition-all duration-200 flex-shrink-0" />
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

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [queue.length]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="border-2 border-borderL/20 dark:border-borderDark/20 rounded-2xl p-4 sm:p-6 bg-surface/80 dark:bg-surfaceDark/80 shadow-xl backdrop-blur-md relative">
        
        {/* Direction indicators */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2 text-primary dark:text-darkPrimary">
            <span className="text-xs sm:text-sm font-semibold">DEQUEUE</span>
            <ArrowRight size={16} />
          </div>
          <div className="flex items-center gap-2 text-primary dark:text-darkPrimary">
            <ArrowRight size={16} />
            <span className="text-xs sm:text-sm font-semibold">ENQUEUE</span>
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
            <div className="w-full flex items-center justify-center h-24 sm:h-32">
              <p className="text-borderL dark:text-borderDark text-sm sm:text-base font-medium">
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
    <div className="min-h-screen w-full bg-background dark:bg-backgroundDark flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="rounded-2xl shadow-xl border border-borderL/20 dark:border-borderDark/20 bg-surface/90 dark:bg-surfaceDark/90 backdrop-blur-md overflow-hidden">
          
          {/* Header */}
          <div className="bg-primary dark:bg-darkPrimary px-6 py-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
              Queue Operations Visualizer
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-medium max-w-2xl mx-auto">
              Interactive visualization of queue data structure with enqueue/dequeue operations and FIFO behavior
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Queue Size Controls */}
            <div className="bg-surface/50 dark:bg-surfaceDark/50 rounded-2xl p-4 sm:p-6 border border-borderL/20 dark:border-borderDark/20">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <label className="text-sm sm:text-base font-semibold text-text dark:text-textDark">
                  Queue Size:
                </label>
                <div className="flex items-center gap-2 bg-background dark:bg-backgroundDark rounded-xl p-2 shadow-inner border border-borderL/20 dark:border-borderDark/20">
                  <button
                    onClick={() => handleSizeChange(maxSize - 1)}
                    disabled={maxSize <= 3}
                    className="p-2 rounded-lg bg-surface dark:bg-surfaceDark hover:bg-borderL/20 dark:hover:bg-borderDark/20 disabled:opacity-50 disabled:cursor-not-allowed transition border border-borderL/20 dark:border-borderDark/20"
                  >
                    <Minus size={16} className="text-text dark:text-textDark" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-text dark:text-textDark">
                    {maxSize}
                  </span>
                  <button
                    onClick={() => handleSizeChange(maxSize + 1)}
                    disabled={maxSize >= 12}
                    className="p-2 rounded-lg bg-surface dark:bg-surfaceDark hover:bg-borderL/20 dark:hover:bg-borderDark/20 disabled:opacity-50 disabled:cursor-not-allowed transition border border-borderL/20 dark:border-borderDark/20"
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
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter value to enqueue"
                  className="flex-1 border-2 border-borderL/30 dark:border-borderDark/30 px-4 py-3 rounded-xl bg-background dark:bg-backgroundDark focus:ring-2 focus:ring-primary dark:focus:ring-darkPrimary focus:border-transparent outline-none transition font-medium text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark"
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
                    className="bg-borderL dark:bg-borderDark hover:bg-borderL/80 dark:hover:bg-borderDark/80 text-white px-4 py-3 rounded-xl shadow-lg transition flex items-center justify-center"
                  >
                    <RefreshCcw size={18} />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg border border-borderL/20 dark:border-borderDark/20">
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
              <div className="bg-primary/10 dark:bg-darkPrimary/10 rounded-2xl p-4 text-center border border-primary/20 dark:border-darkPrimary/20">
                <div className="text-sm sm:text-base text-text dark:text-textDark font-medium">
                  Queue Elements: 
                  <span className="ml-2 text-lg sm:text-xl font-bold text-primary dark:text-darkPrimary">
                    {queue.length}
                  </span>
                  <span className="mx-2 text-borderL dark:text-borderDark">/</span>
                  <span className="text-lg sm:text-xl font-bold text-primary dark:text-darkPrimary">
                    {maxSize}
                  </span>
                </div>
                <div className="mt-2 w-full bg-surface dark:bg-surfaceDark rounded-full h-2 overflow-hidden border border-borderL/20 dark:border-borderDark/20">
                  <div
                    className="h-full bg-primary dark:bg-darkPrimary transition-all duration-300 ease-out"
                    style={{ width: `${(queue.length / maxSize) * 100}%` }}
                  />
                </div>
              </div>

              {/* FIFO Explanation */}
              <div className="bg-surface/50 dark:bg-surfaceDark/50 rounded-2xl p-4 text-center border border-borderL/20 dark:border-borderDark/20">
                <div className="text-sm sm:text-base text-text dark:text-textDark font-medium">
                  <span className="block sm:inline">FIFO (First In, First Out)</span>
                  <span className="hidden sm:inline mx-2 text-borderL dark:text-borderDark">•</span>
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