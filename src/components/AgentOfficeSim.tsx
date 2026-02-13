"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentChatLog from './AgentChatLog';

/* ─── Types ────────────────────────────────────────── */

interface Agent {
  id: string;
  initials: string;
  name: string;
  role: string;
  status: string;
  bodyColor: string;
  hairColor: string;
  skinColor: string;
  avatar: string;
  model: string;
  thought: string;
  lastAction: string;
  mapX: number;
  mapY: number;
}

interface LogEntry {
  id: string;
  agentId: string;
  agentName: string;
  avatar: string;
  timestamp: string;
  message: string;
  type: 'thought' | 'action' | 'talk';
}

/* Conversations are now 100% LLM-generated via /api/banter */

/* ─── Agent Definitions ────────────────────────────── */

const THOUGHT_EMOJIS: Record<string, string> = {
  CODING: '💻', SLEEPING: '💤', TALKING: '💬', EATING: '☕',
  WORKING: '📝', SEARCHING: '🔍', BUILDING: '🔨', READING: '📖', IDLE: '💭',
};

const ROOM_POSITIONS: Record<string, { x: number; y: number }> = {
  bedroom_a: { x: 12, y: 22 }, bathroom: { x: 28, y: 22 },
  bedroom_b: { x: 42, y: 22 }, bedroom_c: { x: 60, y: 22 },
  bedroom_d: { x: 78, y: 18 }, bedroom_e: { x: 90, y: 18 },
  kitchen: { x: 12, y: 62 }, living: { x: 38, y: 62 },
  common: { x: 55, y: 68 }, lab: { x: 82, y: 62 },
  park: { x: 50, y: 92 },
};

const STATUS_TO_ROOM: Record<string, string> = {
  CODING: 'lab', WORKING: 'lab', BUILDING: 'lab',
  SLEEPING: 'bedroom_a', EATING: 'kitchen', TALKING: 'common',
  SEARCHING: 'living', READING: 'bedroom_b', IDLE: 'park',
};

const INITIAL_AGENTS: Agent[] = [
  { id: 'pixel', initials: 'PX', name: 'Pixel', role: 'Orchestrator', status: 'WORKING', bodyColor: '#7B68EE', hairColor: '#4B3D8F', skinColor: '#FDDCB5', avatar: '👾', model: 'Opus', thought: '📝', lastAction: 'Coordinating swarm', mapX: 55, mapY: 68 },
  { id: 'jarvis', initials: 'JV', name: 'Jarvis', role: 'Developer', status: 'CODING', bodyColor: '#4A90D9', hairColor: '#2D5F8A', skinColor: '#FFE0BD', avatar: '⚙️', model: 'Opus', thought: '💻', lastAction: 'Building Discord bot', mapX: 82, mapY: 60 },
  { id: 'loki', initials: 'LK', name: 'Loki', role: 'Writer', status: 'WORKING', bodyColor: '#3CB371', hairColor: '#228B4D', skinColor: '#FDDCB5', avatar: '✍️', model: 'Sonnet', thought: '📝', lastAction: 'Drafting Setup Kit', mapX: 38, mapY: 62 },
  { id: 'friday', initials: 'FR', name: 'Friday', role: 'Researcher', status: 'SEARCHING', bodyColor: '#F0A030', hairColor: '#B07020', skinColor: '#FFE0BD', avatar: '🔍', model: 'Gemini', thought: '🔍', lastAction: 'Scanning timeline', mapX: 38, mapY: 60 },
  { id: 'astra', initials: 'AS', name: 'Astra', role: 'Analyst', status: 'READING', bodyColor: '#9370DB', hairColor: '#6A45A0', skinColor: '#FDDCB5', avatar: '🌌', model: 'Opus', thought: '📖', lastAction: 'Competitor analysis', mapX: 42, mapY: 22 },
  { id: 'vera', initials: 'VR', name: 'Vera', role: 'Security', status: 'WORKING', bodyColor: '#E05555', hairColor: '#A03030', skinColor: '#FFE0BD', avatar: '🛡️', model: 'Sonnet', thought: '📝', lastAction: 'Security audit', mapX: 85, mapY: 65 },
  { id: 'nova', initials: 'NV', name: 'Nova', role: 'SEO', status: 'SEARCHING', bodyColor: '#6B7BFF', hairColor: '#4050BB', skinColor: '#FDDCB5', avatar: '🎯', model: 'Flash', thought: '🔍', lastAction: 'Crawling backlinks', mapX: 82, mapY: 55 },
  { id: 'hermes', initials: 'HM', name: 'Hermes', role: 'Growth', status: 'BUILDING', bodyColor: '#FF6B99', hairColor: '#CC3366', skinColor: '#FFE0BD', avatar: '🚀', model: 'Pro', thought: '🔨', lastAction: 'A/B testing hooks', mapX: 90, mapY: 18 },
  { id: 'echo', initials: 'EC', name: 'Echo', role: 'Voice', status: 'TALKING', bodyColor: '#FF8833', hairColor: '#BB5511', skinColor: '#FDDCB5', avatar: '🎙️', model: '11Labs', thought: '💬', lastAction: 'Voice profile update', mapX: 58, mapY: 72 },
];

/* ─── Component ─────────────────────────────────────── */

export default function AgentEnvironment() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // ─── Drip-feed banter: queue messages and reveal one at a time ───
  const lastBanterUpdate = React.useRef<string | null>(null);
  const messageQueue = React.useRef<LogEntry[]>([]);
  const displayedIds = React.useRef<Set<string>>(new Set());

  // Poll /api/banter every 15s for fresh LLM-generated messages
  useEffect(() => {
    async function pollBanter() {
      try {
        const res = await fetch('/api/banter');
        if (res.ok) {
          const data = await res.json();
          if (data.last_updated && data.last_updated !== lastBanterUpdate.current) {
            lastBanterUpdate.current = data.last_updated;
            const newMessages: LogEntry[] = (data.messages || [])
              .map((m: any, i: number) => {
                const agent = INITIAL_AGENTS.find(a => a.name.toLowerCase() === m.agent.toLowerCase());
                return {
                  id: `banter-${data.last_updated}-${i}`,
                  agentId: agent?.id || m.agent.toLowerCase(),
                  agentName: m.agent,
                  avatar: m.avatar || agent?.avatar || '🤖',
                  timestamp: m.timestamp || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                  message: m.text,
                  type: 'talk' as const,
                };
              })
              .filter((m: LogEntry) => !displayedIds.current.has(m.id));

            // Add unseen messages to the queue
            messageQueue.current = [...messageQueue.current, ...newMessages];
          }
        }
      } catch { /* ignore */ }
    }
    pollBanter();
    const interval = setInterval(pollBanter, 15000);
    return () => clearInterval(interval);
  }, []);

  // Drip-feed: reveal one queued message every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (messageQueue.current.length > 0) {
        const nextMsg = messageQueue.current.shift()!;
        displayedIds.current.add(nextMsg.id);

        // Update the timestamp to NOW so it looks live
        const now = new Date();
        nextMsg.timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        setLogs(prev => [...prev, nextMsg].slice(-60));

        // Move the speaking agent to the common room
        setAgents(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(a =>
            a.name.toLowerCase() === nextMsg.agentName.toLowerCase() ||
            a.id === nextMsg.agentId
          );
          if (idx >= 0) {
            const room = ROOM_POSITIONS.common;
            updated[idx] = {
              ...updated[idx],
              status: 'TALKING',
              thought: '💬',
              mapX: room.x + (Math.random() - 0.5) * 8,
              mapY: room.y + (Math.random() - 0.5) * 6,
            };
          }
          return updated;
        });

        // Scatter agent back after 8 seconds
        const speakerId = nextMsg.agentId;
        setTimeout(() => {
          setAgents(prev => prev.map(a => {
            if (a.id === speakerId && a.status === 'TALKING') {
              const roomKey = STATUS_TO_ROOM[a.status] || 'park';
              const room = ROOM_POSITIONS[roomKey] || ROOM_POSITIONS.park;
              return {
                ...a,
                status: 'WORKING',
                thought: '💭',
                mapX: room.x + (Math.random() - 0.5) * 8,
                mapY: room.y + (Math.random() - 0.5) * 6,
              };
            }
            return a;
          }));
        }, 8000);
      }
    }, 5000); // One message every 5 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* ─── Pixel Art Map ─── */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        backgroundColor: '#90D050',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'relative',
          width: '100%', maxWidth: '900px',
          aspectRatio: '1 / 1',
          maxHeight: '100%',
        }}>
          <img
            src="/village_tilemap.png"
            alt="Agent Village Tilemap"
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
              display: 'block',
            }}
            draggable={false}
          />

          {/* Agent Overlays */}
          {agents.map(agent => (
            <div
              key={agent.id}
              style={{
                position: 'absolute',
                left: `${agent.mapX}%`,
                top: `${agent.mapY}%`,
                transform: 'translate(-50%, -100%)',
                zIndex: Math.round(agent.mapY),
                cursor: 'pointer',
                transition: 'left 1.5s ease, top 1.5s ease',
              }}
              onClick={() => setSelectedAgent(agent)}
            >
              <PixelCharacter agent={agent} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right Column ─── */}
      <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', borderLeft: '2px solid #D8D0C0' }}>

        {/* Agent Roster Grid */}
        <div style={{
          padding: '12px', borderBottom: '2px solid #E8E0D0', backgroundColor: '#F8F4EC',
          display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center',
        }}>
          {agents.map(agent => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              style={{
                width: '56px', textAlign: 'center', padding: '4px 2px',
                cursor: 'pointer', borderRadius: '4px',
                border: selectedAgent?.id === agent.id ? '2px solid #4A8B4A' : '2px solid transparent',
                backgroundColor: selectedAgent?.id === agent.id ? '#E8FFE8' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <MiniSprite agent={agent} />
              <div style={{ fontSize: '8px', fontWeight: 800, color: '#555', marginTop: '2px' }}>
                {agent.initials}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Agent Detail */}
        <AnimatePresence>
          {selectedAgent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ borderBottom: '2px solid #E8E0D0', backgroundColor: '#F5F0E5', overflow: 'hidden' }}
            >
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ transform: 'scale(1.8)', transformOrigin: 'center' }}>
                    <MiniSprite agent={selectedAgent} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#333' }}>
                      {selectedAgent.name}
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#4A8B4A', marginLeft: '8px' }}>
                        {selectedAgent.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#AAA' }}
                  >×</button>
                </div>
                <div style={{ fontSize: '12px', lineHeight: '1.8', color: '#444' }}>
                  <div><strong>Current Action:</strong></div>
                  <div style={{ color: '#666' }}>{selectedAgent.lastAction}</div>
                  <div style={{ marginTop: '4px' }}><strong>Location:</strong></div>
                  <div style={{ color: '#666' }}>the Ville:{STATUS_TO_ROOM[selectedAgent.status]?.replace('_', ' ') || 'park'}</div>
                  <div style={{ marginTop: '4px' }}><strong>Model:</strong> <span style={{ color: '#666' }}>{selectedAgent.model}</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Log */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgentChatLog logs={logs} />
        </div>
      </div>
    </div>
  );
}

/* ─── Pixel Character Sprite ─────────────────────── */

function PixelCharacter({ agent }: { agent: Agent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        backgroundColor: 'white', border: '2px solid #333', borderRadius: '3px',
        padding: '1px 4px', marginBottom: '2px', whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: '3px',
        fontSize: '11px', fontWeight: 800, color: '#111',
        fontFamily: 'system-ui, sans-serif',
        boxShadow: '1px 1px 0 rgba(0,0,0,0.15)', lineHeight: 1.2,
      }}>
        <span>{agent.initials}:</span>
        <span style={{ fontSize: '13px' }}>{agent.thought}</span>
      </div>
      <div style={{ imageRendering: 'pixelated', position: 'relative' }}>
        <div style={{ width: '16px', height: '6px', backgroundColor: agent.hairColor, borderRadius: '4px 4px 0 0', margin: '0 auto', border: '1px solid rgba(0,0,0,0.3)' }} />
        <div style={{ width: '14px', height: '10px', backgroundColor: agent.skinColor, margin: '0 auto', borderLeft: '1px solid rgba(0,0,0,0.2)', borderRight: '1px solid rgba(0,0,0,0.2)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '3px', left: '3px', width: '2px', height: '2px', backgroundColor: '#222', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '3px', right: '3px', width: '2px', height: '2px', backgroundColor: '#222', borderRadius: '50%' }} />
        </div>
        <div style={{ width: '16px', height: '8px', backgroundColor: agent.bodyColor, margin: '0 auto', borderRadius: '0 0 2px 2px', border: '1px solid rgba(0,0,0,0.2)' }} />
        <div style={{ width: '12px', height: '4px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '50%', margin: '1px auto 0' }} />
      </div>
    </div>
  );
}

function MiniSprite({ agent }: { agent: Agent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div style={{ fontSize: '12px', marginBottom: '1px' }}>{agent.thought}</div>
      <div style={{ imageRendering: 'pixelated' }}>
        <div style={{ width: '12px', height: '4px', backgroundColor: agent.hairColor, borderRadius: '3px 3px 0 0', margin: '0 auto', border: '1px solid rgba(0,0,0,0.2)' }} />
        <div style={{ width: '10px', height: '7px', backgroundColor: agent.skinColor, margin: '0 auto' }} />
        <div style={{ width: '12px', height: '6px', backgroundColor: agent.bodyColor, borderRadius: '0 0 2px 2px', margin: '0 auto', border: '1px solid rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  );
}
