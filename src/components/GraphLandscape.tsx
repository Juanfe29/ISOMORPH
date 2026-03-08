"use client";

import React, { useEffect, useRef } from 'react';

export default function GraphLandscape() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let animationFrameId: number;
        let time = 0;

        interface Node3D {
            x: number; y: number; z: number;
            tx: number; ty: number; tz: number;
            bx: number; by: number; bz: number;
            type: 'terrain' | 'sky' | 'sun';
            color: string;
            phase: number;
            sizeMulti: number;
        }

        let nodes: Node3D[] = [];
        const gridCols = 60;
        const gridRows = 40;

        const fov = 350;
        const viewZ = 250;

        const initNodes = () => {
            nodes = [];

            // 1. Terrain Grid (Very structural, flat with clear mountains on sides/back)
            const sizeX = 4000;
            const sizeZ = 2500;

            for (let r = 0; r < gridRows; r++) {
                for (let c = 0; c < gridCols; c++) {
                    const px = (c / (gridCols - 1)) * sizeX - sizeX / 2;
                    const pz = (r / (gridRows - 1)) * sizeZ; // Starts from 0 depth going back

                    // Create a distinct valley in the center, mountains on the edges and far back
                    const distFromCenter = Math.abs(px) / (sizeX / 2);
                    const depthFactor = pz / sizeZ;

                    // Base flat ground
                    let elevation = -200;

                    // Mountains rising on the sides and far back
                    if (distFromCenter > 0.3 || depthFactor > 0.6) {
                        const mntZ = Math.sin(pz * 0.003) * 600 * (depthFactor * 1.5);
                        const mntX = (Math.pow(distFromCenter, 2)) * 800; // quadratic rise on edges
                        // Add some noise to mountains
                        const noise = (Math.sin(px * 0.01) * Math.cos(pz * 0.01)) * 150;
                        elevation += Math.max(0, mntZ + mntX + noise);
                    }

                    // Negative Y because 3D Y is up, but we want ground below us.
                    const py = -150 - elevation;

                    nodes.push({
                        // Start scattered high above or far away
                        x: (Math.random() - 0.5) * 6000,
                        y: Math.random() * 4000 + 1000,
                        z: (Math.random()) * 4000 + 1000,

                        tx: px, ty: py, tz: pz + 400, // +400 pushes the whole grid slightly back
                        bx: px, by: py, bz: pz + 400,
                        type: 'terrain',
                        // Earthy/Tech colors. Bright green near camera, fading to white/grey far away
                        color: depthFactor < 0.4 ? (Math.random() > 0.5 ? '#7de05c' : '#ffffff') : '#888888',
                        phase: Math.random() * Math.PI * 2,
                        sizeMulti: depthFactor < 0.3 ? 1.5 : 0.8
                    });
                }
            }

            // 2. The "Sun" or Central Hub in the firmament
            const sunNodes = 40;
            for (let i = 0; i < sunNodes; i++) {
                // Form a sphere shape near the horizon line dead center
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 150;
                const px = r * Math.sin(phi) * Math.cos(theta);
                const py = r * Math.sin(phi) * Math.sin(theta) + 300; // Horizon height
                const pz = r * Math.cos(phi) + 2600; // Far back

                nodes.push({
                    x: (Math.random() - 0.5) * 8000, y: Math.random() * 8000, z: Math.random() * 8000,
                    tx: px, ty: py, tz: pz, bx: px, by: py, bz: pz,
                    type: 'sun',
                    color: '#ff9d00', // Sun orange
                    phase: Math.random() * Math.PI * 2,
                    sizeMulti: 2.5
                });
            }

            // 3. Sky / Firmament (Dome over the landscape)
            const numSky = 150;
            for (let i = 0; i < numSky; i++) {
                // Random points strictly in upper hemisphere
                const theta = Math.random() * Math.PI; // 0 to PI (Arching over)
                const phi = Math.random() * Math.PI;
                const r = 2500; // Huge dome radius

                const px = r * Math.cos(phi);
                const py = Math.abs(r * Math.sin(phi) * Math.sin(theta)) + 400; // Ensure it's above horizon
                const pz = r * Math.sin(phi) * Math.cos(theta) + 1200;

                nodes.push({
                    x: (Math.random() - 0.5) * 8000, y: Math.random() * 8000, z: Math.random() * 8000,
                    tx: px, ty: py, tz: pz, bx: px, by: py, bz: pz,
                    type: 'sky',
                    color: Math.random() > 0.8 ? '#7de05c' : '#ffffff',
                    phase: Math.random() * Math.PI * 2,
                    sizeMulti: Math.random() > 0.9 ? 2.0 : 1.0
                });
            }
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initNodes();
        };

        window.addEventListener('resize', handleResize);
        initNodes();

        const lerp = (start: number, end: number, amt: number) => {
            return (1 - amt) * start + amt * end;
        };

        const render = () => {
            time += 0.003;

            ctx.fillStyle = '#020305'; // Match brand background
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2 + 100; // Horizon line is slightly below center screen

            const lerpFactor = 0.018;

            type Point2D = { x: number, y: number, scale: number, color: string, type: string, sizeMulti: number };
            const points: (Point2D | null)[] = new Array(nodes.length).fill(null);

            nodes.forEach((n, idx) => {
                // Specific floating behaviors
                if (n.type === 'terrain') {
                    // Ground breathes very subtly
                    n.ty = n.by + Math.cos(time * 0.5 + n.phase) * 10;
                } else if (n.type === 'sun') {
                    // Sun rotates
                    n.tx = n.bx + Math.cos(time + n.phase) * 30;
                    n.ty = n.by + Math.sin(time + n.phase) * 30;
                } else {
                    // Sky drifts slowly
                    n.tx = n.bx + Math.sin(time * 0.2 + n.phase) * 40;
                    n.tz = n.bz + Math.cos(time * 0.2 + n.phase) * 40;
                }

                n.x = lerp(n.x, n.tx, lerpFactor);
                n.y = lerp(n.y, n.ty, lerpFactor);
                n.z = lerp(n.z, n.tz, lerpFactor);

                const scale = fov / (fov + n.z + viewZ);
                if (scale > 0 && n.z > -viewZ) {
                    points[idx] = {
                        x: cx + (n.x * scale),
                        y: cy - (n.y * scale), // -y converts 3D up to Canvas up
                        scale, color: n.color, type: n.type, sizeMulti: n.sizeMulti
                    };
                }
            });

            // 1. TERRAIN GRID LINES
            ctx.lineWidth = 1.0;
            ctx.beginPath();

            for (let r = 0; r < gridRows - 1; r++) {
                for (let c = 0; c < gridCols - 1; c++) {
                    const idx = r * gridCols + c;
                    const p1 = points[idx];
                    const p2 = points[idx + 1];
                    const p3 = points[idx + gridCols];

                    if (p1) {
                        // Fade grid towards the back (horizon) to create depth
                        const depthAlpha = Math.min(1, p1.scale * 1.5);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${depthAlpha * 0.3})`;

                        if (p2) {
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                        }
                        if (p3) {
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p3.x, p3.y);
                        }
                    }
                }
            }
            ctx.stroke();

            // 2. SUN CONNECTIONS (Dense Core)
            const sunOffset = gridRows * gridCols;
            const skyOffset = sunOffset + 40; // 40 sun nodes

            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(255, 157, 0, 0.4)';
            for (let i = sunOffset; i < skyOffset; i++) {
                const p1 = points[i];
                if (!p1) continue;
                for (let j = i + 1; j < skyOffset; j++) {
                    const p2 = points[j];
                    if (!p2) continue;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                }
            }
            ctx.stroke();

            // 3. SKY CONSTELLATIONS
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            for (let i = skyOffset; i < nodes.length; i++) {
                const p1 = points[i];
                if (!p1) continue;
                let connections = 0;
                for (let j = i + 1; j < nodes.length && connections < 2; j++) {
                    const p2 = points[j];
                    if (!p2) continue;
                    if (Math.abs(p1.x - p2.x) < 200 && Math.abs(p1.y - p2.y) < 200) {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        connections++;
                    }
                }
            }
            ctx.stroke();

            // 4. DRAW NODES
            for (let i = 0; i < nodes.length; i++) {
                const p = points[i];
                if (p) {
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.min(1, p.scale * 2.0);
                    ctx.beginPath();
                    const radius = (p.type === 'sun' ? 2.5 : p.type === 'sky' ? 1.5 : 1.0) * p.scale * p.sizeMulti;
                    ctx.arc(p.x, p.y, Math.max(0.3, radius), 0, Math.PI * 2);
                    ctx.fill();

                    if (p.type === 'sun' || p.sizeMulti > 1.5) {
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = Math.min(1, p.scale) * 0.4;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, radius * 4, 0, Math.PI * 2);
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
            {/* Horizontal gradient to mock atmosphere/horizon glow */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(255,157,0,0.1) 50%, rgba(88,140,66,0.05) 60%, rgba(0,0,0,0) 100%)' }} />

            {/* Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none z-10" />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
        </div>
    );
}
