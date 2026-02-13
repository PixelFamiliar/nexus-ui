"use client";

import React, { useState, useEffect } from 'react';
import AgentOfficeSim from '../../components/AgentOfficeSim';
import ProjectBoard from '../../components/ProjectBoard';
import ProtocolHeatmap from '../../components/ProtocolHeatmap';
import WhaleTracker from '../../components/WhaleTracker';
import GlobalSearch from '../../components/GlobalSearch';
import NeuralStandup from '../../components/NeuralStandup';
import SimpleLogin from '../../components/SimpleLogin';
import {
  Cpu,
  Terminal,
  LayoutDashboard,
  Lock,
  Eye,
  MessageSquareShare
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import '../globals.css';

export default function MissionControl() {
  const [showStandup, setShowStandup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasToken = cookies.some(c => c.trim().startsWith('nexus_session='));
      setIsAuthenticated(hasToken);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F0EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#888' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SimpleLogin />;
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F0EBE0', fontFamily: "'Inter', system-ui, sans-serif", color: '#333', overflow: 'hidden' }}>

      {/* Neural Standup Overlay */}
      <AnimatePresence>
        {showStandup && (
          <div
            onClick={() => setShowStandup(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: '32px', cursor: 'pointer' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: '640px', position: 'relative', cursor: 'default' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowStandup(false)}
                style={{ position: 'absolute', top: -12, right: -12, zIndex: 10, width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #CCC', backgroundColor: '#FFF', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
              >×</button>
              <NeuralStandup />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* Sidebar */}
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
            <a href="/" style={{ textDecoration: 'none' }}>
              <SidebarIcon icon={<LayoutDashboard />} label="Dashboard" />
            </a>
            <SidebarIcon
              icon={<MessageSquareShare />}
              onClick={() => setShowStandup(true)}
              label="Standup"
            />
            <SidebarIcon icon={<Terminal />} active label="Mission Control" />
          </nav>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <SidebarIcon
              icon={<Lock />}
              onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.reload(); }}
              label="Logout"
            />
          </div>
        </aside>

        {/* Workspace */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Header */}
          <header style={{
            height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 20px', borderBottom: '2px solid #D8D0C0', backgroundColor: '#E8E0D0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 style={{ fontSize: '14px', fontWeight: 800, color: '#444', letterSpacing: '1px' }}>
                🎯 Mission Control
              </h1>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#D0C8B8' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#888' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4A8B4A' }} />
                  Fortress Node
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye style={{ width: '12px', height: '12px', color: '#AAA' }} />
                  Private
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setShowStandup(true)}
                style={{
                  padding: '6px 12px', borderRadius: '8px', border: '2px solid #4A8B4A',
                  backgroundColor: '#4A8B4A', color: '#FFF', fontSize: '11px',
                  fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFF' }} />
                Standup
              </button>
              <GlobalSearch />
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', border: '2px solid #D0C8B8',
                overflow: 'hidden', backgroundColor: '#FFF',
              }}>
                <img src="/avatars/pixel_cute.png" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </header>

          {/* Main Stage */}
          <div style={{ flex: 1, padding: '12px', display: 'flex', gap: '12px', minHeight: 0, overflow: 'hidden' }}>

            {/* Left: Project Board */}
            <div style={{
              width: '400px', flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column',
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
            }}>
              <AgentOfficeSim />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function SidebarIcon({ icon, active = false, onClick, label }: { icon: React.ReactNode; active?: boolean; onClick?: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px', borderRadius: '8px', cursor: 'pointer', position: 'relative',
        backgroundColor: active ? '#4A8B4A' : 'transparent',
        color: active ? '#FFF' : '#888',
        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}
      className="group"
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#D8D0C0';
          (e.currentTarget as HTMLButtonElement).style.color = '#555';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = '#888';
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
    </button>
  );
}
