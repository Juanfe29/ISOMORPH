'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import K5Mark from './K5Mark';
import { getDict, routes, type Lang } from '@/lib/content';
import { C, MONO, PAD } from '@/lib/theme';

/** Pares de rutas equivalentes, para que el cambio de idioma no te devuelva al home. */
const TWINS: [string, string][] = [
  ['/', '/en'],
  ['/servicios', '/en/services'],
  ['/servicios/telecomunicaciones', '/en/services/telecom'],
  ['/trabajo', '/en/work'],
  ['/metodo', '/en/how-we-work'],
  ['/marca', '/en/brand'],
  ['/contacto', '/en/contact'],
];

function twinOf(path: string, lang: Lang): string {
  const clean = path.replace(/\/$/, '') || '/';
  for (const [es, en] of TWINS) {
    if (lang === 'en' && clean === es) return en;
    if (lang === 'es' && clean === en) return es;
  }
  // Los casos llevan slug propio por idioma: sin tabla de slugs, al índice de Trabajo.
  if (clean.startsWith('/trabajo/')) return '/en/work';
  if (clean.startsWith('/en/work/')) return '/trabajo';
  return lang === 'en' ? '/en' : '/';
}

export default function SiteHeader({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const r = routes[lang];
  const path = usePathname();

  const items = [
    { label: t.nav[0], href: r.servicios },
    { label: t.nav[1], href: r.trabajo },
    { label: t.nav[2], href: r.metodo },
    { label: t.nav[3], href: r.contacto },
  ];

  const langBtn = (on: boolean) => ({
    width: 40,
    height: 30,
    border: 'none',
    cursor: 'pointer',
    fontFamily: MONO,
    fontSize: '.6875rem',
    letterSpacing: '.06em',
    display: 'grid',
    placeItems: 'center',
    textDecoration: 'none',
    background: on ? C.paper : C.surface,
    color: on ? C.ink : C.muted,
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(20,21,23,.72)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        borderBottom: `1px solid ${C.lineSoft}`,
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: `0 ${PAD}`,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(12px,2vw,32px)',
        }}
      >
        <Link
          href={r.home}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 0',
            minHeight: 44,
            flex: 'none',
            textDecoration: 'none',
          }}
        >
          <K5Mark width={34} height={32} />
          <span
            style={{
              fontSize: '.9375rem',
              fontWeight: 600,
              letterSpacing: '-.01em',
              color: C.paper,
              whiteSpace: 'nowrap',
            }}
          >
            Isomorph
          </span>
        </Link>

        <nav
          data-scroll-x="1"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flex: '1 1 0',
            minWidth: 0,
            overflowX: 'auto',
            overflowY: 'hidden',
          }}
        >
          {items.map((it) => {
            const active = path === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                style={{
                  fontFamily: MONO,
                  fontSize: '.75rem',
                  letterSpacing: '.08em',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  padding: '0 clamp(8px,1.4vw,12px)',
                  height: 44,
                  display: 'grid',
                  placeItems: 'center',
                  color: active ? C.paper : C.muted,
                  background: active ? C.surface : 'transparent',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  flex: 'none',
                  textDecoration: 'none',
                }}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
          <div
            style={{
              display: 'flex',
              border: '1px solid rgba(236,234,229,.24)',
              borderRadius: 999,
              overflow: 'hidden',
              height: 32,
              flex: 'none',
            }}
          >
            <Link href={twinOf(path, 'es')} style={langBtn(lang === 'es')} hrefLang="es">
              ES
            </Link>
            <Link href={twinOf(path, 'en')} style={langBtn(lang === 'en')} hrefLang="en">
              EN
            </Link>
          </div>
          <Link
            href={r.contacto}
            data-header-cta="1"
            style={{
              background: 'transparent',
              color: C.paper,
              border: `1.5px solid ${C.paper}`,
              height: 44,
              padding: '0 18px',
              fontSize: '.9375rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              boxShadow: `5px 5px 0 0 ${C.accent}`,
              display: 'grid',
              placeItems: 'center',
              textDecoration: 'none',
              transition: 'box-shadow 140ms ease, transform 140ms ease, color 140ms ease, border-color 140ms ease',
            }}
          >
            {t.navCta}
          </Link>
        </div>
      </div>
    </header>
  );
}
