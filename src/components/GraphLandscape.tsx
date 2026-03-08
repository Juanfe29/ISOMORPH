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

        // Camera perspective
        const fov = 400; // Field of view
        const camY = 400; // Camera height above ground

        // Grid setup
        const gridLinesX = 40; // Number of vertical lines going into distance
        const gridLinesZ = 60; // Number of horizontal lines crossing the screen
        const spacingX = 200; // Space between vertical lines
        const spacingZ = 150; // Space between horizontal lines

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        // Pre-generate stars for the firmament
        interface Star {
            x: number; y: number; r: number; a: number;
        }
        const stars: Star[] = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * 3000 - 1500, // Wide spread horizontally
                y: Math.random() * -1000 - 100, // Only upper half (negative Y in screen space relative to horizon)
                r: Math.random() * 1.5 + 0.5,
                a: Math.random() * Math.PI * 2
            });
        }

        // The "Sun" nodes
        interface SunNode {
            x: number; y: number; z: number; phase: number;
        }
        const sunNodes: SunNode[] = [];
        for (let i = 0; i < 60; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 180; // Sun radius
            sunNodes.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
                phase: Math.random() * Math.PI * 2
            });
        }

        const getElevation = (x: number, z: number, t: number) => {
            // Generate sweeping mountains and valleys
            let y = (Math.sin(x * 0.002 + t * 0.5) * Math.cos(z * 0.003 - t * 0.2)) * 300;
            y += (Math.sin(x * 0.008 - t * 0.3) * Math.cos(z * 0.005 + t * 0.4)) * 100;
            // Lower the center to create a valley for the text
            const distFromCenter = Math.abs(x);
            if (distFromCenter < 1000) {
                y -= (1000 - distFromCenter) * 0.2; // flatten valley
            } else {
                y += (distFromCenter - 1000) * 0.3; // raise mountains on sides
            }
            return y;
        };

        const project = (x: number, y: number, z: number, cx: number, cy: number) => {
            if (z <= 0) return null;
            const scale = fov / z;
            return {
                x: cx + x * scale,
                y: cy - (y - camY) * scale, // Subtract because canvas Y is flipped relative to world Y
                scale
            };
        };

        const render = () => {
            time += 0.015; // Animation speed

            ctx.fillStyle = '#020305'; // Deep space black
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2 + 100; // Horizon line, pushed slightly down to give room to the text

            // --- 1. FIRMAMENT (STARS & SKY) ---
            ctx.fillStyle = '#ffffff';
            stars.forEach(s => {
                const twinkle = (Math.sin(time * 2 + s.a) + 1) * 0.5;
                ctx.globalAlpha = 0.1 + twinkle * 0.6;
                ctx.beginPath();
                // We project stars with virtually infinite Z (so they don't move with camera, just pin them to horizon)
                ctx.arc(cx + s.x, cy + s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // --- 2. THE SUN (HORIZON HUB) ---
            const sunZ = 3000; // Distance of the sun
            const sunProj = project(0, 0, sunZ, cx, cy); // Center on horizon

            if (sunProj) {
                ctx.strokeStyle = 'rgba(255, 157, 0, 0.4)';
                ctx.lineWidth = 1;

                // Draw sun internal web
                const projectedSunNodes = sunNodes.map(sn => {
                    // Rotate sun nodes
                    const rx = sn.x * Math.cos(time) - sn.z * Math.sin(time);
                    const rz = sn.x * Math.sin(time) + sn.z * Math.cos(time);
                    const ry = sn.y + Math.sin(time * 2 + sn.phase) * 10; // breathe

                    return project(rx, ry, sunZ + rz, cx, cy);
                });

                ctx.beginPath();
                for (let i = 0; i < projectedSunNodes.length; i++) {
                    const p1 = projectedSunNodes[i];
                    if (!p1) continue;

                    // Draw node
                    ctx.fillStyle = '#ff9d00';
                    ctx.globalAlpha = 0.8;
                    ctx.beginPath();
                    ctx.arc(p1.x, p1.y, 2 * p1.scale, 0, Math.PI * 2);
                    ctx.fill();

                    // Connect edges
                    for (let j = i + 1; j < projectedSunNodes.length; j++) {
                        const p2 = projectedSunNodes[j];
                        if (!p2) continue;
                        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                        if (dist < 40 * p1.scale) {
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                        }
                    }
                }
                ctx.globalAlpha = 1.0;
                ctx.stroke();

                // Outer glow
                const grd = ctx.createRadialGradient(sunProj.x, sunProj.y, 10, sunProj.x, sunProj.y, 150 * sunProj.scale);
                grd.addColorStop(0, 'rgba(255, 157, 0, 0.15)');
                grd.addColorStop(1, 'rgba(255, 157, 0, 0)');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(sunProj.x, sunProj.y, 150 * sunProj.scale, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- 3. THE EARTH (TERRAIN GRID) ---
            // Calculate moving offset to make it feel like "flying forward"
            const zOffset = (time * 400) % spacingZ;

            type Pt = { x: number, y: number, scale: number, elevation: number };
            const terrain: (Pt | null)[][] = [];

            for (let zRow = 0; zRow < gridLinesZ; zRow++) {
                const z = zRow * spacingZ - zOffset + 50; // Start slightly in front of camera
                terrain[zRow] = [];

                for (let xCol = 0; xCol < gridLinesX; xCol++) {
                    const x = (xCol - gridLinesX / 2) * spacingX;

                    // Calculate Y based on world coordinates
                    const absoluteZ = z + time * 400; // For continuous noise sampling
                    const y = getElevation(x, absoluteZ, time);

                    const proj = project(x, y, z, cx, cy);
                    if (proj) {
                        terrain[zRow].push({ ...proj, elevation: y });
                    } else {
                        terrain[zRow].push(null);
                    }
                }
            }

            // Draw Terrain Grid
            ctx.lineWidth = 1.5;

            for (let zRow = 0; zRow < gridLinesZ - 1; zRow++) {
                for (let xCol = 0; xCol < gridLinesX - 1; xCol++) {
                    const p = terrain[zRow][xCol];
                    const pRight = terrain[zRow][xCol + 1];
                    const pDown = terrain[zRow + 1][xCol];

                    if (!p) continue;

                    // Fog / Depth mapping: Fade out lines far away
                    const depthAlpha = Math.max(0, Math.min(1, (p.scale * 3) - 0.1));

                    // Height mapping: Paint mountains white, valleys green-ish
                    const isHigh = p.elevation > 150;
                    ctx.strokeStyle = isHigh
                        ? `rgba(255, 255, 255, ${depthAlpha * 0.4})` // White peaks
                        : `rgba(125, 224, 92, ${depthAlpha * 0.6})`; // Green valleys

                    ctx.beginPath();
                    if (pRight) {
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(pRight.x, pRight.y);
                    }
                    if (pDown) {
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(pDown.x, pDown.y);
                    }
                    ctx.stroke();

                    // Optional: Draw nodes at vertices near camera for the tech look
                    if (depthAlpha > 0.5 && Math.random() > 0.5) {
                        ctx.fillStyle = isHigh ? '#ffffff' : '#7de05c';
                        ctx.globalAlpha = depthAlpha;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.globalAlpha = 1.0;
                    }
                }
            }

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
            {/* Horizon gradient overlap to mesh ground with sky */}
            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(255,157,0,0.08) 50%, rgba(125,224,92,0.05) 55%, rgba(0,0,0,0) 100%)' }} />

            {/* Dark gradient at the very top to fade out the stars smoothly */}
            <div className="absolute top-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10" />

            {/* Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)] pointer-events-none z-10" />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ mixBlendMode: 'screen' }}
            />
        </div>
    );
}
