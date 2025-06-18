import { connectDB } from '@/lib/db';
import { Chapter } from '@/models/chapter';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const chapters = await Chapter.find().sort({ createdAt: -1 });
  return NextResponse.json(chapters);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newChapter = await Chapter.create(data);
  return NextResponse.json(newChapter, { status: 201 });
}
