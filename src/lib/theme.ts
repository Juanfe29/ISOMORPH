import type { CSSProperties } from 'react';

/** Paleta y tipografía del sistema Isomorph. Los valores son los del diseño aprobado. */
export const C = {
  ink: '#141517',
  surface: '#1D1F23',
  paper: '#ECEAE5',
  muted: '#93939A',
  accent: '#7BA9FF',
  accentHover: '#A6C4FF',
  amber: '#E5B65C',
  amberBg: 'rgba(167,107,10,.18)',
  danger: '#F08B84',
  dangerBg: 'rgba(195,58,50,.16)',
  ok: '#7FD8A0',
  okBg: 'rgba(47,125,69,.16)',
  line: 'rgba(236,234,229,.16)',
  lineSoft: 'rgba(236,234,229,.14)',
  dim: 'rgba(236,234,229,.45)',
  faint: 'rgba(236,234,229,.3)',
  glass: 'rgba(236,234,229,.06)',
} as const;

export const MONO = "var(--font-mono), ui-monospace, Menlo, monospace";
export const SERIF = "var(--font-serif), Georgia, serif";

/** Padding lateral del sitio: mismo clamp en todas las páginas. */
export const PAD = 'clamp(20px,5vw,56px)';

export const page: CSSProperties = {
  maxWidth: 1440,
  margin: '0 auto',
  padding: `clamp(48px,7vw,80px) ${PAD} clamp(56px,8vw,96px)`,
};

export const label: CSSProperties = {
  fontFamily: MONO,
  fontSize: '.75rem',
  textTransform: 'uppercase',
  letterSpacing: '.08em',
  fontWeight: 500,
  color: C.muted,
  margin: '0 0 16px',
};

export const eyebrow: CSSProperties = {
  fontFamily: MONO,
  fontSize: '.6875rem',
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: C.dim,
  margin: 0,
};

export const h1: CSSProperties = {
  fontSize: 'clamp(2.25rem,4vw,3.25rem)',
  fontWeight: 600,
  lineHeight: 1.08,
  letterSpacing: '-.022em',
  color: C.paper,
  margin: '0 0 24px',
};

export const h2: CSSProperties = {
  fontSize: 'clamp(1.75rem,3vw,2.5rem)',
  fontWeight: 600,
  lineHeight: 1.15,
  letterSpacing: '-.018em',
  color: C.paper,
  margin: '0 0 20px',
};

export const h3: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  letterSpacing: '-.01em',
  color: C.paper,
  margin: 0,
};

export const lede: CSSProperties = {
  fontSize: '1.125rem',
  lineHeight: 1.55,
  color: C.muted,
  margin: 0,
  maxWidth: '66ch',
  textWrap: 'pretty',
};

export const body: CSSProperties = {
  fontSize: '1rem',
  lineHeight: 1.6,
  color: C.muted,
  margin: 0,
  maxWidth: '68ch',
  textWrap: 'pretty',
};

/** Tarjeta de vidrio: el patrón de superficie del sitio. */
export const glassCard: CSSProperties = {
  border: `1px solid ${C.lineSoft}`,
  borderRadius: 16,
  background: C.glass,
  backdropFilter: 'blur(20px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
  boxShadow: '0 1px 2px rgba(0,0,0,.4), 0 16px 40px -20px rgba(0,0,0,.6)',
};

/** Grilla intrínseca: colapsa sola, sin media queries. */
export const autoGrid = (min: number, gap = 16): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}px),1fr))`,
  gap,
});

/** Botón primario: el del sombreado desplazado. */
export const ctaPrimary: CSSProperties = {
  background: 'transparent',
  color: C.paper,
  border: `1.5px solid ${C.paper}`,
  borderRadius: 0,
  height: 54,
  padding: '0 28px',
  fontSize: '1.125rem',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  boxShadow: `5px 5px 0 0 ${C.accent}`,
  transition: 'box-shadow 140ms ease, transform 140ms ease, color 140ms ease, border-color 140ms ease',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const ctaGhost: CSSProperties = {
  background: 'transparent',
  color: C.paper,
  border: `1.5px solid ${C.dim}`,
  borderRadius: 0,
  height: 54,
  padding: '0 26px',
  fontSize: '1.0625rem',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'border-color 140ms ease, color 140ms ease',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** Chip mono: etiquetas de capacidad y filtros. */
export const chip = (on = false): CSSProperties => ({
  fontFamily: MONO,
  fontSize: '.6875rem',
  letterSpacing: '.06em',
  height: 44,
  padding: '0 16px',
  borderRadius: 999,
  cursor: 'pointer',
  background: on ? C.paper : C.surface,
  color: on ? C.ink : C.muted,
  border: `1px solid ${on ? C.paper : 'rgba(236,234,229,.24)'}`,
});
