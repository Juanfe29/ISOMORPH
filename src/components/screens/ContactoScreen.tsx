import ContactForm from '@/components/site/ContactForm';
import GraphDemo from '@/components/site/GraphDemo';
import VideoBackdrop from '@/components/site/VideoBackdrop';
import { getDict, type Lang } from '@/lib/content';
import { C, MONO, h1, label, page } from '@/lib/theme';

export default function ContactoScreen({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <div style={{ position: 'relative', isolation: 'isolate' }}>
      <VideoBackdrop src="/videos/hand-network-diagram.mp4" height={640} opacity={0.28} />

      <div style={page}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
            gap: 'clamp(32px,5vw,64px)',
            alignItems: 'start',
          }}
        >
          <div>
            <p style={label}>{t.ctLabel}</p>
            <h1 style={{ ...h1, maxWidth: '16ch' }}>{t.ctTitle}</h1>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.55, color: C.muted, margin: '0 0 40px', maxWidth: '56ch' }}>
              {t.ctLede}
            </p>
            <figure style={{ margin: 0 }}>
              <div
                style={{
                  overflow: 'hidden',
                  background: C.ink,
                  border: `1px solid ${C.line}`,
                  boxShadow: '0 1px 2px rgba(0,0,0,.4), 0 24px 56px -26px rgba(0,0,0,.65)',
                  aspectRatio: '16 / 10',
                }}
              >
                <GraphDemo kind="visitor" />
              </div>
              <figcaption
                style={{
                  fontFamily: MONO,
                  fontSize: '.6875rem',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: C.dim,
                  marginTop: 12,
                }}
              >
                {t.ctFigure}
              </figcaption>
            </figure>
          </div>

          <ContactForm lang={lang} />
        </div>
      </div>
    </div>
  );
}
