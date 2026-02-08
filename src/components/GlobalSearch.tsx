"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useGlobalSearch } from '../hooks/useDashboardData';
import { Search, Database, Calendar, X, CornerDownLeft, FileText, Command } from 'lucide-react';

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useGlobalSearch(query);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-4 px-5 py-3 bg-black/40 border border-white/[0.08] rounded-2xl text-zinc-500 cursor-text hover:border-white/20 hover:bg-white/[0.03] transition-all w-[320px] shadow-inner group"
      >
        <Search className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
        <span className="text-sm font-medium">Search the Neural Network...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-lg bg-black px-2 font-mono text-[10px] font-black text-zinc-500 border border-white/10 group-hover:border-white/20 transition-all">
          ⌘K
        </kbd>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] animate-in fade-in duration-500"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl glass-panel rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] z-[110] overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/10">
            <div className="flex items-center px-8 py-7 border-b border-white/[0.05]">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-5 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <Command className="w-5 h-5 text-blue-400" />
              </div>
              <input
                ref={inputRef}
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-white placeholder:text-zinc-700"
                placeholder="Find a memory, task, or report..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-4 scrollbar-hide">
              {!query ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-white/[0.02] rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-white/[0.05]">
                    <Search className="w-10 h-10 text-zinc-800" />
                  </div>
                  <p className="text-sm font-black text-zinc-600 uppercase tracking-[0.2em]">Quantum Search Ready</p>
                </div>
              ) : (
                <div className="space-y-6 p-2">
                  {results.memories?.length > 0 && (
                    <div>
                      <h3 className="px-4 mb-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Database className="w-3 h-3" /> Collective Memory
                      </h3>
                      <div className="space-y-2">
                        {results.memories.map((m: any) => (
                          <div key={m._id} className="p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-blue-500/30 rounded-[1.5rem] cursor-pointer transition-all group flex items-start gap-4 shadow-lg">
                            <div className="p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 group-hover:bg-blue-500/10 transition-colors">
                              <FileText className="w-5 h-5 text-blue-500/50 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors truncate">{m.title}</h4>
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-black/40 rounded-full border border-white/5 text-zinc-500 uppercase tracking-tighter">{m.source}</span>
                              </div>
                              <p className="text-[11px] text-zinc-500 line-clamp-1 group-hover:text-zinc-400 transition-colors">{m.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.tasks?.length > 0 && (
                    <div>
                      <h3 className="px-4 mb-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Core Operations
                      </h3>
                      <div className="space-y-2">
                        {results.tasks.map((t: any) => (
                          <div key={t._id} className="p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-emerald-500/30 rounded-[1.5rem] cursor-pointer transition-all flex items-center justify-between group shadow-lg">
                            <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{t.title}</h4>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-black/40 rounded-full border border-white/5 text-zinc-500 uppercase">{t.status}</span>
                              <CornerDownLeft className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!results.memories?.length && !results.tasks?.length) && (
                    <div className="py-20 text-center">
                      <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest italic">Zero matches in current sectors.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-10 py-5 bg-black/60 border-t border-white/[0.05] flex items-center justify-between">
              <div className="flex gap-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  <span className="text-zinc-400">Esc</span> close
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  <span className="text-zinc-400">↵</span> open
                </div>
              </div>
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] animate-slow-pulse">
                System_Link: 100%
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
