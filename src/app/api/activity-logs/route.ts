import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const logPath = "/Users/scott/clawd/memory/activity_log.json";
  
  try {
    if (fs.existsSync(logPath)) {
      const data = fs.readFileSync(logPath, 'utf8');
      return NextResponse.json(JSON.parse(data));
    }
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read logs" }, { status: 500 });
  }
}
