import Link from 'next/link';
import VideoBackdrop from '@/components/site/VideoBackdrop';
import { getDict, routes, type Lang } from '@/lib/content';
import { C, MONO, label, h1, h2, lede, page } from '@/lib/theme';

type Tone = 'ok' | 'maybe' | 'no';

const TONES: Record<Tone, { bg: string; border: string; text: string }> = {
  ok: { bg: 'rgba(47,125,69,.16)', border: 'rgba(127,216,160,.45)', text: C.ok },
  maybe: { bg: 'rgba(167,107,10,.18)', border: 'rgba(229,182,92,.45)', text: C.amber },
  no: { bg: 'rgba(195,58,50,.16)', border: 'rgba(240,139,132,.45)', text: C.danger },
};

function Icon({ tone }: { tone: Tone }) {
  const c = TONES[tone].text;
  if (tone === 'ok')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8.5 L6.5 12 L13 4.5" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (tone === 'maybe')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2 L15 14 H1 Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6.5 V9.5 M8 11.5 V11.6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke={c} strokeWidth="1.5" />
      <path d="M4.5 11.5 L11.5 4.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LimitCard({ tone, title, items }: { tone: Tone; title: string; items: readonly string[] }) {
  const s = TONES[tone];
  return (
    <div
      style={{
        background: s.bg,
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        border: `1px solid ${s.border}`,
        borderRadius: 16,
        boxShadow: '0 16px 40px -22px rgba(0,0,0,.5)',
        padding: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Icon tone={tone} />
        <span style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.08em', fontWeight: 500, color: s.text }}>
          {title}
        </span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((i) => (
          <li key={i} style={{ fontSize: '.9375rem', lineHeight: 1.5, color: s.text }}>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ServiciosScreen({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const r = routes[lang];

  return (
    <div style={{ position: 'relative', isolation: 'isolate' }}>
      <VideoBackdrop src="/videos/report-pages.mp4" height={520} />

      <div style={page}>
        <p style={label}>{t.svLabel}</p>
        <h1 style={h1}>{t.svTitle}</h1>
        <p style={{ ...lede, marginBottom: 64 }}>{t.svLede}</p>

        <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${C.line}` }}>
          {t.svBlocks.map((b) => (
            <div
              key={b.title}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,290px),1fr))',
                gap: 'clamp(10px,3vw,48px)',
                padding: 'clamp(24px,4vw,32px) 0',
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-.01em', color: C.paper, margin: '0 0 12px' }}>
                  {b.title}
                </h2>
                <Link
                  href={b.title === t.svBlocks[0].title ? r.telecom : r.trabajo}
                  style={{ fontSize: '.9375rem', color: C.accent, textDecoration: 'underline', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
                >
                  {b.link}
                </Link>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: 0, maxWidth: '72ch' }}>{b.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 96 }}>
          <p style={label}>{t.limLabel}</p>
          <h2 style={{ ...h2, marginBottom: 32 }}>{t.limTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))', gap: 16 }}>
            <LimitCard tone="ok" title={t.limYesLabel} items={t.limYes} />
            <LimitCard tone="maybe" title={t.limMaybeLabel} items={t.limMaybe} />
            <LimitCard tone="no" title={t.limNoLabel} items={t.limNo} />
          </div>
        </div>
      </div>
    </div>
  );
}
