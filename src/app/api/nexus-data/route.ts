import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const whales = [
    { id: "AGENT_824", protocol: "MCP", amount: "$1.2M", type: "STAKE", time: "2m ago" },
    { id: "AGENT_102", protocol: "Molt", amount: "$450k", type: "EXECUTION", time: "5m ago" },
    { id: "AGENT_007", protocol: "Identity", amount: "$2.8M", type: "BRIDGE", time: "12m ago" },
    { id: "AGENT_999", protocol: "MCP", amount: "$890k", type: "STAKE", time: "15m ago" },
    { id: "AGENT_555", protocol: "Custom", amount: "$120k", type: "DEPLOY", time: "22m ago" },
  ];

  const protocols = [
    { name: "MCP", adoption: 78, trend: "+12.4%", color: "#00ff00" },
    { name: "Molt", adoption: 62, trend: "+8.1%", color: "#00ccff" },
    { name: "Identity", adoption: 45, trend: "-2.3%", color: "#ff3b30" },
    { name: "AgentSQL", adoption: 38, trend: "+15.2%", color: "#ff9d00" },
    { name: "LogicGate", adoption: 24, trend: "+5.0%", color: "#8b5cf6" },
  ];

  return NextResponse.json({ whales, protocols });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { environment } = body;

    if (!environment) {
      return NextResponse.json({ error: 'Environment is required' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'src/app/data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.environment = environment;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, environment });
  } catch (error) {
    console.error('Failed to update environment:', error);
    return NextResponse.json({ error: 'Failed to update environment' }, { status: 500 });
  }
}
