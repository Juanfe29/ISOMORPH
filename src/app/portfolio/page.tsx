"use client";

import React, { useEffect, useState } from 'react';
import './portfolio.css';

export default function Portfolio() {
    const [lang, setLang] = useState<'es' | 'en'>('es');

    const toggleLang = () => {
        setLang(prev => (prev === 'es' ? 'en' : 'es'));
    };

    useEffect(() => {
        // ─────────────────────────────────────────────
        // CURSOR
        // ─────────────────────────────────────────────
        const cur = document.getElementById('cur');
        const ring = document.getElementById('cur-r');
        let rx = 0, ry = 0, mx = 0, my = 0;

        const onMouseMove = (e: MouseEvent) => {
            mx = e.clientX;
            my = e.clientY;
            if (cur) {
                cur.style.left = mx + 'px';
                cur.style.top = my + 'px';
            }
        };

        document.addEventListener('mousemove', onMouseMove);

        let animRingId: number;
        const animRing = () => {
            if (ring) {
                ring.style.left = rx + (mx - rx) * .12 + 'px';
                ring.style.top = ry + (my - ry) * .12 + 'px';
                rx = parseFloat(ring.style.left) || 0;
                ry = parseFloat(ring.style.top) || 0;
            }
            animRingId = requestAnimationFrame(animRing);
        };
        animRing();

        // ─────────────────────────────────────────────
        // HERO CANVAS
        // ─────────────────────────────────────────────
        let hcAnimId: number;
        let hcT0: number | null = null;
        let hcPARTICLES: any[] | null = null;

        const canvas = document.getElementById('hc') as HTMLCanvasElement;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const DPR = window.devicePixelRatio || 1;

            const resizeHc = () => {
                const w = canvas.clientWidth, h = canvas.clientHeight;
                canvas.width = w * DPR;
                canvas.height = h * DPR;
                ctx?.scale(DPR, DPR);
            };
            const hcResizeObs = new ResizeObserver(resizeHc);
            hcResizeObs.observe(canvas);
            resizeHc();

            const ANGLES = [-60, 20, 110, 195, -107.2].map(d => d * Math.PI / 180);
            const RM = [0.85, 0.88, 0.90, 1.06, 1.04];
            const EDGES = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]];
            const CX = -0.098, CY = -0.074;
            const buildPts = (R: number) => ANGLES.map((a, i) => ({ x: (Math.cos(a) * RM[i] - CX) * R, y: (Math.sin(a) * RM[i] - CY) * R }));

            const BOT = new Set(['1,2', '2,3', '0,2']), TOP = new Set(['0,4', '3,4', '0,3']);
            const eClass = (a: number, b: number) => { const k = a + ',' + b, dom = a === 0 || b === 0; return { thick: dom || BOT.has(k) || TOP.has(k), faint: !dom && !BOT.has(k) && !TOP.has(k) && a >= 3 && b >= 3 }; };

            const eOut3 = (t: number) => 1 - Math.pow(1 - Math.min(t, 1), 3);
            const eOut5 = (t: number) => 1 - Math.pow(1 - Math.min(t, 1), 5);
            const eSpring = (t: number) => { t = Math.min(t, 1); return 1 + 2.2 * Math.pow(t - 1, 3) + 1.8 * Math.pow(t - 1, 2); };
            const phase = (t: number, s: number, d: number) => eOut3(Math.max(0, Math.min((t - s) / d, 1)));

            let hcMouseX = 0, hcMouseY = 0;
            const onHcMouse = (e: MouseEvent) => { hcMouseX = e.clientX / innerWidth - .5; hcMouseY = e.clientY / innerHeight - .5; };
            document.addEventListener('mousemove', onHcMouse);

            const radGlow = (x: number, y: number, r: number, col: string, alpha: number) => {
                if (!ctx) return;
                const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, col.replace('1)', `${alpha})`));
                g.addColorStop(.5, col.replace('1)', `${alpha * .3})`));
                g.addColorStop(1, col.replace('1)', '0)'));
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            };

            const drawEdge = (x1: number, y1: number, x2: number, y2: number, p: number, lw: number, alpha: number, col: string) => {
                if (!ctx || p <= 0) return;
                ctx.save(); ctx.globalAlpha = alpha * eOut5(p); ctx.strokeStyle = col;
                ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = lw * 2.5;
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p); ctx.stroke(); ctx.restore();
            };

            const drawSunNode = (x: number, y: number, R: number, p: number, elapsed: number) => {
                if (!ctx || p <= 0) return;
                const sp = eSpring(p), pulse = 1 + Math.sin(elapsed * 2.6) * .07, pulse2 = 1 + Math.sin(elapsed * 1.8 + 1) * .04, nr = R * .052;
                ctx.save(); ctx.translate(x, y); ctx.scale(sp, sp);
                radGlow(0, 0, nr * 22 * pulse2, 'rgba(255,160,40,1)', .07);
                radGlow(0, 0, nr * 10 * pulse, 'rgba(255,140,20,1)', .18);
                [2.8, 2.0, 1.5].forEach((rm, i) => {
                    ctx.save(); ctx.globalAlpha = (.28 - i * .07) * p; ctx.strokeStyle = `hsl(38,100%,${68 - i * 6}%)`;
                    ctx.lineWidth = .9; ctx.shadowColor = '#ffaa30'; ctx.shadowBlur = 6;
                    ctx.beginPath(); ctx.arc(0, 0, nr * rm * pulse, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
                });
                const core = ctx.createRadialGradient(0, 0, 0, 0, 0, nr);
                core.addColorStop(0, '#fffaee'); core.addColorStop(.3, '#ffe066'); core.addColorStop(.7, '#ffaa20'); core.addColorStop(1, '#e86010');
                ctx.shadowColor = '#ffcc44'; ctx.shadowBlur = nr * 4; ctx.fillStyle = core;
                ctx.beginPath(); ctx.arc(0, 0, nr, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            };

            const drawRegularNode = (x: number, y: number, R: number, p: number) => {
                if (!ctx || p <= 0) return;
                const sp = eSpring(p), nr = R * .038;
                ctx.save(); ctx.translate(x, y); ctx.scale(sp, sp);
                radGlow(0, 0, nr * 4, 'rgba(220,215,200,1)', .18);
                ctx.save(); ctx.globalAlpha = .5 * p; ctx.strokeStyle = 'rgba(210,215,230,.8)'; ctx.lineWidth = .8;
                ctx.shadowColor = '#c8c4b8'; ctx.shadowBlur = 4; ctx.beginPath(); ctx.arc(0, 0, nr * 1.75, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
                ctx.shadowColor = '#e0ddd4'; ctx.shadowBlur = nr * 3; ctx.fillStyle = 'rgba(230,232,240,1)';
                ctx.beginPath(); ctx.arc(0, 0, nr, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            };

            const drawSunRay = (x1: number, y1: number, x2: number, y2: number, p: number, alpha: number) => {
                if (!ctx || p <= 0) return;
                const ex = x1 + (x2 - x1) * .50 * p, ey = y1 + (y2 - y1) * .50 * p;
                const g = ctx.createLinearGradient(x1, y1, ex, ey);
                g.addColorStop(0, `rgba(255,190,70,${.55 * alpha * eOut5(p)})`);
                g.addColorStop(.6, `rgba(255,150,40,${.15 * alpha})`);
                g.addColorStop(1, 'rgba(255,120,20,0)');
                ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
                ctx.shadowColor = '#ffaa44'; ctx.shadowBlur = 6;
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
            };

            const drawRealLeaf = (ox: number, oy: number, tx: number, ty: number, cx: number, cy: number, progress: number, R: number, alpha: number, hue: number) => {
                if (!ctx || progress <= 0) return;
                const p = Math.min(progress, 1);
                const ipx = ox + (tx - ox) * p, ipy = oy + (ty - oy) * p;
                const icx = ox + (cx - ox) * p, icy = oy + (cy - oy) * p;
                const dx = tx - ox, dy = ty - oy;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const nx = -dy / len, ny = dx / len;
                const wid = R * 0.22 * p;
                const c1x = icx + nx * wid * 0.85, c1y = icy + ny * wid * 0.85;
                const c2x = icx - nx * wid * 0.85, c2y = icy - ny * wid * 0.85;

                ctx.save(); ctx.globalAlpha = alpha * eOut3(p);
                const leafGrad = ctx.createLinearGradient(ox, oy, ipx, ipy);
                leafGrad.addColorStop(0, `hsla(${hue},30%,60%,0.18)`);
                leafGrad.addColorStop(0.4, `hsla(${hue},38%,54%,0.28)`);
                leafGrad.addColorStop(1, `hsla(${hue},22%,68%,0.08)`);
                ctx.fillStyle = leafGrad;
                ctx.shadowColor = `hsla(${hue},28%,45%,0.4)`; ctx.shadowBlur = R * 0.04;
                ctx.beginPath(); ctx.moveTo(ox, oy); ctx.quadraticCurveTo(c1x, c1y, ipx, ipy); ctx.quadraticCurveTo(c2x, c2y, ox, oy); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = `hsla(${hue},28%,45%,0.55)`; ctx.lineWidth = R * 0.007; ctx.shadowBlur = R * 0.02;
                ctx.beginPath(); ctx.moveTo(ox, oy); ctx.quadraticCurveTo(c1x, c1y, ipx, ipy); ctx.quadraticCurveTo(c2x, c2y, ox, oy); ctx.closePath(); ctx.stroke();
                ctx.strokeStyle = `hsla(${hue},25%,40%,0.45)`; ctx.lineWidth = R * 0.009; ctx.lineCap = 'round'; ctx.shadowBlur = 0;
                ctx.beginPath(); ctx.moveTo(ox, oy); ctx.quadraticCurveTo(icx, icy, ipx, ipy); ctx.stroke();
                const vCount = 4;
                for (let i = 1; i <= vCount; i++) {
                    const t = i / (vCount + 1), mt = 1 - t;
                    const mx2 = mt * mt * ox + 2 * mt * t * icx + t * t * ipx;
                    const my2 = mt * mt * oy + 2 * mt * t * icy + t * t * ipy;
                    const vFrac = 0.4 * (1 - t * t) * p, va = 0.4 + i * 0.15;
                    [1, -1].forEach(side => {
                        const vex = mx2 + nx * wid * vFrac * side * Math.cos(va) - ny * wid * vFrac * side * 0.3;
                        const vey = my2 + ny * wid * vFrac * side * Math.cos(va) + nx * wid * vFrac * side * 0.3;
                        ctx.globalAlpha = alpha * eOut3(p) * 0.22; ctx.strokeStyle = `hsla(${hue},25%,38%,1)`; ctx.lineWidth = R * 0.004;
                        ctx.beginPath(); ctx.moveTo(mx2, my2); ctx.lineTo(vex, vey); ctx.stroke();
                    });
                }
                ctx.restore();
            };

            const drawBackground = (cW: number, cH: number, elapsed: number, sunProgress: number) => {
                if (!ctx) return;
                const sp = Math.min(sunProgress * 1.8, 1); if (sp < 0.02) return;
                ctx.save(); ctx.globalAlpha = sp; ctx.fillStyle = '#020305'; ctx.fillRect(0, 0, cW, cH);
                const t = elapsed * 0.12;
                const ribbons = [
                    { ax: 0.1, ay: 0.2, bx: 0.9, by: 0.8, cp1x: 0.6, cp1y: 0.05, cp2x: 0.2, cp2y: 0.95, col: 'rgba(255,255,255,', w: cH * 0.45, a: 0.028 },
                    { ax: 0.0, ay: 0.6, bx: 1.0, by: 0.3, cp1x: 0.7, cp1y: 0.9, cp2x: 0.3, cp2y: 0.1, col: 'rgba(220,225,235,', w: cH * 0.30, a: 0.022 },
                ];
                ribbons.forEach((r, ri) => {
                    const phase = t + ri * 1.3;
                    const ox = Math.sin(phase * 0.7 + ri) * cW * 0.12, oy = Math.cos(phase * 0.5 + ri * 0.8) * cH * 0.10;
                    const x1 = (r.ax * cW) + ox, y1 = (r.ay * cH) + oy, x2 = (r.bx * cW) - ox, y2 = (r.by * cH) - oy;
                    const cpx1 = (r.cp1x * cW) + Math.sin(phase + 0.5) * cW * 0.08, cpy1 = (r.cp1y * cH) + Math.cos(phase + 1.0) * cH * 0.08;
                    const cpx2 = (r.cp2x * cW) + Math.sin(phase + 1.5) * cW * 0.08, cpy2 = (r.cp2y * cH) + Math.cos(phase + 2.0) * cH * 0.08;
                    ctx.save(); ctx.globalAlpha = sp * r.a * 0.5; ctx.strokeStyle = r.col + '1)'; ctx.lineWidth = r.w; ctx.lineCap = 'round';
                    ctx.filter = `blur(${r.w * 0.8}px)`; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2); ctx.stroke(); ctx.filter = 'none';
                    ctx.globalAlpha = sp * r.a * 1.8; ctx.lineWidth = r.w * 0.08; ctx.strokeStyle = r.col + '1)'; ctx.shadowColor = r.col + '0.6)'; ctx.shadowBlur = r.w * 0.15;
                    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2); ctx.stroke(); ctx.restore();
                });
                ctx.restore();
            };

            const renderHc = (ts: number) => {
                hcAnimId = requestAnimationFrame(renderHc);
                if (!hcT0) hcT0 = ts;
                if (!ctx) return;
                const elapsed = (ts - hcT0) / 1000;
                const cW = canvas.clientWidth, cH = canvas.clientHeight;
                ctx.clearRect(0, 0, cW, cH);
                const R = Math.min(cW, cH) * .20;
                const ox = cW * .67 + hcMouseX * 14, oy = cH * .50 + hcMouseY * 10;
                const bgP = phase(elapsed, 0, 2.0);
                drawBackground(cW, cH, elapsed, bgP);
                ctx.save(); ctx.translate(ox, oy);
                if (elapsed > 5.8) { const b = 1 + Math.sin((elapsed - 5.8) * .85) * .011; ctx.scale(b, b); }
                const pts = buildPts(R), v0 = pts[0], v2 = pts[2], pSun = phase(elapsed, 0, 1.4);
                if (pSun > .3) {
                    const ambP = phase(elapsed, .5, .9);
                    for (let d = 0; d < 8; d++) {
                        const ang = d * Math.PI / 4 + elapsed * .04;
                        drawSunRay(v0.x, v0.y, v0.x + Math.cos(ang) * R * .75, v0.y + Math.sin(ang) * R * .75, ambP, .5);
                    }
                }
                [1, 2, 3, 4].forEach((ti, i) => { const p = phase(elapsed, 1.4 + i * .12, .6); drawSunRay(v0.x, v0.y, pts[ti].x, pts[ti].y, p, .9); });
                EDGES.forEach(([a, b], i) => {
                    const { thick, faint } = eClass(a, b); const p = phase(elapsed, 1.35 + i * .14, .65);
                    const lw = thick ? R * .014 : faint ? R * .004 : R * .007; const al = thick ? .82 : faint ? .20 : .50;
                    const col = (a === 0 || b === 0) ? 'rgba(255,220,150,1)' : 'rgba(180,185,200,1)';
                    drawEdge(pts[a].x, pts[a].y, pts[b].x, pts[b].y, p, lw, al, col);
                });
                pts.forEach((pt, i) => { if (i === 0) drawSunNode(pt.x, pt.y, R, pSun, elapsed); else drawRegularNode(pt.x, pt.y, R, phase(elapsed, 3.2 + i * .15, .45)); });
                const stemP = phase(elapsed, 4.2, .7), leafLP = phase(elapsed, 4.75, 1.0), leafRP = phase(elapsed, 5.05, 1.0);
                if (stemP > 0) {
                    const stemLen = R * .32 * stemP; ctx.save(); ctx.globalAlpha = .70 * eOut3(stemP); ctx.strokeStyle = 'rgba(120,140,100,.50)'; ctx.lineWidth = R * .018; ctx.lineCap = 'round';
                    ctx.beginPath(); ctx.moveTo(v2.x, v2.y); ctx.quadraticCurveTo(v2.x + R * .04, v2.y + stemLen * .55, v2.x, v2.y + stemLen); ctx.stroke(); ctx.restore();
                }
                drawRealLeaf(v2.x, v2.y, v2.x - R * .92, v2.y - R * .60, v2.x - R * .38, v2.y + R * .08, leafLP, R, .82, 82);
                drawRealLeaf(v2.x, v2.y, v2.x + R * 1.08, v2.y - R * .24, v2.x + R * .42, v2.y + R * .08, leafRP, R, .70, 90);
                if (!hcPARTICLES) hcPARTICLES = Array.from({ length: 70 }, () => ({ x: (Math.random() - .5) * R * 6, y: (Math.random() - .5) * R * 6, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.4 + .2, op: Math.random() * .14 + .02 }));
                hcPARTICLES.forEach(p => { p.x += p.vx * .07; p.y += p.vy * .07; ctx.save(); ctx.globalAlpha = p.op * Math.min(elapsed / 2, 1); ctx.fillStyle = 'rgba(200,200,210,.8)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
                ctx.restore();
            };
            hcAnimId = requestAnimationFrame(renderHc);
        }

        // ─────────────────────────────────────────────
        // VISION MEDIA 1.0 CANVAS (Instagram Control)
        // ─────────────────────────────────────────────
        let vm1AnimId: number;
        const vm1Canvas = document.getElementById('vm1-canvas') as HTMLCanvasElement;
        if (vm1Canvas) {
            const ctx = vm1Canvas.getContext('2d')!;
            const DPR = window.devicePixelRatio || 1;
            const resize = () => { vm1Canvas.width = vm1Canvas.clientWidth * DPR; vm1Canvas.height = vm1Canvas.clientHeight * DPR; ctx.scale(DPR, DPR); };
            new ResizeObserver(resize).observe(vm1Canvas); resize();
            let T0 = 0;
            const tokens = Array.from({ length: 22 }, (_, i) => ({
                x: Math.random() * .45, y: Math.random(), spd: .008 + Math.random() * .012,
                w: 18 + Math.random() * 28, delay: Math.random() * 2.5,
                word: ['caption', 'brand', 'strategy', 'LLM', 'post', 'reel', 'story', 'AI', 'async', 'prompt'][i % 10]
            }));
            const render = (ts: number) => {
                vm1AnimId = requestAnimationFrame(render); if (!T0) T0 = ts;
                const elapsed = (ts - T0) / 1000; const W = vm1Canvas.clientWidth, H = vm1Canvas.clientHeight;
                ctx.clearRect(0, 0, W, H);
                const bx = W * .48, by = H * .5, pulse = 1 + Math.sin(elapsed * 2.2) * .06;
                const g = ctx.createRadialGradient(bx, by, 0, bx, by, 38 * pulse);
                g.addColorStop(0, 'rgba(200,82,42,.28)'); g.addColorStop(1, 'rgba(200,82,42,0)');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, 38 * pulse, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = 'rgba(200,82,42,.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bx, by, 20, 0, Math.PI * 2); ctx.stroke();
                tokens.forEach(t => {
                    let age = elapsed - t.delay; if (age < 0) return; t.x += t.spd * .016; if (t.x > .52) { t.x = 0; t.delay = elapsed; }
                    const cx = t.x * W * .46, cy = t.y * H, fa = Math.max(0, (.46 - t.x) / .46);
                    ctx.save(); ctx.globalAlpha = fa * .65; ctx.font = `300 10px Archivo`; ctx.fillStyle = 'rgba(200,82,42,.8)'; ctx.fillText(t.word, cx, cy); ctx.restore();
                });
                const cDefs = [
                    { x: .63, y: .15, w: .32, h: .34, label: 'POST', icon: '▣', color: '#c8522a', delay: 1.2 },
                    { x: .63, y: .57, w: .14, h: .30, label: 'STORY', icon: '◉', color: '#4fb3d4', delay: 1.8 },
                    { x: .80, y: .57, w: .14, h: .30, label: 'REEL', icon: '▶', color: '#8a64c8', delay: 2.5 },
                ];
                cDefs.forEach(cd => {
                    const age = elapsed - cd.delay; if (age < 0) return; const p = Math.min(1, age * .8);
                    const cx = cd.x * W, cy = cd.y * H, cw = cd.w * W, ch = cd.h * H;
                    ctx.strokeStyle = cd.color; ctx.globalAlpha = p * .35; ctx.beginPath(); ctx.moveTo(bx + 20, by); ctx.lineTo(cx, cy + ch / 2); ctx.stroke();
                    ctx.globalAlpha = p; ctx.strokeRect(cx, cy, cw * p, ch);
                });
            };
            vm1AnimId = requestAnimationFrame(render);
        }

        // ─────────────────────────────────────────────
        // VISION MEDIA 2.0 CANVAS (Email Automation)
        // ─────────────────────────────────────────────
        let vm2AnimId: number;
        const vm2Canvas = document.getElementById('vm2-canvas') as HTMLCanvasElement;
        if (vm2Canvas) {
            const ctx = vm2Canvas.getContext('2d')!;
            const DPR = window.devicePixelRatio || 1;
            const resize = () => { vm2Canvas.width = vm2Canvas.clientWidth * DPR; vm2Canvas.height = vm2Canvas.clientHeight * DPR; ctx.scale(DPR, DPR); };
            new ResizeObserver(resize).observe(vm2Canvas); resize();
            let T0 = 0;
            const segs = [
                { label: 'SEG A', y: .20, color: '#2a6b8c' },
                { label: 'SEG B', y: .45, color: '#4a9aba' },
                { label: 'SEG C', y: .70, color: '#2a4a6a' },
            ];
            const envs = Array.from({ length: 12 }, (_, i) => ({ x: 0, y: .15 + Math.random() * .7, tx: .78, seg: i % 3, spd: .003 + Math.random() * .005, p: 0, delay: i * .18 + .8 }));
            const render = (ts: number) => {
                vm2AnimId = requestAnimationFrame(render); if (!T0) T0 = ts;
                const elapsed = (ts - T0) / 1000, W = vm2Canvas.clientWidth, H = vm2Canvas.clientHeight;
                ctx.clearRect(0, 0, W, H);
                const sx = W * .14, sy = H * .5;
                ctx.fillStyle = 'rgba(42,107,140,.2)'; ctx.beginPath(); ctx.arc(sx, sy, 25, 0, Math.PI * 2); ctx.fill();
                segs.forEach(seg => {
                    const nx = W * .82, ny = seg.y * H;
                    ctx.strokeStyle = seg.color; ctx.beginPath(); ctx.arc(nx, ny, 12, 0, Math.PI * 2); ctx.stroke();
                });
                envs.forEach(env => {
                    const age = elapsed - env.delay; if (age < 0) return; env.p = Math.min(1, env.p + env.spd);
                    const ex = sx + (W * .82 - sx) * env.p, ey = sy + (segs[env.seg].y * H - sy) * env.p;
                    ctx.strokeStyle = segs[env.seg].color; ctx.globalAlpha = Math.max(0, 1 - env.p);
                    ctx.strokeRect(ex - 8, ey - 5, 16, 10);
                    if (env.p >= 1) { env.p = 0; env.delay = elapsed; }
                });
            };
            vm2AnimId = requestAnimationFrame(render);
        }

        // ─────────────────────────────────────────────
        // PRECISION BANKING ML CANVAS
        // ─────────────────────────────────────────────
        let mlAnimId: number;
        const mlCanvas = document.getElementById('ml-canvas') as HTMLCanvasElement;
        if (mlCanvas) {
            const ctx = mlCanvas.getContext('2d')!;
            const DPR = window.devicePixelRatio || 1;
            const resize = () => { mlCanvas.width = mlCanvas.clientWidth * DPR; mlCanvas.height = mlCanvas.clientHeight * DPR; ctx.scale(DPR, DPR); };
            new ResizeObserver(resize).observe(mlCanvas); resize();
            let T0 = 0;
            const pts = Array.from({ length: 50 }, () => ({ x: Math.random() * .6, y: Math.random(), sub: Math.random() < .15, p: 0 }));
            const render = (ts: number) => {
                mlAnimId = requestAnimationFrame(render); if (!T0) T0 = ts;
                const elapsed = (ts - T0) / 1000, W = mlCanvas.clientWidth, H = mlCanvas.clientHeight;
                ctx.clearRect(0, 0, W, H);
                pts.forEach(pt => {
                    pt.p = Math.min(1, pt.p + .01);
                    const px = pt.x * W * .5, py = pt.y * H;
                    ctx.fillStyle = pt.sub ? '#3a6a3a' : 'rgba(255,255,255,.1)';
                    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
                });
                ctx.strokeStyle = 'rgba(200,82,42,.3)'; ctx.beginPath(); ctx.moveTo(W * .5, 0); ctx.lineTo(W * .55, H); ctx.stroke();
            };
            mlAnimId = requestAnimationFrame(render);
        }

        // ─────────────────────────────────────────────
        // SCROLL REVEAL
        // ─────────────────────────────────────────────
        const rvObs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: .07 });
        document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animRingId);
            if (hcAnimId) cancelAnimationFrame(hcAnimId);
            if (vm1AnimId) cancelAnimationFrame(vm1AnimId);
            if (vm2AnimId) cancelAnimationFrame(vm2AnimId);
            if (mlAnimId) cancelAnimationFrame(mlAnimId);
        };
    }, []);

    return (
        <div className="portfolio-body">
            <div id="cur"></div>
            <div id="cur-r"></div>
            <button id="lt" onClick={toggleLang}>
                {lang === 'es' ? 'EN / ES' : 'ES / EN'}
            </button>

            <nav className="portfolio-nav">
                <div className="n-logo">ISOMORPH</div>
                <ul className="n-links">
                    <li><a href="#work">{lang === 'es' ? 'Proyectos' : 'Projects'}</a></li>
                    <li><a href="#svc">{lang === 'es' ? 'Servicios' : 'Services'}</a></li>
                    <li><a href="#us">{lang === 'es' ? 'Nosotros' : 'About'}</a></li>
                </ul>
            </nav>

            {/* ── HERO ── */}
            <section className="hero">
                <canvas id="hc"></canvas>
                <div className="h-txt">
                    <div className="h-eye">Graph Intelligence · Software Studio · AI</div>
                    <h1>SYNTHESIZE<br /><em>{lang === 'es' ? 'caos → estructura → control' : 'chaos → structure → control'}</em>CONTROL</h1>
                    <p className="h-sub">
                        {lang === 'es' ? 'ISOMORPH construye infraestructura de software con inteligencia artificial — productos digitales que piensan, se adaptan y escalan.' : 'ISOMORPH builds AI-powered software infrastructure — digital products that think, adapt, and scale.'}
                    </p>
                </div>
            </section>

            {/* ── BOATY ── */}
            <section className="boaty-sec">
                <div className="boaty-inner">
                    <div className="rv">
                        <div className="b-tag">{lang === 'es' ? 'Producto Destacado · App Móvil & Web' : 'Featured Product · Mobile & Web'}</div>
                        <h2>BOATY</h2>
                        <p className="b-sub">{lang === 'es' ? 'La plataforma náutica on-demand. Como Uber, en el mar.' : 'The on-demand nautical platform. Like Uber, on the water.'}</p>
                        <p className="b-desc">
                            {lang === 'es' ? 'Marketplace premium que conecta turistas de lujo con proveedores náuticos en tiempo real.' : 'Premium marketplace connecting luxury tourists with nautical providers in real time.'}
                        </p>
                        <a href="https://github.com/mapube16/Boaty" target="_blank" rel="noopener noreferrer" className="b-link">{lang === 'es' ? 'Ver en GitHub →' : 'View on GitHub →'}</a>
                    </div>
                </div>
            </section>

            {/* ── DETAILED PROJECTS ── */}
            <section id="work" className="proj-sec">
                <div className="wrap">
                    <div className="s-label rv" data-num="01">{lang === 'es' ? 'Proyectos' : 'Projects'}</div>
                    <h2 className="rv">{lang === 'es' ? <>CADA PRODUCTO,<br />CADA HISTORIA</> : <>EVERY PRODUCT,<br />EVERY STORY</>}</h2>

                    {/* VISION MEDIA 1.0 */}
                    <div className="proj-detail rv" style={{ marginTop: '4rem' }}>
                        <div className="pd-grid">
                            <div>
                                <div className="p-num">02 — AI · Social Media Automation</div>
                                <div className="p-ttl" style={{ fontSize: '2rem' }}>VISION MEDIA <span style={{ color: 'rgba(200,82,42,.7)' }}>1.0</span></div>
                                <p className="p-dsc">
                                    {lang === 'es' ? 'Plataforma que genera y publica contenido en Instagram de forma autónoma.' : 'Platform that autonomously generates and publishes content on Instagram.'}
                                </p>
                                <div className="prod-canvas-wrap"><canvas id="vm1-canvas"></canvas></div>
                                <a href="https://github.com/Juanfe29/Instagram-automation-AI-generated-content" target="_blank" rel="noopener noreferrer" className="p-lnk">{lang === 'es' ? 'Ver en GitHub →' : 'View on GitHub →'}</a>
                            </div>
                        </div>
                    </div>

                    {/* VISION MEDIA 2.0 */}
                    <div className="proj-detail rv" style={{ marginTop: '1px' }}>
                        <div className="pd-grid">
                            <div>
                                <div className="p-num">03 — AI · Email Marketing Automation</div>
                                <div className="p-ttl" style={{ fontSize: '2rem' }}>VISION MEDIA <span style={{ color: 'rgba(58,138,184,.7)' }}>2.0</span></div>
                                <p className="p-dsc">
                                    {lang === 'es' ? 'Motor de email marketing generado por IA.' : 'AI-generated email marketing engine.'}
                                </p>
                                <div className="prod-canvas-wrap"><canvas id="vm2-canvas"></canvas></div>
                            </div>
                        </div>
                    </div>

                    {/* PRECISION BANKING */}
                    <div className="proj-detail rv" style={{ marginTop: '1px' }}>
                        <div className="pd-grid">
                            <div>
                                <div className="p-num">04 — Machine Learning · Fintech</div>
                                <div className="p-ttl" style={{ fontSize: '2rem' }}>PRECISION <span style={{ color: 'rgba(80,160,80,.7)' }}>BANKING</span></div>
                                <p className="p-dsc">
                                    {lang === 'es' ? 'Predictor de suscripciones bancarias con XGBoost.' : 'Banking subscription predictor with XGBoost.'}
                                </p>
                                <div className="prod-canvas-wrap"><canvas id="ml-canvas"></canvas></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="portfolio-footer">
                <div className="f-logo">ISOMORPH</div>
                <div className="f-copy">© 2026 ANTIGRAVITY ENGINE · PREDICT CONTROL</div>
            </footer>
        </div>
    );
}
