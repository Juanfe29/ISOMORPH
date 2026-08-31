import { C, MONO } from '@/lib/theme';

const MONO_SVG = 'IBM Plex Mono, ui-monospace, Menlo, monospace';

/** Entrada desconectada → sistema. El gráfico central del home. */
export default function SystemDiagram({ labels }: { labels: { entrada: string; sistema: string; mapeo: string; nodes: string[] } }) {
  const nodes: [number, number][] = [
    [96, 96],
    [300, 76],
    [430, 176],
    [96, 250],
    [250, 210],
    [400, 310],
  ];
  const textPos: [number, number][] = [
    [108, 92],
    [312, 72],
    [442, 172],
    [108, 246],
    [262, 206],
    [412, 306],
  ];

  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.surface, padding: 'clamp(16px,3vw,32px)' }}>
      <svg viewBox="0 0 1104 360" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label={`${labels.entrada} → ${labels.sistema}`}>
        <text x="24" y="26" fill="rgba(236,234,229,.55)" fontFamily={MONO_SVG} fontSize="11" letterSpacing="1.1">
          {labels.entrada}
        </text>
        <text x="700" y="26" fill="rgba(236,234,229,.55)" fontFamily={MONO_SVG} fontSize="11" letterSpacing="1.1">
          {labels.sistema}
        </text>

        <g stroke="rgba(236,234,229,.24)" strokeWidth="1" fill="none">
          <path d="M96 96 L300 76 M96 96 L250 210 M300 76 L430 176 M300 76 L96 250 M430 176 L250 210 M430 176 L400 310 M250 210 L400 310 M96 250 L400 310 M96 250 L250 210 M300 76 L400 310" />
        </g>
        <g fill="rgba(236,234,229,.5)">
          {nodes.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />
          ))}
        </g>
        <g fill="rgba(236,234,229,.62)" fontFamily={MONO_SVG} fontSize="10" letterSpacing="1">
          {labels.nodes.map((n, i) => (
            <text key={n} x={textPos[i][0]} y={textPos[i][1]}>
              {n}
            </text>
          ))}
        </g>

        <g stroke={C.accent} strokeWidth="1.25" fill="none">
          <path d="M492 110 L610 148" />
          <path d="M492 186 L610 186" />
          <path d="M492 268 L610 226" />
          <path d="M604 144 L610 148 L603 153" />
          <path d="M604 182 L610 186 L604 190" />
          <path d="M604 222 L610 226 L603 231" />
        </g>
        <text x="492" y="300" fill={C.accent} fontFamily={MONO_SVG} fontSize="10" letterSpacing="1">
          {labels.mapeo}
        </text>

        <g stroke={C.paper} strokeWidth="1" fill="none" transform="translate(70,0)">
          <path d="M780 66 L884.6 142 M780 66 L844.7 265 M780 66 L715.3 265 M780 66 L675.4 142 M884.6 142 L844.7 265 M884.6 142 L715.3 265 M884.6 142 L675.4 142 M844.7 265 L715.3 265 M844.7 265 L675.4 142 M715.3 265 L675.4 142" />
        </g>
        <g fill={C.paper} transform="translate(70,0)">
          <circle cx="780" cy="66" r="5" />
          <circle cx="884.6" cy="142" r="5" />
          <circle cx="844.7" cy="265" r="5" />
          <circle cx="715.3" cy="265" r="5" />
          <circle cx="675.4" cy="142" r="5" />
        </g>
      </svg>
      <span style={{ display: 'none', fontFamily: MONO }} />
    </div>
  );
}
