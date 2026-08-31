'use client';

import { useEffect, useRef, useState } from 'react';
import K5Mark from './K5Mark';
import { getDict, type Lang } from '@/lib/content';
import { C, MONO } from '@/lib/theme';

const LIMIT_Y = 32;
const LIMIT_X = 26;

/**
 * El K5 del especímen de marca: oscila dentro de límites y se puede arrastrar.
 * Nunca pasa de canto ni se espeja — ver la regla en /marca.
 */
export default function K5Interactive({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const [rot, setRot] = useState({ x: -10, y: -6 });
  const [drag, setDrag] = useState(false);
  const dir = useRef(1);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (drag) return;
      setRot((r) => {
        let y = r.y + dir.current * 0.22;
        if (y >= LIMIT_Y) { y = LIMIT_Y; dir.current = -1; }
        if (y <= -LIMIT_Y) { y = -LIMIT_Y; dir.current = 1; }
        return { ...r, y };
      });
    }, 50);
    return () => clearInterval(id);
  }, [drag]);

  const clamp = (v: number, l: number) => Math.max(-l, Math.min(l, v));

  return (
    <>
      <div
        onPointerDown={(e) => {
          last.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture?.(e.pointerId);
          setDrag(true);
        }}
        onPointerMove={(e) => {
          if (!drag || !last.current) return;
          const dx = e.clientX - last.current.x;
          const dy = e.clientY - last.current.y;
          last.current = { x: e.clientX, y: e.clientY };
          setRot((r) => ({ x: clamp(r.x - dy * 0.45, LIMIT_X), y: clamp(r.y + dx * 0.45, LIMIT_Y) }));
        }}
        onPointerUp={() => { last.current = null; setDrag(false); }}
        onPointerCancel={() => { last.current = null; setDrag(false); }}
        style={{
          position: 'relative',
          border: `1px solid ${C.line}`,
          borderRadius: 20,
          background: C.surface,
          boxShadow: '0 1px 2px rgba(0,0,0,.4), 0 24px 56px -26px rgba(0,0,0,.65)',
          height: 'clamp(330px,50vw,540px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: drag ? 'grabbing' : 'grab',
          touchAction: 'none',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            transform: `perspective(1000px) rotateX(${rot.x.toFixed(1)}deg) rotateY(${rot.y.toFixed(1)}deg)`,
            transformStyle: 'preserve-3d',
            transition: drag ? 'none' : 'transform 90ms linear',
          }}
        >
          <K5Mark
            width={440}
            height={372}
            tilt={false}
            strokeWidth={2.2}
            title="K5"
            style={{ maxWidth: '72vw', height: 'auto' }}
          />
        </div>

        <p
          style={{
            position: 'absolute',
            left: 24,
            bottom: 20,
            margin: 0,
            fontFamily: MONO,
            fontSize: '.6875rem',
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: C.dim,
            pointerEvents: 'none',
          }}
        >
          {t.mcK5Drag}
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); setRot({ x: -10, y: -6 }); }}
          style={{
            position: 'absolute',
            right: 20,
            bottom: 16,
            fontFamily: MONO,
            fontSize: '.6875rem',
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            background: 'none',
            border: '1px solid rgba(236,234,229,.3)',
            borderRadius: 999,
            height: 44,
            padding: '0 18px',
            color: C.muted,
            cursor: 'pointer',
          }}
        >
          {t.mcK5Reset}
        </button>
      </div>

      <p
        style={{
          fontFamily: MONO,
          fontSize: '.75rem',
          lineHeight: 1.5,
          letterSpacing: '.02em',
          color: C.amber,
          background: C.amberBg,
          border: `1px solid ${C.amber}`,
          borderRadius: 8,
          padding: 12,
          margin: '16px 0 0',
          maxWidth: '72ch',
        }}
      >
        {t.mcK5Note}
      </p>
    </>
  );
}
