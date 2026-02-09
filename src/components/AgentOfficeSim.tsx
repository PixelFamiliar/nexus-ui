"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Monitor, 
  Coffee, 
  Zap, 
  Terminal, 
  Activity,
  ChevronRight,
  User,
  Search,
  MessageSquare,
  ShieldCheck,
  Radio,
  Code2
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
  status: 'active' | 'idle' | 'busy';
  lastAction: string;
  logs: string[];
  facing: 'left' | 'right';
}

const rooms = [
  { name: 'The Forge (Dev)', x: 10, y: 10, w: 25, h: 30, color: 'emerald' },
  { name: 'Strategy Room', x: 65, y: 10, w: 25, h: 30, color: 'blue' },
  { name: 'Intelligence Hub', x: 10, y: 60, w: 25, h: 30, color: 'purple' },
  { name: 'Coffee Lounge', x: 65, y: 60, w: 25, h: 30, color: 'amber' },
  { name: 'Main Frame', x: 40, y: 35, w: 20, h: 30, color: 'indigo' },
];

const initialAgents: Agent[] = [
  { id: '1', name: 'Pixel', type: 'Supervisor', role: 'Coordinator', x: 50, y: 50, targetX: 50, targetY: 50, status: 'active', lastAction: 'Syncing Swarm', facing: 'right', logs: ['[CORE] System check OK'] },
  { id: '2', name: 'Jarvis', type: 'Execution', role: 'Developer', x: 20, y: 20, targetX: 20, targetY: 20, status: 'busy', lastAction: 'Compiling UI', facing: 'left', logs: ['[BUILD] npm run dev'] },
  { id: '3', name: 'Loki', type: 'Content', role: 'Writer', x: 75, y: 20, targetX: 75, targetY: 20, status: 'idle', lastAction: 'Awaiting Task', facing: 'right', logs: ['[DRAFT] Pending review'] },
  { id: '4', name: 'Friday', type: 'Intelligence', role: 'Researcher', x: 20, y: 75, targetX: 20, targetY: 75, status: 'active', lastAction: 'X Scrape', facing: 'left', logs: ['[INTEL] Detecting trends'] },
  { id: '5', name: 'Astra', type: 'Strategic', role: 'Strategist', x: 75, y: 75, targetX: 75, targetY: 75, status: 'idle', lastAction: 'Market Analysis', facing: 'right', logs: ['[PLAN] Initializing...'] },
  { id: '6', name: 'Vera', type: 'Security', role: 'Compliance', x: 50, y: 20, targetX: 50, targetY: 20, status: 'active', lastAction: 'Vault Audit', facing: 'left', logs: ['[SHIELD] Clear'] },
];

export default function AgentOfficeSim() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        let newTargetX = agent.targetX;
        let newTargetY = agent.targetY;
        let newStatus = agent.status;

        // Change target occasionally
        if (Math.random() > 0.98) {
          const room = rooms[Math.floor(Math.random() * rooms.length)];
          newTargetX = room.x + Math.random() * room.w;
          newTargetY = room.y + Math.random() * room.h;
          newStatus = Math.random() > 0.4 ? 'busy' : 'idle';
        }

        // Movement
        const dx = newTargetX - agent.x;
        const dy = newTargetY - agent.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let newX = agent.x;
        let newY = agent.y;
        let newFacing = agent.facing;

        if (dist > 0.5) {
          newX += (dx / dist) * 0.4;
          newY += (dy / dist) * 0.4;
          newFacing = dx > 0 ? 'right' : 'left';
        } else if (agent.status === 'busy') {
            // "Working" jitter
            newX += (Math.random() - 0.5) * 0.1;
            newY += (Math.random() - 0.5) * 0.1;
        }

        return {
          ...agent,
          x: newX,
          y: newY,
          targetX: newTargetX,
          targetY: newTargetY,
          status: newStatus as 'active' | 'idle' | 'busy',
          facing: newFacing
        };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full min-h-0 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
            Agent <span className="text-blue-500 italic">Office</span>
          </h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Live_Virtual_View: 2.1.0</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            Uplink Active
          </div>
        </div>
      </div>

      {/* The Office Floor - Pixel Art Aesthetic */}
      <div className="flex-1 relative bg-[#0a0a0c] rounded-[2.5rem] border-4 border-zinc-900 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] cursor-default">
        {/* Floor Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Rooms / Zones */}
        {rooms.map((room) => (
          <div 
            key={room.name}
            className={`absolute rounded-3xl border border-white/[0.02] bg-white/[0.01] flex items-center justify-center group/room`}
            style={{ left: `${room.x}%`, top: `${room.y}%`, width: `${room.w}%`, height: `${room.h}%` }}
          >
            <span className="text-[6px] font-black text-zinc-800 uppercase tracking-[0.4em] absolute bottom-2">{room.name}</span>
            {/* Visual Desk Furniture */}
            <div className="w-12 h-8 bg-zinc-900/50 border border-white/[0.05] rounded-lg shadow-2xl flex items-center justify-center">
              <div className="w-6 h-4 bg-zinc-800 rounded sm" />
            </div>
          </div>
        ))}

        {/* Agents as Animated Lobsters/Sprites */}
        {agents.map((agent) => (
          <AgentSprite 
            key={agent.id} 
            agent={agent} 
            isSelected={selectedAgent?.id === agent.id}
            onClick={() => setSelectedAgent(agent)}
          />
        ))}

        {/* Dynamic HUD */}
        {selectedAgent && (
          <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-3xl p-6 border border-blue-500/20 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 bg-black/60 backdrop-blur-xl z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedAgent.status === 'busy' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 pulse' : 'bg-zinc-900 text-zinc-500'} border border-white/10`}>
                  <Bot className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedAgent.name}</h3>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${selectedAgent.status === 'busy' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                      {selectedAgent.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{selectedAgent.role}</p>
                </div>
              </div>
              
              <div className="flex gap-10 text-right mr-4">
                <div>
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Activity</span>
                  <span className="text-xs text-zinc-300 font-mono italic">"{selectedAgent.lastAction}"</span>
                </div>
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-500 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentSprite({ agent, isSelected, onClick }: { agent: Agent, isSelected: boolean, onClick: () => void }) {
  const [jitter, setJitter] = useState({ x: 0, y: 0 });

  // Add working jitter
  useEffect(() => {
    if (agent.status === 'busy') {
      const jInterval = setInterval(() => {
        setJitter({
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        });
      }, 100);
      return () => clearInterval(jInterval);
    } else {
      setJitter({ x: 0, y: 0 });
    }
  }, [agent.status]);

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
      style={{ 
        left: `${agent.x}%`, 
        top: `${agent.y}%`, 
        transform: `translate(calc(-50% + ${jitter.x}px), calc(-50% + ${jitter.y}px)) scale(${agent.facing === 'left' ? '-1, 1' : '1, 1'})` 
      }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Name Tag (Always upright) */}
      <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap scale-x-100 ${agent.facing === 'left' ? 'scale-x-[-1]' : ''}`}>
        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase transition-all shadow-xl ${
          isSelected ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-zinc-900 text-zinc-500 border border-white/5'
        }`}>
          {agent.name}
        </div>
      </div>

      {/* Thinking Bubble */}
      {agent.status === 'busy' && (
        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 scale-x-100 ${agent.facing === 'left' ? 'scale-x-[-1]' : ''}`}>
          <div className="w-10 h-6 bg-white rounded-xl shadow-2xl flex items-center justify-center animate-bounce">
            <div className="flex gap-0.5">
              <div className="w-1 h-1 bg-zinc-800 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-zinc-800 rounded-full animate-pulse [animation-delay:0.2s]" />
              <div className="w-1 h-1 bg-zinc-800 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          </div>
          <div className="w-2 h-2 bg-white absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45" />
        </div>
      )}

      {/* Sprite Body - Pixel Art Lobster Concept */}
      <div className={`relative w-12 h-12 flex items-center justify-center transition-all duration-300 ${
        isSelected ? 'scale-125' : ''
      }`}>
        {/* Lobster Body Visual */}
        <div className={`absolute inset-0 bg-red-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity`} />
        
        {/* Sprite Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isSelected ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 
          agent.status === 'busy' ? 'bg-red-500/80 text-white' : 'bg-zinc-800 text-zinc-400 border border-white/5'
        } transition-colors border-2 ${isSelected ? 'border-white' : 'border-transparent'}`}>
          {/* Custom Lobster-ish Visuals could be added here as SVG paths */}
          {typeIcons[agent.type]}
        </div>

        {/* Antennae (Visual Jiggle) */}
        <div className={`absolute top-0 w-8 h-4 flex justify-between px-2 ${agent.status === 'active' ? 'animate-pulse' : ''}`}>
          <div className="w-0.5 h-3 bg-red-500/40 rounded-full origin-bottom rotate-[-20deg]" />
          <div className="w-0.5 h-3 bg-red-500/40 rounded-full origin-bottom rotate-[20deg]" />
        </div>
      </div>
      
      {/* Ground Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/50 blur-md rounded-full -z-10 group-hover:w-10 group-hover:h-3 transition-all duration-300" />
    </div>
  );
}
