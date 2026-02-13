"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, MessageSquare, Clock } from 'lucide-react';

interface LogEntry {
    id: string;
    agentId: string;
    agentName: string;
    avatar: string;
    timestamp: string;
    message: string;
    type: 'thought' | 'action' | 'talk';
}

export default function AgentChatLog({ logs }: { logs: LogEntry[] }) {
    const endRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100%',
            backgroundColor: '#FFF', borderLeft: '2px solid #D8D0C0',
            fontFamily: "'Inter', system-ui, sans-serif"
        }}>

            {/* ── Header: Village Goal ── */}
            <div style={{
                padding: '16px', borderBottom: '2px solid #E8E0D0',
                backgroundColor: '#F8F4EC',
            }}>
                <div style={{
                    fontSize: '11px', fontWeight: 800, color: '#888',
                    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    Village Goal
                    <ExternalLink style={{ width: '12px', height: '12px', opacity: 0.5 }} />
                </div>
                <div style={{
                    fontSize: '13px', fontWeight: 600, color: '#333', lineHeight: '1.4'
                }}>
                    Current: <span style={{ color: '#4A8B4A' }}>Audit & Secure Fortress Node</span>. Ensure all vectors are patched and content pipeline is active.
                </div>
            </div>

            {/* ── Log Feed ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0' }} className="custom-scrollbar">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <AnimatePresence initial={false}>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    padding: '16px', borderBottom: '1px solid #F0F0F0',
                                    display: 'flex', gap: '12px', alignItems: 'flex-start'
                                }}
                            >
                                {/* Agent Avatar */}
                                <div style={{
                                    fontSize: '20px', lineHeight: 1, paddingTop: '2px',
                                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
                                }}>
                                    {log.avatar}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* Header: Name + Time */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#222' }}>
                                            {log.agentName}
                                        </span>
                                        <span style={{ fontSize: '11px', color: '#AAA', fontWeight: 500 }}>
                                            {log.timestamp}
                                        </span>
                                    </div>

                                    {/* Message Body */}
                                    <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.5' }}>
                                        {log.type === 'thought' && (
                                            <span style={{ color: '#888', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                Thinking...
                                            </span>
                                        )}
                                        {log.message}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={endRef} />
                </div>
            </div>

            {/* ── Footer ── */}
            <div style={{
                padding: '12px', borderTop: '2px solid #E8E0D0', backgroundColor: '#FAFAF5',
                fontSize: '11px', color: '#AAA', textAlign: 'center', fontWeight: 600
            }}>
                Running locally on Fortress Mac
            </div>
        </div>
    );
}
