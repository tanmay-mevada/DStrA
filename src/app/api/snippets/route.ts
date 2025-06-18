import { connectDB } from '@/lib/db';
import { Snippet } from '@/models/snippet';
import { NextRequest, NextResponse } from 'next/server';
import '@/models/chapter'; // ✅ Ensure Chapter model is registered for populate()

export async function GET(req: NextRequest) {
  await connectDB();
  const snippets = await Snippet.find().populate('chapterId');
  return NextResponse.json(snippets);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  const newSnippet = await Snippet.create(data);
  // Optional: Populate the returned snippet with chapter details
  const populatedSnippet = await Snippet.findById(newSnippet._id).populate('chapterId');

  return NextResponse.json(populatedSnippet, { status: 201 });
}
