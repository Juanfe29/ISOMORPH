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
        const camY = 300; // Hovering above ground

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
        const moonNodes = createSphere(60, 140); 

        // --- GRAPH PLANTS (Procedural L-System Ecosystem) ---
        interface PlantNode { lx: number; ly: number; lz: number; id: number; level: number; }
        interface PlantEdge { from: number; to: number; }
        interface Plant {
            x: number; z: number;
            nodes: PlantNode[];
            edges: PlantEdge[];
            color: string;
            createdAt: number;
            baseScale: number;
        }

        const buildTree = (type: string): {nodes: PlantNode[], edges: PlantEdge[], color: string} => {
            const nodes: PlantNode[] = [];
            const edges: PlantEdge[] = [];
            let idCounter = 0;
            
            nodes.push({lx: 0, ly: 0, lz: 0, id: idCounter++, level: 0});
            
            const branch = (parentId: number, startX: number, startY: number, startZ: number, angleY: number, angleX: number, length: number, depth: number, maxDepth: number, params: any) => {
                if (depth >= maxDepth) return;
                
                const dx = Math.sin(angleY) * Math.cos(angleX) * length;
                const dy = Math.sin(angleX) * length; // Up is positive Y in local space
                const dz = Math.cos(angleY) * Math.cos(angleX) * length;
                
                const endX = startX + dx;
                const endY = startY + dy;
                const endZ = startZ + dz;
                
                const currentId = idCounter++;
                nodes.push({lx: endX, ly: endY, lz: endZ, id: currentId, level: depth + 1});
                edges.push({from: parentId, to: currentId});
                
                const numBranches = params.branchesPerNode(depth);
                for(let i=0; i<numBranches; i++) {
                    const newAngleY = angleY + params.spreadY(i, numBranches, depth);
                    const newAngleX = angleX + params.spreadX(i, numBranches, depth);
                    const newLength = length * params.lengthDecay;
                    branch(currentId, endX, endY, endZ, newAngleY, newAngleX, newLength, depth + 1, maxDepth, params);
                }
            };

            let color = '#7de05c';
            if (type === 'fern') {
                color = '#7de05c'; // Neon Green
                // Tall sweeping structure
                branch(0, 0, 0, 0, 0, Math.PI/2, 120, 0, 5, {
                    branchesPerNode: (d:number) => d === 0 ? 1 : 3,
                    spreadY: (i:number, n:number) => {
                        if (n === 1) return 0;
                        return (i === 0) ? 0 : (i === 1 ? -1 : 1); // straight, left, right
                    },
                    spreadX: (i:number) => (i === 0 ? 0.1 : -0.3), // main goes up, sides tilt down
                    lengthDecay: 0.75
                });
            } else if (type === 'crystal') {
                color = '#ff9d00'; // Orange (Isomorph brand color)
                // Short radial bursting pattern, ground dweller
                branch(0, 0, 0, 0, 0, Math.PI/2, 60, 0, 4, {
                     branchesPerNode: (d:number) => d === 0 ? 5 : 2,
                     spreadY: (i:number, n:number, d:number) => d === 0 ? (i/n) * Math.PI * 2 : (i === 0 ? -0.5 : 0.5),
                     spreadX: (i:number, n:number, d:number) => d === 0 ? -0.8 : 0.2, // wide spread at base, curving up
                     lengthDecay: 0.8
                });
            } else if (type === 'bamboo') {
                color = '#00f0ff'; // Cyan
                // Tall, sparse, segmented
                branch(0, 0, 0, 0, 0, Math.PI/2, 80, 0, 7, {
                     branchesPerNode: (d:number) => (d > 0 && d % 2 === 0) ? 3 : 1, // nodes have horizontal shoots
                     spreadY: (i:number, n:number) => i === 0 ? 0 : (i===1 ? Math.PI/2 : -Math.PI/2),
                     spreadX: (i:number) => i === 0 ? 0 : -0.8, // horizontal shoots
                     lengthDecay: 0.9
                });
            } else if (type === 'willow') {
                 color = '#b05cff'; // Purple
                 branch(0, 0, 0, 0, 0, Math.PI/2, 180, 0, 6, {
                      branchesPerNode: (d:number) => d===0 ? 1 : (d<3 ? 2 : 3),
                      spreadY: (i:number, n:number) => (i - (n-1)/2) * 1.5,
                      spreadX: (i:number, n:number, d:number) => (d < 2 ? 0.2 : -0.8), // goes up, then dramatically drops out and down
                      lengthDecay: 0.65
                 });
            }

            return {nodes, edges, color};
        }

        let plants: Plant[] = [];
        const speciesList = ['fern', 'crystal', 'bamboo', 'willow'];

        // Initial invisible prepopulation
        for(let i=0; i<30; i++) {
             const t = speciesList[Math.floor(Math.random() * speciesList.length)];
             plants.push({
                 ...buildTree(t),
                 x: (Math.random() - 0.5) * 5000,
                 z: Math.random() * 4000,
                 createdAt: Date.now() - Math.random() * 10000, // already grown
                 baseScale: 0.5 + Math.random() * 0.8
             });
        }


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

            // Draw Stars
            ctx.fillStyle = '#ffffff';
            stars.forEach(s => {
                const twinkle = (Math.sin(time * 2 + s.a) + 1) * 0.5;
                ctx.globalAlpha = Math.max(0, 0.1 + twinkle * 0.6);
                ctx.beginPath();
                ctx.arc(cx + s.x, cy + s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            // Draw Moon
            const renderSphere = (nodesArray: SphereNode[], finalWorldX: number, finalWorldY: number, finalWorldZ: number, mainColor: string, radiusGlow: number) => {
                const finalProj = project(finalWorldX, finalWorldY, finalWorldZ, cx, cy);
                if (!finalProj) return;

                ctx.strokeStyle = mainColor;
                ctx.lineWidth = 1;

                const projectedNodes = nodesArray.map(sn => {
                    const rx = sn.x * Math.cos(time) - sn.z * Math.sin(time);
                    const rz = sn.x * Math.sin(time) + sn.z * Math.cos(time);
                    const ry = sn.y + Math.sin(time * 2 + sn.phase) * 10; 
                    
                    const fX = finalWorldX + rx;
                    const fY = finalWorldY + ry;
                    const fZ = finalWorldZ + rz;

                    return project(fX, fY, fZ, cx, cy);
                });

                ctx.beginPath();
                for (let i = 0; i < projectedNodes.length; i++) {
                    const p1 = projectedNodes[i];
                    if (!p1) continue;
                    
                    ctx.fillStyle = mainColor;
                    ctx.globalAlpha = 1.0;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.arc(p1.x, p1.y, Math.max(0.1, 2 * p1.scale), 0, Math.PI * 2);

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
                ctx.fill();
                ctx.globalAlpha = 0.4;
                ctx.stroke();
                
                const glowAlpha = 0.3;
                const radius = Math.max(1, radiusGlow * finalProj.scale);
                const grd = ctx.createRadialGradient(finalProj.x, finalProj.y, 10, finalProj.x, finalProj.y, radius);
                
                const rgb = '125, 224, 92'; 
                grd.addColorStop(0, `rgba(${rgb}, ${glowAlpha})`);
                grd.addColorStop(1, `rgba(${rgb}, 0)`);
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(finalProj.x, finalProj.y, radius, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // Render Moon hovering
            renderSphere(moonNodes, -1500, 600, 2000, '#7de05c', 160);

            // --- ANIMATE & SPAWN PLANTS ---
            // Procedurally spawn new plants far out of view
            if (Math.random() < 0.08 && plants.length < 50) {
                 const t = speciesList[Math.floor(Math.random() * speciesList.length)];
                 const isLeft = Math.random() > 0.5;
                 // Don't spawn perfectly in the middle so the main text reads clearly
                 const spawnX = isLeft ? -500 - Math.random() * 2000 : 500 + Math.random() * 2000;
                 plants.push({
                     ...buildTree(t),
                     x: spawnX,
                     z: 4000 + Math.random() * 500, // Spawn deep space
                     createdAt: now,
                     baseScale: 0.5 + Math.random() * 0.8
                 });
            }

            // Move plants towards camera
            plants.forEach(p => {
                p.z -= 15; // Flight speed
            });

            // Cleanup plants that have flown completely past the screen
            plants = plants.filter(p => p.z > 0);

            // Sort (Painters algorithm for 3D depth, draw distant plants first)
            plants.sort((a,b) => b.z - a.z);

            // Draw Plants
            for(const p of plants) {
                // Growth animation: 0 to 1 over 2 seconds
                let growth = Math.min(1, (now - p.createdAt) / 2000);
                
                // Add a subtle sway to the plants based on time, their X pos, and height
                const swayOffset = Math.sin(time + p.x * 0.01) * 30;

                const projNodes = p.nodes.map(n => {
                    // Node growth easing (grows from bottom up, so root nodes grow first)
                    const nodeGrowth = Math.max(0, Math.min(1, (growth * 2) - (n.level * 0.1)));
                    
                    if (nodeGrowth === 0) return { p: null, id: n.id, growth: 0 };

                    const ly = n.ly * nodeGrowth * p.baseScale;
                    // Branches sway more the higher they are
                    const lx = n.lx * nodeGrowth * p.baseScale + (swayOffset * (ly / 100)); 
                    const lz = n.lz * nodeGrowth * p.baseScale;

                    const proj = project(p.x + lx, ly, p.z + lz, cx, cy);
                    return { p: proj, id: n.id, growth: nodeGrowth };
                });

                // Calculate distance fade (fog effect)
                const distFade = Math.max(0, Math.min(1, p.z / 3000));
                ctx.globalAlpha = (1 - distFade) * 0.8; 
                if (ctx.globalAlpha <= 0) continue;

                // Draw Plant Stems (Edges)
                ctx.strokeStyle = p.color;
                ctx.beginPath();
                for (const edge of p.edges) {
                     const n1 = projNodes[edge.from];
                     const n2 = projNodes[edge.to];
                     if (n1.p && n2.p && n1.growth > 0 && n2.growth > 0) {
                         ctx.moveTo(n1.p.x, n1.p.y);
                         ctx.lineTo(n2.p.x, n2.p.y);
                     }
                }
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Draw Plant Leaves/Nodes
                ctx.fillStyle = p.color;
                ctx.beginPath();
                for (const n of projNodes) {
                     if (n.p && n.growth > 0) {
                         ctx.moveTo(n.p.x, n.p.y);
                         ctx.arc(n.p.x, n.p.y, Math.max(0.5, 2 * n.p.scale * n.growth), 0, Math.PI * 2);
                     }
                }
                ctx.fill();
                
                // Optional: ground dot to anchor the plant visually in the void
                const root = project(p.x, 0, p.z, cx, cy);
                if (root) {
                    const grd = ctx.createRadialGradient(root.x, root.y, 0, root.x, root.y, 100 * root.scale);
                    // simple hex to rgb
                    let r='0', g='0', b='0';
                    if (p.color === '#7de05c') { r='125'; g='224'; b='92'; }
                    else if (p.color === '#ff9d00') { r='255'; g='157'; b='0'; }
                    else if (p.color === '#00f0ff') { r='0'; g='240'; b='255'; }
                    else if (p.color === '#b05cff') { r='176'; g='92'; b='255'; }
                    
                    grd.addColorStop(0, `rgba(${r},${g},${b},${(1-distFade)*0.5})`);
                    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
                    ctx.fillStyle = grd;
                    ctx.beginPath();
                    ctx.arc(root.x, root.y, 100 * root.scale, 0, Math.PI * 2);
                    ctx.fill();
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
            {/* Horizon gradient overlap to mesh ground with sky */}
            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none mix-blend-screen"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(125,224,92,0.06) 50%, rgba(125,224,92,0.02) 60%, rgba(0,0,0,0) 100%)' }} />

            {/* Dark gradient at the very top to fade out the stars smoothly */}
            <div className="absolute top-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10" />

            {/* Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)] pointer-events-none z-10" />
        </div>
    );
}

