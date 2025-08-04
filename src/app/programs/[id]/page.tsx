'use client';

import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Program from '@/models/program';
import ProgramViewer from '@/components/ProgramViewer';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

export default async function ProgramDetailPage(props: any) {
  const { params } = props;
  await connectDB();

  const id = params?.id;
  if (!id) return notFound();

  const program = await Program.findById(id).lean();
  if (!program || Array.isArray(program)) return notFound();

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (status !== 'loading' && !session?.user) {
  //     toast('Please Login to continue');
  //     router.replace('/auth/login');
  //     return;
  //   }
  //   trackUserActivity(pathname);
  // }, [session, status, router, pathname]);

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }
  
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