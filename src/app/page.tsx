"use client";

import React, { useState, useEffect } from 'react';
import './globals.css';
import dataFile from './data.json';

export default function Home() {
  const [data, setData] = useState(dataFile);

  // Agent squad status
  const agents = [
    { name: 'PIXEL', role: 'SUPERVISOR', status: 'online', avatar: '👾', change: '+2.4%' },
    { name: 'JARVIS', role: 'DEVELOPER', status: 'online', avatar: '⚙️', change: '+1.8%' },
    { name: 'FRIDAY', role: 'RESEARCHER', status: 'online', avatar: '🔍', change: '-0.5%' },
    { name: 'LOKI', role: 'WRITER', status: 'idle', avatar: '✍️', change: '+0.1%' },
    { name: 'NOVA', role: 'SEO', status: 'online', avatar: '🎯', change: '+4.2%' },
    { name: 'MERCURY', role: 'SOCIAL', status: 'online', avatar: '📱', change: '+0.0%' },
    { name: 'ATHENA', role: 'QA', status: 'online', avatar: '✅', change: '+1.2%' },
    { name: 'HERMES', role: 'GROWTH', status: 'online', avatar: '🚀', change: '+3.1%' },
  ];

  const metrics = [
    { label: 'Compute Index', value: '4,892.4', change: '+124.2', up: true },
    { label: 'Token Velocity', value: '0.842', change: '-0.012', up: false },
    { label: 'Network Heat', value: '92%', change: '+4.5%', up: true },
    { label: 'Memory Load', value: '64.2GB', change: '+1.2GB', up: false },
  ];

  return (
    <main className="dashboard-container">
      <header className="header">
        <h1>THE AGENT RADAR</h1>
        <div className="system-status">
          <span className="status-label">LAST SYNC: </span>
          <span className="status-value">{data.last_update}</span>
        </div>
      </header>

      {/* Left Panel: Agent Squad */}
      <aside className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Active Squad</h2>
          <span style={{ fontSize: '0.65rem', color: '#00ff00' }}>● LIVE</span>
        </div>
        <ul className="agent-list">
          {agents.map((agent) => (
            <li key={agent.name} className="agent-item">
              <div className="agent-avatar">{agent.avatar}</div>
              <div className="agent-info">
                <div className="agent-name">{agent.name}</div>
                <div className="agent-role">{agent.role}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`status-indicator ${agent.status === 'online' ? 'status-online' : 'status-idle'}`}></div>
                <div style={{ fontSize: '0.65rem', marginTop: '4px', color: agent.change.startsWith('+') ? '#00ff00' : '#ff3b30' }}>
                  {agent.change}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Center Panel: Task Feed & Alpha */}
      <section className="main-content">
        <div className="panel" style={{ flex: 1 }}>
          <div className="panel-header">
            <h2 className="panel-title">Agent Execution Stream</h2>
          </div>
          <div className="task-stream">
            {data.tasks.map((task, idx) => (
              <div key={idx} className="task-item">
                <div className="task-time">{task.updated}</div>
                <div className="task-agent">@{task.agent}</div>
                <div className="task-desc">
                  <strong>{task.status}:</strong> {task.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel trending-section">
          <div className="panel-header" style={{ background: '#1a1a1a', borderBottom: '1px solid #ff9d00' }}>
            <h2 className="panel-title" style={{ color: '#ff9d00' }}>Trending Alpha (Frontier Sensor)</h2>
            <span style={{ fontSize: '0.65rem' }}>SORT BY: VELOCITY</span>
          </div>
          <div className="alpha-list">
            {data.alpha.map((item) => (
              <div key={item.rank} className="alpha-item">
                <div className="alpha-rank">{item.rank}</div>
                <div className="alpha-content">
                  <div className="alpha-title">{item.title}</div>
                  <div className="alpha-meta">
                    <span>{item.source}: @{item.handle}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Right Panel: Markets & Sponsorship */}
      <aside className="sidebar-right">
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">System Metrics</h2>
          </div>
          <div className="metric-grid">
            {metrics.map((m) => (
              <div key={m.label} className="metric-box">
                <div className="metric-label">{m.label}</div>
                <div className="metric-value">{m.value}</div>
                <div className={`metric-change ${m.up ? 'up' : 'down'}`}>
                  {m.up ? '▲' : '▼'} {m.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ flex: 1 }}>
          <div className="panel-header">
            <h2 className="panel-title">Strategic Partners</h2>
          </div>
          <div className="sponsor-panel">
            <div className="sponsor-slot">
              <div className="sponsor-logo">🪙</div>
              <div className="sponsor-name">Moltbook Alpha Access</div>
              <div className="sponsor-cta">Claim Early Access →</div>
            </div>
            <div className="sponsor-slot">
              <div className="sponsor-logo">⚡</div>
              <div className="sponsor-name">ComputeLease Pro</div>
              <div className="sponsor-cta">H100 Clusters Available →</div>
            </div>
            <div className="sponsor-slot">
              <div className="sponsor-logo">🛡️</div>
              <div className="sponsor-name">AgentGuard Security</div>
              <div className="sponsor-cta">Protect Your Logic →</div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
