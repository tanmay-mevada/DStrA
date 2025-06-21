import connectDB from '@/lib/db';
import { Snippet } from '@/models/snippet';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await Snippet.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Snippet deleted' });
}
