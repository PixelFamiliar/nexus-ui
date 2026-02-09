"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  Zap,
  Terminal,
  Activity
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  role: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  lastAction: string;
  status: 'active' | 'idle' | 'busy';
  progress: number;
}

const initialAgents: Agent[] = [
  { id: '1', name: 'Pixel', type: 'Supervisor', role: 'Coordinator', x: 50, y: 50, targetX: 50, targetY: 50, lastAction: 'Orchestrating Swarm', status: 'active', progress: 85 },
  { id: '2', name: 'Jarvis', type: 'Execution', role: 'Developer', x: 20, y: 70, targetX: 20, targetY: 70, lastAction: 'Compiling UI Patterns', status: 'busy', progress: 42 },
  { id: '3', name: 'Loki', type: 'Content', role: 'Writer', x: 80, y: 30, targetX: 80, targetY: 30, lastAction: 'Drafting Substack', status: 'busy', progress: 68 },
  { id: '4', name: 'Friday', type: 'Intelligence', role: 'Researcher', x: 15, y: 25, targetX: 15, targetY: 25, lastAction: 'Scanning X Feed', status: 'active', progress: 92 },
  { id: '5', name: 'Astra', type: 'Strategic', role: 'Strategist', x: 85, y: 75, targetX: 85, targetY: 80, lastAction: 'Mapping Markets', status: 'idle', progress: 0 },
  { id: '6', name: 'Vera', type: 'Security', role: 'Compliance', x: 50, y: 15, targetX: 50, targetY: 10, lastAction: 'Fortress Audit', status: 'active', progress: 15 },
];

const rooms = [
  { name: 'Mission Control', x: 40, y: 40, w: 20, h: 20, color: 'blue' },
  { name: 'The Forge (Dev)', x: 5, y: 60, w: 30, h: 35, color: 'emerald' },
  { name: 'Archives (Writing)', x: 65, y: 5, w: 30, h: 40, color: 'amber' },
  { name: 'War Room (Strategy)', x: 65, y: 55, w: 30, h: 40, color: 'pink' },
  { name: 'Intelligence Hub', x: 5, y: 5, w: 30, h: 40, color: 'purple' },
  { name: 'The Vault', x: 40, y: 5, w: 20, h: 15, color: 'indigo' },
];

export default function AgentOfficeSim() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Movement Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        // Increment progress
        let newProgress = agent.progress;
        if (agent.status === 'busy' || agent.status === 'active') {
          newProgress = (agent.progress + Math.random() * 2) % 100;
        }

        // Change target occasionally
        let newTargetX = agent.targetX;
        let newTargetY = agent.targetY;
        let newStatus = agent.status;

        if (Math.random() > 0.95) {
          // Pick a random room or wander
          const room = rooms[Math.floor(Math.random() * rooms.length)];
          newTargetX = room.x + Math.random() * room.w;
          newTargetY = room.y + Math.random() * room.h;
          newStatus = Math.random() > 0.3 ? 'busy' : 'idle';
        }

        // Smooth move towards target
        const dx = newTargetX - agent.x;
        const dy = newTargetY - agent.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let newX = agent.x;
        let newY = agent.y;
        
        if (dist > 1) {
          newX += (dx / dist) * 0.5;
          newY += (dy / dist) * 0.5;
        }

        return {
          ...agent,
          x: newX,
          y: newY,
          targetX: newTargetX,
          targetY: newTargetY,
          status: newStatus as 'active' | 'idle' | 'busy',
          progress: newProgress
        };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
            Squad <span className="text-blue-500 italic">Office</span>
          </h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Live_Telemetry: Active</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">6 Agents Online</span>
          </div>
        </div>
      </div>

      {/* The Office Floor */}
      <div className="flex-1 relative bg-zinc-950 rounded-[3rem] border border-white/5 overflow-hidden shadow-inner cursor-crosshair">
        {/* Floor Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:30px_30px]" />
        
        {/* Rooms */}
        {rooms.map((room) => (
          <div 
            key={room.name}
            className={`absolute rounded-3xl border border-dashed opacity-20 bg-${room.color}-500/5 border-${room.color}-500/30 flex flex-col items-center justify-center`}
            style={{ left: `${room.x}%`, top: `${room.y}%`, width: `${room.w}%`, height: `${room.h}%` }}
          >
            <span className="text-[7px] font-black text-white uppercase tracking-[0.2em] absolute top-4">{room.name}</span>
          </div>
        ))}

        {/* Connections / Neural Pathways (Visual Decoration) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>

        {/* Agents */}
        {agents.map((agent) => (
          <AgentSprite 
            key={agent.id} 
            agent={agent} 
            isSelected={selectedAgent?.id === agent.id}
            onClick={() => setSelectedAgent(agent)}
          />
        ))}

        {/* Selection HUD */}
        {selectedAgent && (
          <div className="absolute top-6 left-6 w-64 glass-panel rounded-2xl p-4 border border-white/10 animate-in fade-in zoom-in-95 duration-300 z-30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{selectedAgent.name}</h4>
                  <p className="text-[8px] text-zinc-500 uppercase font-bold">{selectedAgent.role}</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedAgent(null); }}
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <Zap className="w-3 h-3 fill-current" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                  <span>Task Entropy</span>
                  <span>{Math.round(selectedAgent.progress)}%</span>
                </div>
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${selectedAgent.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] text-zinc-300 italic">"{selectedAgent.lastAction}"</span>
              </div>
            </div>
          </div>
        )}
      </div>
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
      className={`absolute transition-all duration-300 ease-linear cursor-pointer z-20 group`}
      style={{ left: `${agent.x}%`, top: `${agent.y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Activity indicator bar (tiny) */}
      {agent.status !== 'idle' && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: `${agent.progress}%` }} />
        </div>
      )}

      {/* Sprite Body */}
      <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
        isSelected 
          ? 'bg-blue-600 text-white ring-4 ring-blue-500/30 scale-110 shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
          : 'bg-zinc-900/80 text-zinc-400 border border-white/10 hover:border-white/30 hover:scale-105 backdrop-blur-md'
      }`}>
        {typeIcons[agent.type]}
        
        {/* Pulse for active agents */}
        {agent.status === 'busy' && (
          <div className="absolute inset-0 rounded-2xl animate-ping bg-blue-500/20 pointer-events-none" />
        )}
      </div>

      {/* Ground Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-black/50 blur-md rounded-full -z-10 group-hover:w-8 transition-all duration-300" />
      
      {/* Label */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
        <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md transition-colors ${
          isSelected ? 'text-white bg-blue-500/50 backdrop-blur-md' : 'text-zinc-600 group-hover:text-zinc-300'
        }`}>
          {agent.name}
        </span>
      </div>
    </div>
  );
}
