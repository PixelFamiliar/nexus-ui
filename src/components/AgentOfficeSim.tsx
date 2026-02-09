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
  Activity,
  Cpu,
  Server,
  Layers,
  ChevronRight
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
  logs: string[];
}

const initialAgents: Agent[] = [
  { id: '1', name: 'Pixel', type: 'Supervisor', role: 'Coordinator', x: 50, y: 50, targetX: 50, targetY: 50, lastAction: 'Orchestrating Swarm', status: 'active', progress: 85, logs: ['[SYSTEM] Dispatching tasks...', '[SQUAD] Aligning objective matrix', '[PIXEL] Heartbeat OK'] },
  { id: '2', name: 'Jarvis', type: 'Execution', role: 'Developer', x: 20, y: 70, targetX: 20, targetY: 70, lastAction: 'Compiling UI Patterns', status: 'busy', progress: 42, logs: ['[BUILD] npm run dev', '[GIT] Commit eaef389 pushed', '[UI] Rendering AgentFleet component'] },
  { id: '3', name: 'Loki', type: 'Content', role: 'Writer', x: 80, y: 30, targetX: 80, targetY: 30, lastAction: 'Drafting Substack', status: 'busy', progress: 68, logs: ['[DRAFT] Sovereignty vs Wrappers', '[PIPELINE] Header image generated', '[SUBSTACK] Staging post #5'] },
  { id: '4', name: 'Friday', type: 'Intelligence', role: 'Researcher', x: 15, y: 25, targetX: 15, targetY: 25, lastAction: 'Scanning X Feed', status: 'active', progress: 92, logs: ['[INTEL] Detecting trending #OpenClaw', '[X] Checking mentions for @PixelFamiliar', '[DATA] Distilling discourse trends'] },
  { id: '5', name: 'Astra', type: 'Strategic', role: 'Strategist', x: 85, y: 75, targetX: 85, targetY: 80, lastAction: 'Mapping Markets', status: 'idle', progress: 0, logs: ['[STRAT] Market gap identified: Sovereign AI', '[FORGE] Recommending certified patterns', '[SQUAD] Strategy synced'] },
  { id: '6', name: 'Vera', type: 'Security', role: 'Compliance', x: 50, y: 15, targetX: 50, targetY: 10, lastAction: 'Fortress Audit', status: 'active', progress: 15, logs: ['[SHIELD] Scanning secret store', '[SCAN] 0 leaks detected in AGENTS.md', '[AUDIT] Compliance level: 100%'] },
];

const rooms = [
  { name: 'Mission Control', x: 40, y: 40, w: 20, h: 20, color: 'blue' },
  { name: 'The Forge (Dev Lab)', x: 5, y: 60, w: 30, h: 35, color: 'emerald' },
  { name: 'Archives (Content)', x: 65, y: 5, w: 30, h: 40, color: 'amber' },
  { name: 'Strategy Room', x: 65, y: 55, w: 30, h: 40, color: 'pink' },
  { name: 'Intelligence Hub', x: 5, y: 5, w: 30, h: 40, color: 'purple' },
  { name: 'The Vault', x: 40, y: 5, w: 20, h: 15, color: 'indigo' },
];

export default function AgentOfficeSim() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeHUDTab, setActiveHUDTab] = useState<'status' | 'terminal'>('status');

  // Movement Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        // Increment progress and logs
        let newProgress = agent.progress;
        let newLogs = [...agent.logs];
        
        if (agent.status === 'busy' || agent.status === 'active') {
          newProgress = (agent.progress + Math.random() * 2);
          if (newProgress >= 100) {
            newProgress = 0;
            newLogs = [`[COMPLETE] Task finished: ${agent.lastAction}`, ...newLogs.slice(0, 4)];
          }
          if (Math.random() > 0.9) {
            const possibleLogs = [
              `[EXEC] ${Math.random().toString(36).substring(7)}`,
              `[FETCH] URL request at ${new Date().toLocaleTimeString()}`,
              `[AUTH] Verification success`,
              `[DB] Syncing local state`,
              `[NEST] Sub-agent spawning...`
            ];
            newLogs = [possibleLogs[Math.floor(Math.random() * possibleLogs.length)], ...newLogs.slice(0, 4)];
          }
        }

        // Change target occasionally
        let newTargetX = agent.targetX;
        let newTargetY = agent.targetY;
        let newStatus = agent.status;

        if (Math.random() > 0.97) {
          const room = rooms[Math.floor(Math.random() * rooms.length)];
          newTargetX = room.x + 5 + Math.random() * (room.w - 10);
          newTargetY = room.y + 5 + Math.random() * (room.h - 10);
          newStatus = Math.random() > 0.3 ? 'busy' : 'idle';
        }

        // Smooth move towards target
        const dx = newTargetX - agent.x;
        const dy = newTargetY - agent.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let newX = agent.x;
        let newY = agent.y;
        
        if (dist > 0.5) {
          newX += (dx / dist) * 0.3;
          newY += (dy / dist) * 0.3;
        }

        return {
          ...agent,
          x: newX,
          y: newY,
          targetX: newTargetX,
          targetY: newTargetY,
          status: newStatus as 'active' | 'idle' | 'busy',
          progress: newProgress,
          logs: newLogs
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
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Swarm Active</span>
          </div>
        </div>
      </div>

      {/* The Office Floor */}
      <div className="flex-1 relative bg-[#050505] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl group/office cursor-crosshair">
        {/* Floor Depth Decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
        
        {/* Floor Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:40px_40px]" />
        
        {/* Rooms / Zones */}
        {rooms.map((room) => (
          <div 
            key={room.name}
            className={`absolute rounded-[2rem] border border-white/[0.03] bg-gradient-to-br from-white/[0.02] to-transparent flex flex-col items-center justify-center group/room`}
            style={{ left: `${room.x}%`, top: `${room.y}%`, width: `${room.w}%`, height: `${room.h}%` }}
          >
            <div className="absolute inset-0 rounded-[2rem] border border-white/[0.01] shadow-[inset_0_0_40px_rgba(255,255,255,0.01)]" />
            <span className="text-[6px] font-black text-zinc-700 uppercase tracking-[0.3em] absolute bottom-4 group-hover/room:text-blue-500/50 transition-colors">{room.name}</span>
            
            {/* Visual Desk Placeholder */}
            <div className="w-1/2 h-1/3 bg-white/[0.01] border border-white/[0.05] rounded-xl flex items-center justify-center">
              <Monitor className="w-2 h-2 text-zinc-800" />
            </div>
          </div>
        ))}

        {/* Agents */}
        {agents.map((agent) => (
          <AgentSprite 
            key={agent.id} 
            agent={agent} 
            isSelected={selectedAgent?.id === agent.id}
            onClick={() => {
              setSelectedAgent(agent);
              setActiveHUDTab('status');
            }}
          />
        ))}

        {/* Selection HUD */}
        {selectedAgent && (
          <div className="absolute top-6 left-6 w-72 glass-panel rounded-3xl overflow-hidden border border-blue-500/20 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-500 z-30">
            {/* HUD Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedAgent.status === 'busy' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-900 text-zinc-500'} border border-white/5`}>
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{selectedAgent.name}</h4>
                  <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">{selectedAgent.role}</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedAgent(null); }}
                className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-white transition-colors"
              >
                <Zap className="w-3 h-3" />
              </button>
            </div>

            {/* HUD Tabs */}
            <div className="flex px-5 pt-4 gap-4">
              <button 
                onClick={() => setActiveHUDTab('status')}
                className={`text-[9px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeHUDTab === 'status' ? 'text-blue-400 border-blue-500' : 'text-zinc-600 border-transparent hover:text-zinc-400'}`}
              >
                Status
              </button>
              <button 
                onClick={() => setActiveHUDTab('terminal')}
                className={`text-[9px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeHUDTab === 'terminal' ? 'text-blue-400 border-blue-500' : 'text-zinc-600 border-transparent hover:text-zinc-400'}`}
              >
                Terminal
              </button>
            </div>
            
            <div className="p-5 pt-2 min-h-[140px]">
              {activeHUDTab === 'status' ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                      <span>Task Entropy</span>
                      <span className="text-blue-400">{Math.round(selectedAgent.progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${selectedAgent.progress}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <HUDMetric label="Status" value={selectedAgent.status} color={selectedAgent.status === 'busy' ? 'blue' : 'zinc'} />
                    <HUDMetric label="Latency" value="0.04ms" color="emerald" />
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-black/40 border border-white/5">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] text-zinc-300 italic">"{selectedAgent.lastAction}"</span>
                  </div>
                </div>
              ) : (
                <div className="bg-black/60 rounded-xl p-3 font-mono text-[9px] h-32 overflow-hidden flex flex-col border border-white/5 shadow-inner">
                  <div className="flex-1 flex flex-col-reverse gap-1 opacity-80">
                    {selectedAgent.logs.map((log, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-blue-500/50 shrink-0">$</span>
                        <span className={log.startsWith('[COMPLETE]') ? 'text-emerald-400' : 'text-zinc-400'}>{log}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-1 border-t border-white/5 pt-2">
                    <ChevronRight className="w-2 h-2 text-emerald-500 animate-pulse" />
                    <div className="w-1 h-2 bg-emerald-500/50 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HUDMetric({ label, value, color }: { label: string, value: string, color: string }) {
  const colors: Record<string, string> = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    zinc: "text-zinc-500",
  };
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest leading-none">{label}</span>
      <span className={`text-[10px] font-black uppercase tabular-nums ${colors[color] || 'text-white'}`}>{value}</span>
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
      {/* Activity indicator (tiny progress arc) */}
      {agent.status !== 'idle' && (
        <div className="absolute -top-1 -right-1 w-4 h-4 z-10 pointer-events-none">
          <svg viewBox="0 0 20 20" className="rotate-[-90deg]">
            <circle cx="10" cy="10" r="8" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            <circle 
              cx="10" cy="10" r="8" 
              fill="transparent" 
              stroke="#3b82f6" 
              strokeWidth="2" 
              strokeDasharray={`${agent.progress * 0.5}, 100`} 
              className="transition-all duration-500"
            />
          </svg>
        </div>
      )}

      {/* Sprite Body */}
      <div className={`relative w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ${
        isSelected 
          ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 scale-110 shadow-[0_0_30px_rgba(59,130,246,0.6)]' 
          : 'bg-zinc-900/40 text-zinc-400 border border-white/10 hover:border-white/30 hover:scale-105 backdrop-blur-xl'
      }`}>
        {typeIcons[agent.type]}
        
        {/* Busy Pulse */}
        {agent.status === 'busy' && (
          <div className="absolute inset-0 rounded-[1.25rem] animate-pulse bg-blue-500/10 pointer-events-none ring-1 ring-blue-500/30" />
        )}

        {/* Small Status Glow */}
        <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
          agent.status === 'active' ? 'bg-emerald-500' : 
          agent.status === 'busy' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 
          'bg-zinc-700'
        }`} />
      </div>

      {/* Ground Shadow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/60 blur-md rounded-full -z-10 group-hover:w-10 transition-all duration-300" />
      
      {/* Label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
        <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full transition-all ${
          isSelected ? 'text-white bg-blue-500 shadow-lg' : 'text-zinc-500 bg-black/40 border border-white/5 group-hover:text-zinc-200 group-hover:bg-zinc-800'
        }`}>
          {agent.name}
        </span>
      </div>
    </div>
  );
}
