"use client";

import React, { useEffect, useState } from 'react';

interface WhaleTransaction {
  id: string;
  protocol: string;
  amount: string;
  type: string;
  time: string;
}

export default function WhaleTracker() {
  const [whales, setWhales] = useState<WhaleTransaction[]>([]);

  useEffect(() => {
    fetch('/api/nexus-data')
      .then(res => res.json())
      .then(data => setWhales(data.whales))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="panel" style={{ border: '1px solid #333', background: '#050505', color: '#00ff00', fontFamily: 'monospace' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid #333', padding: '8px 12px', background: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>🐋 Agent Whale Tracker</h2>
        <span style={{ fontSize: '0.6rem', color: '#888' }}>REAL-TIME DATA</span>
      </div>
      <div style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #222', background: '#0a0a0a' }}>
              <th style={{ padding: '8px 12px', color: '#888' }}>AGENT_ID</th>
              <th style={{ padding: '8px 12px', color: '#888' }}>PROTOCOL</th>
              <th style={{ padding: '8px 12px', color: '#888' }}>AMOUNT</th>
              <th style={{ padding: '8px 12px', color: '#888' }}>TYPE</th>
              <th style={{ padding: '8px 12px', color: '#888' }}>TIME</th>
            </tr>
          </thead>
          <tbody>
            {whales.map((whale, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #111', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#111'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '8px 12px', color: '#00ccff' }}>{whale.id}</td>
                <td style={{ padding: '8px 12px' }}>{whale.protocol}</td>
                <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>{whale.amount}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ 
                    padding: '2px 6px', 
                    borderRadius: '2px', 
                    background: whale.type === 'STAKE' ? 'rgba(0, 255, 0, 0.1)' : whale.type === 'BRIDGE' ? 'rgba(255, 157, 0, 0.1)' : 'rgba(0, 204, 255, 0.1)',
                    color: whale.type === 'STAKE' ? '#00ff00' : whale.type === 'BRIDGE' ? '#ff9d00' : '#00ccff',
                    fontSize: '0.6rem',
                    fontWeight: 'bold'
                  }}>
                    {whale.type}
                  </span>
                </td>
                <td style={{ padding: '8px 12px', color: '#555' }}>{whale.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
