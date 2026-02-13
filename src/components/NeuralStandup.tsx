"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, MessageSquare, Users } from 'lucide-react';
import dataFile from '../app/data.json';

interface Message {
  agent: string;
  avatar: string;
  color: string;
  text: string;
  turn: number;
  timestamp?: string;
}

export default function NeuralStandup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanter() {
      try {
        const banterRes = await fetch('/data/banter.json');
        if (banterRes.ok) {
          const banterData = await banterRes.json();
          setMessages(banterData.messages || []);
        }
      } catch (err) {
        console.error("Failed to fetch banter:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanter();
  }, []);

  const activeOps = (dataFile as any).tasks?.filter((t: any) => t.status === 'IN PROGRESS') || [];
  const agentNames = ['Pixel', 'Jarvis', 'Friday', 'Loki', 'Nova', 'Vera', 'Hermes', 'Echo', 'Astra'];

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#999', fontSize: '13px', fontWeight: 600, backgroundColor: '#FFF', borderRadius: '12px' }}>
        Loading standup...
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', maxWidth: '640px',
      backgroundColor: '#FFF',
      border: '2px solid #D8D0C0',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '2px solid #E8E0D0',
        backgroundColor: '#F8F4EC',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users style={{ width: '16px', height: '16px', color: '#4A8B4A' }} />
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#333' }}>Daily Standup</span>
          <span style={{ fontSize: '11px', color: '#999', fontWeight: 600 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div style={{
          fontSize: '10px', fontWeight: 700, color: '#4A8B4A',
          backgroundColor: '#E8FFE8', padding: '3px 8px', borderRadius: '4px',
          border: '1px solid #C0E0C0',
        }}>
          {activeOps.length} Active Ops
        </div>
      </div>

      {/* Agent Roster */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid #F0E8D8',
        display: 'flex', flexWrap: 'wrap', gap: '6px',
      }}>
        {agentNames.map((name, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 8px', borderRadius: '12px',
            backgroundColor: '#F5F0E5', border: '1px solid #E8E0D0',
            fontSize: '10px', fontWeight: 700, color: '#555',
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4A8B4A' }} />
            {name}
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 20px', maxHeight: '500px', overflowY: 'auto' }}>

        {/* Active Operations Summary */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Target style={{ width: '13px', height: '13px', color: '#D97706' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Operations ({activeOps.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeOps.slice(0, 5).map((op: any, i: number) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: '8px',
                backgroundColor: '#FFFCF5', border: '1px solid #F0E0C0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '2px' }}>
                    {op.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#999', fontWeight: 600 }}>
                    {op.agent}
                  </div>
                </div>
                <div style={{
                  fontSize: '9px', fontWeight: 700, color: '#D97706',
                  backgroundColor: '#FFF7ED', padding: '2px 6px', borderRadius: '4px',
                  border: '1px solid #FDE68A',
                }}>
                  IN PROGRESS
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banter / Conversation */}
        {messages.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <MessageSquare style={{ width: '13px', height: '13px', color: '#6366F1' }} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Agent Chatter ({messages.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.slice(0, 6).map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '6px',
                    backgroundColor: '#F0E8D8', border: '1px solid #DDD',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', flexShrink: 0,
                  }}>
                    {m.avatar}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#333' }}>{m.agent}</span>
                      <span style={{ fontSize: '9px', color: '#BBB', fontWeight: 600 }}>{m.timestamp || `Turn ${m.turn}`}</span>
                    </div>
                    <div style={{
                      fontSize: '12px', color: '#555', lineHeight: '1.5',
                      padding: '8px 10px', borderRadius: '8px',
                      backgroundColor: '#F8F4EC', border: '1px solid #EEE',
                    }}>
                      &ldquo;{m.text}&rdquo;
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
