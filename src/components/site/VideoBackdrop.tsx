'use client';

import { useSyncExternalStore } from 'react';

type Props = {
  src: string;
  /** Alto del telón. El degradado lo funde con el fondo de la página. */
  height?: number;
  opacity?: number;
  /** `true` cuando el video es el contenido de la figura, no un fondo. */
  plain?: boolean;
};

/** No nos suscribimos a cambios: la decisión se toma una vez, al hidratar. */
const noSubscribe = () => () => {};

const canPlay = () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
  const thin = nav.connection?.saveData === true || /(^|-)2g$/.test(nav.connection?.effectiveType ?? '');
  return !reduce && !thin;
};

/**
 * Fondo de video. Se apaga solo con prefers-reduced-motion y con conexión medida:
 * son nueve MP4 y el sitio se ve en 4G.
 */
export default function VideoBackdrop({ src, height = 560, opacity = 0.26, plain = false }: Props) {
  /** En el servidor y en el primer render siempre `false`: el telón arranca en color plano. */
  const play = useSyncExternalStore(noSubscribe, canPlay, () => false);

  if (plain) {
    return play ? (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    ) : null;
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height,
          zIndex: -2,
          overflow: 'hidden',
          background: '#1D1F23',
        }}
      >
        {play && (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              opacity,
              filter: 'grayscale(.5)',
            }}
          />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height,
          zIndex: -1,
          background: 'linear-gradient(180deg, rgba(20,21,23,.85), rgba(20,21,23,1))',
        }}
      />
    </>
  );
}
