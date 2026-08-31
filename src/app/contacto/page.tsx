import type { Metadata } from 'next';
import SiteShell from '../SiteShell';
import ContactoScreen from '@/components/screens/ContactoScreen';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'No necesitamos un brief formal. Dos párrafos sobre lo que no está funcionando alcanzan.',
  alternates: { canonical: '/contacto', languages: { es: '/contacto', en: '/en/contact' } },
};

export default function Page() {
  return (
    <SiteShell lang="es">
      <ContactoScreen lang="es" />
    </SiteShell>
  );
}
