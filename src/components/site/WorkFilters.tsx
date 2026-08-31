'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getDict, routes, casoSlugs, type CasoKey, type Lang } from '@/lib/content';
import { C, MONO, chip, glassCard } from '@/lib/theme';

const KEYS = ['todos', 'telecom', 'integracion', 'agentes', 'producto', 'qa'] as const;

type Caso = {
  key: string;
  title: string;
  problem: string;
  tags: string[];
  keys: string[];
  caso: CasoKey;
};

export default function WorkFilters({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const r = routes[lang];
  const [active, setActive] = useState<(typeof KEYS)[number]>('todos');

  const cases = t.cases as unknown as Caso[];
  const visible = active === 'todos' ? cases : cases.filter((c) => c.keys.includes(active));

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {t.filters.map((label, i) => (
          <button key={label} onClick={() => setActive(KEYS[i])} style={chip(active === KEYS[i])}>
            {label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))',
            gap: 16,
          }}
        >
          {visible.map((c) => (
            <Link
              key={c.key}
              href={r.caso(casoSlugs[lang][c.caso])}
              style={{
                ...glassCard,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                minHeight: 200,
                textDecoration: 'none',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-.01em', color: C.paper, margin: 0 }}>
                {c.title}
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: C.muted, margin: 0, flex: 1 }}>{c.problem}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {c.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: MONO,
                      fontSize: '.6875rem',
                      letterSpacing: '.06em',
                      color: C.muted,
                      background: C.surface,
                      border: '1px solid rgba(236,234,229,.16)',
                      borderRadius: 999,
                      padding: '5px 10px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            border: '1px dashed rgba(236,234,229,.24)',
            borderRadius: 12,
            padding: 48,
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: MONO, fontSize: '.8125rem', letterSpacing: '.06em', color: C.muted, margin: '0 0 16px' }}>
            {t.emptyMsg}
          </p>
          <button
            onClick={() => setActive('todos')}
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(236,234,229,.4)',
              borderRadius: 0,
              height: 44,
              padding: '0 18px',
              fontSize: '.9375rem',
              color: C.paper,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {t.emptyCta}
          </button>
        </div>
      )}
    </>
  );
}
