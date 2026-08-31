import type { Metadata } from 'next';
import SiteShell from '../../SiteShell';
import TrabajoScreen from '@/components/screens/TrabajoScreen';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Every case starts with what was broken, not with the technology we used.',
  alternates: { canonical: '/en/work', languages: { es: '/trabajo', en: '/en/work' } },
};

export default function Page() {
  return (
    <SiteShell lang="en">
      <TrabajoScreen lang="en" />
    </SiteShell>
  );
}
