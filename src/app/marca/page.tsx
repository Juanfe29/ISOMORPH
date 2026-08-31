import type { Metadata } from 'next';
import SiteShell from '../SiteShell';
import MarcaScreen from '@/components/screens/MarcaScreen';

export const metadata: Metadata = {
  title: 'Marca',
  description: 'El logotipo es tipográfico. El motivo K5 es ornamento, no logo.',
  alternates: { canonical: '/marca', languages: { es: '/marca', en: '/en/brand' } },
};

export default function Page() {
  return (
    <SiteShell lang="es">
      <MarcaScreen lang="es" />
    </SiteShell>
  );
}
