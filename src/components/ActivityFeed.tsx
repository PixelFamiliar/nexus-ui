"use client";

import React from 'react';
import { useActivities } from '../hooks/useDashboardData';
import { Terminal, Activity, ChevronRight, Circle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeed() {
  const activities = useActivities(25);

  if (!activities) {
    return (
      <div className="flex-1 flex items-center justify-center glass-panel rounded-[2rem] p-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center animate-pulse border border-blue-500/20">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Synchronizing Logs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full glass-panel rounded-[2.5rem] overflow-hidden border border-white/[0.08] shadow-2xl">
      {/* Header */}
      <div className="px-8 py-7 flex items-center justify-between border-b border-white/[0.05] bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Intelligence Feed</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Real-time Stream</span>
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="text-[10px] text-zinc-500 font-mono">ID: TEL_PRIME</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
        </div>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-hide">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <Activity className="w-12 h-12 text-zinc-500 mb-4" />
            <p className="text-sm font-medium tracking-tight">System idle. Awaiting operations.</p>
          </div>
        ) : (
          activities.map((item: any, idx: number) => (
            <div key={idx} className="group relative px-6 py-5 rounded-3xl transition-all duration-500 hover:activity-item-hover">
              <div className="flex gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        item.status === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.agent}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter opacity-80">{item.action}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-mono">{formatDistanceToNow(item.timestamp, { addSuffix: false })}</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <p className="text-[13px] text-zinc-400 leading-relaxed font-medium group-hover:text-zinc-200 transition-colors">
                      {item.details}
                    </p>
                  </div>

                  {item.metadata && Object.keys(item.metadata).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(item.metadata).map(([k, v]: any) => (
                        <span key={k} className="px-2 py-1 bg-white/[0.03] rounded-lg text-[9px] text-zinc-500 font-bold border border-white/[0.05]">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer */}
      <div className="px-8 py-5 border-t border-white/[0.05] bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Buffer Optimized</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-700 uppercase tracking-widest">
          Build 07.02.26
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
