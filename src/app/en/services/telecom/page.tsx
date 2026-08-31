import type { Metadata } from 'next';
import SiteShell from '../../../SiteShell';
import TelecomScreen from '@/components/screens/TelecomScreen';

export const metadata: Metadata = {
  title: 'Telecommunications and contact center',
  description: 'Load testing, call peaks and contact center integration. With the limits stated.',
  alternates: { canonical: '/en/services/telecom', languages: { es: '/servicios/telecomunicaciones', en: '/en/services/telecom' } },
};

export default function Page() {
  return (
    <SiteShell lang="en">
      <TelecomScreen lang="en" />
    </SiteShell>
  );
}
