import connectDB from '@/lib/db';
import Library from '@/models/library';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const libs = await Library.find().sort({ chapterNumber: 1 });
    return NextResponse.json(libs);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const newLib = await Library.create(data);
    return NextResponse.json(newLib, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
