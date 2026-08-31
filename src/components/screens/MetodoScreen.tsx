import VideoBackdrop from '@/components/site/VideoBackdrop';
import { getDict, type Lang } from '@/lib/content';
import { C, MONO, glassCard, h1, h2, label, page } from '@/lib/theme';

export default function MetodoScreen({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <div style={{ position: 'relative', isolation: 'isolate' }}>
      <VideoBackdrop src="/videos/steel-spheres-rods.mp4" height={600} />

      <div style={page}>
        <p style={label}>{t.mtLabel}</p>
        <h1 style={{ ...h1, marginBottom: 64, maxWidth: '22ch' }}>{t.mtTitle}</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {t.phases.map((p) => (
            <div
              key={p.n}
              style={{
                ...glassCard,
                display: 'grid',
                gridTemplateColumns: 'clamp(30px,6vw,80px) repeat(auto-fit,minmax(min(100%,230px),1fr))',
                gap: 'clamp(10px,2vw,32px) clamp(16px,3vw,32px)',
                padding: 'clamp(20px,3vw,28px) clamp(18px,3vw,32px)',
                alignItems: 'start',
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: '1.5rem', fontVariantNumeric: 'tabular-nums', color: C.faint }}>
                {p.n}
              </span>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-.01em', color: C.paper, margin: '0 0 8px' }}>
                  {p.title}
                </h2>
                <p style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.08em', textTransform: 'uppercase', color: C.dim, margin: 0 }}>
                  {p.when}
                </p>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: 0, maxWidth: '72ch' }}>{p.body}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 96,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
            gap: 'clamp(32px,5vw,64px)',
            alignItems: 'start',
          }}
        >
          <div>
            <h2 style={{ ...h2, marginBottom: 24 }}>{t.embTitle}</h2>
            {[t.emb1, t.emb2, t.emb3].map((p, i) => (
              <p key={i} style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: i < 2 ? '0 0 16px' : 0, maxWidth: '72ch' }}>
                {p}
              </p>
            ))}
          </div>
          <figure style={{ margin: 0 }}>
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                background: C.surface,
                border: `1px solid ${C.line}`,
                boxShadow: '0 1px 2px rgba(0,0,0,.4), 0 24px 56px -26px rgba(0,0,0,.65)',
                aspectRatio: '4 / 3',
              }}
            >
              <VideoBackdrop src="/videos/technical-documents.mp4" plain />
            </div>
            <figcaption style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.08em', textTransform: 'uppercase', color: C.dim, marginTop: 12 }}>
              {t.mtCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
