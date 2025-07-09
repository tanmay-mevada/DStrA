import connectDB from '@/lib/db';
import { Snippet } from '@/models/snippet';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(_: NextRequest, context) {
  await connectDB();
  const { id } = context.params;
  await Snippet.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Snippet deleted' });
}
