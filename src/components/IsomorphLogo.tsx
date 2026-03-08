'use client';

import { useEffect, useRef } from 'react';

interface IsomorphLogoProps {
    size?: number;
    dark?: boolean;
    animated?: boolean;
    className?: string;
}

export default function IsomorphLogo({
    size = 64,
    dark = true,
    animated = true,
    className = "",
}: IsomorphLogoProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const NS = 'http://www.w3.org/2000/svg';
        const mk = (t: string) => document.createElementNS(NS, t);
        const at = (e: SVGElement, o: Record<string, string | number>) => {
            for (const [k, v] of Object.entries(o)) e.setAttribute(k, String(v));
            return e;
        };

        const getCoreInk = (dark: boolean) => (dark ? '#e8851a' : '#d9740b'); // Sun Orange
        const getPlantInk = (dark: boolean) => (dark ? '#588c42' : '#457a30'); // Plant Green
        const getEdgeInk = (dark: boolean) => (dark ? '#e8e4dc' : '#0f0f0f'); // Standard connection

        // ... keeping kpts exactly as it is ...
        const ANGLES = [-60, 20, 110, 195, -107.2];
        const RM = [0.85, 0.88, 0.90, 1.06, 1.04];
        const EDGES: [number, number][] = [];
        for (let i = 0; i < 5; i++) {
            for (let j = i + 1; j < 5; j++) EDGES.push([i, j]);
        }

        const BOT = new Set(['1,2', '2,3', '0,2']);
        const TOP = new Set(['0,4', '3,4', '0,3']);

        function kpts(cx: number, cy: number, r: number) {
            return ANGLES.map((a, i) => {
                const rad = (a * Math.PI) / 180;
                return { x: cx + r * RM[i] * Math.cos(rad), y: cy + r * RM[i] * Math.sin(rad) };
            });
        }

        function ew(a: number, b: number) {
            const k = a + ',' + b;
            const dom = a === 0 || b === 0;
            const bot = BOT.has(k);
            const top = TOP.has(k);
            const sec = !dom && !bot && !top && a >= 3 && b >= 3;
            return { w: dom || bot || top ? 1 : sec ? 0.28 : 0.5, op: dom || bot || top ? 0.92 : sec ? 0.22 : 0.6 };
        }

        const pad = size * 0.1;
        const r = (size - pad * 2) * 0.4;
        const cx = size / 2;
        const cy = size * 0.45;

        const coreInk = getCoreInk(dark);
        const plantInk = getPlantInk(dark);
        const edgeInk = getEdgeInk(dark);

        const pts = kpts(cx, cy, r);

        const s = mk('svg');
        at(s, { width: size, height: size, viewBox: `0 0 ${size} ${size}`, className: animated ? 'overflow-visible' : '' });

        const g = mk('g');
        s.appendChild(g);

        // v2 node position for stem and leaves
        const v2rad = (110 * Math.PI) / 180;
        const v2x = cx + r * 0.9 * Math.cos(v2rad);
        const v2y = cy + r * 0.9 * Math.sin(v2rad);
        const stemBot = v2y + r * 0.22;

        // Sun rays from node 0
        (() => {
            const v0x = cx + r * 0.85 * Math.cos((-60 * Math.PI) / 180);
            const v0y = cy + r * 0.85 * Math.sin((-60 * Math.PI) / 180);
            const rayLen = r * 0.42;
            const targets = [1, 2, 3, 4].map((i) => ({ dx: pts[i].x - v0x, dy: pts[i].y - v0y }));

            targets.forEach((t, i) => {
                const len = Math.hypot(t.dx, t.dy);
                const nx = t.dx / len, ny = t.dy / len;
                const ray = mk('line');
                at(ray, {
                    x1: (v0x + nx * r * 0.13).toFixed(2), y1: (v0y + ny * r * 0.13).toFixed(2),
                    x2: (v0x + nx * (r * 0.13 + rayLen)).toFixed(2), y2: (v0y + ny * (r * 0.13 + rayLen)).toFixed(2),
                    stroke: coreInk, 'stroke-width': (0.9 * (size / 100)).toFixed(2), opacity: '0.6', 'stroke-linecap': 'round',
                });
                if (animated) { ray.style.strokeDasharray = '700'; ray.style.strokeDashoffset = '700'; ray.style.animation = `dl 0.9s cubic-bezier(0.4,0,0.2,1) forwards ${(1.85 + i * 0.07).toFixed(2)}s`; }
                g.appendChild(ray);
            });
        })();

        // Edges
        EDGES.forEach(([a, b], i) => {
            const { w, op } = ew(a, b);
            const l = mk('line');
            at(l, {
                x1: pts[a].x.toFixed(2), y1: pts[a].y.toFixed(2), x2: pts[b].x.toFixed(2), y2: pts[b].y.toFixed(2),
                stroke: (a === 0 || b === 0) ? coreInk : edgeInk, 'stroke-width': (w * (size / 100)).toFixed(2), opacity: op, 'stroke-linecap': 'round',
            });
            if (animated) { l.style.strokeDasharray = '700'; l.style.strokeDashoffset = '700'; l.style.animation = `dl 0.9s cubic-bezier(0.4,0,0.2,1) forwards ${(0.3 + i * 0.065).toFixed(2)}s`; }
            g.appendChild(l);
        });

        // Nodes
        pts.forEach((p, i) => {
            const nr = r * 0.095;
            const isDom = i === 0;
            const delay = (0.92 + i * 0.07).toFixed(2);

            // Color logic: Node 0 is Sun (orange), Node 2 is root (green), others are standard.
            const nodeColor = isDom ? coreInk : (i === 2 ? plantInk : edgeInk);

            const disc = mk('circle');
            at(disc, { cx: p.x.toFixed(2), cy: p.y.toFixed(2), r: (nr * 0.44).toFixed(2), fill: nodeColor, opacity: isDom ? 1 : 0.85 });
            if (animated) { disc.style.opacity = '0'; disc.style.transformOrigin = `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`; disc.style.animation = `pn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards ${delay}s`; }
            g.appendChild(disc);

            const ring = mk('circle');
            at(ring, { cx: p.x.toFixed(2), cy: p.y.toFixed(2), r: nr.toFixed(2), fill: 'none', stroke: nodeColor, 'stroke-width': (isDom ? 1.5 : 1.0) * (size / 200), opacity: isDom ? 1 : 0.8 });
            if (animated) { ring.style.opacity = '0'; ring.style.transformOrigin = `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`; ring.style.animation = `pn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards ${(parseFloat(delay) + 0.05).toFixed(2)}s`; }
            g.appendChild(ring);
        });

        // Tapered stem
        const sw = r * 0.072, sb = r * 0.026;
        const stemP = mk('path');
        at(stemP, { d: `M${(v2x - sw / 2).toFixed(1)},${v2y.toFixed(1)} L${(v2x + sw / 2).toFixed(1)},${v2y.toFixed(1)} L${(v2x + sb / 2).toFixed(1)},${stemBot.toFixed(1)} L${(v2x - sb / 2).toFixed(1)},${stemBot.toFixed(1)} Z`, fill: plantInk, opacity: '0.8' });
        if (animated) { stemP.style.opacity = '0'; stemP.style.animation = `fi 0.6s ease forwards 1.38s`; }
        g.appendChild(stemP);

        // Leaves
        const lw = r * 0.96, lh = r * 0.62;
        const tipX = v2x - lw, tipY = v2y - lh;
        const leafL = mk('path');
        at(leafL, { d: `M${v2x.toFixed(1)},${v2y.toFixed(1)} L${tipX.toFixed(1)},${tipY.toFixed(1)} Q${(v2x - lw * 0.45).toFixed(1)},${(v2y + r * 0.115).toFixed(1)} ${v2x.toFixed(1)},${v2y.toFixed(1)}`, fill: 'none', stroke: plantInk, 'stroke-width': (1.3 * (size / 200)).toFixed(2), opacity: '0.9', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        if (animated) { leafL.style.strokeDasharray = '700'; leafL.style.strokeDashoffset = '700'; leafL.style.animation = `dl 1.3s ease forwards 1.48s`; }
        g.appendChild(leafL);

        const rw = r * 1.12, rh = r * 0.25;
        const tipRx = v2x + rw, tipRy = v2y - rh;
        const leafR = mk('path');
        at(leafR, { d: `M${v2x.toFixed(1)},${v2y.toFixed(1)} L${tipRx.toFixed(1)},${tipRy.toFixed(1)} Q${(v2x + rw * 0.45).toFixed(1)},${(v2y + r * 0.115).toFixed(1)} ${v2x.toFixed(1)},${v2y.toFixed(1)}`, fill: 'none', stroke: plantInk, 'stroke-width': (1.1 * (size / 200)).toFixed(2), opacity: '0.85', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        if (animated) { leafR.style.strokeDasharray = '700'; leafR.style.strokeDashoffset = '700'; leafR.style.animation = `dl 1.3s ease forwards 1.55s`; }
        g.appendChild(leafR);

        // Keyframes setup
        if (animated && !document.getElementById('isomorph-logo-anims')) {
            const style = document.createElement('style');
            style.id = 'isomorph-logo-anims';
            style.innerHTML = `
        @keyframes dl { to { stroke-dashoffset: 0; } }
        @keyframes pn { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes fi { to { opacity: 1; } }
        @keyframes fu { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `;
            document.head.appendChild(style);
        }

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(s);
    }, [size, dark, animated]);

    return <div ref={containerRef} className={`inline-block ${className}`} style={{ width: size, height: size }} />;
}
