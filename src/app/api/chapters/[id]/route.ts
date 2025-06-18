import { connectDB } from '@/lib/db';
import { Chapter } from '@/models/chapter';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const chapter = await Chapter.findById(params.id);
  if (!chapter) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(chapter);
}
