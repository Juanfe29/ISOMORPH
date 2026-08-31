import K5Mark from '@/components/site/K5Mark';
import K5Interactive from '@/components/site/K5Interactive';
import NumberedSection from '@/components/site/NumberedSection';
import DownloadK5 from '@/components/site/DownloadK5';
import { getDict, type Lang } from '@/lib/content';
import { C, MONO, h1, h2, label, lede, page } from '@/lib/theme';

const tile = { border: `1px solid ${C.line}`, borderRadius: 16, overflow: 'hidden' } as const;
const tileCaption = (ok: boolean) => ({
  padding: '14px 18px',
  borderTop: `1px solid ${ok ? 'rgba(127,216,160,.3)' : 'rgba(240,139,132,.3)'}`,
  background: ok ? 'rgba(47,125,69,.12)' : 'rgba(195,58,50,.12)',
});
const tileTag = (ok: boolean) => ({
  fontFamily: MONO,
  fontSize: '.625rem',
  letterSpacing: '.16em',
  textTransform: 'uppercase' as const,
  color: ok ? C.ok : C.danger,
  margin: '0 0 6px',
});
const tileText = { fontSize: '.9375rem', lineHeight: 1.45, color: C.muted, margin: 0 };
const demo = { height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;
const wordmark = { fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-.018em', color: C.paper } as const;

const specRow = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 24,
  padding: 'clamp(16px,3vw,22px) clamp(18px,3vw,28px)',
} as const;
const specNum = {
  fontFamily: MONO,
  fontSize: '.6875rem',
  letterSpacing: '.06em',
  color: C.dim,
  whiteSpace: 'nowrap' as const,
  fontVariantNumeric: 'tabular-nums' as const,
};

export default function MarcaScreen({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <div style={page}>
      <p style={label}>{t.mcLabel}</p>
      <h1 style={{ ...h1, maxWidth: '20ch' }}>{t.mcTitle}</h1>
      <p style={{ ...lede, maxWidth: '64ch' }}>{t.mcLede}</p>

      <NumberedSection n="01">
        <h2 style={{ ...h2, maxWidth: '24ch' }}>{t.mcLogoTitle}</h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: '0 0 32px', maxWidth: '68ch', textWrap: 'pretty' }}>
          {t.mcLogoBody}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ ...tile, background: C.ink }}>
            <div style={{ height: 'clamp(150px,24vw,220px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', fontWeight: 600, letterSpacing: '-.022em', color: C.paper }}>
                Isomorph
              </span>
            </div>
            <p style={{ fontFamily: MONO, fontSize: '.6875rem', letterSpacing: '.14em', textTransform: 'uppercase', color: C.dim, margin: 0, padding: '14px 20px', borderTop: `1px solid ${C.lineSoft}` }}>
              {t.mcLogoPrim}
            </p>
          </div>

          <div style={{ ...tile, background: C.surface }}>
            <div style={{ height: 'clamp(150px,24vw,220px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <K5Mark width={52} height={49} />
              <span style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', fontWeight: 600, letterSpacing: '-.022em', color: C.paper }}>
                Isomorph
              </span>
            </div>
            <p style={{ fontFamily: MONO, fontSize: '.6875rem', letterSpacing: '.14em', textTransform: 'uppercase', color: C.dim, margin: 0, padding: '14px 20px', borderTop: `1px solid ${C.lineSoft}` }}>
              {t.mcLogoLock}
            </p>
          </div>
        </div>

        <ul style={{ listStyle: 'none', margin: 0, padding: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 10, borderTop: `1px solid ${C.line}` }}>
          {t.mcRules.map((r) => (
            <li key={r} style={{ fontFamily: MONO, fontSize: '.8125rem', lineHeight: 1.5, letterSpacing: '.02em', color: C.muted }}>
              {r}
            </li>
          ))}
        </ul>
      </NumberedSection>

      <NumberedSection n="02">
        <h2 style={{ ...h2, maxWidth: '24ch' }}>{t.mcK5Title}</h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: '0 0 32px', maxWidth: '68ch', textWrap: 'pretty' }}>
          {t.mcK5Body}
        </p>
        <K5Interactive lang={lang} />
      </NumberedSection>

      <NumberedSection n="03">
        <h2 style={{ ...h2, marginBottom: 32, maxWidth: '24ch' }}>{t.mcTypeTitle}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ ...tile, borderRadius: 16, background: C.surface, padding: 'clamp(18px,3vw,28px)' }}>
            <p style={{ fontSize: '4.5rem', lineHeight: 1, fontWeight: 600, letterSpacing: '-.03em', color: C.paper, margin: '0 0 20px' }}>Aa</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-.01em', color: C.paper, margin: '0 0 8px' }}>Newsreader</p>
            <p style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.06em', color: C.muted, margin: '0 0 12px' }}>
              400 · 500 · 600 · 400 italic
            </p>
            <p style={{ fontSize: '.9375rem', lineHeight: 1.55, color: C.muted, margin: 0 }}>{t.mcTypeSerifUse}</p>
          </div>

          <div style={{ ...tile, borderRadius: 16, background: C.surface, padding: 'clamp(18px,3vw,28px)' }}>
            <p style={{ fontFamily: MONO, fontSize: '4.5rem', lineHeight: 1, fontWeight: 500, color: C.paper, margin: '0 0 20px' }}>Aa</p>
            <p style={{ fontFamily: MONO, fontSize: '1.125rem', fontWeight: 500, letterSpacing: '.02em', color: C.paper, margin: '0 0 8px' }}>
              IBM Plex Mono
            </p>
            <p style={{ fontFamily: MONO, fontSize: '.75rem', letterSpacing: '.06em', color: C.muted, margin: '0 0 12px' }}>400 · 500</p>
            <p style={{ fontSize: '.9375rem', lineHeight: 1.55, color: C.muted, margin: 0 }}>{t.mcTypeMonoUse}</p>
          </div>
        </div>

        <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, background: 'rgba(236,234,229,.045)', overflow: 'hidden' }}>
          {[
            { text: t.mcScDisplay, spec: '84 / 0.96 / −0.036em / 600', style: { fontSize: 'clamp(2rem,4vw,3.25rem)', fontWeight: 600, lineHeight: 1, letterSpacing: '-.036em', color: C.paper } },
            { text: t.mcScTitle, spec: '48 / 1.12 / −0.028em / 600', style: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.12, letterSpacing: '-.028em', color: C.paper } },
            { text: t.mcScSub, spec: '20 / 1.3 / −0.01em / 600', style: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-.01em', color: C.paper } },
            { text: t.mcScBody, spec: '18 / 1.6 / 0 / 400', style: { fontSize: '1.125rem', lineHeight: 1.6, color: C.muted } },
            { text: t.mcScLabel, spec: '12 / 1.4 / 0.08em / 500', style: { fontFamily: MONO, fontSize: '.75rem', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.muted } },
          ].map((row, i, all) => (
            <div key={row.spec} style={{ ...specRow, borderBottom: i < all.length - 1 ? `1px solid rgba(236,234,229,.12)` : undefined }}>
              <span style={row.style}>{row.text}</span>
              <span style={specNum}>{row.spec}</span>
            </div>
          ))}
        </div>
      </NumberedSection>

      <NumberedSection n="04">
        <h2 style={{ ...h2, marginBottom: 32, maxWidth: '24ch' }}>{t.mcUseTitle}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))', gap: 16 }}>
          <div style={{ ...tile, border: '1px solid rgba(127,216,160,.4)', background: C.ink }}>
            <div style={demo}>
              <span style={wordmark}>Isomorph</span>
            </div>
            <div style={tileCaption(true)}>
              <p style={tileTag(true)}>{t.mcOk}</p>
              <p style={tileText}>{t.mcU1}</p>
            </div>
          </div>

          <div style={{ ...tile, border: '1px solid rgba(127,216,160,.4)', background: C.surface }}>
            <div style={{ ...demo, position: 'relative', overflow: 'hidden' }}>
              <K5Mark width={240} height={203} tilt={false} accent={false} strokeWidth={2} opacity={0.16} style={{ position: 'absolute' }} />
              <span style={{ position: 'relative', fontFamily: MONO, fontSize: '.75rem', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: C.paper }}>
                {t.mcU2Tag}
              </span>
            </div>
            <div style={tileCaption(true)}>
              <p style={tileTag(true)}>{t.mcOk}</p>
              <p style={tileText}>{t.mcU2}</p>
            </div>
          </div>

          <div style={{ ...tile, border: '1px solid rgba(127,216,160,.4)', background: C.surface }}>
            <div style={{ ...demo, background: C.paper }}>
              <span style={{ ...wordmark, color: C.ink }}>Isomorph</span>
            </div>
            <div style={tileCaption(true)}>
              <p style={tileTag(true)}>{t.mcOk}</p>
              <p style={tileText}>{t.mcU3}</p>
            </div>
          </div>

          <div style={{ ...tile, border: '1px solid rgba(240,139,132,.4)', background: C.ink }}>
            <div style={demo}>
              <K5Mark width={120} height={101} tilt={false} accent={false} strokeWidth={2.4} />
            </div>
            <div style={tileCaption(false)}>
              <p style={tileTag(false)}>{t.mcNo}</p>
              <p style={tileText}>{t.mcU4}</p>
            </div>
          </div>

          <div style={{ ...tile, border: '1px solid rgba(240,139,132,.4)', background: C.ink }}>
            <div style={{ ...demo, overflow: 'hidden' }}>
              <span style={{ ...wordmark, display: 'inline-block', transform: 'scaleX(1.75)' }}>Isomorph</span>
            </div>
            <div style={tileCaption(false)}>
              <p style={tileTag(false)}>{t.mcNo}</p>
              <p style={tileText}>{t.mcU5}</p>
            </div>
          </div>

          <div style={{ ...tile, border: '1px solid rgba(240,139,132,.4)', background: C.ink }}>
            <div style={{ ...demo, gap: 12 }}>
              <K5Mark width={44} height={41} accent={false} stroke={C.amber} />
              <span style={{ ...wordmark, color: C.accent }}>Isomorph</span>
            </div>
            <div style={tileCaption(false)}>
              <p style={tileTag(false)}>{t.mcNo}</p>
              <p style={tileText}>{t.mcU6}</p>
            </div>
          </div>
        </div>
      </NumberedSection>

      <NumberedSection n="05">
        <h2 style={{ ...h2, maxWidth: '24ch' }}>{t.mcVoiceTitle}</h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: '0 0 32px', maxWidth: '68ch', textWrap: 'pretty' }}>
          {t.mcVoiceBody}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {t.mcVoice.map((v) => (
            <div
              key={v.yes}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
                gap: 16,
                border: `1px solid ${C.lineSoft}`,
                borderRadius: 16,
                overflow: 'hidden',
                background: 'rgba(236,234,229,.045)',
              }}
            >
              <div style={{ padding: 'clamp(18px,3vw,24px) clamp(18px,3vw,28px)' }}>
                <p style={tileTag(true)}>{t.mcSay}</p>
                <p style={{ fontSize: '1.125rem', lineHeight: 1.45, color: C.paper, margin: 0, textWrap: 'pretty' }}>{v.yes}</p>
              </div>
              <div style={{ padding: 'clamp(18px,3vw,24px) clamp(18px,3vw,28px)' }}>
                <p style={tileTag(false)}>{t.mcSayNot}</p>
                <p style={{ fontSize: '1.125rem', lineHeight: 1.45, color: 'rgba(236,234,229,.42)', margin: 0, textWrap: 'pretty' }}>
                  {v.no}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ul style={{ listStyle: 'none', margin: 0, padding: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 10, borderTop: `1px solid ${C.line}` }}>
          {t.mcVoiceRules.map((r) => (
            <li key={r} style={{ fontFamily: MONO, fontSize: '.8125rem', lineHeight: 1.5, letterSpacing: '.02em', color: C.muted }}>
              {r}
            </li>
          ))}
        </ul>
      </NumberedSection>

      <NumberedSection n="06">
        <h2 style={{ ...h2, maxWidth: '24ch' }}>{t.mcDlTitle}</h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: '0 0 28px', maxWidth: '68ch', textWrap: 'pretty' }}>
          {t.mcDlBody}
        </p>
        <DownloadK5 lang={lang} />
        <p style={{ fontFamily: MONO, fontSize: '.75rem', lineHeight: 1.5, letterSpacing: '.02em', color: C.muted, margin: 0, maxWidth: '72ch' }}>
          {t.mcDlNote}
        </p>
      </NumberedSection>
    </div>
  );
}
