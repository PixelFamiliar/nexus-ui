"use client";

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ClipboardList,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import dataFile from '../app/data.json';

interface Project {
  name: string;
  last_worked: string;
  status: string;
  mtime: number;
  agent: string;
  uiStatus: 'ongoing' | 'completed' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
}

export default function ProjectBoard() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!dataFile || !dataFile.tasks) return;

    const mapped: Project[] = dataFile.tasks.map((p: any) => {
      let uiStatus: Project['uiStatus'] = 'upcoming';
      let priority: Project['priority'] = 'low';

      if (p.status === 'DONE') {
        uiStatus = 'completed';
        priority = 'low';
      } else if (p.status === 'IN PROGRESS' || p.status === 'REVIEW') {
        uiStatus = 'ongoing';
        priority = 'high';
      } else {
        uiStatus = 'upcoming';
        priority = 'medium';
      }

      return { ...p, uiStatus, priority };
    });

    setProjects(mapped);
  }, []);

  const ongoing = projects.filter(p => p.uiStatus === 'ongoing');
  const completed = projects.filter(p => p.uiStatus === 'completed');
  const upcoming = projects.filter(p => p.uiStatus === 'upcoming');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFF', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '2px solid #E8E0D0', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F8F4EC', flexShrink: 0 }}>
        <ClipboardList style={{ width: '16px', height: '16px', color: '#4A8B4A' }} />
        <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#444', letterSpacing: '0.5px' }}>
          Project Hub
        </h2>
      </div>

      {/* Content */}
      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {/* Active Ops */}
        <Section icon={<Zap style={{ width: '12px', height: '12px', color: '#D97706' }} />} title="Active Ops" count={ongoing.length} color="#D97706">
          {ongoing.map((p, i) => <ProjectCard key={i} project={p} />)}
        </Section>

        {/* Pipeline */}
        <Section icon={<Clock style={{ width: '12px', height: '12px', color: '#5B7BAA' }} />} title="Pipeline" count={upcoming.length} color="#5B7BAA">
          {upcoming.map((p, i) => <ProjectCard key={i} project={p} />)}
        </Section>

        {/* Completed */}
        <Section icon={<CheckCircle2 style={{ width: '12px', height: '12px', color: '#4A8B4A' }} />} title="Completed" count={completed.length} color="#4A8B4A">
          {completed.map((p, i) => <ProjectCard key={i} project={p} />)}
        </Section>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 16px', borderTop: '2px solid #E8E0D0', backgroundColor: '#F8F4EC', textAlign: 'center' }}>
        <span style={{ fontSize: '10px', color: '#BBB', fontWeight: 600 }}>Private Access Only</span>
      </div>
    </div>
  );
}

function Section({ icon, title, count, color, children }: { icon: React.ReactNode; title: string; count: number; color: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {icon}
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color }}>{count}</span>
      </div>
      <div style={{ display: 'grid', gap: '8px' }}>
        {children}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const priorityStyles: Record<string, { color: string; bg: string; border: string }> = {
    high: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    medium: { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    low: { color: '#888', bg: '#F5F5F5', border: '#E5E5E5' },
  };

  const statusColors: Record<string, string> = {
    ongoing: '#D97706',
    completed: '#4A8B4A',
    upcoming: '#BBB',
  };

  const ps = priorityStyles[project.priority] || priorityStyles.low;

  return (
    <div style={{
      padding: '12px', borderRadius: '8px', border: '1px solid #E8E0D0',
      backgroundColor: '#FAFAF5', cursor: 'pointer', transition: 'all 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#F0EDE5'; (e.currentTarget as HTMLDivElement).style.borderColor = '#D0C8B8'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#FAFAF5'; (e.currentTarget as HTMLDivElement).style.borderColor = '#E8E0D0'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#333', lineHeight: '1.3' }}>
          {project.name}
        </h3>
        <span style={{
          flexShrink: 0, padding: '2px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.5px',
          color: ps.color, backgroundColor: ps.bg, border: `1px solid ${ps.border}`,
        }}>
          {project.priority}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: statusColors[project.uiStatus] || '#BBB' }} />
          <span style={{ color: '#888', textTransform: 'capitalize' }}>{project.uiStatus}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#AAA' }}>
          <span>→</span>
          <span style={{ color: '#5B7BAA', fontWeight: 600 }}>{project.agent}</span>
        </div>
      </div>
    </div>
  );
}
