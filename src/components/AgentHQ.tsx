"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Code2, 
  MessageSquare, 
  Search, 
  Radio, 
  ShieldCheck,
  Coffee,
  Monitor,
  Database,
  Briefcase,
  Zap
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  role: string;
  x: number;
  y: number;
  lastAction: string;
  status: 'active' | 'idle' | 'busy';
}

const initialAgents: Agent[] = [
  { id: '1', name: 'Pixel', type: 'Supervisor', role: 'Coordinator', x: 45, y: 45, lastAction: 'Orchestrating Swarm', status: 'active' },
  { id: '2', name: 'Jarvis', type: 'Execution', role: 'Developer', x: 20, y: 70, lastAction: 'Compiling UI Patterns', status: 'busy' },
  { id: '3', name: 'Loki', type: 'Content', role: 'Writer', x: 75, y: 30, lastAction: 'Drafting Substack', status: 'idle' },
  { id: '4', name: 'Friday', type: 'Intelligence', role: 'Researcher', x: 15, y: 25, lastAction: 'Scanning X Feed', status: 'active' },
  { id: '5', name: 'Astra', type: 'Strategic', role: 'Strategist', x: 80, y: 75, lastAction: 'Mapping Markets', status: 'idle' },
  { id: '6', name: 'Vera', type: 'Security', role: 'Compliance', x: 50, y: 15, lastAction: 'Fortress Audit', status: 'active' },
];

export default function AgentHQ() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Simple movement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'idle' || Math.random() > 0.7) {
          const moveX = (Math.random() - 0.5) * 5;
          const moveY = (Math.random() - 0.5) * 5;
          return {
            ...agent,
            x: Math.max(5, Math.min(90, agent.x + moveX)),
            y: Math.max(5, Math.min(90, agent.y + moveY))
          };
        }
        return agent;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
            Agent <span className="text-blue-500 italic">HQ</span>
          </h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Spatial_View: Active</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform active:scale-95">
            Summon All
          </button>
        </div>
      </div>

      {/* The Office Floor */}
      <div className="flex-1 relative bg-zinc-950 rounded-[3rem] border border-white/5 overflow-hidden shadow-inner group/office">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px]" />
        
        {/* Furniture / Zones */}
        <OfficeZone label="Main Frame" x={40} y={40} icon={<Database className="w-8 h-8 opacity-20" />} color="blue" />
        <OfficeZone label="Dev Lab" x={10} y={60} icon={<Monitor className="w-8 h-8 opacity-20" />} color="emerald" />
        <OfficeZone label="Archive" x={70} y={20} icon={<Briefcase className="w-8 h-8 opacity-20" />} color="amber" />
        <OfficeZone label="Comm Center" x={10} y={15} icon={<Radio className="w-8 h-8 opacity-20" />} color="purple" />
        <OfficeZone label="Lounge" x={75} y={70} icon={<Coffee className="w-8 h-8 opacity-20" />} color="pink" />
        <OfficeZone label="Vault" x={45} y={5} icon={<ShieldCheck className="w-8 h-8 opacity-20" />} color="indigo" />

        {/* Agents */}
        {agents.map((agent) => (
          <AgentSprite 
            key={agent.id} 
            agent={agent} 
            isSelected={selectedAgent?.id === agent.id}
            onClick={() => setSelectedAgent(agent)}
          />
        ))}

        {/* HUD Info */}
        {selectedAgent && (
          <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-2xl p-4 border border-blue-500/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{selectedAgent.name}</h4>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{selectedAgent.role}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-blue-500 uppercase block mb-0.5">Live Action</span>
                <span className="text-xs text-zinc-300 italic">"{selectedAgent.lastAction}"</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OfficeZone({ label, x, y, icon, color }: { label: string, x: number, y: number, icon: React.ReactNode, color: string }) {
  const colors: Record<string, string> = {
    blue: "border-blue-500/10 bg-blue-500/5",
    emerald: "border-emerald-500/10 bg-emerald-500/5",
    amber: "border-amber-500/10 bg-amber-500/5",
    purple: "border-purple-500/10 bg-purple-500/5",
    pink: "border-pink-500/10 bg-pink-500/5",
    indigo: "border-indigo-500/10 bg-indigo-500/5",
  };

  return (
    <div 
      className={`absolute w-32 h-32 rounded-3xl border-2 border-dashed ${colors[color]} flex flex-col items-center justify-center gap-2 transition-opacity duration-1000`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {icon}
      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function AgentSprite({ agent, isSelected, onClick }: { agent: Agent, isSelected: boolean, onClick: () => void }) {
  const typeIcons: Record<string, React.ReactNode> = {
    Supervisor: <Bot className="w-4 h-4" />,
    Execution: <Code2 className="w-4 h-4" />,
    Content: <MessageSquare className="w-4 h-4" />,
    Intelligence: <Search className="w-4 h-4" />,
    Strategic: <Radio className="w-4 h-4" />,
    Security: <ShieldCheck className="w-4 h-4" />,
  };

  return (
    <div 
      className={`absolute transition-all duration-1000 ease-in-out cursor-pointer z-20 group`}
      style={{ left: `${agent.x}%`, top: `${agent.y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
    >
      {/* Speech Bubble (Small) */}
      <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-white text-black text-[8px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl scale-90`}>
        {agent.lastAction}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
      </div>

      {/* Sprite Body */}
      <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
        isSelected 
          ? 'bg-blue-500 text-white ring-4 ring-blue-500/20 scale-110 shadow-2xl shadow-blue-500/50' 
          : 'bg-zinc-900 text-zinc-400 border border-white/10 hover:border-white/20 hover:scale-105'
      }`}>
        {typeIcons[agent.type]}
        
        {/* Status indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-950 ${
          agent.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
          agent.status === 'busy' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 
          'bg-zinc-700'
        }`} />
      </div>

      {/* Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 blur-md rounded-full -z-10 group-hover:w-10 group-hover:h-3 transition-all duration-300" />
      
      {/* Name Tag */}
      <div className="mt-2 text-center">
        <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${isSelected ? 'text-blue-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
          {agent.name}
        </span>
      </div>
    </div>
  );
}
