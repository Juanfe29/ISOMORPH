import type { Metadata } from 'next';
import { Newsreader, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const serif = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://isomorph.lat'),
  title: {
    default: 'Isomorph — Ingeniería e IA aplicada',
    template: '%s · Isomorph',
  },
  description:
    'Diseñamos, integramos y operamos sistemas a la medida, con profundidad en telecomunicaciones y contact centers. Bogotá, Colombia.',
  openGraph: {
    type: 'website',
    siteName: 'Isomorph',
    locale: 'es_CO',
    images: ['/og.png'],
  },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={serif.variable + ' ' + mono.variable}>
      <body>{children}</body>
    </html>
  );
}
