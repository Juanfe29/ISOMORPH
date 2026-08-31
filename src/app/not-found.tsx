import Link from 'next/link';
import SiteShell from './SiteShell';
import { getDict, routes } from '@/lib/content';
import { C, MONO, PAD } from '@/lib/theme';

/**
 * 404 real: la ruta no existe y el sitio lo dice sin rodeos.
 * Next la usa para cualquier URL que no coincida con una ruta.
 */
export default function NotFound() {
  const t = getDict('es');
  const r = routes.es;

  return (
    <SiteShell lang="es">
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: `clamp(88px,14vw,160px) ${PAD}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 24,
        }}
      >
        <h1 style={{ fontFamily: MONO, fontSize: 'clamp(3rem,8vw,6rem)', fontWeight: 500, lineHeight: 1, color: C.paper, margin: 0 }}>
          404
        </h1>
        <p style={{ fontFamily: MONO, fontSize: '.8125rem', letterSpacing: '.06em', color: C.muted, margin: 0 }}>{t.e404}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link
            href={r.home}
            style={{
              background: 'transparent',
              color: C.paper,
              border: `1.5px solid ${C.paper}`,
              height: 44,
              padding: '0 18px',
              fontSize: '.9375rem',
              fontWeight: 500,
              boxShadow: `5px 5px 0 0 ${C.accent}`,
              display: 'grid',
              placeItems: 'center',
              textDecoration: 'none',
            }}
          >
            {t.e404Home}
          </Link>
          <Link
            href={r.servicios}
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(236,234,229,.4)',
              height: 44,
              padding: '0 18px',
              fontSize: '.9375rem',
              color: C.paper,
              display: 'grid',
              placeItems: 'center',
              textDecoration: 'none',
            }}
          >
            {t.e404Sv}
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
