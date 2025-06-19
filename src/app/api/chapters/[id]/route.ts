import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Chapter } from '@/models/chapter';

// 🟢 GET /api/chapters/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const chapter = await Chapter.findById(params.id);
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// 🟡 PUT /api/chapters/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const data = await req.json();

  const updated = await Chapter.findByIdAndUpdate(params.id, data, { new: true });

  if (!updated) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// 🔴 Optionally: DELETE handler
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const deleted = await Chapter.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Chapter deleted' });
}
