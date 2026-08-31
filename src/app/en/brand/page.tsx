import type { Metadata } from 'next';
import SiteShell from '../../SiteShell';
import MarcaScreen from '@/components/screens/MarcaScreen';

export const metadata: Metadata = {
  title: 'Brand',
  description: 'The logotype is typographic. The K5 motif is ornament, not a logo.',
  alternates: { canonical: '/en/brand', languages: { es: '/marca', en: '/en/brand' } },
};

export default function Page() {
  return (
    <SiteShell lang="en">
      <MarcaScreen lang="en" />
    </SiteShell>
  );
}
