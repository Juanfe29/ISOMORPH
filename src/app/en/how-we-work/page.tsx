import type { Metadata } from 'next';
import SiteShell from '../../SiteShell';
import MetodoScreen from '@/components/screens/MetodoScreen';

export const metadata: Metadata = {
  title: 'How we work',
  description: 'Four stages, no surprises halfway through.',
  alternates: { canonical: '/en/how-we-work', languages: { es: '/metodo', en: '/en/how-we-work' } },
};

export default function Page() {
  return (
    <SiteShell lang="en">
      <MetodoScreen lang="en" />
    </SiteShell>
  );
}
