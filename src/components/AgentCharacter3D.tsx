"use client";

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Agent {
    id: string;
    name: string;
    status: string;
    lastAction: string;
    color: string;
    avatar: string;
    task?: string;
    model?: string;
    thought?: string;
}

// Map Tailwind color names to hex
const COLOR_MAP: Record<string, string> = {
    'bg-white': '#e2e8f0',
    'bg-blue-500': '#3b82f6',
    'bg-emerald-500': '#10b981',
    'bg-amber-500': '#f59e0b',
    'bg-purple-500': '#8b5cf6',
    'bg-red-500': '#ef4444',
    'bg-indigo-500': '#6366f1',
    'bg-pink-500': '#ec4899',
    'bg-yellow-500': '#eab308',
    'bg-cyan-500': '#06b6d4',
    'bg-orange-500': '#f97316',
    'bg-rose-500': '#f43f5e',
};

function getHexColor(twColor: string): string {
    return COLOR_MAP[twColor] || '#6366f1';
}

function getStatusEmoji(status: string): string {
    const s = status.toUpperCase();
    if (s.includes('CODING') || s.includes('BUILDING')) return "⌨️";
    if (s.includes('EXECUTING')) return "⚡";
    if (s.includes('SEARCHING') || s.includes('SCRAPING')) return "🔍";
    if (s.includes('TALKING') || s.includes('PLANNING')) return "💬";
    if (s.includes('READING')) return "📖";
    if (s.includes('WAITING')) return "⏳";
    return "💤";
}

interface AgentCharacter3DProps {
    agent: Agent;
    targetPosition: [number, number, number];
    onClick: (agent: Agent) => void;
    isSelected: boolean;
}

export default function AgentCharacter3D({ agent, targetPosition, onClick, isSelected }: AgentCharacter3DProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const currentPos = useRef(new THREE.Vector3(...targetPosition));
    const [hovered, setHovered] = useState(false);
    const bobOffset = useRef(Math.random() * Math.PI * 2);
    const headColor = getHexColor(agent.color);
    const bodyColor = new THREE.Color(headColor).multiplyScalar(0.7).getHexString();

    useFrame((state) => {
        if (!groupRef.current) return;

        // Lerp position toward target
        const target = new THREE.Vector3(...targetPosition);
        currentPos.current.lerp(target, 0.02);
        groupRef.current.position.copy(currentPos.current);

        // Idle bob
        const t = state.clock.elapsedTime + bobOffset.current;
        groupRef.current.position.y = currentPos.current.y + Math.sin(t * 1.5) * 0.05;

        // Slight rotation toward movement direction
        const diff = target.clone().sub(currentPos.current);
        if (diff.length() > 0.1) {
            const angle = Math.atan2(diff.x, diff.z);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                angle,
                0.05
            );
        }
    });

    return (
        <group
            ref={groupRef}
            onClick={(e) => { e.stopPropagation(); onClick(agent); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
            {/* Selection / hover glow ring */}
            {(isSelected || hovered) && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                    <ringGeometry args={[0.5, 0.65, 32]} />
                    <meshBasicMaterial
                        color={isSelected ? '#3b82f6' : headColor}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            )}

            {/* Shadow blob */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <circleGeometry args={[0.35, 16]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.4} />
            </mesh>

            {/* Legs */}
            <RoundedBox args={[0.15, 0.3, 0.15]} position={[-0.12, 0.15, 0]} radius={0.03} smoothness={2}>
                <meshStandardMaterial color={`#${bodyColor}`} />
            </RoundedBox>
            <RoundedBox args={[0.15, 0.3, 0.15]} position={[0.12, 0.15, 0]} radius={0.03} smoothness={2}>
                <meshStandardMaterial color={`#${bodyColor}`} />
            </RoundedBox>

            {/* Body (torso) */}
            <RoundedBox args={[0.45, 0.45, 0.3]} position={[0, 0.55, 0]} radius={0.06} smoothness={2}>
                <meshStandardMaterial color={headColor} />
            </RoundedBox>

            {/* Arms */}
            <RoundedBox args={[0.12, 0.35, 0.12]} position={[-0.32, 0.5, 0]} radius={0.03} smoothness={2}>
                <meshStandardMaterial color={`#${bodyColor}`} />
            </RoundedBox>
            <RoundedBox args={[0.12, 0.35, 0.12]} position={[0.32, 0.5, 0]} radius={0.03} smoothness={2}>
                <meshStandardMaterial color={`#${bodyColor}`} />
            </RoundedBox>

            {/* Head */}
            <RoundedBox args={[0.35, 0.35, 0.3]} position={[0, 0.95, 0]} radius={0.08} smoothness={2}>
                <meshStandardMaterial color={headColor} />
            </RoundedBox>

            {/* Eyes */}
            <mesh position={[-0.08, 0.97, 0.16]}>
                <boxGeometry args={[0.06, 0.06, 0.02]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.08, 0.97, 0.16]}>
                <boxGeometry args={[0.06, 0.06, 0.02]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Pupils */}
            <mesh position={[-0.08, 0.96, 0.175]}>
                <boxGeometry args={[0.03, 0.03, 0.01]} />
                <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh position={[0.08, 0.96, 0.175]}>
                <boxGeometry args={[0.03, 0.03, 0.01]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Status emoji above head — no distanceFactor for orthographic camera */}
            <Html
                position={[0, 1.4, 0]}
                center
                sprite
                style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
                <div style={{
                    fontSize: '14px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
                    transform: 'scale(0.8)',
                }}>
                    {getStatusEmoji(agent.status)}
                </div>
            </Html>

            {/* Thought bubble (shown on hover) */}
            {hovered && agent.thought && (
                <Html
                    position={[0, 1.7, 0]}
                    center
                    sprite
                    style={{ pointerEvents: 'none' }}
                >
                    <div style={{
                        background: 'rgba(0,0,0,0.92)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '3px 8px',
                        fontSize: '7px',
                        fontWeight: 700,
                        color: '#71717a',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontStyle: 'italic',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.8)',
                    }}>
                        &quot;{agent.thought}&quot;
                    </div>
                </Html>
            )}

            {/* Name tag below character */}
            <Html
                position={[0, -0.25, 0]}
                center
                sprite
                style={{ pointerEvents: 'none' }}
            >
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    border: `1px solid ${isSelected ? '#3b82f650' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '6px',
                    padding: '2px 6px',
                    fontSize: '7px',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    color: isSelected ? '#93c5fd' : '#d4d4d8',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textTransform: 'uppercase' as const,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}>
                    {agent.name}
                </div>
            </Html>

            {/* Active work indicator: pulsing ring around working agents */}
            {agent.status !== 'IDLE' && agent.status !== 'WAITING' && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
                    <ringGeometry args={[0.42, 0.45, 32]} />
                    <meshBasicMaterial color={headColor} transparent opacity={0.25} />
                </mesh>
            )}
        </group>
    );
}
