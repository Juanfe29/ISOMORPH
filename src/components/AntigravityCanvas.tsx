"use client";

import { useEffect, useRef } from "react";

/**
 * Antigravity canvas — recycled from the previous portfolio hero
 * (see commit cc4c033 "Solid Depth Edition"). In the new system
 * this is decorative and lives inside <ManifestoSection>, not the hero.
 */
export default function AntigravityCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const DPR = window.devicePixelRatio || 1;

        const resize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            canvas.width = w * DPR;
            canvas.height = h * DPR;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(DPR, DPR);
        };
        const obs = new ResizeObserver(resize);
        obs.observe(canvas);
        resize();

        const ANGLES = [-60, 20, 110, 195, -107.2].map((d) => (d * Math.PI) / 180);
        const RM = [0.85, 0.88, 0.9, 1.06, 1.04];
        const EDGES: [number, number][] = [
            [0, 1], [0, 2], [0, 3], [0, 4],
            [1, 2], [1, 3], [1, 4],
            [2, 3], [2, 4], [3, 4],
        ];
        const CX = -0.098;
        const CY = -0.074;
        const buildPts = (R: number) =>
            ANGLES.map((a, i) => ({
                x: (Math.cos(a) * RM[i] - CX) * R,
                y: (Math.sin(a) * RM[i] - CY) * R,
            }));

        const BOT = new Set(["1,2", "2,3", "0,2"]);
        const TOP = new Set(["0,4", "3,4", "0,3"]);
        const eClass = (a: number, b: number) => {
            const k = a + "," + b;
            const dom = a === 0 || b === 0;
            return {
                thick: dom || BOT.has(k) || TOP.has(k),
                faint: !dom && !BOT.has(k) && !TOP.has(k) && a >= 3 && b >= 3,
            };
        };

        const eOut3 = (t: number) => 1 - Math.pow(1 - Math.min(t, 1), 3);
        const eOut5 = (t: number) => 1 - Math.pow(1 - Math.min(t, 1), 5);
        const eSpring = (t: number) => {
            t = Math.min(t, 1);
            return 1 + 2.2 * Math.pow(t - 1, 3) + 1.8 * Math.pow(t - 1, 2);
        };
        const phase = (t: number, s: number, d: number) =>
            eOut3(Math.max(0, Math.min((t - s) / d, 1)));

        let mouseX = 0;
        let mouseY = 0;
        const onMouse = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseX = (e.clientX - r.left) / r.width - 0.5;
            mouseY = (e.clientY - r.top) / r.height - 0.5;
        };
        canvas.addEventListener("mousemove", onMouse);

        const radGlow = (x: number, y: number, r: number, col: string, alpha: number) => {
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, col.replace("1)", `${alpha})`));
            g.addColorStop(0.5, col.replace("1)", `${alpha * 0.3})`));
            g.addColorStop(1, col.replace("1)", "0)"));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawEdge = (
            x1: number, y1: number, x2: number, y2: number,
            p: number, lw: number, alpha: number, col: string
        ) => {
            if (p <= 0) return;
            ctx.save();
            ctx.globalAlpha = alpha * eOut5(p);
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = "round";
            ctx.shadowColor = col;
            ctx.shadowBlur = lw * 2.5;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p);
            ctx.stroke();
            ctx.restore();
        };

        const drawSunNode = (x: number, y: number, R: number, p: number, elapsed: number) => {
            if (p <= 0) return;
            const sp = eSpring(p);
            const pulse = 1 + Math.sin(elapsed * 2.6) * 0.07;
            const pulse2 = 1 + Math.sin(elapsed * 1.8 + 1) * 0.04;
            const nr = R * 0.052;
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(sp, sp);
            radGlow(0, 0, nr * 22 * pulse2, "rgba(255,160,40,1)", 0.07);
            radGlow(0, 0, nr * 10 * pulse, "rgba(255,140,20,1)", 0.18);
            [2.8, 2.0, 1.5].forEach((rm, i) => {
                ctx.save();
                ctx.globalAlpha = (0.28 - i * 0.07) * p;
                ctx.strokeStyle = `hsl(38,100%,${68 - i * 6}%)`;
                ctx.lineWidth = 0.9;
                ctx.shadowColor = "#ffaa30";
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(0, 0, nr * rm * pulse, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            });
            const core = ctx.createRadialGradient(0, 0, 0, 0, 0, nr);
            core.addColorStop(0, "#fffaee");
            core.addColorStop(0.3, "#ffe066");
            core.addColorStop(0.7, "#ffaa20");
            core.addColorStop(1, "#e86010");
            ctx.shadowColor = "#ffcc44";
            ctx.shadowBlur = nr * 4;
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(0, 0, nr, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        const drawRegularNode = (x: number, y: number, R: number, p: number) => {
            if (p <= 0) return;
            const sp = eSpring(p);
            const nr = R * 0.038;
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(sp, sp);
            radGlow(0, 0, nr * 4, "rgba(220,215,200,1)", 0.18);
            ctx.save();
            ctx.globalAlpha = 0.5 * p;
            ctx.strokeStyle = "rgba(210,215,230,.8)";
            ctx.lineWidth = 0.8;
            ctx.shadowColor = "#c8c4b8";
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(0, 0, nr * 1.75, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
            ctx.shadowColor = "#e0ddd4";
            ctx.shadowBlur = nr * 3;
            ctx.fillStyle = "rgba(230,232,240,1)";
            ctx.beginPath();
            ctx.arc(0, 0, nr, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        const drawSunRay = (
            x1: number, y1: number, x2: number, y2: number,
            p: number, alpha: number
        ) => {
            if (p <= 0) return;
            const ex = x1 + (x2 - x1) * 0.5 * p;
            const ey = y1 + (y2 - y1) * 0.5 * p;
            const g = ctx.createLinearGradient(x1, y1, ex, ey);
            g.addColorStop(0, `rgba(255,190,70,${0.55 * alpha * eOut5(p)})`);
            g.addColorStop(0.6, `rgba(255,150,40,${0.15 * alpha})`);
            g.addColorStop(1, "rgba(255,120,20,0)");
            ctx.save();
            ctx.strokeStyle = g;
            ctx.lineWidth = 1.5;
            ctx.lineCap = "round";
            ctx.shadowColor = "#ffaa44";
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            ctx.restore();
        };

        let particles: { x: number; y: number; vx: number; vy: number; r: number; op: number }[] | null = null;
        let raf = 0;
        let t0: number | null = null;

        const render = (ts: number) => {
            raf = requestAnimationFrame(render);
            if (t0 === null) t0 = ts;
            const elapsed = (ts - t0) / 1000;
            const cW = canvas.clientWidth;
            const cH = canvas.clientHeight;
            ctx.clearRect(0, 0, cW, cH);

            const R = Math.min(cW, cH) * 0.32;
            const ox = cW * 0.5 + mouseX * 14;
            const oy = cH * 0.5 + mouseY * 10;

            ctx.save();
            ctx.translate(ox, oy);
            if (elapsed > 5.8 && !reduce) {
                const b = 1 + Math.sin((elapsed - 5.8) * 0.85) * 0.011;
                ctx.scale(b, b);
            }

            const pts = buildPts(R);
            const v0 = pts[0];
            const pSun = phase(elapsed, 0, 1.4);

            if (pSun > 0.3) {
                const ambP = phase(elapsed, 0.5, 0.9);
                for (let d = 0; d < 8; d++) {
                    const ang = (d * Math.PI) / 4 + elapsed * 0.04;
                    drawSunRay(
                        v0.x, v0.y,
                        v0.x + Math.cos(ang) * R * 0.75,
                        v0.y + Math.sin(ang) * R * 0.75,
                        ambP, 0.5
                    );
                }
            }

            [1, 2, 3, 4].forEach((ti, i) => {
                const p = phase(elapsed, 1.4 + i * 0.12, 0.6);
                drawSunRay(v0.x, v0.y, pts[ti].x, pts[ti].y, p, 0.9);
            });

            EDGES.forEach(([a, b], i) => {
                const { thick, faint } = eClass(a, b);
                const p = phase(elapsed, 1.35 + i * 0.14, 0.65);
                const lw = thick ? R * 0.014 : faint ? R * 0.004 : R * 0.007;
                const al = thick ? 0.82 : faint ? 0.2 : 0.5;
                const col = a === 0 || b === 0 ? "rgba(255,220,150,1)" : "rgba(180,185,200,1)";
                drawEdge(pts[a].x, pts[a].y, pts[b].x, pts[b].y, p, lw, al, col);
            });

            pts.forEach((pt, i) => {
                if (i === 0) drawSunNode(pt.x, pt.y, R, pSun, elapsed);
                else drawRegularNode(pt.x, pt.y, R, phase(elapsed, 3.2 + i * 0.15, 0.45));
            });

            if (!particles) {
                particles = Array.from({ length: 50 }, () => ({
                    x: (Math.random() - 0.5) * R * 6,
                    y: (Math.random() - 0.5) * R * 6,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
                    r: Math.random() * 1.4 + 0.2,
                    op: Math.random() * 0.14 + 0.02,
                }));
            }
            particles.forEach((p) => {
                if (!reduce) {
                    p.x += p.vx * 0.07;
                    p.y += p.vy * 0.07;
                }
                ctx.save();
                ctx.globalAlpha = p.op * Math.min(elapsed / 2, 1);
                ctx.fillStyle = "rgba(200,200,210,.8)";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            ctx.restore();

            if (reduce && elapsed > 6) {
                cancelAnimationFrame(raf);
            }
        };

        raf = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(raf);
            obs.disconnect();
            canvas.removeEventListener("mousemove", onMouse);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden />;
}
