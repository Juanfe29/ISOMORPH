import type { Metadata } from 'next';
import SiteShell from '../SiteShell';
import ServiciosScreen from '@/components/screens/ServiciosScreen';

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Cinco capacidades: telecomunicaciones, integración de sistemas, agentes de IA, producto a la medida, QA y brechas.',
  alternates: { canonical: '/servicios', languages: { es: '/servicios', en: '/en/services' } },
};

export default function Page() {
  return (
    <SiteShell lang="es">
      <ServiciosScreen lang="es" />
    </SiteShell>
  );
}
