import type { Metadata } from 'next';
import SiteShell from '../../SiteShell';
import TelecomScreen from '@/components/screens/TelecomScreen';

export const metadata: Metadata = {
  title: 'Telecomunicaciones y contact center',
  description: 'Pruebas de carga, picos de llamadas e integración de contact centers. Con las limitaciones declaradas.',
  alternates: { canonical: '/servicios/telecomunicaciones', languages: { es: '/servicios/telecomunicaciones', en: '/en/services/telecom' } },
};

export default function Page() {
  return (
    <SiteShell lang="es">
      <TelecomScreen lang="es" />
    </SiteShell>
  );
}
