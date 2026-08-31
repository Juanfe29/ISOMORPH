import type { ReactNode } from 'react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import type { Lang } from '@/lib/content';

/** Cascarón común: cabecera pegajosa, main que crece, pie al fondo. */
export default function SiteShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#141517' }}>
      <SiteHeader lang={lang} />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter lang={lang} />
    </div>
  );
}
