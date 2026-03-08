"use client";

import React, { useEffect, useRef } from 'react';

export default function GraphLandscape() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
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
        }

        let nodes: Node3D[] = [];
        const gridCols = 45;
        const gridRows = 30;

        // 3D Projection configuration
        const fov = 400;
        const viewZ = 300; // Camera distance

        const initNodes = () => {
            nodes = [];

            // 1. Terrain Grid
            const sizeX = 2800;
            const sizeZ = 1600;

            for (let r = 0; r < gridRows; r++) {
                for (let c = 0; c < gridCols; c++) {
                    const px = (c / (gridCols - 1)) * sizeX - sizeX / 2;
                    const pz = (r / (gridRows - 1)) * sizeZ - sizeZ / 2 + 600;

                    // Superposition of waves for mountain-like terrain
                    let elevation = (Math.sin(px * 0.002) * Math.cos(pz * 0.003)) * 250;
                    elevation += (Math.sin(px * 0.008) * Math.sin(pz * 0.005)) * 80;
                    elevation -= (Math.cos(px * 0.015 + pz * 0.01)) * 30; // some noise

                    const py = -100 - elevation; // Negative Y puts it below the camera in 3D space

                    nodes.push({
                        x: (Math.random() - 0.5) * 5000,
                        y: (Math.random() - 0.5) * 5000,
                        z: (Math.random() - 0.5) * 5000,
                        tx: px, ty: py, tz: pz,
                        bx: px, by: py, bz: pz,
                        type: 'terrain',
                        color: r % 4 === 0 ? '#588c42' : '#ffffff', // Plant green accents
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }

            // 2. Sky/Stars Nodes
            const numSky = 200;
            for (let i = 0; i < numSky; i++) {
                const px = (Math.random() - 0.5) * 4000;
                const py = Math.random() * 1200 + 300; // High up (Positive Y)
                const pz = Math.random() * 2000 - 500;

                nodes.push({
                    x: (Math.random() - 0.5) * 5000,
                    y: (Math.random() - 0.5) * 5000,
                    z: (Math.random() - 0.5) * 5000,
                    tx: px, ty: py, tz: pz,
                    bx: px, by: py, bz: pz,
                    type: 'sky',
                    color: Math.random() > 0.85 ? '#e8851a' : '#e0e4ee', // Sun orange accents
                    phase: Math.random() * Math.PI * 2
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
            time += 0.004;
            ctx.clearRect(0, 0, width, height);

            // Center of screen projection point
            const cx = width / 2;
            const cy = height / 2 + 150; // Shifted slightly down

            // Update Nodes
            const lerpFactor = 0.012; // Speed of forming from chaos to order

            type Point2D = { x: number, y: number, scale: number };
            const points: (Point2D | null)[] = new Array(nodes.length).fill(null);

            nodes.forEach((n, idx) => {
                // Gentle floating
                n.tx = n.bx + Math.sin(time + n.phase) * (n.type === 'sky' ? 40 : 15);
                n.ty = n.by + Math.cos(time * 0.8 + n.phase) * (n.type === 'sky' ? 40 : 15);
                n.tz = n.bz + Math.sin(time * 1.2 + n.phase) * 20;

                // Move towards target
                n.x = lerp(n.x, n.tx, lerpFactor);
                n.y = lerp(n.y, n.ty, lerpFactor);
                n.z = lerp(n.z, n.tz, lerpFactor);

                // 3D Projection
                const scale = fov / (fov + n.z + viewZ);
                if (scale > 0 && n.z > -viewZ) { // Avoid points behind camera
                    const screenX = cx + (n.x * scale);
                    const screenY = cy - (n.y * scale); // Minus since true 3D Y is up, Canvas Y is down
                    points[idx] = { x: screenX, y: screenY, scale };
                }
            });

            // Draw Terrain Grid Lines
            // Indices 0 to gridRows * gridCols - 1 belong to the terrain
            ctx.lineWidth = 0.6;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.beginPath();

            for (let r = 0; r < gridRows - 1; r++) {
                for (let c = 0; c < gridCols - 1; c++) {
                    const idx = r * gridCols + c;
                    const p1 = points[idx];
                    const p2 = points[idx + 1]; // right neighbor
                    const p3 = points[idx + gridCols]; // bottom neighbor

                    if (p1) {
                        if (p2 && Math.random() > 0.05) { // Skip few lines for tech aesthetic
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                        }
                        if (p3 && Math.random() > 0.05) {
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p3.x, p3.y);
                        }
                    }
                }
            }
            ctx.stroke();

            // Draw Sky Connections (Constellations)
            const skyOffset = gridRows * gridCols;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(232, 133, 26, 0.12)'; // Orange glow for constellations
            for (let i = skyOffset; i < nodes.length; i++) {
                const p1 = points[i];
                if (!p1) continue;
                // Only check proximity with a few next elements for performance and constellation look
                for (let j = i + 1; j < Math.min(i + 15, nodes.length); j++) {
                    const p2 = points[j];
                    if (!p2) continue;

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    if (dx * dx + dy * dy < 18000) {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                    }
                }
            }
            ctx.stroke();

            // Draw Cross-Connections (Sky to Terrain, infrequent)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(88, 140, 66, 0.1)'; // Hint of green
            for (let i = skyOffset; i < nodes.length; i += 8) {
                const pSky = points[i];
                if (!pSky) continue;
                const terrainIdx = Math.floor(Math.random() * skyOffset);
                const pTerr = points[terrainIdx];
                if (pTerr) {
                    const dx = pSky.x - pTerr.x;
                    const dy = pSky.y - pTerr.y;
                    if (dx * dx + dy * dy < 50000 && Math.random() > 0.3) {
                        ctx.moveTo(pSky.x, pSky.y);
                        ctx.lineTo(pTerr.x, pTerr.y);
                    }
                }
            }
            ctx.stroke();

            // Draw Points
            for (let i = 0; i < nodes.length; i++) {
                const p = points[i];
                if (p) {
                    ctx.fillStyle = nodes[i].color;
                    ctx.globalAlpha = Math.min(1, Math.max(0.1, p.scale));
                    ctx.beginPath();
                    const radius = nodes[i].type === 'sky' ? 1.5 * p.scale : 0.8 * p.scale;
                    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                    ctx.fill();
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
            {/* Subtle atmospheric glow behind the graph */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 80%, rgba(88, 140, 66, 0.15) 0%, rgba(5, 5, 5, 0) 50%)' }} />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
            />
        </div>
    );
}
