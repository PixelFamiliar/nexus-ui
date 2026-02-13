"use client";

import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface Zone {
    id: string;
    name: string;
    position: [number, number, number];
    size: [number, number];
    color: string;
    borderColor: string;
}

const ZONES: Zone[] = [
    {
        id: 'execution',
        name: 'NEURAL_EXECUTION_GRID',
        position: [-4, 0.01, -2],
        size: [14, 8],
        color: '#1e3a5f',
        borderColor: '#3b82f6',
    },
    {
        id: 'sync',
        name: 'CORE_SYNC_LEVEL',
        position: [-1, 0.01, 6],
        size: [10, 5],
        color: '#2d1b4e',
        borderColor: '#8b5cf6',
    },
];

function ZonePlane({ zone }: { zone: Zone }) {
    const edgesGeometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(zone.size[0], zone.size[1]);
        return new THREE.EdgesGeometry(geo);
    }, [zone.size]);

    return (
        <group position={zone.position}>
            {/* Zone floor fill */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={zone.size} />
                <meshStandardMaterial
                    color={zone.color}
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Zone border */}
            <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} geometry={edgesGeometry}>
                <lineBasicMaterial color={zone.borderColor} transparent opacity={0.4} />
            </lineSegments>

            {/* Zone label */}
            <Html
                position={[-zone.size[0] / 2 + 0.5, 0.1, -zone.size[1] / 2 + 0.3]}
                style={{ pointerEvents: 'none' }}
                distanceFactor={12}
            >
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    border: `1px solid ${zone.borderColor}40`,
                    borderRadius: '12px',
                    padding: '4px 12px',
                    fontSize: '9px',
                    fontWeight: 900,
                    letterSpacing: '0.3em',
                    color: '#71717a',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(8px)',
                }}>
                    {zone.name}
                </div>
            </Html>
        </group>
    );
}

export default function GridFloor() {
    return (
        <group>
            {/* Main grid */}
            <gridHelper
                args={[30, 30, '#1a2744', '#0d1620']}
                position={[0, 0, 2]}
            />

            {/* Secondary subtle grid */}
            <gridHelper
                args={[30, 60, '#0f1a2e', '#080f1a']}
                position={[0, -0.01, 2]}
            />

            {/* Floor plane (solid dark bg) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 2]}>
                <planeGeometry args={[40, 40]} />
                <meshBasicMaterial color="#030810" transparent opacity={0.95} />
            </mesh>

            {/* Zone overlays */}
            {ZONES.map(zone => (
                <ZonePlane key={zone.id} zone={zone} />
            ))}
        </group>
    );
}

export { ZONES };
export type { Zone };
