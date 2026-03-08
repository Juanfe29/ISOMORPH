"use client";

import React, { useEffect, useRef } from 'react';

export default function GraphLandscape() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Better performance
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let animationFrameId: number;
        let time = 0;

        interface Node3D {
            x: number; y: number; z: number; // Current scattered pos
            tx: number; ty: number; tz: number; // Target formation pos
            bx: number; by: number; bz: number; // Base formation pos
            type: 'terrain' | 'sky';
            color: string;
            phase: number;
            sizeMulti: number;
        }

        let nodes: Node3D[] = [];
        const gridCols = 50;  // denser grid
        const gridRows = 35;

        // 3D Projection configuration
        const fov = 450;
        const viewZ = 200; // Camera distance

        const initNodes = () => {
            nodes = [];

            // 1. Terrain Grid (Very structural)
            const sizeX = 3500;
            const sizeZ = 2200;

            for (let r = 0; r < gridRows; r++) {
                for (let c = 0; c < gridCols; c++) {
                    const px = (c / (gridCols - 1)) * sizeX - sizeX / 2;
                    const pz = (r / (gridRows - 1)) * sizeZ - sizeZ / 2 + 800;

                    // Clearer mountains and valleys
                    let elevation = (Math.sin(px * 0.0015) * Math.cos(pz * 0.002)) * 400;
                    elevation += (Math.sin(px * 0.005) * Math.sin(pz * 0.004)) * 100;

                    const py = -150 - elevation; // Negative Y puts it below the camera in 3D space

                    nodes.push({
                        x: (Math.random() - 0.5) * 8000,
                        y: (Math.random() - 0.5) * 8000, // Starts very scattered
                        z: (Math.random() - 0.5) * 8000 + 2000,
                        tx: px, ty: py, tz: pz,
                        bx: px, by: py, bz: pz,
                        type: 'terrain',
                        // High contrast: Bright white or vibrant green
                        color: Math.random() > 0.9 ? '#7de05c' : '#ffffff',
                        phase: Math.random() * Math.PI * 2,
                        sizeMulti: Math.random() > 0.9 ? 2.5 : 1.2
                    });
                }
            }

            // 2. Sky Constellations (Clear and structured)
            const numSky = 120;
            for (let i = 0; i < numSky; i++) {
                const px = (Math.random() - 0.5) * 5000;
                const py = Math.random() * 1500 + 400; // Sky
                const pz = Math.random() * 3000 - 1000;

                nodes.push({
                    x: (Math.random() - 0.5) * 8000,
                    y: (Math.random() - 0.5) * 8000,
                    z: (Math.random() - 0.5) * 8000 + 2000,
                    tx: px, ty: py, tz: pz,
                    bx: px, by: py, bz: pz,
                    type: 'sky',
                    // Very bright orange for sun theme
                    color: Math.random() > 0.7 ? '#ff9d00' : '#e0e4ee',
                    phase: Math.random() * Math.PI * 2,
                    sizeMulti: Math.random() > 0.8 ? 3.0 : 1.5
                });
            }
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initNodes(); // re-init so they physically reform from chaos
        };

        window.addEventListener('resize', handleResize);
        initNodes();

        // Ease out quadratic
        const lerp = (start: number, end: number, amt: number) => {
            return (1 - amt) * start + amt * end;
        };

        const render = () => {
            time += 0.003; // Slower, more majestic breathing
            // Solid solid black background for maximum contrast
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            // Center of screen projection point
            const cx = width / 2;
            const cy = height / 2 + 100; // Shifted slightly down

            // Update Nodes
            const lerpFactor = 0.015; // Animation speed from chaos

            type Point2D = { x: number, y: number, scale: number, color: string, type: string, sizeMulti: number };
            const points: (Point2D | null)[] = new Array(nodes.length).fill(null);

            nodes.forEach((n, idx) => {
                // Ocean/Breathing effect is stronger
                n.tx = n.bx + Math.sin(time + n.phase) * (n.type === 'sky' ? 60 : 30);
                n.ty = n.by + Math.cos(time * 0.8 + n.phase) * (n.type === 'sky' ? 50 : 25);
                n.tz = n.bz + Math.sin(time * 1.2 + n.phase) * 30;

                // Move towards target
                n.x = lerp(n.x, n.tx, lerpFactor);
                n.y = lerp(n.y, n.ty, lerpFactor);
                n.z = lerp(n.z, n.tz, lerpFactor);

                // 3D Projection
                const scale = fov / (fov + n.z + viewZ);
                if (scale > 0 && n.z > -viewZ) { // Avoid points behind camera
                    points[idx] = {
                        x: cx + (n.x * scale),
                        y: cy - (n.y * scale),
                        scale, color: n.color, type: n.type, sizeMulti: n.sizeMulti
                    };
                }
            });

            // TERRAIN GRID LINES (Highly visible)
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'; // Much brighter lines
            ctx.beginPath();

            for (let r = 0; r < gridRows - 1; r++) {
                for (let c = 0; c < gridCols - 1; c++) {
                    const idx = r * gridCols + c;
                    const p1 = points[idx];
                    const p2 = points[idx + 1];
                    const p3 = points[idx + gridCols];

                    if (p1) {
                        if (p2 && Math.random() > 0.02) {
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                        }
                        if (p3 && Math.random() > 0.02) {
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p3.x, p3.y);
                        }
                    }
                }
            }
            ctx.stroke();

            // SKY CONSTELLATIONS (Bright Orange)
            const skyOffset = gridRows * gridCols;
            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(255, 157, 0, 0.35)';
            for (let i = skyOffset; i < nodes.length; i++) {
                const p1 = points[i];
                if (!p1) continue;
                let connections = 0;
                for (let j = i + 1; j < nodes.length && connections < 3; j++) {
                    const p2 = points[j];
                    if (!p2) continue;

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    if (dx * dx + dy * dy < 40000) {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        connections++;
                    }
                }
            }
            ctx.stroke();

            // Draw Cross-Connections (Sky to Terrain, infrequent)
            // Removed this section as per instructions to improve clarity and focus on lattice/web.

            // DRAW BRIGHT NODES
            for (let i = 0; i < nodes.length; i++) {
                const p = points[i];
                if (p) {
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.min(1, Math.max(0.3, p.scale * 1.5));
                    ctx.beginPath();
                    const radius = (p.type === 'sky' ? 2.5 : 1.5) * p.scale * p.sizeMulti;
                    ctx.arc(p.x, p.y, Math.max(0.5, radius), 0, Math.PI * 2);
                    ctx.fill();

                    // Add glow for special large nodes
                    if (p.sizeMulti > 2.0) {
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = Math.min(1, Math.max(0.3, p.scale * 1.5)) * 0.3;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            ctx.globalAlpha = 1.0;

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
            {/* Dark vignette to center focus */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none z-10" />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'contrast(1.2)' }}
            />
        </div>
    );
}
