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
            ffCount: 30,
            starCount: 200,
            clearance: 0.35,
            breeze: 0.03
        };

        // --- CLASSES (Ported from Final Edition) ---
        class Star {
            x: number; y: number; z: number; size: number; phase: number;
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * (height * 0.6);
                this.z = Math.random();
                this.size = 0.5 + this.z * 1.2;
                this.phase = Math.random() * Math.PI * 2;
            }
            draw(ctx: CanvasRenderingContext2D, time: number) {
                const twinkle = 0.2 + Math.abs(Math.sin(time * 2 + this.phase)) * 0.8;
                ctx.globalAlpha = twinkle * this.z * 0.6;
                ctx.fillStyle = "#FFF";
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }

        class Meteor {
            active: boolean = false;
            timer: number = 0;
            x: number = 0; y: number = 0; vx: number = 0; vy: number = 0; len: number = 0;
            history: { x: number, y: number }[] = [];

            constructor() { this.init(); }
            init() {
                this.active = false;
                this.timer = Math.random() * 500 + 200;
            }
            spawn() {
                this.x = Math.random() * width;
                this.y = Math.random() * (height * 0.3);
                this.vx = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 10);
                this.vy = 5 + Math.random() * 5;
                this.len = 100 + Math.random() * 150;
                this.active = true;
                this.history = [];
            }
            update() {
                if (!this.active) {
                    this.timer--;
                    if (this.timer <= 0) this.spawn();
                    return;
                }
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > 15) this.history.shift();
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -200 || this.x > width + 200 || this.y > height) this.init();
            }
            draw(ctx: CanvasRenderingContext2D) {
                if (!this.active) return;
                ctx.beginPath();
                ctx.strokeStyle = "#FFF";
                ctx.lineWidth = 0.5;
                for (let i = 0; i < this.history.length - 1; i++) {
                    ctx.globalAlpha = i / this.history.length;
                    ctx.moveTo(this.history[i].x, this.history[i].y);
                    ctx.lineTo(this.history[i + 1].x, this.history[i + 1].y);
                    if (i % 4 === 0) ctx.fillRect(this.history[i].x, this.history[i].y, 1.5, 1.5);
                }
                ctx.stroke();
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
            createdAt: number;

            constructor(x: number, y: number, z: number, type: string, scale: number) {
                this.x = x; this.y = y; this.z = z;
                this.type = type;
                this.scale = scale * (0.4 + z * 1.6);
                this.opacity = 0.08 + z * 0.8;
                this.createdAt = Date.now();
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
                    const b = 2;
                    for (let i = 0; i < b; i++) {
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

            update(node: PlantNode, wind: number, mouseX: number, mouseY: number, cx: number, cy: number) {
                // Combine global wind with cursor reactivity
                let mouseImpact = 0;
                // Simple 2D distance for cursor reactivity in this model
                const dx = mouseX - (this.x + node.relX);
                const dy = mouseY - (this.y + node.relY);
                const distSq = dx * dx + dy * dy;
                if (distSq < 40000) {
                    mouseImpact = - (dx * 0.01) * (1 - Math.sqrt(distSq) / 200);
                }

                node.angleOffset = (wind + mouseImpact) * node.flex * (0.5 + this.z);
                node.children.forEach(c => this.update(c, wind, mouseX, mouseY, cx, cy));
            }

            draw(ctx: CanvasRenderingContext2D, node: PlantNode, x: number, y: number, pAngle = 0) {
                const ang = pAngle + node.angleOffset;
                node.children.forEach(c => {
                    const l = Math.hypot(c.relX, c.relY);
                    const a = Math.atan2(c.relY, c.relX) + ang;
                    const nx = x + Math.cos(a) * l, ny = y + Math.sin(a) * l;
                    if (c.depth > 0 || !c.isLeaf) {
                        ctx.beginPath();
                        ctx.lineWidth = Math.max(0.3, node.depth * 0.7 * (0.4 + this.z));
                        ctx.globalAlpha = this.opacity * (node.depth === 0 ? 0.2 : 0.1 + node.depth / 15);
                        ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
                        this.draw(ctx, c, nx, ny, ang);
                    } else {
                        ctx.fillStyle = '#FFF';
                        ctx.globalAlpha = this.opacity * 0.4;
                        ctx.fillRect(nx, ny, 1.5, 1.5);
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
                const rx = time * 0.03, ry = time * 0.05, cx = w / 2, cy = h * 0.25;
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

        class Firefly {
            x: number = 0; y: number = 0; a: number = 0; s: number = 0;
            constructor() { this.init(); }
            init() { this.x = Math.random() * width; this.y = Math.random() * height; this.a = Math.random() * 7; this.s = 0.2 + Math.random() * 0.4; }
            update() {
                this.a += (Math.random() - 0.5) * 0.1;
                this.x += Math.cos(this.a) * this.s; this.y += Math.sin(this.a) * this.s;
                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.init();
            }
            draw(ctx: CanvasRenderingContext2D, time: number) {
                const b = Math.abs(Math.sin(time * 1.2 + this.x * 0.01));
                ctx.globalAlpha = b * 0.4; ctx.fillStyle = '#FFF';
                ctx.beginPath(); ctx.arc(this.x, this.y, 1, 0, 7); ctx.fill();
            }
        }

        // --- INITIALIZATION ---
        const starsFinal: Star[] = [];
        const fireflies: Firefly[] = [];
        const plantsFinal: Plant[] = [];
        const moon = new Moon();
        const shootingStar = new Meteor();

        for (let i = 0; i < CONFIG.starCount; i++) starsFinal.push(new Star());
        for (let i = 0; i < CONFIG.ffCount; i++) fireflies.push(new Firefly());

        const species = ['oak', 'poplar', 'willow', 'bush'];
        for (let i = 0; i < 24; i++) {
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

            // Shooting Star
            shootingStar.update();
            shootingStar.draw(ctx);

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
                p.update(p.root, wind, mouseX, mouseY, width / 2, height / 2 + 100);
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

