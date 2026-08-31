'use client';

import { useEffect, useRef, useState } from 'react';
import { getDict, type Lang } from '@/lib/content';
import { C, MONO } from '@/lib/theme';

const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? 'https://formspree.io/f/mkjnowpq';
const MAILTO = 'hello@isomorph.lat';
const VALID = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = 'idle' | 'sending' | 'sent' | 'draft' | 'failed';

export default function ContactForm({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const [form, setForm] = useState({ nombre: '', empresa: '', correo: '', mensaje: '' });
  const [mailError, setMailError] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [elapsed, setElapsed] = useState(0);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (tick.current) clearInterval(tick.current); }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    if (status === 'sending') return;
    if (!VALID.test(form.correo.trim())) {
      setMailError(true);
      setStatus('idle');
      return;
    }
    setMailError(false);
    setStatus('sending');
    setElapsed(0);
    const t0 = Date.now();
    tick.current = setInterval(() => setElapsed((Date.now() - t0) / 1000), 100);

    const stop = (next: Status) => {
      if (tick.current) clearInterval(tick.current);
      const wait = Math.max(0, 500 - (Date.now() - t0));
      setTimeout(() => setStatus(next), wait);
    };

    const asunto = `Sitio isomorph.lat — ${form.empresa || form.nombre || 'contacto'}`;

    if (!ENDPOINT) {
      const bodyText = [
        form.nombre + (form.empresa ? ` — ${form.empresa}` : ''),
        form.correo,
        '',
        form.mensaje,
      ].join('\n');
      window.location.href =
        `mailto:${MAILTO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(bodyText)}`;
      stop('draft');
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.nombre,
          email: form.correo,
          empresa: form.empresa || '—',
          message: form.mensaje,
          origen: 'isomorph.lat/contacto',
          _subject: asunto,
          _replyto: form.correo,
          _cc: form.correo.trim(),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setForm({ nombre: '', empresa: '', correo: '', mensaje: '' });
      stop('sent');
    } catch {
      stop('failed');
    }
  }

  const fieldLabel = {
    fontFamily: MONO,
    fontSize: '.75rem',
    letterSpacing: '.08em',
    textTransform: 'uppercase' as const,
    color: C.muted,
  };

  const field = (err = false) => ({
    height: 44,
    border: `1px solid ${err ? C.danger : 'rgba(236,234,229,.24)'}`,
    borderRadius: 0,
    padding: '0 12px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    color: C.paper,
    background: err ? C.dangerBg : 'rgba(236,234,229,.05)',
    outline: 'none',
  });

  const notice = (tone: 'ok' | 'bad', text: string) => (
    <div
      role="status"
      style={{
        background: tone === 'ok' ? C.okBg : C.dangerBg,
        border: `1px solid ${tone === 'ok' ? C.ok : C.danger}`,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontFamily: MONO,
        fontSize: '.8125rem',
        lineHeight: 1.5,
        color: tone === 'ok' ? C.ok : C.danger,
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      style={{
        border: `1px solid ${C.line}`,
        borderRadius: 20,
        background: 'rgba(20,21,23,.66)',
        backdropFilter: 'blur(26px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(26px) saturate(1.6)',
        boxShadow: '0 1px 2px rgba(0,0,0,.4), 0 28px 64px -28px rgba(0,0,0,.7)',
        padding: 'clamp(20px,4vw,32px)',
      }}
    >
      {status === 'failed' && notice('bad', t.errSend)}
      {status === 'sent' && notice('ok', t.okSent)}
      {status === 'draft' && notice('ok', t.okDraft)}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={fieldLabel}>{t.fName}</span>
          <input value={form.nombre} onChange={set('nombre')} style={field()} autoComplete="name" />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={fieldLabel}>{t.fCompany}</span>
          <input value={form.empresa} onChange={set('empresa')} style={field()} autoComplete="organization" />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={fieldLabel}>{t.fMail}</span>
          <input
            value={form.correo}
            onChange={set('correo')}
            style={field(mailError)}
            inputMode="email"
            autoComplete="email"
            aria-invalid={mailError}
          />
          {mailError && (
            <span style={{ fontFamily: MONO, fontSize: '.75rem', lineHeight: 1.4, color: C.danger }}>
              {t.errMail}
            </span>
          )}
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={fieldLabel}>{t.fMsg}</span>
          <textarea
            value={form.mensaje}
            onChange={set('mensaje')}
            rows={5}
            style={{ ...field(), height: 'auto', padding: 12, lineHeight: 1.5, resize: 'vertical' }}
          />
          <span style={{ fontFamily: MONO, fontSize: '.75rem', lineHeight: 1.4, color: C.dim }}>
            {t.fMsgHelp}
          </span>
        </label>

        <button
          onClick={submit}
          disabled={status === 'sending'}
          style={{
            background: 'transparent',
            color: status === 'sending' ? C.dim : C.paper,
            border: `1.5px solid ${status === 'sending' ? 'rgba(236,234,229,.36)' : C.paper}`,
            borderRadius: 0,
            height: 50,
            padding: '0 24px',
            fontSize: '1.0625rem',
            fontWeight: 500,
            cursor: status === 'sending' ? 'default' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: `5px 5px 0 0 ${status === 'sending' ? 'rgba(123,169,255,.35)' : C.accent}`,
            marginTop: 4,
          }}
        >
          {status === 'sending'
            ? `${t.sending} · ${elapsed.toFixed(1).replace('.', lang === 'es' ? ',' : '.')} s`
            : t.submit}
        </button>

        <p style={{ fontFamily: MONO, fontSize: '.6875rem', letterSpacing: '.1em', color: C.dim, margin: '8px 0 0' }}>
          {t.ctFoot}
        </p>
      </div>
    </div>
  );
}
