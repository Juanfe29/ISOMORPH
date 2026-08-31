import type { ReactNode } from 'react';
import { C, MONO } from '@/lib/theme';

/**
 * Sección numerada: el patrón de ritmo del sitio.
 * La columna del número colapsa sola en pantallas angostas.
 */
export default function NumberedSection({
  n,
  children,
  top = 'clamp(64px,9vw,112px)',
}: {
  n: string;
  children: ReactNode;
  top?: string;
}) {
  return (
    <section style={{ paddingTop: top }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(30px,6vw,88px) minmax(0,1fr)',
          gap: 'clamp(14px,3vw,40px)',
          alignItems: 'start',
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: '.6875rem',
            letterSpacing: '.14em',
            color: C.faint,
            paddingTop: 14,
          }}
        >
          {n}
        </span>
        <div>{children}</div>
      </div>
    </section>
  );
}
