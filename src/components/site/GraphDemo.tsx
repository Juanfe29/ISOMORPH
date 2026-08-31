'use client';

import { useEffect } from 'react';

type Props = {
  kind: 'force' | 'packets' | 'visitor';
  areas?: readonly string[];
  areasTitle?: string;
};

/**
 * Monta el web component <graph-demo> de /graph-demos.js.
 * Es JS plano sin build: se carga una vez y se reutiliza.
 */
export default function GraphDemo({ kind, areas, areasTitle }: Props) {
  useEffect(() => {
    if (document.querySelector('script[data-graph-demos]')) return;
    const s = document.createElement('script');
    s.src = '/graph-demos.js';
    s.async = true;
    s.dataset.graphDemos = '1';
    document.head.appendChild(s);
  }, []);

  return (
    // @ts-expect-error web component sin tipos
    <graph-demo
      kind={kind}
      areas={areas ? JSON.stringify(areas) : undefined}
      areas-title={areasTitle}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
