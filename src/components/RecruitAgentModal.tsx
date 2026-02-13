"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, UserPlus, Settings2, Sparkles, Zap } from 'lucide-react';

interface AgentDef {
    id: string;
    name: string;
    model: string;
    color: string;
    avatar: string;
    role: string;
    status: 'active' | 'available';
}

const RECRUITABLE_AGENTS: AgentDef[] = [
    { id: 'pixel', name: 'Pixel', model: 'Claude Opus 4.6', color: '#e2e8f0', avatar: '👾', role: 'Coordinator', status: 'active' },
    { id: 'jarvis', name: 'Jarvis', model: 'Claude Opus 4.6', color: '#3b82f6', avatar: '⚙️', role: 'Developer', status: 'active' },
    { id: 'loki', name: 'Loki', model: 'Claude Sonnet 4.5', color: '#10b981', avatar: '✍️', role: 'Writer', status: 'active' },
    { id: 'friday', name: 'Friday', model: 'Gemini 3 Pro', color: '#f59e0b', avatar: '🔍', role: 'Researcher', status: 'active' },
    { id: 'astra', name: 'Astra', model: 'Claude Opus 4.6', color: '#8b5cf6', avatar: '🌌', role: 'Strategist', status: 'active' },
    { id: 'vera', name: 'Vera', model: 'Claude Sonnet 4.5', color: '#ef4444', avatar: '🛡️', role: 'Security', status: 'active' },
    { id: 'nova', name: 'Nova', model: 'Gemini 3 Flash', color: '#6366f1', avatar: '🎯', role: 'SEO Lead', status: 'active' },
    { id: 'hermes', name: 'Hermes', model: 'Gemini 3 Pro', color: '#ec4899', avatar: '🚀', role: 'Growth', status: 'active' },
    { id: 'midas', name: 'Midas', model: 'Claude Opus 4.6', color: '#eab308', avatar: '💰', role: 'Finance', status: 'active' },
    { id: 'athena', name: 'Athena', model: 'Claude Sonnet 4.5', color: '#06b6d4', avatar: '✅', role: 'QA Lead', status: 'active' },
    { id: 'echo', name: 'Echo', model: 'ElevenLabs Gen-3', color: '#f97316', avatar: '🎙️', role: 'Voice', status: 'active' },
    { id: 'oracle', name: 'Oracle', model: 'Gemini 3 Pro', color: '#f43f5e', avatar: '🔮', role: 'Prediction', status: 'active' },
    { id: 'gemini', name: 'Gemini', model: 'Gemini 3 Ultra', color: '#4f46e5', avatar: '♊', role: 'Multi-Modal', status: 'available' },
    { id: 'codex', name: 'Codex', model: 'GPT-5.3 Codex', color: '#22c55e', avatar: '💻', role: 'Code Gen', status: 'available' },
    { id: 'molty', name: 'Molty', model: 'Sovereign LLM', color: '#dc2626', avatar: '🦞', role: 'Mascot', status: 'available' },
];

interface RecruitAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RecruitAgentModal({ isOpen, onClose }: RecruitAgentModalProps) {
    const [activeTab, setActiveTab] = useState<'recruiting' | 'customization'>('recruiting');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-0 flex items-center justify-center z-[301] pointer-events-none"
                    >
                        <div className="w-[720px] max-h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.8)] pointer-events-auto overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-white tracking-tight">Recruit Agent</h2>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Select an AI to join your team</p>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setActiveTab('recruiting')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'recruiting'
                                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                                : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                    >
                                        <Sparkles className="w-3 h-3 inline mr-2" />
                                        Recruiting
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('customization')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'customization'
                                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                                : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                    >
                                        <Settings2 className="w-3 h-3 inline mr-2" />
                                        Customization
                                    </button>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/5 rounded-xl transition-all group"
                                >
                                    <XCircle className="w-6 h-6 text-zinc-700 group-hover:text-red-500/60 transition-colors" />
                                </button>
                            </div>

                            {/* Agent Grid */}
                            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                                {activeTab === 'recruiting' ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {RECRUITABLE_AGENTS.map((agent) => (
                                            <motion.div
                                                key={agent.id}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="group relative bg-[#111] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-white/15 transition-all overflow-hidden"
                                            >
                                                {/* Glow bg */}
                                                <div
                                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                                                    style={{ background: `radial-gradient(circle at center, ${agent.color}08, transparent 70%)` }}
                                                />

                                                <div className="relative z-10">
                                                    {/* Avatar block */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div
                                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 border-black shadow-lg"
                                                            style={{ backgroundColor: agent.color }}
                                                        >
                                                            {agent.avatar}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-black text-white">{agent.name}</span>
                                                                {agent.status === 'active' ? (
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                                                                ) : (
                                                                    <div className="w-2 h-2 rounded-full bg-zinc-600" />
                                                                )}
                                                            </div>
                                                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{agent.role}</span>
                                                        </div>
                                                    </div>

                                                    {/* Model info */}
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Zap className="w-3 h-3 text-zinc-600" />
                                                        <span className="text-[9px] font-bold text-zinc-500 tracking-wider">{agent.model}</span>
                                                    </div>

                                                    {/* Action */}
                                                    <button
                                                        className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${agent.status === 'active'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                            }`}
                                                    >
                                                        {agent.status === 'active' ? 'Active on Squad' : 'Recruit'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-48">
                                        <div className="text-center space-y-3">
                                            <Settings2 className="w-10 h-10 text-zinc-700 mx-auto" />
                                            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Agent Customization Coming Soon</p>
                                            <p className="text-[10px] text-zinc-700">Configure agent models, personalities, and behavior parameters</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
