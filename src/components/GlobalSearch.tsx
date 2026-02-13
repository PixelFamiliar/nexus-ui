"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useGlobalSearch } from '../hooks/useDashboardData';
import { Search, Database, Calendar, X, CornerDownLeft, FileText, Command } from 'lucide-react';

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useGlobalSearch(query);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setIsOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', backgroundColor: '#FFF',
          border: '2px solid #D8D0C0', borderRadius: '10px',
          color: '#999', cursor: 'text', width: '280px',
          transition: 'all 0.15s', fontSize: '13px',
        }}
      >
        <Search style={{ width: '14px', height: '14px', color: '#BBB' }} />
        <span style={{ fontWeight: 500 }}>Search...</span>
        <kbd style={{
          marginLeft: 'auto', display: 'inline-flex', height: '22px', alignItems: 'center',
          padding: '0 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
          color: '#BBB', backgroundColor: '#F0EBE0', border: '1px solid #D8D0C0',
        }}>
          ⌘K
        </kbd>
      </div>

      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 100 }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'fixed', left: '50%', top: '15%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: '560px', backgroundColor: '#FFF',
            borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 110,
            overflow: 'hidden', border: '2px solid #D8D0C0',
          }}>
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '2px solid #E8E0D0' }}>
              <Search style={{ width: '18px', height: '18px', color: '#AAA', marginRight: '12px' }} />
              <input
                ref={inputRef}
                autoFocus
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: '16px', fontWeight: 500,
                  color: '#333', fontFamily: 'inherit', backgroundColor: 'transparent',
                }}
                placeholder="Search tasks, memories, reports..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={() => setIsOpen(false)}
                style={{ padding: '4px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#BBB' }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Results */}
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '12px' }}>
              {!query ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <Search style={{ width: '32px', height: '32px', color: '#DDD', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '13px', color: '#BBB', fontWeight: 600 }}>Type to search...</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {results.memories?.length > 0 && (
                    <div>
                      <h3 style={{ padding: '0 8px', marginBottom: '8px', fontSize: '10px', fontWeight: 700, color: '#AAA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Memories
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {results.memories.map((m: any) => (
                          <div key={m._id} style={{
                            padding: '10px 12px', borderRadius: '8px', border: '1px solid #E8E0D0',
                            backgroundColor: '#FAFAF5', cursor: 'pointer',
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>{m.title}</h4>
                              <span style={{ fontSize: '9px', fontWeight: 600, color: '#AAA', textTransform: 'uppercase' }}>{m.source}</span>
                            </div>
                            <p style={{ fontSize: '11px', color: '#888' }}>{m.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.tasks?.length > 0 && (
                    <div>
                      <h3 style={{ padding: '0 8px', marginBottom: '8px', fontSize: '10px', fontWeight: 700, color: '#AAA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Tasks
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {results.tasks.map((t: any) => (
                          <div key={t._id} style={{
                            padding: '10px 12px', borderRadius: '8px', border: '1px solid #E8E0D0',
                            backgroundColor: '#FAFAF5', cursor: 'pointer',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>{t.title}</h4>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: '#5B7BAA', textTransform: 'uppercase' }}>{t.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!results.memories?.length && !results.tasks?.length) && (
                    <div style={{ padding: '40px 0', textAlign: 'center' }}>
                      <p style={{ fontSize: '13px', color: '#BBB', fontWeight: 600 }}>No results found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 20px', borderTop: '2px solid #E8E0D0', backgroundColor: '#F8F4EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '10px', color: '#BBB', fontWeight: 600 }}>
                  <strong style={{ color: '#999' }}>Esc</strong> close
                </span>
                <span style={{ fontSize: '10px', color: '#BBB', fontWeight: 600 }}>
                  <strong style={{ color: '#999' }}>↵</strong> open
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
