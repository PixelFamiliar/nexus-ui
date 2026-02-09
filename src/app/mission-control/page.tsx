"use client";

import React, { useState } from 'react';
import ActivityFeed from '../../components/ActivityFeed';
import CalendarView from '../../components/CalendarView';
import AgentFleet from '../../components/AgentFleet';
import AgentHQ from '../../components/AgentHQ';
import GlobalSearch from '../../components/GlobalSearch';
import WhopLogin from '../../components/WhopLogin';
import { 
  LayoutDashboard, 
  Terminal, 
  Calendar, 
  Settings,
  Shield,
  Zap,
  Cpu,
  Database,
  Globe,
  Radio,
  BarChart3,
  Layers,
  Search
} from 'lucide-react';
import '../globals.css';

export default function MissionControl() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="relative min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Background Layering */}
      <div className="absolute inset-0 bg-mesh pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      
      {/* Container */}
      <div className="relative z-10 flex h-screen overflow-hidden">
        
        {/* Premium Sidebar */}
        <aside className="w-[100px] shrink-0 flex flex-col items-center py-10 border-r border-white/[0.05] bg-black/20 backdrop-blur-md">
          <div className="w-14 h-14 rounded-3xl premium-gradient p-0.5 shadow-2xl shadow-blue-500/20 mb-12 flex items-center justify-center">
            <div className="w-full h-full bg-black rounded-[1.4rem] flex items-center justify-center">
              <Cpu className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <nav className="flex flex-col gap-6">
            <SidebarAction icon={<LayoutDashboard />} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarAction icon={<Layers />} active={activeTab === 'execution'} onClick={() => setActiveTab('execution')} />
            <SidebarAction icon={<Calendar />} active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
            <div className="h-px w-6 bg-white/5 my-2" />
            <SidebarAction icon={<BarChart3 />} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <SidebarAction icon={<Shield />} active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
            <SidebarAction icon={<Zap />} active={activeTab === 'alpha'} onClick={() => setActiveTab('alpha')} />
          </nav>

          <div className="mt-auto">
            <SidebarAction icon={<Settings />} onClick={() => setActiveTab('settings')} />
          </div>
        </aside>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Bar */}
          <header className="h-24 shrink-0 flex items-center justify-between px-12 border-b border-white/[0.05]">
            <div className="flex items-center gap-10">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  Control <span className="text-blue-500 italic">Center</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Node_Status: Active</span>
                </div>
              </div>
              
              <div className="h-10 w-px bg-white/10" />
              
              <GlobalSearch />
            </div>

            <div className="flex items-center gap-10">
              <div className="hidden xl:flex items-center gap-12">
                <TopMetric label="Neural_Load" value="12%" />
                <TopMetric label="Disk_Array" value="Synced" />
                <TopMetric label="Latency" value="0.4ms" />
              </div>
              <WhopLogin />
            </div>
          </header>

          {/* Scrolling Stage */}
          <div className="flex-1 overflow-hidden p-10 flex flex-col gap-10">
            
            {/* High-Impact Stat Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 shrink-0">
              <PremiumStatCard label="Total_Execution" value="284,192" trend="+12k" color="blue" />
              <PremiumStatCard label="Uptime_Protocol" value="99.99%" trend="Stable" color="emerald" />
              <PremiumStatCard label="Compute_Cycle" value="4.2 PFlops" trend="+0.4" color="purple" />
              <PremiumStatCard label="Context_Window" value="2.1M" trend="Deep" color="indigo" />
            </div>

            {/* Content Display */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-0">
              
              {/* Agent Fleet (Cards) */}
              <div className="lg:col-span-3 h-full flex flex-col min-h-0 bg-black/20 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-sm">
                <AgentFleet />
              </div>

              {/* Agent HQ (Spatial View) */}
              <div className="lg:col-span-6 h-full flex flex-col min-h-0 bg-black/20 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-sm">
                <AgentHQ />
              </div>

              {/* Activity Feed Container */}
              <div className="lg:col-span-3 h-full flex flex-col min-h-0">
                <ActivityFeed />
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SidebarAction({ icon, active = false, onClick }: { icon: React.ReactElement, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`group relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
        active 
          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
          : 'text-zinc-600 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/10'
      }`}
    >
      {active && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />}
      {React.cloneElement(icon, { className: "w-6 h-6 transition-transform group-hover:scale-110" })}
    </button>
  );
}

function TopMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">{label}</span>
      <span className="text-xs font-bold text-zinc-300 tabular-nums">{value}</span>
    </div>
  );
}

function PremiumStatCard({ label, value, trend, color }: { label: string, value: string, trend: string, color: string }) {
  const colors: Record<string, string> = {
    blue: "from-blue-500/20 border-blue-500/20 text-blue-400",
    emerald: "from-emerald-500/20 border-emerald-500/20 text-emerald-400",
    purple: "from-purple-500/20 border-purple-500/20 text-purple-400",
    indigo: "from-indigo-500/20 border-indigo-500/20 text-indigo-400"
  };

  return (
    <div className={`relative glass-panel rounded-[2.5rem] p-8 overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 border border-white/5 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {trend}
          </span>
        </div>
        <div className="text-3xl font-mono font-black text-white tracking-tight">{value}</div>
      </div>
    </div>
  );
}
