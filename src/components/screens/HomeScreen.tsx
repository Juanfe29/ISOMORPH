import Link from 'next/link';
import HeroLift from '@/components/site/HeroLift';
import SystemDiagram from '@/components/site/SystemDiagram';
import VideoBackdrop from '@/components/site/VideoBackdrop';
import { getDict, routes, casoSlugs, type Lang } from '@/lib/content';
import { C, MONO, PAD, glassCard } from '@/lib/theme';

const section = { maxWidth: 1440, margin: '0 auto', padding: `clamp(56px,8vw,96px) ${PAD} 0` };
const rule = { fontFamily: MONO, fontSize: '.6875rem', letterSpacing: '.14em', color: C.faint } as const;
const kicker = {
  fontFamily: MONO,
  fontSize: '.6875rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '.14em',
  color: C.muted,
  margin: 0,
};
const h2Big = {
  fontSize: 'clamp(1.75rem,3.2vw,2.75rem)',
  fontWeight: 600,
  lineHeight: 1.08,
  letterSpacing: '-.028em',
  color: C.paper,
  margin: 0,
};

export default function HomeScreen({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const r = routes[lang];

  return (
    <div>
      <HeroLift lang={lang} />

      <section style={{ maxWidth: 1440, margin: '0 auto', padding: `clamp(72px,10vw,128px) ${PAD} 0` }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(30px,6vw,88px) minmax(0,1fr)',
            gap: 'clamp(14px,3vw,40px)',
            alignItems: 'start',
          }}
        >
          <span style={{ ...rule, paddingTop: 14 }}>01</span>
          <div>
            <p
              style={{
                fontSize: 'clamp(1.75rem,3.4vw,3rem)',
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: '-.028em',
                color: C.paper,
                margin: '0 0 32px',
                maxWidth: '20ch',
                textWrap: 'balance',
              }}
            >
              {t.tesisLead}
            </p>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: C.muted, margin: 0, maxWidth: '64ch', textWrap: 'pretty' }}>
              {t.tesis}
            </p>
          </div>
        </div>
      </section>

      <section style={section}>
        <SystemDiagram
          labels={{
            entrada: lang === 'es' ? 'ENTRADA' : 'INPUT',
            sistema: lang === 'es' ? 'SISTEMA' : 'SYSTEM',
            mapeo: lang === 'es' ? 'MAPEO' : 'MAPPING',
            nodes:
              lang === 'es'
                ? ['LLAMADAS', 'CRM', 'WHATSAPP', 'ERP', 'AGENTES', 'REPORTES']
                : ['CALLS', 'CRM', 'WHATSAPP', 'ERP', 'AGENTS', 'REPORTS'],
          }}
        />
      </section>

      <section style={{ position: 'relative', marginTop: 96, padding: '96px 0', overflow: 'hidden', isolation: 'isolate' }}>
        <VideoBackdrop src="/videos/sunlight-desk.mp4" height={9999} opacity={0.3} />
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: `0 ${PAD}` }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'clamp(30px,6vw,88px) minmax(0,1fr)',
              gap: 'clamp(14px,3vw,40px)',
              alignItems: 'end',
              marginBottom: 48,
              borderBottom: `1px solid ${C.line}`,
              paddingBottom: 24,
            }}
          >
            <span style={rule}>02</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
              <h2 style={h2Big}>{t.capsTitle}</h2>
              <p style={kicker}>{t.capsLabel}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))', gap: 16 }}>
            {t.caps.map((cap) => (
              <Link
                key={cap.title}
                href={r.servicios}
                style={{ ...glassCard, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, textDecoration: 'none' }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-.01em', color: C.paper, margin: 0 }}>
                  {cap.title}
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: 0, flex: 1 }}>{cap.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {cap.chips.map((c) => (
                    <span
                      key={c}
                      style={{
                        fontFamily: MONO,
                        fontSize: '.6875rem',
                        letterSpacing: '.06em',
                        color: C.muted,
                        background: 'rgba(20,21,23,.66)',
                        border: `1px solid ${C.lineSoft}`,
                        borderRadius: 999,
                        padding: '5px 10px',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 'clamp(32px,5vw,64px)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <span style={rule}>03</span>
              <span style={{ width: 40, height: 1, background: 'rgba(236,234,229,.24)', display: 'block' }} />
              <p style={kicker}>{t.telLabel}</p>
            </div>
            <h2 style={{ ...h2Big, margin: '0 0 24px' }}>{t.telTitle}</h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: '0 0 24px', maxWidth: '72ch' }}>{t.telBody}</p>
            <Link
              href={r.telecom}
              style={{
                border: '1.5px solid rgba(236,234,229,.4)',
                height: 44,
                padding: '0 18px',
                fontSize: '.9375rem',
                color: C.paper,
                display: 'inline-grid',
                placeItems: 'center',
                textDecoration: 'none',
              }}
            >
              {t.telLink}
            </Link>
          </div>

          <aside
            style={{
              position: 'relative',
              overflow: 'hidden',
              isolation: 'isolate',
              ...glassCard,
              padding: 24,
              alignSelf: 'start',
            }}
          >
            <p style={{ fontFamily: MONO, fontSize: '.6875rem', letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted, margin: '0 0 16px' }}>
              {t.casoInsignia}
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.2, color: C.paper, margin: '0 0 12px' }}>{t.flagTitle}</p>
            <p style={{ fontSize: '1rem', lineHeight: 1.55, color: C.muted, margin: '0 0 20px' }}>{t.flagBody}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {t.flagPoints.map((pt) => (
                <div key={pt} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: MONO, fontSize: '.625rem', color: C.accent }}>—</span>
                  <span style={{ fontSize: '.9375rem', lineHeight: 1.45, color: 'rgba(236,234,229,.82)' }}>{pt}</span>
                </div>
              ))}
            </div>
            <Link
              href={r.caso(casoSlugs[lang].telecom)}
              style={{ fontFamily: MONO, fontSize: '.6875rem', letterSpacing: '.12em', color: C.accent, height: 44, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
            >
              {t.flagLink}
            </Link>
          </aside>
        </div>
      </section>

      <section style={section}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <span style={rule}>04</span>
          <span style={{ width: 40, height: 1, background: 'rgba(236,234,229,.24)', display: 'block' }} />
          <p style={kicker}>{t.comoLabel}</p>
        </div>
        <h2 style={{ ...h2Big, margin: '0 0 24px', maxWidth: '18ch' }}>{t.comoTitle}</h2>
        <p style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: C.muted, margin: '0 0 24px', maxWidth: '64ch' }}>{t.comoBody}</p>
        <Link href={r.metodo} style={{ fontSize: '1rem', color: C.accent, height: 44, display: 'inline-flex', alignItems: 'center' }}>
          {t.comoLink}
        </Link>
      </section>

      <section style={{ position: 'relative', marginTop: 96, padding: '96px 0', overflow: 'hidden', isolation: 'isolate' }}>
        <VideoBackdrop src="/videos/whiteboard.mp4" height={9999} opacity={0.28} />
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: `0 ${PAD}` }}>
          <div
            style={{
              ...glassCard,
              borderRadius: 20,
              padding: 'clamp(24px,5vw,48px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 'clamp(24px,4vw,48px)',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(2rem,4vw,3.5rem)',
                  fontWeight: 600,
                  lineHeight: 1.02,
                  letterSpacing: '-.032em',
                  color: C.paper,
                  margin: '0 0 20px',
                  maxWidth: '16ch',
                  textWrap: 'balance',
                }}
              >
                {t.cierreTitle}
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.55, color: C.muted, margin: 0, maxWidth: '52ch' }}>{t.cierreBody}</p>
            </div>
            <Link
              href={r.contacto}
              style={{
                background: 'transparent',
                color: C.paper,
                border: `1.5px solid ${C.paper}`,
                height: 50,
                padding: '0 24px',
                fontSize: '1.0625rem',
                fontWeight: 500,
                boxShadow: `5px 5px 0 0 ${C.accent}`,
                display: 'inline-grid',
                placeItems: 'center',
                textDecoration: 'none',
              }}
            >
              {t.cierreCta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
