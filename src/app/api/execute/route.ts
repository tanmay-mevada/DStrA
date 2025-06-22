import { NextRequest, NextResponse } from 'next/server';

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';
const JUDGE0_API_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { language, source_code, stdin, debug } = body;

  const langMap: Record<string, number> = {
    python: 71,
    cpp: 54,
    c: 50,
  };

  const language_id = langMap[language];
  if (!language_id) return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });

  const debugPrefix = debug ? '# Debug Mode\n' : '';

  const response = await fetch(JUDGE0_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': JUDGE0_API_KEY!,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
    body: JSON.stringify({
      language_id,
      source_code: debugPrefix + source_code,
      stdin,
    }),
  });

  const result = await response.json();

  return NextResponse.json({
    output: result.stdout,
    stderr: result.stderr,
    time: result.time,
    memory: result.memory,
  });
}