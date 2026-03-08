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
        let time = 0; // Total time
        // const startupTime = Date.now(); // Used for the intro sequence

        // Intro Sequence Phases configuration
        // Phase 1 (0-2s): Two stars rush to center
        // Phase 2 (2-3s): Supernova flash and explosion
        // Phase 3 (3-5.5s): Nodes travel to their landscape positions
        // Phase 4 (5.5s+): Normal breathing landscape
        const PHASE_1_DURATION = 4000; // Stars rush in
        const PHASE_2_DURATION = 1500; // Supernova flash
        const PHASE_3_DURATION = 4500; // Build the landscape

        // Camera perspective
        const fov = 400; // Field of view
        const camY = 400; // Camera height above ground

        // Grid setup for Terrain
        const gridLinesX = 40; // Number of vertical lines going into distance
        const gridLinesZ = 60; // Number of horizontal lines crossing the screen
        const spacingX = 200; // Space between vertical lines
        const spacingZ = 150; // Space between horizontal lines

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        // --- Data Structures ---

        // Stars/Firmament
        interface Star { x: number; y: number; r: number; a: number; }
        const stars: Star[] = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * 3000 - 1500, // Wide spread horizontally
                y: Math.random() * -1000 - 100, // Only upper half (negative Y in screen space relative to horizon)
                r: Math.random() * 1.5 + 0.5,
                a: Math.random() * Math.PI * 2
            });
        }

        // Spherical graph objects (Sun & Moon)
        interface SphereNode {
            x: number; y: number; z: number; phase: number;
            startX: number; startY: number; startZ: number; // For intro animation
        }

        const createSphere = (count: number, radius: number, isSun: boolean) => {
            const arr: SphereNode[] = [];
            for (let i = 0; i < count; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                // Final resting local positions
                const rx = radius * Math.sin(phi) * Math.cos(theta);
                const ry = radius * Math.sin(phi) * Math.sin(theta);
                const rz = radius * Math.cos(phi);

                // Intro starting positions (Colliding stars starting far apart)
                // Left star (becomes moon), Right star (becomes sun)
                const startX = isSun ? 4000 + Math.random() * 500 : -4000 - Math.random() * 500;
                const startY = Math.random() * 1000 - 500;
                const startZ = 2000 + Math.random() * 500;

                arr.push({ x: rx, y: ry, z: rz, phase: Math.random() * Math.PI * 2, startX, startY, startZ });
            }
            return arr;
        };

        const sunNodes = createSphere(80, 200, true);
        const moonNodes = createSphere(60, 140, false); // Moon

        // Generate Terrain Nodes data strictly for mapping the intro explosion back to the grid
        interface TerrainNode {
            startX: number; startY: number; startZ: number; // Center of explosion
        }
        const terrainNodes: TerrainNode[][] = [];
        for (let zRow = 0; zRow < gridLinesZ; zRow++) {
            terrainNodes[zRow] = [];
            for (let xCol = 0; xCol < gridLinesX; xCol++) {
                // All terrain points start from the center explosion point
                terrainNodes[zRow].push({
                    startX: (Math.random() - 0.5) * 500,
                    startY: (Math.random() - 0.5) * 500,
                    startZ: 2000 + (Math.random() - 0.5) * 500
                });
            }
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

        const easeOutExpo = (x: number): number => {
            return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        };
        const easeInQuad = (x: number): number => {
            return x * x;
        };
        const easeOutQuad = (x: number): number => {
            return 1 - (1 - x) * (1 - x);
        };

        let startTimestamp: number | null = null;

        const render = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsedMs = timestamp - startTimestamp;
            time += 0.015; // Animation speed

            ctx.fillStyle = '#020305'; // Deep space black
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2 + 100; // Horizon line, pushed slightly down to give room to the text

            // --- ANIMATION STATE LOGIC ---
            let introProgress = 0; // 0 to 1 for the final formation phase
            let inCollisionPhase = false;
            let collisionProgress = 0; // 0 to 1
            let inExplosionPhase = false;
            let explosionProgress = 0; // 0 to 1
            let flashAlpha = 0;
            let showLandscape = false;


            if (elapsedMs < PHASE_1_DURATION) {
                // Phase 1: Two stars rushing in
                inCollisionPhase = true;
                collisionProgress = Math.min(1, easeInQuad(elapsedMs / PHASE_1_DURATION));
            } else if (elapsedMs < (PHASE_1_DURATION + PHASE_2_DURATION)) {
                // Phase 2: BOOM Flash and initial scatter
                inExplosionPhase = true;
                explosionProgress = Math.min(1, easeOutQuad((elapsedMs - PHASE_1_DURATION) / PHASE_2_DURATION));

                // Flash goes 0 -> 1 -> 0
                if (explosionProgress < 0.2) flashAlpha = explosionProgress * 5;
                else flashAlpha = Math.max(0, 1 - ((explosionProgress - 0.2) / 0.8));

                showLandscape = true; // start showing elements flying out
                introProgress = 0; // Lock to start of outward flight
            } else if (elapsedMs < (PHASE_1_DURATION + PHASE_2_DURATION + PHASE_3_DURATION)) {
                // Phase 3: Settling into landscape
                showLandscape = true;
                const p3Time = elapsedMs - (PHASE_1_DURATION + PHASE_2_DURATION);
                introProgress = Math.min(1, easeOutExpo(p3Time / PHASE_3_DURATION));
            } else {
                // Phase 4: Normal
                showLandscape = true;
                introProgress = 1;
            }

            // Draw Collision Phase (If active)
            if (inCollisionPhase || inExplosionPhase) {
                const drawCluster = (startX: number, color: string, isSun: boolean) => {
                    const nodes = isSun ? sunNodes : moonNodes;
                    const currentX = inCollisionPhase ? startX * (1 - collisionProgress) : 0;
                    const scatterMulti = inExplosionPhase ? 1 + explosionProgress * 40 : 1;

                    // Draw a massive glowing halo around the colliding stars
                    if (inCollisionPhase) {
                        const clusterCenter = project(currentX, 0, 2500, cx, cy);
                        if (clusterCenter) {
                            const haloAlpha = collisionProgress * 0.8;
                            const grd = ctx.createRadialGradient(clusterCenter.x, clusterCenter.y, 10, clusterCenter.x, clusterCenter.y, 400 * clusterCenter.scale);
                            // Hacky rgb parse for halo
                            const rgb = isSun ? '255, 157, 0' : '125, 224, 92';
                            grd.addColorStop(0, `rgba(${rgb}, ${haloAlpha})`);
                            grd.addColorStop(1, `rgba(${rgb}, 0)`);
                            ctx.fillStyle = grd;
                            ctx.beginPath();
                            ctx.arc(clusterCenter.x, clusterCenter.y, 400 * clusterCenter.scale, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }

                    nodes.forEach(sn => {
                        const p = project(
                            currentX + (sn.x * scatterMulti),
                            sn.startY + (sn.y * scatterMulti),
                            sn.startZ + (sn.z * scatterMulti),
                            cx, cy
                        );
                        if (p) {
                            ctx.fillStyle = color;
                            // Make particles much larger and brighter during the chaos
                            const sizeBoost = inExplosionPhase ? (1 - explosionProgress) * 5 + 1 : 2;
                            ctx.globalAlpha = Math.max(0, 1 - (inExplosionPhase ? explosionProgress : 0));
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, Math.max(0.1, 2 * p.scale * sizeBoost), 0, Math.PI * 2);
                            ctx.fill();
                        }
                    });
                };

                let leftStart = -3000, rightStart = 3000;
                drawCluster(leftStart, '#7de05c', false);
                drawCluster(rightStart, '#ff9d00', true);
            }

            // Draw expanding shockwave during explosion
            if (inExplosionPhase) {
                const shockCenterX = width / 2;
                const shockCenterY = height / 2;
                const maxRadius = Math.max(width, height) * 1.5;
                const currentRadius = explosionProgress * maxRadius;

                ctx.strokeStyle = `rgba(255, 157, 0, ${1 - explosionProgress})`;
                ctx.lineWidth = 10 * (1 - explosionProgress);
                ctx.beginPath();
                ctx.arc(shockCenterX, shockCenterY, currentRadius, 0, Math.PI * 2);
                ctx.stroke();

                ctx.strokeStyle = `rgba(125, 224, 92, ${(1 - explosionProgress) * 0.5})`;
                ctx.lineWidth = 20 * (1 - explosionProgress);
                ctx.beginPath();
                ctx.arc(shockCenterX, shockCenterY, currentRadius * 0.8, 0, Math.PI * 2);
                ctx.stroke();
            }

            // --- NORMAL LANDSCAPE RENDERING (Modified by introProgress) ---
            if (showLandscape) {
                // Draw Stars only when sky clears
                if (introProgress > 0.5) {
                    ctx.fillStyle = '#ffffff';
                    stars.forEach(s => {
                        const twinkle = (Math.sin(time * 2 + s.a) + 1) * 0.5;
                        const starFadeIn = Math.min(1, (introProgress - 0.5) * 2);
                        ctx.globalAlpha = Math.max(0, (0.1 + twinkle * 0.6) * starFadeIn);
                        ctx.beginPath();
                        ctx.arc(cx + s.x, cy + s.y, s.r, 0, Math.PI * 2);
                        ctx.fill();
                    });
                }

                // Helper to draw a celestial sphere (Sun/Moon)
                const renderSphere = (nodesArray: SphereNode[], finalWorldX: number, finalWorldY: number, finalWorldZ: number, mainColor: string, radiusGlow: number) => {
                    const finalProj = project(finalWorldX, finalWorldY, finalWorldZ, cx, cy);
                    if (!finalProj) return;

                    ctx.strokeStyle = mainColor;
                    ctx.lineWidth = 1;

                    // Projection mapping with explosion easing
                    const projectedNodes = nodesArray.map(sn => {
                        // Rotation
                        const rx = sn.x * Math.cos(time) - sn.z * Math.sin(time);
                        const rz = sn.x * Math.sin(time) + sn.z * Math.cos(time);
                        const ry = sn.y + Math.sin(time * 2 + sn.phase) * 10;

                        // Final world pos
                        const fX = finalWorldX + rx;
                        const fY = finalWorldY + ry;
                        const fZ = finalWorldZ + rz;

                        // Start world pos (Center of explosion)
                        const sX = 0 + (Math.random() - 0.5) * 500;
                        const sY = 0 + (Math.random() - 0.5) * 500;
                        const sZ = 2000 + (Math.random() - 0.5) * 500;

                        // Extreme explosion scatter if in very early intro
                        let currentX = sX + (fX - sX) * introProgress;
                        let currentY = sY + (fY - sY) * introProgress;
                        let currentZ = sZ + (fZ - sZ) * introProgress;

                        if (introProgress < 0.1 && explosionProgress > 0) {
                            currentX += (Math.random() - 0.5) * explosionProgress * 15000;
                            currentY += (Math.random() - 0.5) * explosionProgress * 15000;
                            currentZ += (Math.random() - 0.5) * explosionProgress * 15000;
                        }

                        return project(currentX, currentY, currentZ, cx, cy);
                    });

                    // Draw edges and nodes
                    ctx.beginPath();
                    for (let i = 0; i < projectedNodes.length; i++) {
                        const p1 = projectedNodes[i];
                        if (!p1) continue;

                        // Node
                        ctx.fillStyle = mainColor;
                        ctx.globalAlpha = Math.max(0, introProgress);
                        ctx.beginPath();
                        ctx.arc(p1.x, p1.y, Math.max(0.1, 2 * p1.scale), 0, Math.PI * 2);
                        ctx.fill();

                        // Connect
                        for (let j = i + 1; j < projectedNodes.length; j++) {
                            const p2 = projectedNodes[j];
                            if (!p2) continue;
                            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                            if (dist < 40 * p1.scale) {
                                ctx.moveTo(p1.x, p1.y);
                                ctx.lineTo(p2.x, p2.y);
                            }
                        }
                    }
                    ctx.globalAlpha = Math.max(0, introProgress * 0.4);
                    ctx.stroke();

                    // Outer glow
                    if (introProgress > 0.5) {
                        const glowAlpha = Math.max(0, (introProgress - 0.5) * 2 * 0.15);
                        const radius = Math.max(1, radiusGlow * finalProj.scale);
                        const grd = ctx.createRadialGradient(finalProj.x, finalProj.y, 10, finalProj.x, finalProj.y, radius);
                        // Hacky way to parse rgba from hex for gradient, hardcoded for ease:
                        const rgb = mainColor === '#ff9d00' ? '255, 157, 0' : '125, 224, 92';
                        grd.addColorStop(0, `rgba(${rgb}, ${glowAlpha})`);
                        grd.addColorStop(1, `rgba(${rgb}, 0)`);
                        ctx.fillStyle = grd;
                        ctx.beginPath();
                        ctx.arc(finalProj.x, finalProj.y, radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                };

                // Draw Sun (Center Horizon)
                renderSphere(sunNodes, 0, 100, 2500, '#ff9d00', 150);

                // Draw Moon (High up, left side)
                renderSphere(moonNodes, -2800, 2000, 3200, '#7de05c', 160);

                // --- THE EARTH (TERRAIN GRID) ---
                // Calculate moving offset to make it feel like "flying forward"
                const zOffset = (time * 400) % spacingZ;

                type Pt = { x: number, y: number, scale: number, elevation: number };
                const terrain: (Pt | null)[][] = [];

                for (let zRow = 0; zRow < gridLinesZ; zRow++) {
                    const z = zRow * spacingZ - zOffset + 50; // Start slightly in front of camera
                    terrain[zRow] = [];

                    for (let xCol = 0; xCol < gridLinesX; xCol++) {
                        const x = (xCol - gridLinesX / 2) * spacingX;
                        const absoluteZ = z + time * 400; // For continuous noise sampling
                        const finalY = getElevation(x, absoluteZ, time);

                        // Intro explosion mapping
                        const tNode = terrainNodes[zRow][xCol];
                        let currX = tNode.startX + (x - tNode.startX) * introProgress;
                        let currZ = tNode.startZ + (z - tNode.startZ) * introProgress;
                        let currY = tNode.startY + (finalY - tNode.startY) * introProgress;

                        // Scatter heavily early on
                        if (introProgress < 0.1 && explosionProgress > 0) {
                            currX += (Math.random() - 0.5) * explosionProgress * 5000;
                            currY += (Math.random() - 0.5) * explosionProgress * 5000;
                            currZ += (Math.random() - 0.5) * explosionProgress * 5000;
                        }

                        const proj = project(currX, currY, currZ, cx, cy);
                        if (proj) terrain[zRow].push({ ...proj, elevation: finalY });
                        else terrain[zRow].push(null);
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

                        // Make grid lines aggressively visible during formation, then settle
                        const baseAlpha = Math.max(0, Math.min(1, (p.scale * 3) - 0.1));
                        const explosionFlashGrid = (1 - introProgress); // high value right after explosion
                        const depthAlpha = Math.min(1, baseAlpha * introProgress + explosionFlashGrid * 0.5);

                        // Height mapping: Paint mountains white, valleys green-ish
                        const isHigh = p.elevation > 150;

                        ctx.strokeStyle = isHigh
                            ? `rgba(255, 255, 255, ${depthAlpha * 0.8})` // White peaks
                            : `rgba(125, 224, 92, ${depthAlpha * 1.0})`; // Green valleys

                        ctx.beginPath();
                        if (pRight) { ctx.moveTo(p.x, p.y); ctx.lineTo(pRight.x, pRight.y); }
                        if (pDown) { ctx.moveTo(p.x, p.y); ctx.lineTo(pDown.x, pDown.y); }
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
            }

            // Draw Full Screen Supernova Flash if active
            if (flashAlpha > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
                ctx.fillRect(0, 0, width, height);
            }

            ctx.globalAlpha = 1.0;
            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
            {/* Horizon gradient overlap to mesh ground with sky */}
            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none mix-blend-screen"
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
