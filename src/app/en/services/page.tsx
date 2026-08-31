import type { Metadata } from 'next';
import SiteShell from '../../SiteShell';
import ServiciosScreen from '@/components/screens/ServiciosScreen';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Five capabilities: telecommunications, systems integration, AI agents, custom product, QA and gaps.',
  alternates: { canonical: '/en/services', languages: { es: '/servicios', en: '/en/services' } },
};

export default function Page() {
  return (
    <SiteShell lang="en">
      <ServiciosScreen lang="en" />
    </SiteShell>
  );
}
