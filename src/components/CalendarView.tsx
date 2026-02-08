"use client";

import React, { useState } from 'react';
import { useTasks } from '../hooks/useDashboardData';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  LayoutGrid,
  Trello,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  isToday as isDayToday
} from 'date-fns';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startDate = startOfWeek(currentDate);
  const tasks = useTasks();

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="flex flex-col h-full glass-panel rounded-[2.5rem] overflow-hidden border border-white/[0.08] shadow-2xl">
      {/* Header */}
      <div className="px-10 py-7 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
            <CalendarIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Project Matrix</h2>
            <p className="text-[11px] font-bold text-indigo-400/80 uppercase tracking-[0.2em] mt-0.5">Global Task Scheduler</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 rounded-2xl p-1.5 border border-white/5 shadow-inner">
            <button className="p-2.5 bg-white/[0.05] text-white rounded-xl shadow-lg border border-white/10">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-2.5 text-zinc-600 hover:text-zinc-300 transition-all">
              <Trello className="w-4 h-4" />
            </button>
          </div>
          <div className="h-10 w-px bg-white/5" />
          <div className="flex items-center gap-4 bg-black/40 px-6 py-2.5 rounded-2xl border border-white/5">
            <button onClick={prevWeek} className="p-1 hover:text-white text-zinc-600 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-black text-zinc-300 min-w-[160px] text-center uppercase tracking-widest">
              {format(startDate, 'MMM dd')} — {format(addDays(startDate, 6), 'MMM dd')}
            </span>
            <button onClick={nextWeek} className="p-1 hover:text-white text-zinc-600 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 h-full">
        {days.map((day) => {
          const dayTasks = tasks.filter(t => isSameDay(new Date(t.startTime), day));
          const isToday = isDayToday(day);

          return (
            <div key={day.toString()} className={`flex flex-col border-r border-white/[0.03] last:border-r-0 transition-all duration-700 group/day ${isToday ? 'calendar-day-today' : 'hover:bg-white/[0.01]'}`}>
              {/* Day Label */}
              <div className="pt-6 pb-4 px-4 flex flex-col items-center">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isToday ? 'text-blue-400' : 'text-zinc-600 group-hover/day:text-zinc-400'}`}>
                  {format(day, 'EEE')}
                </span>
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 group-hover/day:scale-110 ${isToday ? 'bg-blue-600 text-white glow-blue' : 'text-zinc-500 group-hover/day:text-zinc-300'}`}>
                  <span className="text-xl font-mono font-black tabular-nums">{format(day, 'dd')}</span>
                </div>
              </div>
              
              {/* Day Tasks */}
              <div className="flex-1 px-3 py-4 space-y-3 overflow-y-auto scrollbar-hide">
                {dayTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center opacity-[0.03] group-hover/day:opacity-[0.08] transition-opacity">
                    <Sparkles className="w-10 h-10" />
                  </div>
                ) : (
                  dayTasks.map((task: any) => (
                    <div key={task._id} className="p-4 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.05] rounded-[1.5rem] hover:border-blue-500/50 hover:bg-white/[0.06] transition-all duration-500 group/task cursor-pointer shadow-xl hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
                          <Clock className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] font-mono font-black text-blue-400">
                            {format(task.startTime, 'HH:mm')}
                          </span>
                        </div>
                        {task.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <h4 className="text-[12px] font-bold text-zinc-200 group-hover/task:text-white leading-tight transition-colors">
                        {task.title}
                      </h4>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{task.type}</span>
                        <div className="flex -space-x-1.5">
                          <div className="w-4 h-4 rounded-full bg-zinc-800 border border-white/10" />
                          <div className="w-4 h-4 rounded-full bg-zinc-700 border border-white/10" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
