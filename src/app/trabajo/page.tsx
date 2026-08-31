import type { Metadata } from 'next';
import SiteShell from '../SiteShell';
import TrabajoScreen from '@/components/screens/TrabajoScreen';

export const metadata: Metadata = {
  title: 'Trabajo',
  description: 'Cada caso empieza por lo que estaba roto, no por la tecnología que usamos.',
  alternates: { canonical: '/trabajo', languages: { es: '/trabajo', en: '/en/work' } },
};

export default function Page() {
  return (
    <SiteShell lang="es">
      <TrabajoScreen lang="es" />
    </SiteShell>
  );
}
