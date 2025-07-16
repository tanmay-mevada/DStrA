import { NextRequest, NextResponse } from 'next/server';
import Program from '@/models/program';
import connectDB from '@/lib/db';

type ParamsPromise = Promise<{ id: string }>;

// GET a single program
export async function GET(
  req: NextRequest,
  context: { params: ParamsPromise }
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const program = await Program.findById(id);
    if (!program) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }
    return NextResponse.json(program);
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// UPDATE a program
export async function PUT(
  req: NextRequest,
  context: { params: ParamsPromise }
) {
  const { id } = await context.params;
  await connectDB();
  const body = await req.json();

  try {
    const updated = await Program.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

// DELETE a program
export async function DELETE(
  req: NextRequest,
  context: { params: ParamsPromise }
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const deleted = await Program.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch {
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
