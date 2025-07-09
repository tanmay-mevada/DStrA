import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Chapter } from '@/models/chapter';

// 🟢 GET /api/chapters/:id
export async function GET(req: NextRequest, context) {
  await connectDB();
  const { id } = context.params; // ✅ Access after await

  try {
    const chapter = await Chapter.findById(id);
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// 🟡 PUT /api/chapters/:id
export async function PUT(req: NextRequest, context) {
  await connectDB();
  const { id } = context.params; // ✅ Access after await

  try {
    const data = await req.json();
    const updated = await Chapter.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// 🔴 DELETE /api/chapters/:id
export async function DELETE(req: NextRequest, context) {
  await connectDB();
  const { id } = context.params; // ✅ Access after await

  try {
    const deleted = await Chapter.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
