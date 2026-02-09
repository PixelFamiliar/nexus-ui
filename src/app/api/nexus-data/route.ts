import { NextResponse } from 'next/server';

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
