"use client";

import React, { useState, useEffect } from 'react';
import ProjectBoard from '../components/ProjectBoard';
import GlobalSearch from '../components/GlobalSearch';
import SimpleLogin from '../components/SimpleLogin';
import RecruitAgentModal from '../components/RecruitAgentModal';
import AgentOfficeSim from '../components/AgentOfficeSim';
import dataFile from './data.json';
import {
  Cpu,
  Terminal,
  LayoutDashboard,
  Lock,
  UserPlus,
  Eye,
  Palette
} from 'lucide-react';
import './globals.css';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [environment, setEnvironment] = useState((dataFile as any).environment || 'fortress');
  const [recruitModalOpen, setRecruitModalOpen] = useState(false);

  const cycleEnvironment = async () => {
    const envs = ['fortress', 'office', 'lab'];
    const next = envs[(envs.indexOf(environment) + 1) % envs.length];
    setEnvironment(next);

    try {
      await fetch('/api/nexus-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment: next })
      });
    } catch (err) {
      console.error('Failed to sync environment to data.json', err);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasToken = cookies.some(c => c.trim().startsWith('nexus_session='));
      setIsAuthenticated(hasToken);
    };
    checkAuth();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F0EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', fontSize: '14px', color: '#888' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SimpleLogin />;
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F0EBE0', fontFamily: "'Inter', system-ui, sans-serif", color: '#333', overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* ═══ Sidebar ═══ */}
        <aside style={{
          width: '60px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '16px 0', borderRight: '2px solid #D8D0C0', backgroundColor: '#E8E0D0',
        }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              backgroundColor: '#4A8B4A', border: '2px solid #3A7B3A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 0 #3A7B3A', cursor: 'pointer',
            }}>
              <Cpu className="w-4 h-4" style={{ color: '#FFF' }} />
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <SidebarIcon icon={<LayoutDashboard />} active label="Dashboard" />
            <a href="/mission-control" style={{ textDecoration: 'none' }}>
              <SidebarIcon icon={<Terminal />} label="Mission Control" />
            </a>
            <div onClick={() => setRecruitModalOpen(true)}>
              <SidebarIcon icon={<UserPlus />} label="Recruit Agent" />
            </div>
            <div onClick={cycleEnvironment}>
              <SidebarIcon icon={<Palette />} label="Change Theme" />
            </div>
          </nav>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <div onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.reload(); }}>
              <SidebarIcon icon={<Lock />} label="Logout" />
            </div>
          </div>
        </aside>

        {/* ═══ Workspace ═══ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Header */}
          <header style={{
            height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 20px', borderBottom: '2px solid #D8D0C0', backgroundColor: '#E8E0D0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 style={{ fontSize: '14px', fontWeight: 800, color: '#444', letterSpacing: '1px' }}>
                🏘️ Agent Town
              </h1>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#D0C8B8' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#888' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4A8B4A' }} />
                  {environment.charAt(0).toUpperCase() + environment.slice(1)} Node
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye style={{ width: '12px', height: '12px', color: '#AAA' }} />
                  Private
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <GlobalSearch />
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', border: '2px solid #D0C8B8',
                overflow: 'hidden', backgroundColor: '#FFF',
              }}>
                <img src="/avatars/purple_lobster_x.png" alt="User" style={{
                  width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7,
                }} />
              </div>
            </div>
          </header>

          {/* Main Stage */}
          <div style={{ flex: 1, padding: '12px', display: 'flex', gap: '12px', minHeight: 0, overflow: 'hidden' }}>

            {/* Left: Project Board */}
            <div style={{
              width: '360px', flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column',
              backgroundColor: '#FFF', border: '2px solid #D8D0C0', borderRadius: '12px',
              overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <ProjectBoard />
            </div>

            {/* Right: Smallville */}
            <div style={{
              flex: 1, height: '100%', display: 'flex', flexDirection: 'column',
              border: '2px solid #D8D0C0', borderRadius: '12px',
              overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              minHeight: '400px',
            }}>
              <AgentOfficeSim environment={environment} />
            </div>

          </div>
        </div>
      </div>

      {/* Recruit Agent Modal */}
      <RecruitAgentModal isOpen={recruitModalOpen} onClose={() => setRecruitModalOpen(false)} />
    </main>
  );
}

function SidebarIcon({ icon, active = false, label }: { icon: React.ReactNode; active?: boolean; label?: string }) {
  return (
    <div
      style={{
        padding: '8px', borderRadius: '8px', cursor: 'pointer', position: 'relative',
        backgroundColor: active ? '#4A8B4A' : 'transparent',
        color: active ? '#FFF' : '#888',
        transition: 'all 0.15s',
      }}
      className="group"
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = '#D8D0C0';
          (e.currentTarget as HTMLDivElement).style.color = '#555';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLDivElement).style.color = '#888';
        }
      }}
    >
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 18 }) : icon}
      {label && (
        <div style={{
          position: 'absolute', left: '100%', marginLeft: '8px', top: '50%', transform: 'translateY(-50%)',
          padding: '4px 8px', backgroundColor: '#333', color: '#FFF', borderRadius: '4px',
          fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
          opacity: 0, pointerEvents: 'none', zIndex: 50, transition: 'opacity 0.2s',
        }}
          className="group-hover:!opacity-100"
        >
          {label}
        </div>
      )}
    </div>
  );
}
