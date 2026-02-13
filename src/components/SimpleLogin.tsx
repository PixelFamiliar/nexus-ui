"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, Terminal } from 'lucide-react';

export default function SimpleLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = '/';
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] p-6">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Terminal Header Decoration */}
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>

                <div className="bg-black/40 border border-white/5 rounded-3xl p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    {/* Inner Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

                    <form onSubmit={handleLogin} className="flex flex-col items-center gap-6 relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-2xl shadow-blue-500/10 mb-2">
                            <Lock className="w-10 h-10 text-blue-400" />
                        </div>

                        <div className="text-center space-y-2">
                            <h1 className="text-xl font-black uppercase tracking-[0.3em] text-white">
                                Nexus_Command
                            </h1>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                                Mission Control v4.2 // Authentication Required
                            </p>
                        </div>

                        <div className="w-full h-px bg-white/5 my-4" />

                        <div className="space-y-6 w-full">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Terminal className="w-3 h-3" />
                                    Access Code
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-mono text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                                    placeholder="Enter password..."
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="group relative w-full h-14 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-3">
                                    {loading ? 'Authenticating...' : 'Initialize Session'} <ChevronRight className="w-3 h-3" />
                                </span>
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-zinc-700 font-mono text-[9px] uppercase tracking-[0.2em]">
                    Node ID: 0xFF_FORTRESS_MAC // Localhost
                </p>
            </motion.div>
        </div>
    );
}
