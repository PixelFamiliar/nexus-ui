import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BANTER_PATH = path.join(process.cwd(), 'src', 'data', 'banter.json');

export async function GET() {
    try {
        if (fs.existsSync(BANTER_PATH)) {
            const data = JSON.parse(fs.readFileSync(BANTER_PATH, 'utf-8'));
            return NextResponse.json(data);
        }
        return NextResponse.json({ messages: [], last_updated: null });
    } catch {
        return NextResponse.json({ messages: [], last_updated: null }, { status: 500 });
    }
}
