'use client';

import { useState } from 'react';
import { RefreshCcw, PlusCircle, BookOpen, X, Play, Hash, AlertTriangle, CheckCircle, XCircle, Calculator, Database, Settings, Users, Lock, Zap } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

export default function HashingVisualizer() {
  const TABLE_SIZE = 10;
  const [table, setTable] = useState<(number | null)[]>(Array(TABLE_SIZE).fill(null));
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [highlight, setHighlight] = useState<number[]>([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const resetTable = () => {
    setTable(Array(TABLE_SIZE).fill(null));
    setInput('');
    setMessage('');
    setHighlight([]);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const insert = async () => {
    const num = parseInt(input.trim());
    if (isNaN(num)) return setMessage('Enter a valid number');
    if (isAnimating) return;
    
    setIsAnimating(true);
    setMessage('');
    setHighlight([]);
    setCurrentStep(0);

    const index = num % TABLE_SIZE;
    let pos = index;
    const tempTable = [...table];

    // Show hash calculation
    setMessage(`Hash calculation: ${num} % ${TABLE_SIZE} = ${index}`);
    await delay(1000);

    for (let i = 0; i < TABLE_SIZE; i++) {
      setCurrentStep(i + 1);
      setHighlight([pos]);
      await delay(800);

      if (tempTable[pos] === null) {
        tempTable[pos] = num;
        setTable(tempTable);
        setMessage(`Inserted ${num} at index ${pos} ${i > 0 ? `(after ${i} probes)` : ''}`);
        setHighlight([]);
        setIsAnimating(false);
        return;
      } else {
        setMessage(`Collision at index ${pos}! Value ${tempTable[pos]} already exists. Probing next position...`);
        pos = (pos + 1) % TABLE_SIZE;
      }
    }

    setMessage('Table is full! Could not insert.');
    setHighlight([]);
    setIsAnimating(false);
  };

  const getLoadFactor = () => {
    const filled = table.filter(val => val !== null).length;
    return (filled / TABLE_SIZE * 100).toFixed(1);
  };

  const TheoryModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-800/10 backdrop-blur-sm">
      <div className="bg-white/30 dark:bg-zinc-900/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-primary/20 dark:border-darkPrimary/20">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white/40 dark:bg-zinc-900/40 border-primary/10 dark:border-darkPrimary/10">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-primary dark:text-darkPrimary">
            <BookOpen size={24} />
            Hash Tables Theory
          </h2>
          
        </div>
        
        <div className="p-6 space-y-6">
          <section>
            <h3 className="mb-3 text-xl font-semibold text-primary dark:text-darkPrimary">What is a Hash Table?</h3>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              A hash table is a data structure that implements an associative array, a structure that can map keys to values. It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.
            </p>
            <div className="p-4 border-l-4 border-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Time Complexity:</strong> Average O(1) for insertion, deletion, and search operations
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xl font-semibold text-primary dark:text-darkPrimary">Division Method</h3>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              The division method uses the formula: <code className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-800">hash(key) = key % table_size</code>
            </p>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Example:</strong> If we want to insert 23 into a table of size 10: hash(23) = 23 % 10 = 3
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xl font-semibold text-primary dark:text-darkPrimary">Linear Probing</h3>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Linear probing is a collision resolution technique where we search for the next available slot sequentially. If slot hash(key) is occupied, we try hash(key) + 1, then hash(key) + 2, and so on.
            </p>
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Clustering:</strong> Linear probing can cause primary clustering, where consecutive occupied slots form clusters, increasing search time.
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xl font-semibold text-primary dark:text-darkPrimary">Load Factor</h3>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Load factor = (Number of elements) / (Table size). A load factor above 0.7 typically indicates the need for table resizing to maintain performance.
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-xl font-semibold text-primary dark:text-darkPrimary">Applications</h3>
            <ul className="space-y-2 text-gray-700 list-disc list-inside dark:text-gray-300">
              <li>Database indexing</li>
              <li>Caching systems</li>
              <li>Symbol tables in compilers</li>
              <li>Implementing sets and maps</li>
              <li>Password storage (with cryptographic hash functions)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
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

  return (
    <div className="w-full min-h-screen px-2 py-4 bg-background dark:bg-backgroundDark sm:px-4 lg:px-8">
      <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="flex items-center justify-center gap-3 text-2xl font-bold sm:text-3xl lg:text-4xl text-primary dark:text-darkPrimary drop-shadow">
            <Hash size={32} className="sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
            Hash Table Visualizer
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-gray-600 sm:text-base dark:text-gray-400">
            Interactive visualization of hash table operations using division method and linear probing
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 border shadow-md bg-white/50 dark:bg-zinc-900/50 border-primary/15 dark:border-darkPrimary/15 rounded-2xl backdrop-blur-md sm:p-6">
          <div className="flex flex-col items-center justify-center gap-3 mb-4 sm:flex-row sm:gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter value to insert"
              disabled={isAnimating}
              className="w-full px-3 py-2 transition border rounded-lg outline-none border-primary/20 dark:border-darkPrimary/20 sm:w-48 bg-white/90 dark:bg-zinc-900/90 focus:ring-2 focus:ring-primary dark:focus:ring-darkPrimary disabled:opacity-50"
            />
            <div className="flex w-full gap-2 sm:w-auto">
              <button
                onClick={insert}
                disabled={isAnimating}
                className="flex items-center justify-center flex-1 gap-2 px-4 py-2 font-semibold text-white transition-all bg-green-600 rounded-lg shadow sm:flex-none hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnimating ? <Play size={16} className="animate-pulse" /> : <PlusCircle size={16} />}
                {isAnimating ? 'Inserting...' : 'Insert'}
              </button>
              <button
                onClick={resetTable}
                disabled={isAnimating}
                className="flex items-center justify-center flex-1 gap-2 px-4 py-2 font-semibold text-white transition-all bg-gray-500 rounded-lg shadow sm:flex-none hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCcw size={16} />
                Reset
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
            <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
              <span className="text-gray-600 dark:text-gray-400">
                Load Factor: <span className="font-semibold text-primary dark:text-darkPrimary">{getLoadFactor()}%</span>
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Table Size: <span className="font-semibold">{TABLE_SIZE}</span>
              </span>
              {currentStep > 0 && (
                <span className="text-gray-600 dark:text-gray-400">
                  Probes: <span className="font-semibold text-yellow-600">{currentStep}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hash Table */}
        <div className="p-4 border shadow-inner bg-white/40 dark:bg-zinc-900/40 border-primary/10 dark:border-darkPrimary/10 rounded-2xl backdrop-blur-md sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-center sm:text-xl text-primary dark:text-darkPrimary sm:mb-6">
            Hash Table (Size: {TABLE_SIZE})
          </h2>
          
          {/* Mobile: 2 columns, Tablet: 5 columns, Desktop: 10 columns */}
          <div className="grid justify-center grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10 sm:gap-3 lg:gap-4">
            {table.map((val, idx) => (
              <div
                key={idx}
                className={`aspect-square sm:aspect-auto sm:h-16 lg:h-20 flex flex-col items-center justify-center border-2 rounded-xl text-xs sm:text-sm lg:text-base font-semibold transition-all duration-300 shadow-sm
                  ${highlight.includes(idx) ? 'bg-yellow-300 border-yellow-500 scale-105' :
                  val !== null ? 'bg-blue-100 border-blue-400 dark:bg-blue-900/40 dark:border-blue-500' : 
                  'bg-white border-primary/20 dark:bg-zinc-900/40 dark:border-darkPrimary/20'}
                `}
              >
                <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">[{idx}]</div>
                <div className="text-sm font-bold text-center sm:text-base">
                  {val !== null ? val : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs sm:mt-6 sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 rounded border-primary/20 dark:bg-zinc-900/40 dark:border-darkPrimary/20"></div>
              <span className="text-gray-600 dark:text-gray-400">Empty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded dark:bg-blue-900/40 dark:border-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 border-2 border-yellow-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Current Position</span>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="text-center">
            <div className="inline-flex items-center max-w-full gap-2 px-4 py-3 text-sm font-medium border shadow-sm sm:text-base lg:text-lg text-primary dark:text-darkPrimary bg-white/50 dark:bg-zinc-900/50 border-primary/10 dark:border-darkPrimary/10 rounded-xl backdrop-blur-md">
              {message.includes('calculation') && <Calculator size={18} />}
              {message.includes('Inserted') && <CheckCircle size={18} />}
              {message.includes('Collision') && <AlertTriangle size={18} />}
              {message.includes('full') && <XCircle size={18} />}
              {message.includes('valid') && <AlertTriangle size={18} />}
              {message}
            </div>
          </div>
        )}

        {/* Theory Section */}
        <div className="p-6 border shadow-sm bg-white/50 dark:bg-zinc-900/50 border-primary/10 dark:border-darkPrimary/10 rounded-2xl backdrop-blur-md sm:p-8">
          <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold sm:text-3xl text-primary dark:text-darkPrimary">
            <BookOpen size={28} />
            Hash Tables Theory
          </h2>
          
          <div className="space-y-8">
            <section>
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-primary dark:text-darkPrimary">
                <Hash size={20} />
                What is a Hash Table?
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                A hash table is a data structure that implements an associative array, a structure that can map keys to values. It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.
              </p>
              <div className="p-4 border-l-4 border-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                  <Zap size={16} />
                  <strong>Time Complexity:</strong> Average O(1) for insertion, deletion, and search operations
                </p>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-primary dark:text-darkPrimary">
                <Calculator size={20} />
                Division Method
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                The division method uses the formula: <code className="px-2 py-1 font-mono bg-gray-100 rounded dark:bg-gray-800">hash(key) = key % table_size</code>
              </p>
              <div className="p-4 border-l-4 border-green-400 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                  <CheckCircle size={16} />
                  <strong>Example:</strong> If we want to insert 23 into a table of size 10: hash(23) = 23 % 10 = 3
                </p>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-primary dark:text-darkPrimary">
                <Settings size={20} />
                Linear Probing
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                Linear probing is a collision resolution technique where we search for the next available slot sequentially. If slot hash(key) is occupied, we try hash(key) + 1, then hash(key) + 2, and so on.
              </p>
              <div className="p-4 border-l-4 border-yellow-400 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <p className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle size={16} />
                  <strong>Clustering:</strong> Linear probing can cause primary clustering, where consecutive occupied slots form clusters, increasing search time.
                </p>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-primary dark:text-darkPrimary">
                <Database size={20} />
                Load Factor
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                Load factor = (Number of elements) / (Table size). A load factor above 0.7 typically indicates the need for table resizing to maintain performance.
              </p>
              <div className="p-4 border-l-4 border-purple-400 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  <strong>Current Load Factor:</strong> {getLoadFactor()}% ({table.filter(val => val !== null).length}/{TABLE_SIZE})
                </p>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-primary dark:text-darkPrimary">
                <Users size={20} />
                Real-World Applications
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Database size={18} className="text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">Database indexing</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Zap size={18} className="text-yellow-600" />
                  <span className="text-gray-700 dark:text-gray-300">Caching systems</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Settings size={18} className="text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Symbol tables in compilers</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Hash size={18} className="text-purple-600" />
                  <span className="text-gray-700 dark:text-gray-300">Implementing sets and maps</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Lock size={18} className="text-red-600" />
                  <span className="text-gray-700 dark:text-gray-300">Password storage</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Users size={18} className="text-indigo-600" />
                  <span className="text-gray-700 dark:text-gray-300">User session management</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
          <div className="p-4 border bg-white/30 dark:bg-zinc-900/30 rounded-xl border-primary/10 dark:border-darkPrimary/10">
            <div className="text-2xl font-bold text-primary dark:text-darkPrimary">
              {table.filter(val => val !== null).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Elements</div>
          </div>
          <div className="p-4 border bg-white/30 dark:bg-zinc-900/30 rounded-xl border-primary/10 dark:border-darkPrimary/10">
            <div className="text-2xl font-bold text-primary dark:text-darkPrimary">
              {table.filter(val => val === null).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Empty Slots</div>
          </div>
          <div className="p-4 border bg-white/30 dark:bg-zinc-900/30 rounded-xl border-primary/10 dark:border-darkPrimary/10">
            <div className="text-2xl font-bold text-primary dark:text-darkPrimary">
              {currentStep}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Last Probes</div>
          </div>
        </div>
      </div>
    </div>
  );
}