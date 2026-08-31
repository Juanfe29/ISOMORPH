import Link from 'next/link';
import K5Mark from './K5Mark';
import { getDict, routes, type Lang } from '@/lib/content';
import { C, MONO, PAD } from '@/lib/theme';

export default function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const r = routes[lang];

  const colLabel = {
    fontFamily: MONO,
    fontSize: '.6875rem',
    letterSpacing: '.08em',
    textTransform: 'uppercase' as const,
    color: C.dim,
    margin: '0 0 12px',
  };

  const linkStyle = {
    padding: '6px 0',
    display: 'block',
    fontSize: '.875rem',
    color: C.muted,
    textDecoration: 'none',
  };

  const coHrefs = [r.trabajo, r.metodo, r.marca, r.contacto];

  return (
    <footer
      style={{
        borderTop: `1px solid ${C.lineSoft}`,
        background: 'rgba(29,31,35,.72)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: `clamp(40px,6vw,64px) ${PAD} 32px`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,170px),1fr))',
          gap: 'clamp(28px,4vw,48px)',
        }}
      >
        <div>
          <K5Mark width={54} height={40} />
          <p style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.06em', color: C.muted, margin: '16px 0 0' }}>
            {t.footStatus}
          </p>
        </div>

        <div>
          <p style={colLabel}>{t.footSvc}</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {t.footSvcItems.map((s) => (
              <li key={s}>
                <Link href={r.servicios} style={linkStyle}>
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p style={colLabel}>{t.footCo}</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {t.footCoLabels.map((label, i) => (
              <li key={label}>
                <Link href={coHrefs[i]} style={linkStyle}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p style={colLabel}>{t.footContact}</p>
          <p style={{ fontSize: '.875rem', lineHeight: 1.6, color: C.muted, margin: 0 }}>
            <a href="mailto:hello@isomorph.lat" style={{ color: C.muted, textDecoration: 'none' }}>
              hello@isomorph.lat
            </a>
            <br />
            Bogotá, Colombia
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: `0 ${PAD} 32px`,
          paddingTop: 24,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '16px 24px',
          borderTop: `1px solid ${C.line}`,
        }}
      >
        <p style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.06em', color: C.dim, margin: 0 }}>
          ISOMORPH · BOGOTÁ, COLOMBIA · 2026
        </p>
      </div>
    </footer>
  );
}
