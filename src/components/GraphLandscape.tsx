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
        const moonNodes = createSphere(80, 160); 

        // --- HIGH-RES STATIONARY GRAPH PLANTS ---
        // Building much denser networks with slower L-System branching
        interface PlantNode { lx: number; ly: number; lz: number; id: number; level: number; orderOfCreation: number; }
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
            
            nodes.push({lx: 0, ly: 0, lz: 0, id: idCounter++, level: 0, orderOfCreation: creationStep++});
            
            // Recursive fractal builder
            // We use maxDepth+2 or more to make them much denser
            const branch = (parentId: number, startX: number, startY: number, startZ: number, angleY: number, angleX: number, length: number, depth: number, maxDepth: number, params: any) => {
                if (depth >= maxDepth) return;
                
                const dx = Math.sin(angleY) * Math.cos(angleX) * length;
                const dy = Math.sin(angleX) * length; 
                const dz = Math.cos(angleY) * Math.cos(angleX) * length;
                
                const endX = startX + dx;
                const endY = startY + dy;
                const endZ = startZ + dz;
                
                const currentId = idCounter++;
                const order = creationStep++;
                nodes.push({lx: endX, ly: endY, lz: endZ, id: currentId, level: depth + 1, orderOfCreation: order});
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

            let color = '#7de05c';
            let growthSpeed = 0.5; // lower is slower build
            
            if (type === 'fern') {
                color = '#7de05c'; 
                growthSpeed = 0.05; // dense fern grows slow
                branch(0, 0, 0, 0, 0, Math.PI/2, 100, 0, 7, { // Increased depth to 7 for HIGH detial
                    branchesPerNode: (d:number) => d === 0 ? 1 : (d < 5 ? 3 : 2),
                    spreadY: (i:number, n:number) => {
                        if (n === 1) return 0;
                        return (i === 0) ? 0 : (i === 1 ? -1 : 1); 
                    },
                    spreadX: (i:number) => (i === 0 ? 0.05 : -0.4), 
                    lengthDecay: 0.8
                });
            } else if (type === 'crystal') {
                color = '#ff9d00'; 
                growthSpeed = 0.02; // very slow methodical build
                branch(0, 0, 0, 0, 0, Math.PI/2, 50, 0, 6, {
                     branchesPerNode: (d:number) => d === 0 ? 6 : (d < 3 ? 3 : 2),
                     spreadY: (i:number, n:number, d:number) => d === 0 ? (i/n) * Math.PI * 2 : (i === 0 ? -0.5 : 0.5),
                     spreadX: (i:number, n:number, d:number) => d === 0 ? -0.8 : 0.3, 
                     lengthDecay: 0.85
                });
            } else if (type === 'bamboo') {
                color = '#00f0ff'; 
                growthSpeed = 0.08; 
                branch(0, 0, 0, 0, 0, Math.PI/2, 60, 0, 10, { // Deeply segmented
                     branchesPerNode: (d:number) => (d > 0 && d % 2 === 0) ? 4 : 1, 
                     spreadY: (i:number, n:number) => i === 0 ? 0 : (i/n) * Math.PI * 2,
                     spreadX: (i:number) => i === 0 ? 0 : -0.9, 
                     lengthDecay: 0.95
                });
            } else if (type === 'willow') {
                 color = '#b05cff'; 
                 growthSpeed = 0.04;
                 branch(0, 0, 0, 0, 0, Math.PI/2, 160, 0, 8, {
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

        // SPATIAL DISTRIBUTION
        // We want a static forest around the camera in a wide semicricle.
        // Left, right, and deep forward, leaving the center clear to render.
        for(let i=0; i<35; i++) {
             const t = speciesList[Math.floor(Math.random() * speciesList.length)];
             
             // Keep them out of the middle lane (-800 to 800 x) where the text goes, 
             // but fill the sides and deep background 
             let px = (Math.random() - 0.5) * 6000;
             if (px > -1000 && px < 0) px -= 1500;
             if (px < 1000 && px > 0) px += 1500;
             
             let pz = 1500 + Math.random() * 4500;

             const generated = buildDetailedTree(t);
             const maxOrder = Math.max(...generated.nodes.map(n => n.orderOfCreation));

             plants.push({
                 ...generated,
                 x: px,
                 z: pz,
                 // Stagger their birth times so they don't all finish growing at once
                 createdAt: Date.now() + (Math.random() * 8000), 
                 baseScale: 0.7 + Math.random() * 0.8,
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
                    const rx = sn.x * Math.cos(time * 0.5) - sn.z * Math.sin(time * 0.5);
                    const rz = sn.x * Math.sin(time * 0.5) + sn.z * Math.cos(time * 0.5);
                    const ry = sn.y + Math.sin(time * 1.5 + sn.phase) * 15; // Deeper breathing
                    
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
                    ctx.arc(p1.x, p1.y, Math.max(0.1, 2.5 * p1.scale), 0, Math.PI * 2);

                    for (let j = i + 1; j < projectedNodes.length; j++) {
                        const p2 = projectedNodes[j];
                        if (!p2) continue;
                        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                        // Dense interior connections for the moon
                        if (dist < 50 * p1.scale) {
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                        }
                    }
                }
                ctx.fill();
                ctx.globalAlpha = 0.5;
                ctx.stroke();
                
                const glowAlpha = 0.4;
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
            
            // Render Green Moon hovering Left
            renderSphere(moonNodes, -1800, 700, 2200, '#7de05c', 180);

            // Sort Plants (Painters algorithm for 3D depth, completely stationary plants)
            plants.sort((a,b) => b.z - a.z);

            // Draw Plants
            for(const p of plants) {
                // Growth mechanics: 
                // Plant stays completely still in XYZ space.
                // We sequentially reveal its nodes from root (order 0) to leaf over time.
                const elapsed = now - p.createdAt;
                if (elapsed < 0) continue; // Hasn't sprouted yet

                // Which creation step are we currently exposing?
                const currentExposureStep = (elapsed / 16) * p.growthSpeed * 20; 
                
                // Add a subtle majestic sway relative to time
                const swayOffset = Math.sin(time + p.x * 0.02) * 20;

                const projNodes = p.nodes.map(n => {
                    // Check if this specific node has "grown" enough to be visible
                    // 0 = invisible, 1 = fully formed
                    const individualGrowth = Math.max(0, Math.min(1, currentExposureStep - n.orderOfCreation));
                    if (individualGrowth <= 0) return { p: null, id: n.id, growth: 0 };

                    const ly = n.ly * p.baseScale;
                    const lx = n.lx * p.baseScale + (swayOffset * (ly / 500)); 
                    const lz = n.lz * p.baseScale;

                    const proj = project(p.x + lx, ly, p.z + lz, cx, cy);
                    return { p: proj, id: n.id, growth: individualGrowth };
                });

                const distFade = Math.max(0, Math.min(1, p.z / 5000));
                ctx.globalAlpha = (1 - distFade) * 0.9; 
                if (ctx.globalAlpha <= 0) continue;

                // Draw Plant Graph Edges mapping out sequentially
                ctx.strokeStyle = p.color;
                ctx.beginPath();
                for (const edge of p.edges) {
                     if (edge.orderOfCreation > currentExposureStep) continue; // Line hasn't formed yet

                     const n1 = projNodes[edge.from];
                     const n2 = projNodes[edge.to];
                     
                     if (n1.p && n2.p && n1.growth > 0 && n2.growth > 0) {
                         // Line opacity based on the target node's formation, so lines draw in smoothly rather than popping
                         ctx.globalAlpha = (1 - distFade) * 0.9 * n2.growth;
                         ctx.moveTo(n1.p.x, n1.p.y);
                         ctx.lineTo(n2.p.x, n2.p.y);
                     }
                }
                ctx.lineWidth = 1; // Thinner lines for high-res look
                ctx.stroke();

                // Draw Plant Data Nodes (Leaves)
                ctx.fillStyle = p.color;
                ctx.beginPath();
                for (const n of projNodes) {
                     if (n.p && n.growth > 0) {
                         ctx.globalAlpha = (1 - distFade) * 0.9 * n.growth;
                         ctx.moveTo(n.p.x, n.p.y);
                         ctx.arc(n.p.x, n.p.y, Math.max(0.3, 1.5 * n.p.scale * n.growth), 0, Math.PI * 2);
                     }
                }
                ctx.fill();
                
                // Base anchor glow (grows as the plant roots step 0)
                const rootGrowth = Math.min(1, currentExposureStep);
                if (rootGrowth > 0) {
                    const root = project(p.x, 0, p.z, cx, cy);
                    if (root) {
                        const grd = ctx.createRadialGradient(root.x, root.y, 0, root.x, root.y, 80 * root.scale * rootGrowth);
                        let r='0', g='0', b='0';
                        if (p.color === '#7de05c') { r='125'; g='224'; b='92'; }
                        else if (p.color === '#ff9d00') { r='255'; g='157'; b='0'; }
                        else if (p.color === '#00f0ff') { r='0'; g='240'; b='255'; }
                        else if (p.color === '#b05cff') { r='176'; g='92'; b='255'; }
                        
                        grd.addColorStop(0, `rgba(${r},${g},${b},${(1-distFade)*0.4*rootGrowth})`);
                        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
                        ctx.globalAlpha = 1;
                        ctx.fillStyle = grd;
                        ctx.beginPath();
                        ctx.arc(root.x, root.y, 80 * root.scale * rootGrowth, 0, Math.PI * 2);
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
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(125,224,92,0.06) 50%, rgba(125,224,92,0.02) 60%, rgba(0,0,0,0) 100%)' }} />

            <div className="absolute top-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10" />

            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)] pointer-events-none z-10" />
        </div>
    );
}

