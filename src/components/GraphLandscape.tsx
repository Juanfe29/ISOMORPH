'use client';

import { useEffect, useRef } from 'react';

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

        // Camera perspective
        const fov = 400;
        const camY = 300;

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // --- Data Structures ---
        // Stars/Firmament (Static)
        interface Star { x: number; y: number; r: number; a: number; }
        const stars: Star[] = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * 3000 - 1500,
                y: Math.random() * -1000 - 100,
                r: Math.random() * 1.5 + 0.5,
                a: Math.random() * Math.PI * 2
            });
        }

        // Moon Graph
        interface SphereNode { x: number; y: number; z: number; phase: number; }
        const createSphere = (count: number, radius: number) => {
            const arr: SphereNode[] = [];
            for (let i = 0; i < count; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const rx = radius * Math.sin(phi) * Math.cos(theta);
                const ry = radius * Math.sin(phi) * Math.sin(theta);
                const rz = radius * Math.cos(phi);
                arr.push({ x: rx, y: ry, z: rz, phase: Math.random() * Math.PI * 2 });
            }
            return arr;
        };
        const moonNodes = createSphere(100, 160);

        // Building much denser networks with slower L-System branching
        interface PlantNode { lx: number; ly: number; lz: number; id: number; level: number; orderOfCreation: number; isLeaf: boolean; parentId: number | null; }
        interface PlantEdge { from: number; to: number; orderOfCreation: number; }
        interface Plant {
            x: number; z: number;
            nodes: PlantNode[];
            edges: PlantEdge[];
            color: string;
            createdAt: number;
            baseScale: number;
            growthSpeed: number;
            totalSteps: number;
        }

        const buildDetailedTree = (type: string): { nodes: PlantNode[], edges: PlantEdge[], color: string, growthSpeed: number } => {
            const nodes: PlantNode[] = [];
            const edges: PlantEdge[] = [];
            let idCounter = 0;
            let creationStep = 0;

            nodes.push({ lx: 0, ly: 0, lz: 0, id: idCounter++, level: 0, orderOfCreation: creationStep++, isLeaf: false, parentId: null });

            // Recursive fractal builder
            const branch = (parentId: number, startX: number, startY: number, startZ: number, angleY: number, angleX: number, length: number, depth: number, maxDepth: number, params: any) => {

                // Leaf clusters
                if (depth >= maxDepth) {
                    const numLeaves = 4 + Math.floor(Math.random() * 6); // More leaves for foreground
                    for (let l = 0; l < numLeaves; l++) {
                        const lx = startX + (Math.random() - 0.5) * length * 1.5;
                        const ly = startY + (Math.random() - 0.5) * length * 1.5;
                        const lz = startZ + (Math.random() - 0.5) * length * 1.5;

                        const leafId = idCounter++;
                        const order = creationStep++;
                        nodes.push({ lx, ly, lz, id: leafId, level: depth + 1, orderOfCreation: order, isLeaf: true, parentId });
                        edges.push({ from: parentId, to: leafId, orderOfCreation: order });
                    }
                    return;
                }

                const dx = Math.sin(angleY) * Math.cos(angleX) * length;
                const dy = Math.sin(angleX) * length;
                const dz = Math.cos(angleY) * Math.cos(angleX) * length;

                const endX = startX + dx;
                const endY = startY + dy;
                const endZ = startZ + dz;

                const currentId = idCounter++;
                const order = creationStep++;
                nodes.push({ lx: endX, ly: endY, lz: endZ, id: currentId, level: depth + 1, orderOfCreation: order, isLeaf: false, parentId });
                edges.push({ from: parentId, to: currentId, orderOfCreation: order });

                const numBranches = params.branchesPerNode(depth);
                for (let i = 0; i < numBranches; i++) {
                    const newAngleY = angleY + params.spreadY(i, numBranches, depth);
                    const newAngleX = angleX + params.spreadX(i, numBranches, depth);
                    const newLength = length * params.lengthDecay;
                    branch(currentId, endX, endY, endZ, newAngleY, newAngleX, newLength, depth + 1, maxDepth, params);

                    // Dense cross connections
                    if (depth > 1 && i > 0 && Math.random() > 0.3) {
                        edges.push({ from: parentId, to: currentId, orderOfCreation: creationStep++ });
                    }
                }
            };

            let color = '#ffffff';
            let growthSpeed = 0.5;

            // MASSIVE structure scales (Lengths are doubled/tripled)
            if (type === 'fern') {
                growthSpeed = 0.05;
                branch(0, 0, 0, 0, 0, Math.PI / 2, 250, 0, 7, {
                    branchesPerNode: (d: number) => d === 0 ? 1 : (d < 4 ? 3 : 2),
                    spreadY: (i: number, n: number) => {
                        if (n === 1) return 0;
                        return (i === 0) ? 0 : (i === 1 ? -1 : 1);
                    },
                    spreadX: (i: number) => (i === 0 ? 0.05 : -0.4),
                    lengthDecay: 0.8
                });
            } else if (type === 'crystal') {
                growthSpeed = 0.02;
                branch(0, 0, 0, 0, 0, Math.PI / 2, 150, 0, 6, {
                    branchesPerNode: (d: number) => d === 0 ? 6 : (d < 3 ? 3 : 2),
                    spreadY: (i: number, n: number, d: number) => d === 0 ? (i / n) * Math.PI * 2 : (i === 0 ? -0.5 : 0.5),
                    spreadX: (i: number, n: number, d: number) => d === 0 ? -0.8 : 0.4,
                    lengthDecay: 0.75
                });
            } else if (type === 'willow') {
                growthSpeed = 0.04;
                branch(0, 0, 0, 0, 0, Math.PI / 2, 350, 0, 8, {
                    branchesPerNode: (d: number) => d === 0 ? 1 : (d < 4 ? 2 : 4),
                    spreadY: (i: number, n: number) => (i - (n - 1) / 2) * 1.5,
                    spreadX: (i: number, n: number, d: number) => (d < 3 ? 0.2 : -0.9),
                    lengthDecay: 0.7
                });
            }

            return { nodes, edges, color, growthSpeed };
        }

        let plants: Plant[] = [];
        const speciesList = ['fern', 'crystal', 'willow']; // Removed bamboo for massive sprawling feel

        // SPATIAL DISTRIBUTION - Few, Massive, Foreground plants
        // Fixed start time for all plants to avoid random feel
        const startTime = Date.now() + 500;

        for (let i = 0; i < 8; i++) {
            const t = speciesList[Math.floor(Math.random() * speciesList.length)];

            // Plants are massive, but pull them slightly more towards center than before
            let px = (Math.random() - 0.5) * 1500;
            if (px < 0) px -= 1200;
            else px += 1200;

            // Very close Z index (foreground)
            let pz = 400 + Math.random() * 1200;

            const generated = buildDetailedTree(t);
            const maxOrder = Math.max(...generated.nodes.map(n => n.orderOfCreation));

            plants.push({
                ...generated,
                x: px,
                z: pz,
                createdAt: startTime,
                baseScale: 1.5 + Math.random() * 1.5, // 2x-3x bigger overall scale multiplier
                totalSteps: maxOrder
            });
        }

        // Project 3D -> 2D
        const project = (x: number, y: number, z: number, cx: number, cy: number) => {
            if (z <= 0) return null;
            const scale = fov / z;
            return {
                x: cx + x * scale,
                y: cy - (y - camY) * scale,
                scale
            };
        };

        const render = () => {
            time += 0.015;
            const now = Date.now();

            ctx.fillStyle = '#020305';
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2 + 100; // Horizon offset

            // Draw Stars - NO TWINKLE
            ctx.fillStyle = '#ffffff';
            stars.forEach(s => {
                ctx.globalAlpha = 0.3; // Stable, non-flickering alpha
                ctx.beginPath();
                ctx.arc(cx + s.x, cy + s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            plants.sort((a, b) => b.z - a.z);

            // Draw Plants
            for (const p of plants) {
                const elapsed = now - p.createdAt;
                if (elapsed < 0) continue;

                // Recursive Organic Growth: child only grows if parent is mature enough
                const growthDuration = 4000;
                const globalProgress = Math.min(1, elapsed / growthDuration);

                const growthMap = new Map<number, number>();

                // Find max height to normalize sweep
                const maxHeight = Math.max(...p.nodes.map(n => n.ly));
                const swayOffset = Math.sin(time + p.x * 0.02) * 20;

                const projNodes = p.nodes.map(n => {
                    // Base potential growth from height sweep
                    const currentRevealHeight = maxHeight * globalProgress;
                    const heightRef = currentRevealHeight - n.ly;

                    let nodePotential = Math.max(0, Math.min(1, heightRef / 40 + 0.5));

                    // Rule: Cannot grow more than parent + a little bit of independence
                    if (n.parentId !== null) {
                        const parentGrowth = growthMap.get(n.parentId) || 0;
                        // Child starts growing when parent hits 40%, but finishes shortly after parent
                        nodePotential = Math.min(nodePotential, Math.max(0, parentGrowth * 1.2 - 0.4));
                    }

                    growthMap.set(n.id, nodePotential);

                    const individualGrowth = nodePotential;
                    if (individualGrowth <= 0) return { p: null, id: n.id, growth: 0, isLeaf: n.isLeaf };

                    const ly = n.ly * p.baseScale;
                    const lx = n.lx * p.baseScale + (swayOffset * (ly / 500));
                    const lz = n.lz * p.baseScale;

                    const proj = project(p.x + lx, ly, p.z + lz, cx, cy);
                    return { p: proj, id: n.id, growth: individualGrowth, isLeaf: n.isLeaf };
                });

                const distFade = Math.max(0, Math.min(1, p.z / 6000));
                ctx.globalAlpha = (1 - distFade) * 0.9;
                if (ctx.globalAlpha <= 0) continue;

                ctx.strokeStyle = '#aaaaaa';
                ctx.beginPath();
                for (const edge of p.edges) {
                    const n1 = projNodes[edge.from];
                    const n2 = projNodes[edge.to];

                    if (n1.p && n2.p && n1.growth > 0) {
                        ctx.globalAlpha = (1 - distFade) * 0.7 * n2.growth;
                        ctx.moveTo(n1.p.x, n1.p.y);
                        ctx.lineTo(n2.p.x, n2.p.y);
                    }
                }
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Draw Plant Data Nodes (Leaves)
                ctx.beginPath();
                for (const n of projNodes) {
                    if (n.p && n.growth > 0) {
                        ctx.fillStyle = n.isLeaf ? '#ffffff' : '#999999';
                        ctx.globalAlpha = (1 - distFade) * (n.isLeaf ? 1.0 : 0.7) * n.growth;

                        const sizeMult = n.isLeaf ? 3.0 : 1.5;

                        ctx.moveTo(n.p.x, n.p.y);
                        ctx.arc(n.p.x, n.p.y, Math.max(0.5, sizeMult * n.p.scale * n.growth), 0, Math.PI * 2);
                    }
                }
                ctx.fill();

                // Base anchor glow
                const rootGrowth = Math.min(1, globalProgress * 5);
                if (rootGrowth > 0) {
                    const root = project(p.x, 0, p.z, cx, cy);
                    if (root) {
                        const rootRadius = 150 * root.scale * rootGrowth;
                        const grd = ctx.createRadialGradient(root.x, root.y, 0, root.x, root.y, rootRadius);
                        const r = '255', g = '255', b = '255';

                        grd.addColorStop(0, `rgba(${r},${g},${b},${(1 - distFade) * 0.15 * rootGrowth})`);
                        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
                        ctx.globalAlpha = 1;
                        ctx.fillStyle = grd;
                        ctx.beginPath();
                        ctx.arc(root.x, root.y, rootRadius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
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
            <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none mix-blend-screen"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0) 100%)' }} />

            <div className="absolute top-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10" />

            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)] pointer-events-none z-10" />
        </div>
    );
}

