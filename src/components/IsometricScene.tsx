"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
    XCircle,
    Cpu,
    Activity,
    Layers,
    Zap,
    Radio,
    Command,
    Maximize2,
    Terminal,
    ShieldCheck,
} from 'lucide-react';

import GridFloor, { ZONES } from './GridFloor';
import AgentCharacter3D from './AgentCharacter3D';

// Component that sets up the camera properly after mount
function CameraSetup() {
    const { camera, size, gl } = useThree();

    useEffect(() => {
        if (camera instanceof THREE.OrthographicCamera) {
            // With frustum L/R = ±701, the visible units width at a given zoom = 1402/zoom
            // We want to show about 25 units across. So zoom = 1402/25 ≈ 56
            // But R3F frustum is ±(width/2), so visible = width/zoom
            const desiredVisibleWidth = 35; // units to see horizontally
            const zoom = size.width / desiredVisibleWidth;

            camera.zoom = zoom;
            camera.updateProjectionMatrix();
        }
    }, [camera, size, gl]);

    return null;
}

interface Agent {
    id: string;
    name: string;
    status: 'CODING' | 'SEARCHING' | 'TALKING' | 'IDLE' | 'BUILDING' | 'WAITING' | 'EXECUTING' | 'READING' | 'SCRAPING';
    lastAction: string;
    color: string;
    avatar: string;
    task?: string;
    model?: string;
    thought?: string;
}

const INITIAL_AGENTS: Agent[] = [
    { id: 'pixel', name: 'Pixel', status: 'IDLE', lastAction: 'Coordinating swarm', color: 'bg-white', avatar: '👾', model: 'Claude Opus 4.6', thought: 'Optimizing spatial latency...' },
    { id: 'jarvis', name: 'Jarvis', status: 'CODING', lastAction: 'Refactoring UI', color: 'bg-blue-500', avatar: '⚙️', model: 'Claude Opus 4.6', thought: 'Applying reaction matrix...' },
    { id: 'loki', name: 'Loki', status: 'TALKING', lastAction: 'Drafting brief', color: 'bg-emerald-500', avatar: '✍️', model: 'Claude Sonnet 4.5', thought: 'Analyzing narrative gaps.' },
    { id: 'friday', name: 'Friday', status: 'SEARCHING', lastAction: 'Scanning social', color: 'bg-amber-500', avatar: '🔍', model: 'Gemini 3 Pro', thought: 'Indexing X discourse.' },
    { id: 'astra', name: 'Astra', status: 'TALKING', lastAction: 'Market brief', color: 'bg-purple-500', avatar: '🌌', model: 'Claude Opus 4.6', thought: 'Simulating market pivot.' },
    { id: 'vera', name: 'Vera', status: 'EXECUTING', lastAction: 'Shield audit', color: 'bg-red-500', avatar: '🛡️', model: 'Claude Sonnet 4.5', thought: 'Hardening port 18789.' },
    { id: 'nova', name: 'Nova', status: 'SCRAPING', lastAction: 'SEO map', color: 'bg-indigo-500', avatar: '🎯', model: 'Gemini 3 Flash', thought: 'Mapping Shopify leads.' },
    { id: 'hermes', name: 'Hermes', status: 'BUILDING', lastAction: 'Growth test', color: 'bg-pink-500', avatar: '🚀', model: 'Gemini 3 Pro', thought: 'Iterating landing page.' },
    { id: 'midas', name: 'Midas', status: 'IDLE', lastAction: 'Vault check', color: 'bg-yellow-500', avatar: '💰', model: 'Claude Opus 4.6', thought: 'Calculating Pro ARR.' },
    { id: 'athena', name: 'Athena', status: 'READING', lastAction: 'Log check', color: 'bg-cyan-500', avatar: '✅', model: 'Claude Sonnet 4.5', thought: 'Auditing logic hygiene.' },
    { id: 'echo', name: 'Echo', status: 'TALKING', lastAction: 'Voice sync', color: 'bg-orange-500', avatar: '🎙️', model: 'ElevenLabs Gen-3', thought: 'Synthesizing Adam 2.0.' },
    { id: 'oracle', name: 'Oracle', status: 'WAITING', lastAction: 'Odds sync', color: 'bg-rose-500', avatar: '🔮', model: 'Gemini 3 Pro', thought: 'Checking Kalshi orderbook.' },
];

function isIdleZone(status: string): boolean {
    return status === 'IDLE' || status === 'WAITING' || status === 'TALKING';
}

function getAgentPosition(agent: Agent, agents: Agent[]): [number, number, number] {
    const zoneId = isIdleZone(agent.status) ? 'sync' : 'execution';
    const zone = ZONES.find(z => z.id === zoneId)!;

    const zoneAgents = agents.filter(a => (isIdleZone(a.status) ? 'sync' : 'execution') === zoneId);
    const idx = zoneAgents.indexOf(agent);
    const cols = zoneId === 'execution' ? 4 : 3;
    const col = idx % cols;
    const row = Math.floor(idx / cols);

    const spacing = 2.2;
    const x = zone.position[0] - zone.size[0] / 2 + spacing + col * spacing;
    const z = zone.position[2] - zone.size[1] / 2 + spacing + row * spacing;

    return [x, 0, z];
}

export default function IsometricScene() {
    const [agents, setAgents] = useState(INITIAL_AGENTS);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [ticker, setTicker] = useState('SYSTEM: Spatial environment v5.0 active. Node: FORTRESS_MAC.');

    // Periodically update agent statuses
    useEffect(() => {
        const interval = setInterval(() => {
            setAgents(prev => prev.map(agent => {
                if (Math.random() > 0.88) {
                    const statuses: Agent['status'][] = ['CODING', 'SEARCHING', 'TALKING', 'IDLE', 'BUILDING', 'WAITING', 'EXECUTING', 'READING', 'SCRAPING'];
                    const thoughts = [
                        "Syncing neural weights...",
                        "Analyzing traffic spike...",
                        "Hardening gateway auth...",
                        "Refactoring core loop...",
                        "Monitoring X engagement...",
                        "Drafting alpha brief...",
                        "Evaluating arbitrage...",
                        "Steady state reached.",
                    ];
                    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    const newThought = thoughts[Math.floor(Math.random() * thoughts.length)];

                    if (newStatus !== agent.status) {
                        setTicker(`LOG: ${agent.name.toUpperCase()} shifted to ${newStatus}`);
                    }
                    return { ...agent, status: newStatus, thought: newThought };
                }
                return agent;
            }));
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    // Update selected agent reference when agents change
    useEffect(() => {
        if (selectedAgent) {
            const updated = agents.find(a => a.id === selectedAgent.id);
            if (updated) setSelectedAgent(updated);
        }
    }, [agents]);

    const handleSelectAgent = useCallback((agent: Agent) => {
        setSelectedAgent(prev => prev?.id === agent.id ? null : agent);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#020208] text-zinc-400 font-sans overflow-hidden relative">

            {/* HUD Overlay Lines */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </div>

            {/* Header Bar */}
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-black/80 backdrop-blur-xl relative z-50 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
                        <div className="w-2 h-2 rounded-full bg-blue-500/80 shadow-[0_0_8px_#60a5fa] animate-ping opacity-40" />
                    </div>
                    <div className="space-y-0">
                        <span className="font-black tracking-[0.4em] uppercase text-[9px] text-white">Isometric_Command_View</span>
                        <div className="text-[7px] text-zinc-600 font-bold uppercase tracking-widest flex gap-3">
                            <span>Three.js v5</span>
                            <span>•</span>
                            <span className="text-blue-500/50">Live_Agent_Grid</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-8 text-[8px] font-black text-zinc-700 tracking-[0.2em] uppercase">
                    <div className="flex items-center gap-2">
                        <Radio className="w-3 h-3 text-blue-500/20" />
                        <span>Agents: {agents.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-emerald-500/20" />
                        <span className="text-emerald-500/30">Stable</span>
                    </div>
                </div>
            </div>

            {/* 3D Canvas */}
            <div className="flex-1 relative">
                <Canvas
                    orthographic
                    camera={{
                        zoom: 1,
                        position: [25, 25, 25],
                        near: -500,
                        far: 500,
                    }}
                    dpr={1}
                    style={{ background: '#020208' }}
                    gl={{ antialias: true, alpha: false }}
                >
                    {/* Lighting */}
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow color="#c8d6e5" />
                    <directionalLight position={[-5, 10, -5]} intensity={0.3} color="#6366f1" />
                    <hemisphereLight args={['#1e293b', '#020208', 0.3]} />

                    {/* Camera auto-adjust */}
                    <CameraSetup />


                    {/* Grid Floor & Zones */}
                    <Suspense fallback={null}>
                        <GridFloor />
                    </Suspense>

                    {/* Agent Characters */}
                    {agents.map((agent) => (
                        <AgentCharacter3D
                            key={agent.id}
                            agent={agent}
                            targetPosition={getAgentPosition(agent, agents)}
                            onClick={handleSelectAgent as any}
                            isSelected={selectedAgent?.id === agent.id}
                        />
                    ))}

                    {/* Camera Controls */}
                    <OrbitControls
                        makeDefault
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minZoom={10}
                        maxZoom={200}
                        maxPolarAngle={Math.PI / 2.2}
                        minPolarAngle={0.3}
                        target={[0, 0, 2]}
                    />
                </Canvas>
            </div>

            {/* Footer Ticker */}
            <div className="h-10 bg-black/90 border-t border-white/5 flex items-center px-6 gap-6 shrink-0 relative z-50 backdrop-blur-3xl">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="relative">
                        <Activity className="w-3.5 h-3.5 text-blue-500" />
                        <div className="absolute inset-0 bg-blue-500/20 blur-md" />
                    </div>
                    <span className="font-black text-zinc-500 text-[8px] tracking-[0.3em] uppercase">Neural_Telemetry</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <motion.div
                        key={ticker}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] font-bold text-zinc-400 italic tracking-wide flex items-center gap-3"
                    >
                        <span className="text-zinc-700">[{new Date().toLocaleTimeString()}]</span>
                        {ticker}
                    </motion.div>
                </div>
                <div className="flex items-center gap-6 text-zinc-800 text-[8px] font-black uppercase tracking-widest shrink-0">
                    <div className="flex items-center gap-2">
                        <Command className="w-3 h-3" />
                        <span>Sovereign</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Maximize2 className="w-3 h-3" />
                        <span>100%</span>
                    </div>
                </div>
            </div>

            {/* Agent Detail Sidebar */}
            <AnimatePresence>
                {selectedAgent && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute right-0 top-0 bottom-0 w-[420px] bg-[#020202]/98 backdrop-blur-[50px] border-l border-white/10 p-10 shadow-[0_0_100px_rgba(0,0,0,1)] z-[200] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-14">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-3xl shadow-2xl border-4 border-black">
                                        {selectedAgent.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2">{selectedAgent.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                                                <span className="text-[9px] font-black text-blue-500/80 tracking-widest uppercase">{selectedAgent.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAgent(null)} className="p-3 hover:bg-white/5 rounded-2xl transition-all group active:scale-90">
                                <XCircle className="w-6 h-6 text-zinc-800 group-hover:text-red-500/60 transition-colors" />
                            </button>
                        </div>

                        {/* Neural Data Grid */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 pr-2">
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-px bg-blue-500/20" />
                                    <span className="text-[9px] font-black text-zinc-600 tracking-[0.4em] uppercase">Compute_Core</span>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <NeuralStat label="Primary_Model" value={selectedAgent.model || "Unknown"} icon={<Cpu className="w-3 h-3 text-blue-500" />} />
                                    <NeuralStat label="Memory_State" value="Persistent" icon={<ShieldCheck className="w-3 h-3 text-emerald-500" />} />
                                    <NeuralStat label="Context_Window" value="2.1M Tokens" icon={<Layers className="w-3 h-3 text-purple-500" />} />
                                    <NeuralStat label="Auth_Node" value="Fortress_Mac" icon={<Terminal className="w-3 h-3 text-orange-500" />} />
                                </div>
                            </section>

                            <section className="space-y-6 flex-1 flex flex-col min-h-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-px bg-emerald-500/20" />
                                    <span className="text-[9px] font-black text-zinc-600 tracking-[0.4em] uppercase">Neural_Log</span>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>
                                <div className="flex-1 bg-black border border-white/5 rounded-2xl p-6 font-mono text-[10px] text-zinc-500 shadow-inner overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-0.5 h-full bg-emerald-500/20" />
                                    <pre className="whitespace-pre-wrap leading-relaxed italic h-full overflow-y-auto custom-scrollbar">
                                        {`>> Establishing neural handshake with ${selectedAgent.name}...\n>> Secure protocol: X-402 ENCRYPTED\n>> CURRENT_ACTIVITY: "${selectedAgent.lastAction}"\n>> STATUS: ${selectedAgent.status}\n>> THOUGHT: "${selectedAgent.thought}"\n>> Pattern synchronization: 100%\n>> Logic hygiene check: PASS\n>> Swarm consensus: ACHIEVED\n>> Waiting for instruction override...`}
                                    </pre>
                                </div>
                            </section>
                        </div>

                        {/* Action Bar */}
                        <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                            <div className="flex gap-3">
                                <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-[0.3em] uppercase rounded-2xl transition-all shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 text-xs">
                                    <Zap className="w-4 h-4 fill-white" />
                                    NEURAL_SYNC
                                </button>
                                <button className="w-16 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 rounded-2xl border border-white/5 flex items-center justify-center transition-all">
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex justify-center items-center gap-3">
                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[8px] font-black text-zinc-800 tracking-[0.5em] uppercase">Sovereign_System</span>
                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function NeuralStat({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 group hover:bg-white/[0.04] transition-all hover:border-white/10">
            <div className="flex items-center gap-2">
                {icon}
                <div className="text-[7px] font-black text-zinc-700 tracking-[0.15em] uppercase">{label}</div>
            </div>
            <div className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">{value}</div>
        </div>
    );
}
