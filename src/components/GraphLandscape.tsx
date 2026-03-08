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
        const moonNodes = createSphere(100, 160); // Denser moon

        // --- HIGH-RES MONOCHROME STATIONARY GRAPH PLANTS ---
        // Building much denser networks with slower L-System branching
        interface PlantNode { lx: number; ly: number; lz: number; id: number; level: number; orderOfCreation: number; isLeaf: boolean; }
        interface PlantEdge { from: number; to: number; orderOfCreation: number; }
        interface Plant {
            x: number; z: number;
            nodes: PlantNode[];
            edges: PlantEdge[];
            color: string;
            createdAt: number;
            baseScale: number;
            growthSpeed: number; // custom per species
            totalSteps: number;
        }

        const buildDetailedTree = (type: string): {nodes: PlantNode[], edges: PlantEdge[], color: string, growthSpeed: number} => {
            const nodes: PlantNode[] = [];
            const edges: PlantEdge[] = [];
            let idCounter = 0;
            let creationStep = 0;
            
            nodes.push({lx: 0, ly: 0, lz: 0, id: idCounter++, level: 0, orderOfCreation: creationStep++, isLeaf: false});
            
            // Recursive fractal builder
            const branch = (parentId: number, startX: number, startY: number, startZ: number, angleY: number, angleX: number, length: number, depth: number, maxDepth: number, params: any) => {
                
                // If we reach max depth, generate a "leaf cluster" of many tiny nodes connected to the end
                if (depth >= maxDepth) {
                     const numLeaves = 4 + Math.floor(Math.random() * 4); // Dense leaf clusters
                     for(let l=0; l<numLeaves; l++) {
                          const lx = startX + (Math.random() - 0.5) * length;
                          const ly = startY + (Math.random() - 0.5) * length;
                          const lz = startZ + (Math.random() - 0.5) * length;
                          
                          const leafId = idCounter++;
                          const order = creationStep++;
                          nodes.push({lx, ly, lz, id: leafId, level: depth + 1, orderOfCreation: order, isLeaf: true});
                          edges.push({from: parentId, to: leafId, orderOfCreation: order});
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
                nodes.push({lx: endX, ly: endY, lz: endZ, id: currentId, level: depth + 1, orderOfCreation: order, isLeaf: false});
                edges.push({from: parentId, to: currentId, orderOfCreation: order});
                
                const numBranches = params.branchesPerNode(depth);
                for(let i=0; i<numBranches; i++) {
                    const newAngleY = angleY + params.spreadY(i, numBranches, depth);
                    const newAngleX = angleX + params.spreadX(i, numBranches, depth);
                    const newLength = length * params.lengthDecay;
                    branch(currentId, endX, endY, endZ, newAngleY, newAngleX, newLength, depth + 1, maxDepth, params);

                    // Add dense cross connections within the same branch cluster for a 'graph' look
                    if (depth > 1 && i > 0 && Math.random() > 0.4) {
                        edges.push({from: parentId, to: currentId, orderOfCreation: creationStep++});
                    }
                }
            };

            // Pure White/Gray Palette
            let color = '#ffffff';
            let growthSpeed = 0.5; 
            
            // All species are white now, just structural differences
            if (type === 'fern') {
                growthSpeed = 0.05; // dense fern grows slow
                branch(0, 0, 0, 0, 0, Math.PI/2, 100, 0, 7, { // depth 7 = very detailed stems, depth 8 leaves
                    branchesPerNode: (d:number) => d === 0 ? 1 : (d < 5 ? 3 : 2),
                    spreadY: (i:number, n:number) => {
                        if (n === 1) return 0;
                        return (i === 0) ? 0 : (i === 1 ? -1 : 1); 
                    },
                    spreadX: (i:number) => (i === 0 ? 0.05 : -0.4), 
                    lengthDecay: 0.8
                });
            } else if (type === 'crystal') {
                growthSpeed = 0.02; // very slow methodical build
                branch(0, 0, 0, 0, 0, Math.PI/2, 50, 0, 6, { // radial burst
                     branchesPerNode: (d:number) => d === 0 ? 6 : (d < 3 ? 3 : 2),
                     spreadY: (i:number, n:number, d:number) => d === 0 ? (i/n) * Math.PI * 2 : (i === 0 ? -0.5 : 0.5),
                     spreadX: (i:number, n:number, d:number) => d === 0 ? -0.8 : 0.3, 
                     lengthDecay: 0.85
                });
            } else if (type === 'bamboo') {
                growthSpeed = 0.08; 
                branch(0, 0, 0, 0, 0, Math.PI/2, 60, 0, 10, { // Deeply segmented, tall
                     branchesPerNode: (d:number) => (d > 0 && d % 2 === 0) ? 4 : 1, 
                     spreadY: (i:number, n:number) => i === 0 ? 0 : (i/n) * Math.PI * 2,
                     spreadX: (i:number) => i === 0 ? 0 : -0.9, 
                     lengthDecay: 0.95
                });
            } else if (type === 'willow') {
                 growthSpeed = 0.04;
                 branch(0, 0, 0, 0, 0, Math.PI/2, 160, 0, 9, { // massive drooping tree
                      branchesPerNode: (d:number) => d===0 ? 1 : (d<4 ? 2 : 4),
                      spreadY: (i:number, n:number) => (i - (n-1)/2) * 1.5,
                      spreadX: (i:number, n:number, d:number) => (d < 3 ? 0.2 : -0.9), // dramatic drop
                      lengthDecay: 0.7
                 });
            }

            return {nodes, edges, color, growthSpeed};
        }

        let plants: Plant[] = [];
        const speciesList = ['fern', 'crystal', 'bamboo', 'willow'];

        // SPATIAL DISTRIBUTION - denser forest
        for(let i=0; i<45; i++) {
             const t = speciesList[Math.floor(Math.random() * speciesList.length)];
             
             // Keep middle lane clear for text reading
             let px = (Math.random() - 0.5) * 6000;
             if (px > -1200 && px < 0) px -= 1800;
             if (px < 1200 && px > 0) px += 1800;
             
             let pz = 1200 + Math.random() * 5000;

             const generated = buildDetailedTree(t);
             const maxOrder = Math.max(...generated.nodes.map(n => n.orderOfCreation));

             plants.push({
                 ...generated,
                 x: px,
                 z: pz,
                 // Stagger their birth times 
                 createdAt: Date.now() + (Math.random() * 8000), 
                 baseScale: 0.6 + Math.random() * 0.9,
                 totalSteps: maxOrder
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
                ctx.globalAlpha = Math.max(0, 0.1 + twinkle * 0.5);
                ctx.beginPath();
                ctx.arc(cx + s.x, cy + s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            // Draw Moon (Monochrome/White)
            const renderSphere = (nodesArray: SphereNode[], finalWorldX: number, finalWorldY: number, finalWorldZ: number, mainColor: string, radiusGlow: number) => {
                const finalProj = project(finalWorldX, finalWorldY, finalWorldZ, cx, cy);
                if (!finalProj) return;

                ctx.strokeStyle = mainColor;
                ctx.lineWidth = 1;

                const projectedNodes = nodesArray.map(sn => {
                    const rx = sn.x * Math.cos(time * 0.5) - sn.z * Math.sin(time * 0.5);
                    const rz = sn.x * Math.sin(time * 0.5) + sn.z * Math.cos(time * 0.5);
                    const ry = sn.y + Math.sin(time * 1.5 + sn.phase) * 15; 
                    
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
                    ctx.globalAlpha = 0.9;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.arc(p1.x, p1.y, Math.max(0.1, 2.5 * p1.scale), 0, Math.PI * 2);

                    for (let j = i + 1; j < projectedNodes.length; j++) {
                        const p2 = projectedNodes[j];
                        if (!p2) continue;
                        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                        if (dist < 45 * p1.scale) {
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                        }
                    }
                }
                ctx.fill();
                ctx.globalAlpha = 0.3; // dimmer edges for depth
                ctx.stroke();
                
                const glowAlpha = 0.2; // softer white glow
                const radius = Math.max(1, radiusGlow * finalProj.scale);
                const grd = ctx.createRadialGradient(finalProj.x, finalProj.y, 10, finalProj.x, finalProj.y, radius);
                
                const rgb = '255, 255, 255'; 
                grd.addColorStop(0, `rgba(${rgb}, ${glowAlpha})`);
                grd.addColorStop(1, `rgba(${rgb}, 0)`);
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(finalProj.x, finalProj.y, radius, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // Render White Moon hovering Left
            renderSphere(moonNodes, -1800, 700, 2200, '#ffffff', 200);

            plants.sort((a,b) => b.z - a.z);

            // Draw Plants
            for(const p of plants) {
                const elapsed = now - p.createdAt;
                if (elapsed < 0) continue; 

                // Exposure step dictates growth. Much smoother multiplier.
                // It builds node by node over many seconds.
                const currentExposureStep = (elapsed / 16) * p.growthSpeed * 15; 
                
                const swayOffset = Math.sin(time + p.x * 0.02) * 20;

                const projNodes = p.nodes.map(n => {
                    const individualGrowth = Math.max(0, Math.min(1, currentExposureStep - n.orderOfCreation));
                    if (individualGrowth <= 0) return { p: null, id: n.id, growth: 0, isLeaf: n.isLeaf };

                    const ly = n.ly * p.baseScale;
                    const lx = n.lx * p.baseScale + (swayOffset * (ly / 500)); 
                    const lz = n.lz * p.baseScale;

                    const proj = project(p.x + lx, ly, p.z + lz, cx, cy);
                    return { p: proj, id: n.id, growth: individualGrowth, isLeaf: n.isLeaf };
                });

                const distFade = Math.max(0, Math.min(1, p.z / 5000));
                ctx.globalAlpha = (1 - distFade) * 0.8; 
                if (ctx.globalAlpha <= 0) continue;

                ctx.strokeStyle = '#aaaaaa'; // stems are gray for contrast with white leaves
                ctx.beginPath();
                for (const edge of p.edges) {
                     if (edge.orderOfCreation > currentExposureStep) continue; 

                     const n1 = projNodes[edge.from];
                     const n2 = projNodes[edge.to];
                     
                     if (n1.p && n2.p && n1.growth > 0 && n2.growth > 0) {
                         ctx.globalAlpha = (1 - distFade) * 0.6 * n2.growth;
                         ctx.moveTo(n1.p.x, n1.p.y);
                         ctx.lineTo(n2.p.x, n2.p.y);
                     }
                }
                ctx.lineWidth = 1; 
                ctx.stroke();

                // Draw Plant Data Nodes (Leaves)
                ctx.beginPath();
                for (const n of projNodes) {
                     if (n.p && n.growth > 0) {
                         // Leaves are white, stems are grey
                         ctx.fillStyle = n.isLeaf ? '#ffffff' : '#888888';
                         ctx.globalAlpha = (1 - distFade) * (n.isLeaf ? 0.9 : 0.6) * n.growth;
                         
                         // Leaves are slightly larger spheres
                         const sizeMult = n.isLeaf ? 2.5 : 1.2;
                         
                         ctx.moveTo(n.p.x, n.p.y);
                         ctx.arc(n.p.x, n.p.y, Math.max(0.3, sizeMult * n.p.scale * n.growth), 0, Math.PI * 2);
                     }
                }
                ctx.fill();
                
                // Base anchor glow
                const rootGrowth = Math.min(1, currentExposureStep);
                if (rootGrowth > 0) {
                    const root = project(p.x, 0, p.z, cx, cy);
                    if (root) {
                        const rootRadius = 90 * root.scale * rootGrowth;
                        const grd = ctx.createRadialGradient(root.x, root.y, 0, root.x, root.y, rootRadius);
                        const r='255', g='255', b='255';
                        
                        grd.addColorStop(0, `rgba(${r},${g},${b},${(1-distFade)*0.2*rootGrowth})`);
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
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.01) 60%, rgba(0,0,0,0) 100%)' }} />

            <div className="absolute top-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10" />

            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)] pointer-events-none z-10" />
        </div>
    );
}
