import type { Metadata } from 'next';
import SiteShell from '../SiteShell';
import MetodoScreen from '@/components/screens/MetodoScreen';

export const metadata: Metadata = {
  title: 'Cómo trabajamos',
  description: 'Cuatro etapas, sin sorpresas a mitad de camino.',
  alternates: { canonical: '/metodo', languages: { es: '/metodo', en: '/en/how-we-work' } },
};

export default function Page() {
  return (
    <SiteShell lang="es">
      <MetodoScreen lang="es" />
    </SiteShell>
  );
}
