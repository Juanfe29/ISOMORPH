import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDict, routes, casoKeyFromSlug, type Lang } from '@/lib/content';
import { C, MONO, h1, label, page } from '@/lib/theme';

type Caso = {
  title: string;
  problema: string;
  restriccion: string;
  construimos: string;
  hasResult: boolean;
  resultado?: string;
  resultadoDetalle?: string;
  caps: string[];
};

const subLabel = {
  fontFamily: MONO,
  fontSize: '.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '.08em',
  color: C.dim,
  margin: '0 0 12px',
};

const bodyText = { fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: 0, maxWidth: '72ch' };

export default function CasoScreen({ lang, slug }: { lang: Lang; slug: string }) {
  const t = getDict(lang);
  const r = routes[lang];
  const key = casoKeyFromSlug(lang, slug);
  if (!key) notFound();

  const caso = (t.casos as unknown as Record<string, Caso>)[key];
  if (!caso) notFound();

  return (
    <div style={page}>
      <Link
        href={r.trabajo}
        style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
      >
        {t.backTrabajo}
      </Link>
      <p style={{ ...label, margin: '16px 0' }}>{t.casoLabel}</p>
      <h1 style={{ ...h1, marginBottom: 64, maxWidth: '20ch' }}>{caso.title}</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
          gap: 'clamp(28px,4vw,48px) clamp(28px,5vw,64px)',
        }}
      >
        <div>
          <p style={subLabel}>{t.casoProblema}</p>
          <p style={bodyText}>{caso.problema}</p>
        </div>
        <div>
          <p style={subLabel}>{t.casoRestriccion}</p>
          <p style={bodyText}>{caso.restriccion}</p>
        </div>
        <div>
          <p style={subLabel}>{t.casoConstruimos}</p>
          <p style={bodyText}>{caso.construimos}</p>
        </div>

        {caso.hasResult && (
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.surface, padding: 'clamp(16px,3vw,32px)' }}>
            <p style={{ ...subLabel, marginBottom: 16 }}>{t.casoResultado}</p>
            <p
              style={{
                fontFamily: MONO,
                fontSize: 'clamp(2rem,4vw,3rem)',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: '-.01em',
                color: C.amber,
                background: C.amberBg,
                border: `1px solid ${C.amber}`,
                borderRadius: 8,
                padding: 16,
                margin: 0,
              }}
            >
              {caso.resultado}
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.55, color: C.paper, margin: '16px 0 0' }}>{caso.resultadoDetalle}</p>
            <p style={{ fontFamily: MONO, fontSize: '.8125rem', letterSpacing: '.02em', color: C.muted, margin: '12px 0 0' }}>
              {t.casoResultadoNota}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 64, paddingTop: 32, borderTop: `1px solid ${C.line}` }}>
        <p style={subLabel}>{t.casoCaps}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {caso.caps.map((cap) => (
            <Link
              key={cap}
              href={r.servicios}
              style={{
                fontFamily: MONO,
                fontSize: '.6875rem',
                letterSpacing: '.06em',
                color: C.accent,
                background: 'rgba(123,169,255,.12)',
                border: '1px solid rgba(123,169,255,.45)',
                borderRadius: 999,
                padding: '0 14px',
                height: 44,
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              {cap}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
