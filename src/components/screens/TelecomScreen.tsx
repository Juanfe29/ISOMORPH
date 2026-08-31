import Link from 'next/link';
import GraphDemo from '@/components/site/GraphDemo';
import { getDict, routes, casoSlugs, type Lang } from '@/lib/content';
import { C, MONO, glassCard, h1, label, page } from '@/lib/theme';

const subLabel = {
  fontFamily: MONO,
  fontSize: '.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '.08em',
  color: C.dim,
  margin: '0 0 12px',
};

const bodyText = { fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: 0, maxWidth: '72ch' };

const relPill = {
  fontFamily: MONO,
  fontSize: '.8125rem',
  letterSpacing: '.04em',
  color: C.accent,
  background: 'rgba(123,169,255,.12)',
  border: '1px solid rgba(123,169,255,.45)',
  borderRadius: 999,
  padding: '0 16px',
  height: 44,
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
};

export default function TelecomScreen({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const r = routes[lang];
  const casoHref = r.caso(casoSlugs[lang].telecom);

  return (
    <div style={page}>
      <Link
        href={r.servicios}
        style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
      >
        {t.backServicios}
      </Link>
      <p style={{ ...label, margin: '16px 0' }}>{t.tcLabel}</p>
      <h1 style={{ ...h1, marginBottom: 64, maxWidth: '20ch' }}>{t.tcTitle}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 'clamp(32px,5vw,64px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div>
            <p style={subLabel}>{t.tcP1Label}</p>
            <p style={bodyText}>{t.tcP1}</p>
          </div>
          <div>
            <p style={subLabel}>{t.tcP2Label}</p>
            <p style={bodyText}>{t.tcP2}</p>
          </div>
          <div>
            <p style={subLabel}>{t.tcP3Label}</p>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '72ch' }}>
              {t.tcEntrega.map((li) => (
                <li key={li} style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted }}>
                  {li}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={subLabel}>{t.tcP4Label}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href={casoHref} style={relPill}>
                {t.tcRel1}
              </Link>
              <Link href={casoHref} style={relPill}>
                {t.tcRel2}
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <figure style={{ margin: 0 }}>
            <div
              style={{
                overflow: 'hidden',
                background: C.ink,
                border: `1px solid ${C.line}`,
                boxShadow: '0 1px 2px rgba(0,0,0,.4), 0 24px 56px -26px rgba(0,0,0,.65)',
                aspectRatio: '4 / 3',
              }}
            >
              <GraphDemo kind="packets" />
            </div>
            <figcaption style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.08em', textTransform: 'uppercase', color: C.dim, marginTop: 12 }}>
              {t.tcCaption}
            </figcaption>
          </figure>

          <div style={{ ...glassCard, padding: 24 }}>
            <p style={{ fontFamily: MONO, fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, margin: '0 0 16px' }}>
              {t.tcLimLabel}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: C.amberBg, border: `1px solid ${C.amber}`, borderRadius: 8, padding: 12 }}>
                <p style={{ margin: 0, fontSize: '.9375rem', lineHeight: 1.5, color: C.amber }}>{t.tcLim1}</p>
              </div>
              <div style={{ background: C.dangerBg, border: `1px solid ${C.danger}`, borderRadius: 8, padding: 12 }}>
                <p style={{ margin: 0, fontSize: '.9375rem', lineHeight: 1.5, color: C.danger }}>{t.tcLim2}</p>
              </div>
            </div>
          </div>

          <Link
            href={r.contacto}
            style={{
              background: '#205bc3',
              color: '#FFFFFF',
              borderRadius: 8,
              height: 48,
              padding: '0 24px',
              fontSize: '1rem',
              fontWeight: 500,
              alignSelf: 'flex-start',
              display: 'grid',
              placeItems: 'center',
              textDecoration: 'none',
            }}
          >
            {t.tcCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
