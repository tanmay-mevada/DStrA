import { NextResponse } from 'next/server';
import Program from '@/models/program';
import connectDB from '@/lib/db';

// GET a single program by ID
export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = context.params;

  try {
    const program = await Program.findById(id);
    if (!program) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }
    return NextResponse.json(program);
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// UPDATE a program by ID
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = context.params;
  const body = await req.json();

  try {
    const updated = await Program.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

// DELETE a program by ID
export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = context.params;

  try {
    const deleted = await Program.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (err) {
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
