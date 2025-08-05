'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCcw, AlertTriangle, Ban, Plus, Minus } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';

// Stack Box Component
function StackBox({ value, isTop }: { value: string; isTop: boolean }) {
  return (
    <div className="relative w-full max-w-md h-12 sm:h-14 border-2 border-primary/40 dark:border-darkPrimary/40 rounded-xl bg-surface/70 dark:bg-surfaceDark/70 text-text dark:text-textDark flex items-center justify-center mb-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fadeIn">
      <span className="px-3 text-sm font-semibold tracking-wide truncate sm:text-base">{value}</span>
      {isTop && (
        <div className="absolute flex items-center gap-1 -translate-x-1/2 -top-6 left-1/2">
          <div className="px-2 py-1 text-xs font-bold border rounded-full shadow-sm text-primary dark:text-darkPrimary bg-surface dark:bg-surfaceDark border-primary/30 dark:border-darkPrimary/30 backdrop-blur">
            TOP
          </div>
          <div className="w-0 h-0 border-t-4 border-l-4 border-r-4 border-l-transparent border-r-transparent border-t-primary dark:border-t-darkPrimary"></div>
        </div>
      )}
    </div>
  );
}

// Empty Slot Component
function EmptySlot() {
  return (
    <div className="w-full h-12 max-w-md mb-2 transition-all duration-200 border-2 border-dashed sm:h-14 border-borderL/30 dark:border-borderDark/30 rounded-xl opacity-40 bg-surface/30 dark:bg-surfaceDark/30 backdrop-blur-sm" />
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
    <div className="w-full max-w-md mx-auto">
      <div
        ref={containerRef}
        className="border-2 border-borderL/20 dark:border-borderDark/20 rounded-2xl p-4 sm:p-6 bg-surface/80 dark:bg-surfaceDark/80 min-h-[280px] max-h-[400px] overflow-y-auto shadow-xl backdrop-blur-md flex flex-col items-center relative"
      >
        {/* Stack Base */}
        <div className="absolute w-full h-2 max-w-md -translate-x-1/2 rounded-full shadow-inner bottom-4 sm:bottom-6 left-1/2 bg-borderL/40 dark:bg-borderDark/40"></div>
        
        <div className="flex flex-col-reverse items-center w-full pb-4">
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

  const handleSizeChange = (newSize: number) => {
    const val = Math.max(1, Math.min(20, newSize));
    setSize(val);
    setError(null);
    if (stack.length > val) {
      setStack(stack.slice(0, val));
    }
  };

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

    if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4 bg-background dark:bg-backgroundDark">
      <div className="w-full max-w-4xl mx-auto">
        <div className="overflow-hidden border shadow-xl rounded-2xl border-borderL/20 dark:border-borderDark/20 bg-surface/90 dark:bg-surfaceDark/90 backdrop-blur-md">
          
          {/* Header */}
          <div className="px-6 py-8 text-center bg-primary dark:bg-darkPrimary">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Stack Operations Visualizer
            </h1>
            <p className="max-w-2xl mx-auto text-sm font-medium text-white/90 sm:text-base">
              Interactive visualization of stack data structure with push/pop operations and overflow/underflow detection
            </p>
          </div>

          <div className="p-6 space-y-6 sm:p-8">
            
            {/* Stack Size Controls */}
            <div className="p-4 border bg-surface/50 dark:bg-surfaceDark/50 rounded-2xl sm:p-6 border-borderL/20 dark:border-borderDark/20">
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <label className="text-sm font-semibold sm:text-base text-text dark:text-textDark">
                  Stack Size:
                </label>
                <div className="flex items-center gap-2 p-2 border shadow-inner bg-background dark:bg-backgroundDark rounded-xl border-borderL/20 dark:border-borderDark/20">
                  <button
                    onClick={() => handleSizeChange(size - 1)}
                    disabled={size <= 1}
                    className="p-2 transition border rounded-lg bg-surface dark:bg-surfaceDark hover:bg-borderL/20 dark:hover:bg-borderDark/20 disabled:opacity-50 disabled:cursor-not-allowed border-borderL/20 dark:border-borderDark/20"
                  >
                    <Minus size={16} className="text-text dark:text-textDark" />
                  </button>
                  <span className="w-12 text-lg font-bold text-center text-text dark:text-textDark">
                    {size}
                  </span>
                  <button
                    onClick={() => handleSizeChange(size + 1)}
                    disabled={size >= 20}
                    className="p-2 transition border rounded-lg bg-surface dark:bg-surfaceDark hover:bg-borderL/20 dark:hover:bg-borderDark/20 disabled:opacity-50 disabled:cursor-not-allowed border-borderL/20 dark:border-borderDark/20"
                  >
                    <Plus size={16} className="text-text dark:text-textDark" />
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-borderL dark:text-borderDark">
                  (max 20)
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
                  placeholder="Enter value to push"
                  className="flex-1 px-4 py-3 font-medium transition border-2 outline-none border-borderL/30 dark:border-borderDark/30 rounded-xl bg-background dark:bg-backgroundDark focus:ring-2 focus:ring-primary dark:focus:ring-darkPrimary focus:border-transparent text-text dark:text-textDark placeholder-borderL dark:placeholder-borderDark"
                  onKeyDown={e => {
                    if (e.key === 'Enter') push();
                  }}
                  maxLength={16}
                  autoComplete="off"
                />
                <div className="flex gap-2">
                  <button
                    onClick={push}
                    disabled={!input.trim() || stack.length >= size}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 disabled:bg-borderL/50 dark:disabled:bg-borderDark/50 text-white px-6 py-3 rounded-xl shadow-lg transition font-semibold disabled:cursor-not-allowed disabled:opacity-50 min-w-[80px]"
                  >
                    Push
                  </button>
                  <button
                    onClick={pop}
                    disabled={stack.length === 0}
                    className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 disabled:bg-borderL/50 dark:disabled:bg-borderDark/50 text-white px-6 py-3 rounded-xl shadow-lg transition font-semibold disabled:cursor-not-allowed disabled:opacity-50 min-w-[80px]"
                  >
                    Pop
                  </button>
                  <button
                    onClick={reset}
                    title="Reset Stack"
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
                      {error.replace('Stack ', '')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Stack Visualizer */}
            <div className="space-y-4">
              <StackVisualizer stack={stack} size={size} scrollToTop={scrollToTop} />
              
              {/* Stack Info */}
              <div className="p-4 text-center border bg-primary/10 dark:bg-darkPrimary/10 rounded-2xl border-primary/20 dark:border-darkPrimary/20">
                <div className="text-sm font-medium sm:text-base text-text dark:text-textDark">
                  Stack Elements: 
                  <span className="ml-2 text-lg font-bold sm:text-xl text-primary dark:text-darkPrimary">
                    {stack.length}
                  </span>
                  <span className="mx-2 text-borderL dark:text-borderDark">/</span>
                  <span className="text-lg font-bold sm:text-xl text-primary dark:text-darkPrimary">
                    {size}
                  </span>
                </div>
                <div className="w-full h-2 mt-2 overflow-hidden border rounded-full bg-surface dark:bg-surfaceDark border-borderL/20 dark:border-borderDark/20">
                  <div
                    className="h-full transition-all duration-300 ease-out bg-primary dark:bg-darkPrimary"
                    style={{ width: `${(stack.length / size) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}