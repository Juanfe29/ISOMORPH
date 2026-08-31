import type { Metadata } from 'next';
import SiteShell from '../SiteShell';
import HomeScreen from '@/components/screens/HomeScreen';

export const metadata: Metadata = {
  title: 'Isomorph — Engineering and applied AI',
  description:
    'We design, integrate and operate custom systems, with depth in telecommunications and contact centers. Bogotá, Colombia.',
  alternates: { canonical: '/en', languages: { es: '/', en: '/en' } },
};

export default function Page() {
  return (
    <SiteShell lang="en">
      <HomeScreen lang="en" />
    </SiteShell>
  );
}
