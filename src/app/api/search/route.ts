import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query || query.length < 2) {
    return NextResponse.json({ memories: [], tasks: [] });
  }

  const workspaceRoot = "/Users/scott/clawd";
  
  try {
    // Search in memory/ and deliverables/
    // We use grep to find files containing the query
    const cmd = `grep -ril "${query}" ${workspaceRoot}/memory ${workspaceRoot}/deliverables --exclude-dir=node_modules --exclude-dir=.next | head -n 20`;
    const files = execSync(cmd, { encoding: 'utf8' }).split('\n').filter(Boolean);
    
    const results = files.map(file => {
      const relativePath = path.relative(workspaceRoot, file);
      return {
        _id: relativePath,
        title: path.basename(file),
        content: `Found in ${relativePath}`,
        source: relativePath.startsWith('memory') ? 'Memory' : 'Deliverable'
      };
    });

    return NextResponse.json({ memories: results, tasks: [] });
  } catch (error) {
    return NextResponse.json({ memories: [], tasks: [] });
  }
}
