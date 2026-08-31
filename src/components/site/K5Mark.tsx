import type { CSSProperties } from 'react';
import { C } from '@/lib/theme';

const PATHS = [
  'M150 122 C116 58, 46 34, 20 62 C-4 90, 32 146, 84 164 C110 173, 132 172, 146 164',
  'M146 164 C154 206, 132 240, 106 236 C82 232, 100 184, 146 164 Z',
  'M178 142 C198 94, 240 86, 250 108 C258 126, 226 140, 202 142',
  'M176 120 C173 107, 158 106, 156 119 C163 158, 169 202, 161 234',
];

const ACCENT = [
  'M160 102 C156 92, 153 84, 151 76',
  'M172 104 C179 99, 184 96, 191 93',
];

type Props = {
  width?: number;
  height?: number;
  /** Trazo del cuerpo. Solo tinta clara u oscura: el K5 no se recolorea. */
  stroke?: string;
  /** Los dos trazos de acento. `false` los omite (usos ornamentales de fondo). */
  accent?: boolean;
  strokeWidth?: number;
  /** Inclinación del lockup de cabecera. */
  tilt?: boolean;
  opacity?: number;
  style?: CSSProperties;
  title?: string;
};

/**
 * K5: el ornamento de la marca. No es el logotipo — nunca se usa solo como firma.
 * Ver /marca para las reglas.
 */
export default function K5Mark({
  width = 34,
  height = 32,
  stroke = C.paper,
  accent = true,
  strokeWidth = 1.8,
  tilt = true,
  opacity,
  style,
  title,
}: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={tilt ? '8 62 256 190' : '-12 24 288 228'}
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ display: 'block', overflow: 'visible', opacity, ...style }}
    >
      <g
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        transform={tilt ? 'rotate(-6 160 150)' : undefined}
      >
        {PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
        {accent && ACCENT.map((d) => <path key={d} d={d} stroke={C.accent} />)}
      </g>
    </svg>
  );
}
