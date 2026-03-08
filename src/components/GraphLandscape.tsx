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

        // --- CONFIG ---
        const CONFIG = {
            moonRadius: 100,
            ffCount: 45,
            starCount: 200,
            clearance: 0.35,
            breeze: 0.03
        };

        // --- CLASSES ---
        class Star {
            x: number; y: number; z: number; size: number; phase: number;
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * (height * 0.7);
                this.z = Math.random();
                this.size = 0.5 + this.z * 1.5;
                this.phase = Math.random() * Math.PI * 2;
            }
            draw(ctx: CanvasRenderingContext2D, time: number) {
                const twinkle = 0.3 + Math.abs(Math.sin(time * 2 + this.phase)) * 0.7;
                ctx.globalAlpha = twinkle * this.z * 0.5;
                ctx.fillStyle = "#FFF";
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }

        class Meteor {
            active: boolean = false;
            timer: number = 0;
            x: number = 0; y: number = 0; vx: number = 0; vy: number = 0;
            history: { x: number, y: number }[] = [];

            constructor(immediate = false) {
                this.timer = immediate ? Math.random() * 100 : Math.random() * 800 + 400;
            }
            spawn() {
                this.x = -100;
                this.y = Math.random() * (height * 0.4);
                this.vx = 18 + Math.random() * 12;
                this.vy = 2 + Math.random() * 4;
                this.active = true;
                this.history = [];
            }
            update() {
                if (!this.active) {
                    if (this.timer > 0) this.timer--;
                    else this.spawn();
                    return;
                }
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > 25) this.history.shift();
                this.x += this.vx;
                this.y += this.vy;
                if (this.x > width + 200 || this.y > height) {
                    this.active = false;
                    this.timer = Math.random() * 1200 + 600;
                }
            }
            draw(ctx: CanvasRenderingContext2D) {
                if (!this.active) return;
                ctx.beginPath();
                ctx.strokeStyle = "#FFF";
                ctx.lineWidth = 1.2;
                for (let i = 0; i < this.history.length - 1; i++) {
                    ctx.globalAlpha = (i / this.history.length) * 0.7;
                    ctx.moveTo(this.history[i].x, this.history[i].y);
                    ctx.lineTo(this.history[i + 1].x, this.history[i + 1].y);
                }
                ctx.stroke();
            }
        }

        class MountainRange {
            nodes: { x: number, y: number, isInternal?: boolean }[] = [];
            yBase: number; opacity: number; color: string;

            constructor(yBase: number, maxHeight: number, seed: number, opacity: number, color: string) {
                this.yBase = yBase;
                this.opacity = opacity;
                this.color = color;
                const steps = 30;
                const stepW = width / steps;
                for (let i = 0; i <= steps; i++) {
                    const nx = i * stepW;
                    const noise = Math.sin(i * 0.2 + seed) * (maxHeight * 0.5) + Math.sin(i * 0.6 + seed) * (maxHeight * 0.2);
                    const ny = yBase - (maxHeight * 0.5 + noise);
                    this.nodes.push({ x: nx, y: ny });
                    for (let j = 1; j <= 2; j++) {
                        this.nodes.push({ x: nx + (Math.random() - 0.5) * stepW, y: ny + (yBase - ny) * (j / 3), isInternal: true });
                    }
                }
            }
            draw(ctx: CanvasRenderingContext2D) {
                ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity * 0.15;
                ctx.moveTo(0, this.yBase);
                this.nodes.filter(n => !n.isInternal).forEach(n => ctx.lineTo(n.x, n.y));
                ctx.lineTo(width, this.yBase);
                ctx.fill();
                ctx.lineWidth = 1.2;
                for (let i = 0; i < this.nodes.length; i++) {
                    for (let j = i + 1; j < Math.min(i + 12, this.nodes.length); j++) {
                        const n1 = this.nodes[i], n2 = this.nodes[j];
                        const d = Math.hypot(n1.x - n2.x, n1.y - n2.y);
                        if (d < width / 6) {
                            ctx.globalAlpha = (1 - d / (width / 6)) * this.opacity;
                            ctx.beginPath(); ctx.moveTo(n1.x, n1.y); ctx.lineTo(n2.x, n2.y); ctx.stroke();
                        }
                    }
                }
            }
        }

        class Firefly {
            x: number = 0; y: number = 0; a: number = 0; v: number = 0; size: number = 0;
            constructor() { this.init(); }
            init() {
                this.x = Math.random() * width;
                this.y = height * 0.3 + Math.random() * height * 0.7;
                this.a = Math.random() * Math.PI * 2;
                this.v = 0.5 + Math.random() * 0.8;
                this.size = 1 + Math.random() * 1.5;
            }
            update() {
                this.a += (Math.random() - 0.5) * 0.2;
                this.x += Math.cos(this.a) * this.v;
                this.y += Math.sin(this.a) * this.v;
                if (this.x < 0 || this.x > width || this.y < height * 0.3 || this.y > height) this.init();
            }
            draw(ctx: CanvasRenderingContext2D, time: number) {
                const pulse = 0.2 + Math.abs(Math.sin(time * 3 + this.x * 0.1)) * 0.8;
                ctx.globalAlpha = pulse * 0.8;
                ctx.fillStyle = "#FFF";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = pulse * 0.2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class PlantNode {
            relX: number; relY: number; depth: number; type: string; isLeaf: boolean;
            angleOffset: number = 0;
            flex: number;
            children: PlantNode[] = [];
            constructor(x: number, y: number, depth: number, type: string, isLeaf = false) {
                this.relX = x; this.relY = y;
                this.depth = depth;
                this.type = type;
                this.isLeaf = isLeaf;
                this.flex = isLeaf ? 3 : (12 - depth) * 0.18;
            }
        }

        class Plant {
            x: number; y: number; z: number; type: string; scale: number; opacity: number;
            root: PlantNode;

            constructor(x: number, y: number, z: number, type: string, scale: number) {
                this.x = x; this.y = y; this.z = z;
                this.type = type;
                this.scale = scale * (0.4 + z * 1.6);
                this.opacity = 0.15 + z * 0.8;
                this.root = this.generate();
            }

            generate() {
                const s = this.scale;
                if (this.type === 'oak') return this.buildOak(0, 0, -Math.PI / 2, 65 * s, 7);
                if (this.type === 'poplar') return this.buildPoplar(0, 0, -Math.PI / 2, 85 * s, 8);
                if (this.type === 'willow') return this.buildWillow(0, 0, -Math.PI / 2, 55 * s, 6);
                return this.buildBush(0, 0, 45 * s);
            }

            addLeafCloud(node: PlantNode, count: number, r: number) {
                for (let i = 0; i < count; i++) {
                    const a = Math.random() * Math.PI * 2;
                    const d = Math.random() * r;
                    node.children.push(new PlantNode(Math.cos(a) * d, Math.sin(a) * d, 0, this.type, true));
                }
            }

            buildOak(x: number, y: number, angle: number, len: number, depth: number): PlantNode {
                const n = new PlantNode(x, y, depth, 'oak');
                if (depth <= 0) { this.addLeafCloud(n, 18, 45); return n; }
                const b = depth > 5 ? 1 : 2 + Math.floor(Math.random() * 2);
                for (let i = 0; i < b; i++) {
                    const a = angle + (Math.random() - 0.5) * 1.1;
                    const l = len * (0.7 + Math.random() * 0.2);
                    n.children.push(this.buildOak(Math.cos(a) * l, Math.sin(a) * l, a, l, depth - 1));
                }
                return n;
            }

            buildPoplar(x: number, y: number, angle: number, len: number, depth: number): PlantNode {
                const n = new PlantNode(x, y, depth, 'poplar');
                if (depth <= 0) { this.addLeafCloud(n, 8, 25); return n; }
                const b = depth > 6 ? 1 : 2;
                for (let i = 0; i < b; i++) {
                    const a = angle + (i === 0 ? (Math.random() - 0.5) * 0.2 : (Math.random() - 0.5) * 0.6);
                    const l = len * (i === 0 ? 0.85 : 0.5);
                    n.children.push(this.buildPoplar(Math.cos(a) * l, Math.sin(a) * l, a, l, depth - 1));
                }
                return n;
            }

            buildWillow(x: number, y: number, angle: number, len: number, depth: number): PlantNode {
                const n = new PlantNode(x, y, depth, 'willow');
                if (depth > 0) {
                    for (let i = 0; i < 2; i++) {
                        const a = angle + (i - 0.5) * 1.2;
                        n.children.push(this.buildWillow(Math.cos(a) * len, Math.sin(a) * len, a, len * 0.8, depth - 1));
                    }
                } else {
                    let p = n;
                    for (let i = 0; i < 12; i++) {
                        const hn = new PlantNode((Math.random() - 0.5) * 8, 16, 0, 'willow', true);
                        p.children.push(hn); p = hn;
                    }
                }
                return n;
            }

            buildBush(x: number, y: number, size: number): PlantNode {
                const r = new PlantNode(x, y, 5, 'bush');
                for (let i = 0; i < 12; i++) {
                    const a = -Math.PI + (i / 11) * Math.PI;
                    const l = size * (0.6 + Math.random() * 0.5);
                    const m = new PlantNode(Math.cos(a) * l * 0.5, Math.sin(a) * l * 0.5, 3, 'bush');
                    const t = new PlantNode(Math.cos(a) * l * 0.5, Math.sin(a) * l * 0.5, 0, 'bush');
                    this.addLeafCloud(t, 6, 25);
                    m.children.push(t); r.children.push(m);
                }
                return r;
            }

            update(node: PlantNode, wind: number, mouseX: number, mouseY: number) {
                let mouseImpact = 0;
                const dx = mouseX - (this.x + node.relX);
                const dy = mouseY - (this.y + node.relY);
                const distSq = dx * dx + dy * dy;
                if (distSq < 40000) {
                    mouseImpact = - (dx * 0.01) * (1 - Math.sqrt(distSq) / 200);
                }
                node.angleOffset = (wind + mouseImpact) * node.flex * (0.5 + this.z);
                node.children.forEach(c => this.update(c, wind, mouseX, mouseY));
            }

            draw(ctx: CanvasRenderingContext2D, node: PlantNode, x: number, y: number, pAngle = 0) {
                const ang = pAngle + node.angleOffset;
                node.children.forEach(c => {
                    const l = Math.hypot(c.relX, c.relY);
                    const a = Math.atan2(c.relY, c.relX) + ang;
                    const nx = x + Math.cos(a) * l, ny = y + Math.sin(a) * l;
                    if (c.depth > 0 || !c.isLeaf) {
                        ctx.beginPath();
                        ctx.lineWidth = Math.max(0.4, node.depth * 0.8 * (0.4 + this.z));
                        ctx.globalAlpha = this.opacity * (node.depth === 0 ? 0.2 : 0.1 + node.depth / 15);
                        ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
                        this.draw(ctx, c, nx, ny, ang);
                    } else {
                        ctx.fillStyle = '#FFF';
                        ctx.globalAlpha = this.opacity * 0.5;
                        ctx.fillRect(nx, ny, 2, 2);
                    }
                });
            }
        }

        class Moon {
            pts: { ox: number, oy: number, oz: number, r: number }[] = [];
            constructor() {
                const craters = Array.from({ length: 12 }, () => ({
                    p: Math.random() * Math.PI, t: Math.random() * Math.PI * 2, r: 0.2 + Math.random() * 0.3, d: 25 + Math.random() * 20
                }));
                for (let i = 0; i < 600; i++) {
                    const p = Math.acos(-1 + (2 * i) / 600), t = Math.sqrt(600 * Math.PI) * p;
                    let rad = CONFIG.moonRadius;
                    craters.forEach(c => {
                        const dist = Math.hypot(p - c.p, (t % (Math.PI * 2)) - c.t);
                        if (dist < c.r) rad -= Math.cos((dist / c.r) * Math.PI / 2) * c.d;
                    });
                    this.pts.push({ ox: Math.sin(p) * Math.cos(t), oy: Math.sin(p) * Math.sin(t), oz: Math.cos(p), r: rad });
                }
            }
            draw(ctx: CanvasRenderingContext2D, time: number, w: number, h: number) {
                const rx = time * 0.03, ry = time * 0.05, cx = w / 2, cy = h * 0.18;
                const proj = this.pts.map(p => {
                    let x = p.ox * p.r, y = p.oy * p.r, z = p.oz * p.r;
                    let ty = y * Math.cos(rx) - z * Math.sin(rx), tz = y * Math.sin(rx) + z * Math.cos(rx);
                    let tx = x * Math.cos(ry) + tz * Math.sin(ry);
                    return { x: tx + cx, y: ty + cy, z: -x * Math.sin(ry) + tz * Math.cos(ry) };
                });
                ctx.beginPath(); ctx.strokeStyle = '#FFF';
                proj.forEach((p, i) => {
                    if (p.z > 0) {
                        proj.forEach((p2, j) => {
                            const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                            if (d < 22) {
                                ctx.globalAlpha = (1 - d / 22) * (p.z / CONFIG.moonRadius) * 0.25;
                                ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
                            }
                        });
                    }
                });
                ctx.stroke();
            }
        }

        // --- INITIALIZATION ---
        const starsFinal: Star[] = [];
        const meteors: Meteor[] = [];
        const mountains: MountainRange[] = [];
        const fireflies: Firefly[] = [];
        const plantsFinal: Plant[] = [];
        const moon = new Moon();

        for (let i = 0; i < CONFIG.starCount; i++) starsFinal.push(new Star());
        for (let i = 0; i < 8; i++) meteors.push(new Meteor(true));
        for (let i = 0; i < CONFIG.ffCount; i++) fireflies.push(new Firefly());

        mountains.push(new MountainRange(height, 650, 0, 0.55, "#888"));
        mountains.push(new MountainRange(height, 380, 50, 0.65, "#AAA"));

        const species = ['oak', 'poplar', 'willow', 'bush'];
        for (let i = 0; i < 25; i++) {
            const z = Math.random();
            const x = Math.random() * width;
            const gap = CONFIG.clearance * (1.2 - z);
            if (x > width * (0.5 - gap) && x < width * (0.5 + gap)) continue;
            plantsFinal.push(new Plant(x, height - 20 + (1 - z) * 15, z, species[Math.floor(Math.random() * 4)], 0.8 + Math.random() * 0.4));
        }
        plantsFinal.sort((a, b) => a.z - b.z);

        let mouseX = 0;
        let mouseY = 0;
        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const render = () => {
            time += 0.01;
            ctx.fillStyle = '#000';
            ctx.globalAlpha = 1;
            ctx.fillRect(0, 0, width, height);

            // Stars
            starsFinal.forEach(s => s.draw(ctx, time));

            // Meteor Shower
            meteors.forEach(m => {
                m.update();
                m.draw(ctx);
            });

            // Mountains
            mountains.forEach(m => m.draw(ctx));

            // Fog Gradient
            const fog = ctx.createLinearGradient(0, height - 220, 0, height);
            fog.addColorStop(0, "rgba(0,0,0,0)");
            fog.addColorStop(1, "rgba(0,0,0,0.95)");
            ctx.fillStyle = fog;
            ctx.globalAlpha = 1;
            ctx.fillRect(0, height - 220, width, 220);

            // Moon
            moon.draw(ctx, time, width, height);

            // Fireflies
            fireflies.forEach(f => {
                f.update();
                f.draw(ctx, time);
            });

            // Plants
            const wind = Math.sin(time * 0.6) * CONFIG.breeze;
            plantsFinal.forEach(p => {
                p.update(p.root, wind, mouseX, mouseY);
                p.draw(ctx, p.root, p.x, p.y);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
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

