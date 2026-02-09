"use client";

import React from 'react';
import { 
  Bot, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  MessageSquare, 
  Code2, 
  Search,
  Radio,
  Clock
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  lastAction: string;
  uptime: string;
  load: number;
  type: string;
}

const agents: Agent[] = [
  { id: '1', name: 'Pixel', role: 'Coordinator', status: 'active', lastAction: 'Nexus Sync', uptime: '99.9%', load: 12, type: 'Supervisor' },
  { id: '2', name: 'Jarvis', role: 'Developer', status: 'busy', lastAction: 'Building Fleet UI', uptime: '98.4%', load: 85, type: 'Execution' },
  { id: '3', name: 'Loki', role: 'Writer', status: 'idle', lastAction: 'Drafted Substack #4', uptime: '99.1%', load: 0, type: 'Content' },
  { id: '4', name: 'Friday', role: 'Researcher', status: 'active', lastAction: 'X Intel Gathering', uptime: '99.5%', load: 42, type: 'Intelligence' },
  { id: '5', name: 'Astra', role: 'Strategist', status: 'idle', lastAction: 'Market Mapping', uptime: '100%', load: 0, type: 'Strategic' },
  { id: '6', name: 'Vera', role: 'Compliance', status: 'active', lastAction: 'Fortress Scan', uptime: '100%', load: 15, type: 'Security' },
];

export default function AgentFleet() {
  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
            Agent <span className="text-blue-500 italic">Fleet</span>
          </h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">SQUAD_OP_CAPACITY: 84%</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            Broadcast to Squad
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const statusColors = {
    active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    idle: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20',
    busy: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    offline: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    Supervisor: <Bot className="w-4 h-4" />,
    Execution: <Code2 className="w-4 h-4" />,
    Content: <MessageSquare className="w-4 h-4" />,
    Intelligence: <Search className="w-4 h-4" />,
    Strategic: <Radio className="w-4 h-4" />,
    Security: <ShieldCheck className="w-4 h-4" />,
  };

  return (
    <div className="group relative glass-panel rounded-3xl p-5 border border-white/[0.03] hover:border-white/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-900 border border-white/5 transition-transform group-hover:scale-110 duration-300`}>
            {typeIcons[agent.type]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">{agent.name}</h3>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${statusColors[agent.status]}`}>
                {agent.status}
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">{agent.role}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Uptime</span>
          <span className="text-xs font-mono font-bold text-zinc-300">{agent.uptime}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3 text-blue-500" /> Last Action
          </span>
          <span className="text-zinc-300 italic">"{agent.lastAction}"</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
            <span>Neural Load</span>
            <span>{agent.load}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div 
              className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] transition-all duration-1000"
              style={{ width: `${agent.load}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 rounded-3xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
