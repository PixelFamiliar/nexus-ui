"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Monitor, 
  Coffee, 
  Zap, 
  Terminal, 
  Activity,
  ChevronRight,
  Search,
  MessageSquare,
  ShieldCheck,
  Radio,
  Code2,
  Cpu,
  Server,
  Layers,
  Wind
} from 'lucide-react';

interface Workstation {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'dev' | 'writer' | 'strat' | 'intel' | 'security' | 'lounge';
}

interface Agent {
  id: string;
  name: string;
  type: string;
  role: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  status: 'active' | 'idle' | 'busy';
  lastAction: string;
  logs: string[];
  facing: 'left' | 'right';
  currentWorkstation?: string;
}

const workstations: Workstation[] = [
  { id: 'ws-1', name: 'Dev Console A', x: 20, y: 25, type: 'dev' },
  { id: 'ws-2', name: 'Dev Console B', x: 20, y: 40, type: 'dev' },
  { id: 'ws-3', name: 'Content Suite', x: 75, y: 25, type: 'writer' },
  { id: 'ws-4', name: 'Strategy Board', x: 75, y: 40, type: 'strat' },
  { id: 'ws-5', name: 'Intel Nexus', x: 20, y: 70, type: 'intel' },
  { id: 'ws-6', name: 'Security Vault', x: 50, y: 15, type: 'security' },
  { id: 'ws-7', name: 'Coffee Station', x: 80, y: 75, type: 'lounge' },
];

const rooms = [
  { name: 'The Forge', x: 5, y: 5, w: 40, h: 50, color: 'emerald', icon: <Cpu className="w-4 h-4" /> },
  { name: 'Mission Control', x: 45, y: 5, w: 50, h: 50, color: 'blue', icon: <Layers className="w-4 h-4" /> },
  { name: 'Deep Intel', x: 5, y: 55, w: 40, h: 40, color: 'purple', icon: <Search className="w-4 h-4" /> },
  { name: 'The Lounge', x: 45, y: 55, w: 50, h: 40, color: 'amber', icon: <Coffee className="w-4 h-4" /> },
];

const initialAgents: Agent[] = [
  { id: '1', name: 'Pixel', type: 'Supervisor', role: 'Coordinator', x: 50, y: 45, targetX: 50, targetY: 45, status: 'active', lastAction: 'Syncing Swarm', facing: 'right', logs: ['[CORE] System check OK'] },
  { id: '2', name: 'Jarvis', type: 'Execution', role: 'Developer', x: 20, y: 25, targetX: 20, targetY: 25, status: 'busy', lastAction: 'Refining UI', facing: 'left', logs: ['[BUILD] nexus-ui sync complete'] },
  { id: '3', name: 'Loki', type: 'Content', role: 'Writer', x: 75, y: 25, targetX: 75, targetY: 25, status: 'busy', lastAction: 'Drafting X thread', facing: 'right', logs: ['[DRAFT] Sovereignty memo'] },
  { id: '4', name: 'Friday', type: 'Intelligence', role: 'Researcher', x: 20, y: 70, targetX: 20, targetY: 70, status: 'active', lastAction: 'Trend sensing', facing: 'left', logs: ['[INTEL] Signal detected'] },
  { id: '5', name: 'Astra', type: 'Strategic', role: 'Strategist', x: 80, y: 75, targetX: 80, targetY: 75, status: 'idle', lastAction: 'Drinking Coffee', facing: 'right', logs: ['[IDLE] Recharging'] },
  { id: '6', name: 'Vera', type: 'Security', role: 'Compliance', x: 50, y: 15, targetX: 50, targetY: 15, status: 'active', lastAction: 'Scanning Leaks', facing: 'left', logs: ['[SHIELD] Audit passed'] },
];

export default function AgentOfficeSim() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Animation & Behavior Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        let newTargetX = agent.targetX;
        let newTargetY = agent.targetY;
        let newStatus = agent.status;
        let newWorkstation = agent.currentWorkstation;

        // Logic for state changes
        if (Math.random() > 0.99) {
          if (agent.status === 'idle') {
            // Pick a desk to work at
            const desk = workstations[Math.floor(Math.random() * (workstations.length - 1))];
            newTargetX = desk.x;
            newTargetY = desk.y;
            newStatus = 'busy';
            newWorkstation = desk.id;
          } else {
            // Go to lounge or wander
            const lounge = workstations.find(w => w.type === 'lounge');
            newTargetX = (lounge?.x || 50) + (Math.random() - 0.5) * 10;
            newTargetY = (lounge?.y || 50) + (Math.random() - 0.5) * 10;
            newStatus = 'idle';
            newWorkstation = undefined;
          }
        }

        // Smooth Movement
        const dx = newTargetX - agent.x;
        const dy = newTargetY - agent.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let newX = agent.x;
        let newY = agent.y;
        let newFacing = agent.facing;

        if (dist > 0.2) {
          const speed = agent.status === 'idle' ? 0.2 : 0.4;
          newX += (dx / dist) * speed;
          newY += (dy / dist) * speed;
          newFacing = dx > 0 ? 'right' : 'left';
        }

        return {
          ...agent,
          x: newX,
          y: newY,
          targetX: newTargetX,
          targetY: newTargetY,
          status: newStatus as 'active' | 'idle' | 'busy',
          facing: newFacing,
          currentWorkstation: newWorkstation
        };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full min-h-0 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
            Claw<span className="text-blue-500 italic">ffice</span>
          </h2>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-1">Spatial_Neural_Grid: v2.1</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] pulse" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest tabular-nums">Sync: 100%</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <button className="text-[9px] font-black text-blue-500 hover:text-white uppercase tracking-widest transition-colors">
                Recenter
            </button>
        </div>
      </div>

      {/* The ISO Floor */}
      <div className="flex-1 relative bg-[#050505] rounded-[4rem] border-2 border-white/[0.03] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] perspective-[1500px]">
        {/* Isometric Grid Container */}
        <div 
          className="absolute inset-0 transition-transform duration-1000"
          style={{ 
            transform: 'rotateX(20deg) rotateZ(-5deg) scale(1.1)',
            transformOrigin: 'center center'
          }}
        >
          {/* Floor Texture */}
          <div className="absolute inset-[-50%] opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
          <div className="absolute inset-[-50%] bg-[radial-gradient(#ffffff03_1.5px,transparent_1.5px)] [background-size:40px_40px]" />
          
          {/* Room Borders */}
          {rooms.map((room) => (
            <div 
              key={room.name}
              className={`absolute border border-white/[0.02] bg-white/[0.01] rounded-[3rem] transition-all duration-700`}
              style={{ left: `${room.x}%`, top: `${room.y}%`, width: `${room.w}%`, height: `${room.h}%` }}
            >
              <div className="absolute top-6 left-8 flex items-center gap-2 opacity-20">
                {room.icon}
                <span className="text-[7px] font-black text-white uppercase tracking-[0.3em]">{room.name}</span>
              </div>
            </div>
          ))}

          {/* Workstations / Desks */}
          {workstations.map((ws) => (
            <div 
              key={ws.id}
              className="absolute w-16 h-12 flex items-center justify-center transition-all duration-500"
              style={{ left: `${ws.x}%`, top: `${ws.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Desk Sprite */}
              <div className="relative w-10 h-6 bg-zinc-900 border border-white/5 rounded-lg shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20" />
                <div className="absolute top-2 left-2 w-4 h-2 bg-zinc-800 rounded-sm" />
              </div>
              <div className="absolute -bottom-4 text-[5px] font-black text-zinc-800 uppercase tracking-widest">{ws.name}</div>
            </div>
          ))}

          {/* Agents */}
          {agents.map((agent) => (
            <AgentSprite 
              key={agent.id} 
              agent={agent} 
              isSelected={selectedAgent?.id === agent.id}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>

        {/* Flat Overlays (HUD) */}
        {selectedAgent && (
          <div className="absolute right-8 top-8 bottom-8 w-80 glass-panel rounded-[2.5rem] overflow-hidden border border-blue-500/20 shadow-2xl animate-in slide-in-from-right-10 duration-500 flex flex-col z-40">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Bot className="w-6 h-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{selectedAgent.name}</h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{selectedAgent.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAgent(null)} className="text-zinc-600 hover:text-white transition-colors">
                <Zap className="w-4 h-4 fill-current" />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
              {/* Status Section */}
              <div className="grid grid-cols-2 gap-6">
                <StatusItem label="Status" value={selectedAgent.status} color={selectedAgent.status === 'busy' ? 'blue' : 'emerald'} />
                <StatusItem label="Zone" value={rooms.find(r => selectedAgent.x >= r.x && selectedAgent.x <= r.x+r.w)?.name || 'Transit'} color="zinc" />
                <StatusItem label="Load" value="12%" color="zinc" />
                <StatusItem label="Uptime" value="100%" color="emerald" />
              </div>

              {/* Task Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Active Execution</span>
                    <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[7px] font-black text-blue-400 uppercase tracking-widest">Priority: High</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 group/task">
                    <Terminal className="w-5 h-5 text-zinc-600 group-hover/task:text-blue-500 transition-colors" />
                    <span className="text-[11px] text-zinc-400 italic">"{selectedAgent.lastAction}"</span>
                </div>
              </div>

              {/* Logs */}
              <div className="space-y-4">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Neural Streams</span>
                <div className="bg-black/60 rounded-2xl p-4 font-mono text-[9px] border border-white/5 space-y-2">
                  {selectedAgent.logs.map((log, i) => (
                    <div key={i} className="flex gap-2 text-zinc-500">
                      <span className="text-blue-500/50">{'>'}</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <span className="text-emerald-500 animate-pulse">{'>'}</span>
                    <div className="w-1 h-3 bg-emerald-500/50 animate-pulse rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 mt-auto">
                <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 hover:-translate-y-1 active:translate-y-0 active:scale-95">
                    Signal to Agent
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusItem({ label, value, color }: { label: string, value: string, color: string }) {
    const colors: Record<string, string> = {
        blue: "text-blue-400",
        emerald: "text-emerald-400",
        zinc: "text-zinc-600"
    };
    return (
        <div>
            <span className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.2em] block mb-1">{label}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${colors[color]}`}>{value}</span>
        </div>
    );
}

function AgentSprite({ agent, isSelected, onClick }: { agent: Agent, isSelected: boolean, onClick: () => void }) {
  const typeIcons: Record<string, React.ReactNode> = {
    Supervisor: <Bot className="w-4 h-4 shadow-[0_0_10px_white]" />,
    Execution: <Code2 className="w-4 h-4" />,
    Content: <MessageSquare className="w-4 h-4" />,
    Intelligence: <Search className="w-4 h-4" />,
    Strategic: <Radio className="w-4 h-4" />,
    Security: <ShieldCheck className="w-4 h-4" />,
  };

  return (
    <div 
      className={`absolute transition-all duration-300 ease-linear cursor-pointer z-20 group`}
      style={{ 
        left: `${agent.x}%`, 
        top: `${agent.y}%`, 
        transform: `translate(-50%, -50%) scale(${agent.facing === 'left' ? '-1, 1' : '1, 1'})` 
      }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* HUD Elements attached to sprite (facing-corrected) */}
      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} scale-x-100 ${agent.facing === 'left' ? 'scale-x-[-1]' : ''}`}>
        <div className="px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-white text-black text-[7px] font-black uppercase tracking-tighter whitespace-nowrap shadow-2xl">
          {agent.name}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/90 rotate-45 border-r border-b border-white" />
        </div>
      </div>

      {/* Busy Indicator */}
      {agent.status === 'busy' && (
        <div className={`absolute -top-6 right-[-20px] transition-all duration-300 animate-bounce scale-x-100 ${agent.facing === 'left' ? 'scale-x-[-1]' : ''}`}>
           <Zap className="w-3 h-3 text-blue-500 fill-blue-500/20" />
        </div>
      )}

      {/* Visual Sprite Body */}
      <div className={`relative w-12 h-12 flex items-center justify-center transition-all duration-300 ${
        isSelected ? 'scale-125' : ''
      }`}>
        {/* Glowing Aura */}
        <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${
            isSelected ? 'bg-blue-600/30 opacity-100' : 'bg-red-600/10 opacity-0 group-hover:opacity-100'
        }`} />

        {/* Character Visual */}
        <div className={`w-10 h-10 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ${
          isSelected 
            ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,1)]' 
            : agent.status === 'busy' ? 'bg-zinc-950 text-white ring-2 ring-white/10' : 'bg-zinc-900/60 text-zinc-500 backdrop-blur-md'
        } border border-white/5`}>
            {typeIcons[agent.type]}
            
            {/* Status light */}
            <div className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-[#050505] ${
                agent.status === 'busy' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 
                agent.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-700'
            }`} />
        </div>

        {/* Antennae Animation */}
        <div className={`absolute -top-1 w-full h-4 flex justify-center gap-4 transition-all duration-500 ${agent.status !== 'idle' ? 'opacity-100' : 'opacity-20'}`}>
            <div className="w-0.5 h-3 bg-red-500/40 rounded-full origin-bottom rotate-[-30deg] animate-pulse" />
            <div className="w-0.5 h-3 bg-red-500/40 rounded-full origin-bottom rotate-[30deg] animate-pulse [animation-delay:0.2s]" />
        </div>
      </div>

      {/* Dynamic Feet (Animation illusion) */}
      {agent.status !== 'busy' && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-4 opacity-40">
            <div className="w-1 h-1 bg-white/20 rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-white/20 rounded-full animate-bounce [animation-delay:0.1s]" />
        </div>
      )}
      
      {/* Ground Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-black/60 blur-md rounded-full -z-10 group-hover:w-10 transition-all duration-300" />
    </div>
  );
}
