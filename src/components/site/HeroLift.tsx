'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getDict, routes, type Lang } from '@/lib/content';
import { C, MONO, PAD } from '@/lib/theme';

/**
 * Hero del home: el diagrama se dibuja con el scroll.
 * El elemento <graph-demo> vive en /graph-demos.js (web component, sin build).
 */
export default function HeroLift({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const r = routes[lang];
  const track = useRef<HTMLElement | null>(null);
  const lastP = useRef(-1);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const s = document.createElement('script');
    s.src = '/graph-demos.js';
    s.async = true;
    document.head.appendChild(s);

    const onScroll = () => {
      const el = track.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = rect.height - (window.innerHeight - 64);
      const p = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;
      // el diagrama termina de dibujarse al 78% del track; el resto es el lift asentándose
      const drawP = Math.min(p / 0.78, 1);
      if (Math.abs(drawP - lastP.current) < 0.004) return;
      lastP.current = drawP;
      setPct(drawP);
      const node = document.querySelector('graph-demo[kind="force"]') as
        | (HTMLElement & { setProgress?: (n: number) => void })
        | null;
      node?.setProgress?.(drawP);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    const t1 = setTimeout(onScroll, 400);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(t1);
      s.remove();
    };
  }, []);

  return (
    <section ref={track} style={{ height: '340vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 64,
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
          background: C.ink,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* El telón va en un envoltorio posicionado: <graph-demo> se fija
            `position:relative` a sí mismo al conectarse, así que si el absolute
            se le pasa a él, lo pisa, entra en el flujo y aplasta el texto. */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* @ts-expect-error web component sin tipos */}
          <graph-demo
            kind="force"
            areas={JSON.stringify(t.areaNodes)}
            areas-title={t.areaTitle}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(100deg, rgba(20,21,23,.94) 0%, rgba(20,21,23,.82) 24%, rgba(20,21,23,.3) 46%, rgba(20,21,23,0) 64%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            flex: '1 1 auto',
            minHeight: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '100%', maxWidth: 1560, margin: '0 auto', padding: `0 ${PAD}` }}>
            <div style={{ maxWidth: 'min(46rem,100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <span style={{ width: 56, height: 1, background: C.paper, display: 'block' }} />
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: '.6875rem',
                    letterSpacing: '.18em',
                    textTransform: 'uppercase',
                    color: C.paper,
                  }}
                >
                  {t.heroEyebrow}
                </span>
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.5rem,5.6vw,5.25rem)',
                  fontWeight: 600,
                  lineHeight: 0.96,
                  letterSpacing: '-.036em',
                  color: C.paper,
                  margin: '0 0 24px',
                  maxWidth: '15ch',
                  textWrap: 'balance',
                }}
              >
                {t.heroTitle}
              </h1>
              <p
                style={{
                  fontSize: 'clamp(1rem,1.2vw,1.1875rem)',
                  lineHeight: 1.5,
                  color: 'rgba(236,234,229,.82)',
                  margin: '0 0 28px',
                  maxWidth: '44ch',
                }}
              >
                {t.heroSupport}
              </p>
              <Link
                href={r.contacto}
                style={{
                  pointerEvents: 'auto',
                  background: 'transparent',
                  color: C.paper,
                  border: `1.5px solid ${C.paper}`,
                  height: 54,
                  padding: '0 28px',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  boxShadow: `5px 5px 0 0 ${C.accent}`,
                  display: 'inline-grid',
                  placeItems: 'center',
                  textDecoration: 'none',
                  transition:
                    'box-shadow 140ms ease, transform 140ms ease, color 140ms ease, border-color 140ms ease',
                }}
              >
                {t.heroCta}
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            flex: 'none',
            pointerEvents: 'none',
            borderTop: `1px solid ${C.lineSoft}`,
            background: 'rgba(20,21,23,.7)',
            backdropFilter: 'blur(18px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
          }}
        >
          <div
            style={{
              maxWidth: 1560,
              margin: '0 auto',
              padding: `14px ${PAD}`,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px 20px',
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: '.6875rem',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: C.muted,
                minWidth: 0,
                flex: '1 1 auto',
              }}
            >
              {t.heroCaption}
            </span>
            <div
              style={{
                flex: '1 1 140px',
                minWidth: 120,
                height: 2,
                background: 'rgba(236,234,229,.16)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(pct * 100).toFixed(1)}%`,
                  background: '#2A2A2E',
                  transition: 'width 80ms linear',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: MONO,
                fontSize: '.6875rem',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '.06em',
                color: C.paper,
                minWidth: '4ch',
                textAlign: 'right',
              }}
            >
              {Math.round(pct * 100)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
