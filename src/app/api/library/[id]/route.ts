import { NextRequest, NextResponse } from 'next/server';
import Library from '@/models/library';
import connectDB from '@/lib/db';

type ParamsPromise = Promise<{ id: string }>;

// GET a single library
export async function GET(
  req: NextRequest,
  context: { params: ParamsPromise }
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const lib = await Library.findById(id);
    if (!lib) {
      return NextResponse.json({ message: 'Library not found' }, { status: 404 });
    }
    return NextResponse.json(lib);
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// UPDATE a library
export async function PUT(
  req: NextRequest,
  context: { params: ParamsPromise }
) {
  const { id } = await context.params;
  await connectDB();
  const body = await req.json();

  try {
    const updated = await Library.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'Library not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

// DELETE a library
export async function DELETE(
  req: NextRequest,
  context: { params: ParamsPromise }
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const deleted = await Library.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Library not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Library deleted successfully' });
  } catch {
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
