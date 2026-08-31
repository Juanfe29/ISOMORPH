'use client';

import { getDict, type Lang } from '@/lib/content';
import { C, ctaGhost, ctaPrimary } from '@/lib/theme';

const PATHS = [
  'M150 122 C116 58, 46 34, 20 62 C-4 90, 32 146, 84 164 C110 173, 132 172, 146 164',
  'M146 164 C154 206, 132 240, 106 236 C82 232, 100 184, 146 164 Z',
  'M178 142 C198 94, 240 86, 250 108 C258 126, 226 140, 202 142',
  'M176 120 C173 107, 158 106, 156 119 C163 158, 169 202, 161 234',
];
const ACCENT = ['M160 102 C156 92, 153 84, 151 76', 'M172 104 C179 99, 184 96, 191 93'];

const source = (w: number, h: number) =>
  '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="-12 24 288 228">' +
  '<g fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
  PATHS.map((d) => '<path d="' + d + '" stroke="#ECEAE5"/>').join('') +
  ACCENT.map((d) => '<path d="' + d + '" stroke="#7BA9FF"/>').join('') +
  '</g></svg>';

function save(href: string, name: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Descargables del ornamento K5. Se generan en el navegador: no hay binarios en el repo. */
export default function DownloadK5({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  const svg = () => {
    const url = URL.createObjectURL(new Blob([source(570, 451)], { type: 'image/svg+xml' }));
    save(url, 'isomorph-k5.svg');
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const png = () => {
    const W = 2048;
    const H = Math.round((2048 * 228) / 288);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      c.getContext('2d')?.drawImage(img, 0, 0, W, H);
      c.toBlob((b) => {
        if (!b) return;
        const url = URL.createObjectURL(b);
        save(url, 'isomorph-k5-2048.png');
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source(W, H));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
      <button onClick={svg} style={{ ...ctaPrimary, height: 54, padding: '0 26px', fontSize: '1.0625rem' }}>
        {t.mcDlSvg}
      </button>
      <button onClick={png} style={{ ...ctaGhost, color: C.paper }}>
        {t.mcDlPng}
      </button>
    </div>
  );
}
