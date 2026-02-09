"use client";

import React, { useEffect, useState } from 'react';

interface Protocol {
  name: string;
  adoption: number;
  trend: string;
  color: string;
}

export default function ProtocolHeatmap() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);

  useEffect(() => {
    fetch('/api/nexus-data')
      .then(res => res.json())
      .then(data => setProtocols(data.protocols))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="panel" style={{ border: '1px solid #333', background: '#050505', color: '#ff9d00', fontFamily: 'monospace' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid #333', padding: '8px 12px', background: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>📊 Protocol Adoption Heatmap</h2>
        <span style={{ fontSize: '0.6rem', color: '#888' }}>PHASE 2 DEPLOYED</span>
      </div>
      <div style={{ padding: '15px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {protocols.map((protocol, idx) => (
            <div key={idx} style={{ background: '#0a0a0a', border: '1px solid #222', padding: '10px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{protocol.name}</span>
                <span style={{ fontSize: '0.7rem', color: protocol.trend.startsWith('+') ? '#00ff00' : '#ff3b30' }}>{protocol.trend}</span>
              </div>
              <div style={{ height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${protocol.adoption}%`, height: '100%', background: protocol.color, boxShadow: `0 0 10px ${protocol.color}44` }}></div>
              </div>
              <div style={{ marginTop: '5px', fontSize: '0.6rem', color: '#666', textAlign: 'right' }}>
                ADOPTION: {protocol.adoption}%
              </div>
              {/* Background Glow Effect */}
              <div style={{ 
                position: 'absolute', 
                top: '-50%', 
                left: '-50%', 
                width: '200%', 
                height: '200%', 
                background: `radial-gradient(circle at center, ${protocol.color}11 0%, transparent 70%)`,
                pointerEvents: 'none'
              }}></div>
            </div>
          ))}
        </div>
        
        {/* Market Summary */}
        <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255, 157, 0, 0.05)', border: '1px dashed rgba(255, 157, 0, 0.2)', fontSize: '0.65rem', lineHeight: '1.4' }}>
          <strong style={{ color: '#ff9d00' }}>ANALYST NOTE:</strong> MCP remains dominant as agent-to-agent negotiation standard. Molt adoption surging among independent sub-agents following the Discord migration.
        </div>
      </div>
    </div>
  );
}
