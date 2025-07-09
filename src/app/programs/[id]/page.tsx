// src/app/programs/[id]/page.tsx
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Program from '@/models/program';
import ProgramViewer from '@/components/ProgramViewer';

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
  await connectDB();

  const id = params?.id;
  if (!id) return notFound();

  const program = await Program.findById(id).lean();
  if (!program || Array.isArray(program)) return notFound();

  return (
    <ProgramViewer
      title={program.title}
      chapter={program.chapterNumber}
      language={program.language}
      description={program.description}
      code={program.code}
    />
  );
}