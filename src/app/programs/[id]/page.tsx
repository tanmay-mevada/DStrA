'use client';

import { use } from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import ProgramViewer from '@/components/ProgramViewer';
import Spinner from '@/components/Spinner';
import { toast } from 'react-hot-toast';
import { trackUserActivity } from '@/lib/trackUserActivity';

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwrap the params Promise

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch program from API
  useEffect(() => {
    async function fetchProgram() {
      try {
        const res = await fetch(`/api/programs/${id}`);
        if (!res.ok) throw new Error('Program not found');
        const data = await res.json();
        setProgram(data);
      } catch (error) {
        toast.error('Program not found');
        router.replace('/404');
      } finally {
        setLoading(false);
      }
    }
    fetchProgram();
  }, [id, router]);

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      toast('Please Login to continue');
      router.replace('/auth/login');
      return;
    }
    if (session?.user) trackUserActivity(pathname);
  }, [session, status, router, pathname]);

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!program) return null;

  return (
    <ProgramViewer
      title={program.title}
      chapter={program.chapterNumber}
      language={program.language}
      description={program.description}
      code={program.code}
      programId={id}
    />
  );
}
